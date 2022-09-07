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
}
