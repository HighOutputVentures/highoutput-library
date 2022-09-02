import { TierConfig } from '../typings';

export interface IApiProvider {
  getTiers(): Promise<TierConfig[]>;
  getSecret(): Promise<{ secret: string }>;
}
