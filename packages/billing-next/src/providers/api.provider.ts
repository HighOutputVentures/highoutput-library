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

    const setupIntent = await this.stripe.setupIntents.create({
      payment_method_types: ['card'],
      customer: customer.stripeCustomer,
    });

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
      subscription: Omit<Subscription, 'tier' | 'user'> & {
        tier: Tier;
        user: {
          stripeCustomer: string;
          paymentMethod: Pick<
            Stripe.PaymentMethod.Card,
            'brand' | 'country' | 'exp_month' | 'exp_year' | 'last4'
          >;
        };
      };
    } | null>
  > {
    const { user } = params;
    const subscription = await this.storageAdapter.findSubscriptionByUser(user);

    if (R.isNil(subscription)) {
      return {
        status: 200,
        body: {
          data: null,
        },
      };
    }

    const tier = await this.storageAdapter.findTier(subscription.tier);
    const customer = await this.storageAdapter.findUser(user);
    const stripePaymentMethod = await this.stripe.paymentMethods.retrieve(
      customer?.stripePaymentMethod as string,
    );

    const data = {
      subscription: {
        ...R.omit(['tier', 'user'], subscription),
        tier: tier as Tier,
        user: {
          stripeCustomer: customer?.stripeCustomer,
          paymentMethod: R.pick(
            ['brand', 'country', 'exp_month', 'exp_year', 'last4'],
            stripePaymentMethod.card,
          ),
        },
      } as never,
    };

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
      default_payment_method: customer.stripePaymentMethod,
    });

    await this.storageAdapter.insertSubscription({
      stripeSubscription: subscription.id,
      user,
      tier,
      quantity,
      stripeStatus: subscription.status,
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
      case WebhookEvents.INVOICE_PAID: {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        await this.storageAdapter.updateSubscription(subscription, {
          stripeStatus: 'active',
        });

        break;
      }

      case WebhookEvents.SETUP_INTENT_SUCCEEDED: {
        const setupIntent = event.data.object as Stripe.SetupIntent;
        const paymentMethod = setupIntent.payment_method as string;
        const customer = setupIntent.customer as string;

        await this.stripe.customers.update(customer, {
          invoice_settings: {
            default_payment_method: paymentMethod,
          },
        });

        await this.storageAdapter.updateUser(customer, {
          stripePaymentMethod: paymentMethod,
        });

        break;
      }

      case WebhookEvents.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;

        const [item] = subscription.items.data;
        const product = item.price.product as Stripe.Product;
        const tier = await this.storageAdapter.findTier(product.id);

        await this.storageAdapter.updateSubscription(subscription.id, {
          tier: tier?.id,
          quantity: item.quantity,
          stripeStatus: subscription.status,
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

      case WebhookEvents.INVOICE_CREATED: {
        const invoice = event.data.object as Stripe.Invoice;

        await this.stripe.invoices.finalizeInvoice(invoice.id as string);

        break;
      }

      case WebhookEvents.INVOICE_PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice;

        await this.storageAdapter.updateSubscription(
          invoice.subscription as string,
          {
            stripeStatus: 'unpaid',
          },
        );

        break;
      }

      default:
        throw new AppError(
          'UNHANDLED_WEBHOOK_EVENT',
          `Unexpected event type. Event ${event.type} is currently not supported.`,
        );
    }

    await this.storageAdapter.insertEvent({
      stripeEvent: event.id,
      stripeEventType: event.type,
      stripeIdempotencyKey: event.request?.idempotency_key as string,
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
