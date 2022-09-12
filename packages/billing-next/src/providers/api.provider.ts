/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import {
  IApiProvider,
  Request,
  Response,
  WebhookEvents,
} from '../interfaces/api.provider';
import { TYPES } from '../types';
import {
  IStripeProviderStorageAdapter,
  ValueType,
} from '../interfaces/stripe.provider';
import { IConfigProvider } from '../interfaces/config.provider';
import { TierConfig } from '../typings';

@injectable()
export class ApiProvider implements IApiProvider {
  constructor(
    @inject(TYPES.Stripe) private stripe: Stripe,
    @inject(TYPES.ConfigProvider) private configProvider: IConfigProvider,
    @inject(TYPES.StripeProviderStorageAdapter)
    private storageAdapter: IStripeProviderStorageAdapter,
  ) {}

  async getTiers() {
    return {
      status: 200,
      body: {
        data: this.configProvider.config.tiers,
      },
    } as Response<TierConfig[]>;
  }

  async getSecret(params: Request): Promise<Response<string>> {
    const { user } = params;

    let customer = await this.storageAdapter.findCustomer(user);

    if (!customer) {
      const stripeCustomer = await this.stripe.customers.create({
        metadata: {
          id: user,
        },
      });

      customer = {
        id: user,
        stripeCustomer: stripeCustomer.id,
      };

      await this.storageAdapter.insertCustomer(customer);
    }

    let {
      data: [setupIntent],
    } = await this.stripe.setupIntents.list({
      customer: customer.stripeCustomer,
    });

    if (!setupIntent) {
      setupIntent = await this.stripe.setupIntents.create({
        payment_method_types: ['card'],
        customer: customer.stripeCustomer,
      });
    }

    return {
      status: 200,
      body: {
        secret: setupIntent.client_secret as string,
      },
    };
  }

  async getSubscription(params: Request) {
    const { user } = params;
    const subscription = await this.storageAdapter.findSubscription(user);

    return {
      status: 200,
      body: {
        data: subscription,
      },
    } as Response;
  }

  async getPortal(params: Request<never>) {
    const { user } = params;
    const portalConfig = await this.storageAdapter.findValue(
      ValueType.BILLING_PORTAL_CONFIGURATION,
    );
    const customer = await this.storageAdapter.findCustomer(user);
    let customerId: string;

    if (!customer) {
      const stripeCustomer = await this.stripe.customers.create({
        metadata: {
          id: user,
        },
      });

      await this.storageAdapter.insertCustomer({
        id: user,
        stripeCustomer: stripeCustomer.id,
      });

      customerId = stripeCustomer.id;
    }

    customerId = customer?.stripeCustomer as string;

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: this.configProvider.config.customerPortal.returnUrl,
      configuration: portalConfig?.value as string,
    });

    return {
      status: 301,
      body: {
        redirect_url: session.url,
      },
    } as Response;
  }

  async putSubscription(params: Request<string>) {
    const { user } = params;
    const tier = params.body?.tier as string;
    const quantity = parseInt(params.body?.quantity as string, 10) || 1;
    const customer = await this.storageAdapter.findCustomer(user);

    if (!customer) {
      throw new Error('Cannot find customer.');
    }

    const product = await this.storageAdapter.findTier(tier);

    if (!product) {
      throw new Error('Cannot find product.');
    }

    const [price] = product.stripePrices;

    const subscription = await this.stripe.subscriptions.create({
      customer: customer?.stripeCustomer as string,
      items: [
        {
          price,
          quantity,
        },
      ],
      expand: ['items.data.price.product', 'latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    if (paymentIntent.status === 'succeeded') {
      await this.storageAdapter.insertSubscription({
        id: user,
        stripeSubscription: subscription.id,
        tier,
        quantity,
      });
    }

    return {
      status: 200,
      body: {
        data: {
          tier,
          quantity,
          payment_status: paymentIntent.status,
        },
      },
    } as Response;
  }

  async postWebhook(params: Required<Omit<Request, 'user'>>) {
    const { endpointSecret, signature, rawBody } = params.body;

    if (R.isNil(endpointSecret)) {
      throw new Error('Cannot verify payload without signing secret.');
    }

    const event = this.stripe.webhooks.constructEvent(
      rawBody as Buffer,
      signature as string,
      endpointSecret as string,
    );

    switch (event.type) {
      case WebhookEvents.SUBSCRIPTION_CREATED: {
        const subscription = event.data.object as Stripe.Subscription;

        const expandedSubscription = await this.stripe.subscriptions.retrieve(
          subscription.id,
          {
            expand: [
              'items.data.price.product',
              'latest_invoice.payment_intent',
            ],
          },
        );

        const [item] = expandedSubscription.items.data;
        const product = item.price.product as Stripe.Product;
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        if (paymentIntent.status === 'succeeded') {
          const user = await this.storageAdapter.findCustomer(
            expandedSubscription.customer as string,
          );
          const tier = await this.storageAdapter.findTier(product.id);

          await this.storageAdapter.insertSubscription({
            id: user?.id as string,
            stripeSubscription: expandedSubscription.id,
            tier: tier?.id as string,
            quantity: item.quantity as number,
          });
        }

        break;
      }
      case WebhookEvents.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;

        const expandedSubscription = await this.stripe.subscriptions.retrieve(
          subscription.id,
          {
            expand: [
              'items.data.price.product',
              'latest_invoice.payment_intent',
            ],
          },
        );

        const [item] = expandedSubscription.items.data;
        const product = item.price.product as Stripe.Product;
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        if (paymentIntent.status === 'succeeded') {
          const user = await this.storageAdapter.findCustomer(
            expandedSubscription.customer as string,
          );
          const tier = await this.storageAdapter.findTier(product.id);

          await this.storageAdapter.updateSubscription(user?.id as string, {
            stripeSubscription: expandedSubscription.id,
            tier: tier?.id,
            quantity: item.quantity,
          });
        }

        break;
      }
      case WebhookEvents.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await this.storageAdapter.findCustomer(
          subscription.customer as string,
        );

        await this.storageAdapter.updateSubscription(user?.id as string, {
          stripeSubscription: subscription.id,
          tier: undefined,
          quantity: undefined,
        });

        break;
      }
      default:
        throw new Error(`Unhandled event type: ${event.type}`);
    }

    return {
      status: 200,
      body: {
        received: true,
      },
    } as Response;
  }
}
