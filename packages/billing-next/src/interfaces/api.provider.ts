/* eslint-disable no-shadow */
import { TierConfig } from '../typings';

export type Request<T = unknown> = {
  user: string;
  body?: Record<string, T>;
};

export type Response<T = unknown> =
  | {
      status: 200;
      body: {
        data: Record<string, T>;
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
  getTiers(): Promise<Response<TierConfig[]>>;
  getSecret(params: Request): Promise<Response<string>>;
  getSubscription(params: Request): Promise<Response>;
  getPortal(params: Request): Promise<Response>;
  putSubscription(params: Request<string>): Promise<Response>;
  postWebhook(params: Required<Omit<Request, 'user'>>): Promise<Response>;
}
