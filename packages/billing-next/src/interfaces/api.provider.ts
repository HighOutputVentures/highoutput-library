import { TierConfig } from '../typings';

export type Request<T = never> = {
  user: string;
  body?: T;
};

export type Response<T = unknown> = {
  status: 200 | 301 | 404;
  body: Record<string, T>;
};

export interface IApiProvider {
  getTiers(): Promise<Response<TierConfig[]>>;
  getSecret(params: Request): Promise<Response<string>>;
  // getSubscription(params: Request): Promise<Response>;
  // putSubscription(params: Request<{ tier: string }>): Promise<Response>;
}
