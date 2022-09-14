/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import R from 'ramda';
import AppError from '@highoutput/error';
import {
  IApiProvider,
  Request,
  Response,
  WebhookEvents,
} from '../interfaces/api.provider';
import { TYPES } from '../types';
import {
  IStripeProviderStorageAdapter,
  Subscription,
  Tier,
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

  async getTiers(): Promise<Response<{ tiers: TierConfig[] }>> {
    return {
      status: 200,
      body: {
        data: {
          tiers: this.configProvider.config.tiers,
        },
      },
    };
  }

  async getSecret(params: Request): Promise<Response<{ secret: string }>> {
    const { user } = params;

    let customer = await this.storageAdapter.findUser(user);

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

      await this.storageAdapter.insertUser(customer);
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
        data: {
          secret: setupIntent.client_secret as string,
        },
      },
    };
  }

  async getSubscription(params: Request): Promise<
    Response<{
      subscription: Omit<Subscription, 'tier'> & { tier: Tier };
    } | null>
  > {
    const { user } = params;
    const subscription = await this.storageAdapter.findSubscriptionByUser(user);
    let data = null;

    if (!R.isNil(subscription)) {
      const tier = await this.storageAdapter.findTier(subscription.tier);
      data = {
        subscription: {
          ...R.omit(['tier'], subscription),
          tier,
        } as Omit<Subscription, 'tier'> & { tier: Tier },
      };
    }

    return {
      status: 200,
      body: {
        data,
      },
    };
  }

  async getPortal(params: Request<never>): Promise<Response> {
    const { user } = params;
    const portalConfig = await this.storageAdapter.findValue(
      ValueType.BILLING_PORTAL_CONFIGURATION,
    );
    const customer = await this.storageAdapter.findUser(user);
    let customerId: string;

    if (!customer) {
      const stripeCustomer = await this.stripe.customers.create({
        metadata: {
          id: user,
        },
      });

      await this.storageAdapter.insertUser({
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
      redirectionUrl: session.url,
    };
  }

  async putSubscription(
    params: Request<string>,
  ): Promise<Response<{ subscription: Omit<Subscription, 'id'> }>> {
    const { user } = params;
    const tier = params.body?.tier as string;
    const quantity = parseInt(params.body?.quantity as string, 10) || 1;
    const customer = await this.storageAdapter.findUser(user);

    if (!customer) {
      throw new AppError(
        'RESOURCE_NOT_FOUND',
        `Sorry, customer with ID ${user} cannot be found.`,
      );
    }

    const product = await this.storageAdapter.findTier(tier);

    if (!product) {
      throw new AppError(
        'RESOURCE_NOT_FOUND',
        `Sorry, product with ID ${tier} cannot be found.`,
      );
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
    });

    return {
      status: 200,
      body: {
        data: {
          subscription: {
            stripeSubscription: subscription.id,
            user,
            tier,
            quantity,
            stripeStatus: subscription.status,
          },
        },
      },
    };
  }

  async postWebhook(
    params: Required<Omit<Request, 'user'>>,
  ): Promise<Response<{ received: boolean }>> {
    const { endpointSecret, signature, rawBody } = params.body;

    if (R.isNil(endpointSecret)) {
      throw new AppError(
        'RESOURCE_NOT_FOUND',
        'Cannot verify payload without a signing secret. Please provide a webhook signing secret.',
      );
    }

    const event = this.stripe.webhooks.constructEvent(
      rawBody as Buffer,
      signature as string,
      endpointSecret as string,
    );

    const isLogged = await this.storageAdapter.findEvent(
      event.request?.idempotency_key || event.id,
    );

    if (isLogged) {
      return {
        status: 200,
        body: {
          data: {
            received: true,
          },
        },
      };
    }

    switch (event.type) {
      case WebhookEvents.SUBSCRIPTION_CREATED: {
        const subscription = event.data.object as Stripe.Subscription;

        const expandedSubscription = await this.stripe.subscriptions.retrieve(
          subscription.id,
          {
            expand: ['items.data.price.product'],
          },
        );

        const [item] = expandedSubscription.items.data;
        const product = item.price.product as Stripe.Product;

        const user = await this.storageAdapter.findUser(
          expandedSubscription.customer as string,
        );
        const tier = await this.storageAdapter.findTier(product.id);

        await this.storageAdapter.insertSubscription({
          stripeSubscription: expandedSubscription.id,
          user: user?.id as string,
          tier: tier?.id as string,
          quantity: item.quantity as number,
          stripeStatus: expandedSubscription.status,
        });

        break;
      }

      case WebhookEvents.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;

        const expandedSubscription = await this.stripe.subscriptions.retrieve(
          subscription.id,
          {
            expand: ['items.data.price.product'],
          },
        );

        const [item] = expandedSubscription.items.data;
        const product = item.price.product as Stripe.Product;
        const tier = await this.storageAdapter.findTier(product.id);

        await this.storageAdapter.updateSubscription(expandedSubscription.id, {
          tier: tier?.id,
          quantity: item.quantity,
          stripeStatus: expandedSubscription.status,
        });

        break;
      }

      case WebhookEvents.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription;

        await this.storageAdapter.updateSubscription(subscription.id, {
          stripeStatus: 'canceled',
        });

        break;
      }
      default:
        throw new AppError(
          'UNHANDLED_WEBHOOK_EVENT',
          `Unexpected event type. Event ${event.type} is currently not supported.`,
        );
    }

    await this.storageAdapter.insertEvent({
      id: event.id,
      type: event.type,
      idempotencyKey: event.request?.idempotency_key as string,
      requestId: event.request?.id as string | null,
    });

    return {
      status: 200,
      body: {
        data: {
          received: true,
        },
      },
    };
  }
}
