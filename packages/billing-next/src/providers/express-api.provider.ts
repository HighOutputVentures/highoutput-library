/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import R from 'ramda';
import { IApiProvider, Request, Response } from '../interfaces/api.provider';
import { TYPES } from '../types';
import {
  IStripeProviderStorageAdapter,
  ValueType,
} from '../interfaces/stripe.provider';
import { IConfigProvider } from '../interfaces/config.provider';
import { TierConfig } from '../typings';

@injectable()
export class ExpressApiProvider implements IApiProvider {
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

  async getSecret(params: Request) {
    const { user } = params;

    const customer = await this.storageAdapter.findCustomer(user);
    let customerId: string;

    if (customer) {
      const intentList = await this.stripe.setupIntents.list({
        customer: customer.stripeCustomer,
      });
      customerId = customer.stripeCustomer;

      if (!R.isEmpty(intentList.data)) {
        const [intent] = intentList.data;
        return {
          status: 200,
          body: {
            secret: intent.client_secret,
          },
        } as Response<string>;
      }
    } else {
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

    const intent = await this.stripe.setupIntents.create({
      payment_method_types: ['card'],
      customer: customerId,
    });

    return {
      status: 200,
      body: {
        secret: intent.client_secret,
      },
    } as Response<string>;
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
}
