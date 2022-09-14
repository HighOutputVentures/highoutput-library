/* eslint-disable no-shadow */
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
  // 'PAYMENT_SUCCEEDED'
}

export interface IApiProvider {
  getTiers(): Promise<Response<{ tiers: TierConfig[] }>>;
  getSecret(params: Request): Promise<Response<{ secret: string }>>;
  getSubscription(params: Request): Promise<
    Response<{
      subscription: Omit<Subscription, 'tier'> & { tier: Tier };
    } | null>
  >;
  getPortal(params: Request): Promise<Response>;
  putSubscription(
    params: Request<string>,
  ): Promise<Response<{ subscription: Subscription }>>;
  postWebhook(
    params: Required<Omit<Request, 'user'>>,
  ): Promise<Response<{ received: boolean }>>;
}
