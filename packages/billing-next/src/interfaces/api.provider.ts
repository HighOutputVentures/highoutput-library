import { TierConfig } from '../typings';

type Request<T = never> = {
  user: string;
  body?: T;
};

type Response<T = never> = {
  status: 200 | 301 | 404;
  body?: T;
};

export interface IApiProvider {
  getTiers(): Promise<Response<TierConfig[]>>;
  getSecret(params: Request): Promise<Response<{ secret: string }>>;
  getSubscription(params: Request): Promise<Response>;
  putSubscription(params: Request<{ tier: string }>): Promise<Response>;
}
