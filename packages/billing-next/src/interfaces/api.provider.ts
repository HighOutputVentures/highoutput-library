/* eslint-disable no-shadow */
import Stripe from 'stripe';
import { TierConfig } from '../typings';
import { Subscription, Tier } from './stripe.provider';

export type Request<T = unknown> = {
  user: string;
  body?: Record<string, T>;
};

export type Response<T = unknown> =
  | {
      status: 200;
      body: {
        data: T;
      };
    }
  | {
      status: 301;
      redirectionUrl: string;
    }
  | {
      status: 404;
    }
  | {
      status: 400;
      body: {
        error: string;
      };
    };

export enum WebhookEvents {
  'SUBSCRIPTION_CREATED' = 'customer.subscription.created',
  'SUBSCRIPTION_UPDATED' = 'customer.subscription.updated',
  'SUBSCRIPTION_DELETED' = 'customer.subscription.deleted',
  'SETUP_INTENT_SUCCEEDED' = 'setup_intent.succeeded',
  'INVOICE_PAID' = 'invoice.paid',
}

export interface IApiProvider {
  getTiers(): Promise<Response<{ tiers: TierConfig[] }>>;
  getSecret(params: Request): Promise<Response<{ secret: string }>>;
  getSubscription(params: Request): Promise<
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
  >;
  getPortal(params: Request): Promise<Response>;
  putSubscription(
    params: Request<string>,
  ): Promise<Response<{ subscription: Omit<Subscription, 'id'> }>>;
  postWebhook(
    params: Required<Omit<Request, 'user'>>,
  ): Promise<Response<{ received: boolean }>>;
}
