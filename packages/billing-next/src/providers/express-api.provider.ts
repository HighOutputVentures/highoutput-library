/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'inversify';
import { IApiProvider, Response } from '../interfaces/api.provider';
import { TYPES } from '../types';
// import { IStripeProviderStorageAdapter } from '../interfaces/stripe.provider';
import { IConfigProvider } from '../interfaces/config.provider';
import { TierConfig } from '../typings';

@injectable()
export class ExpressApiProvider implements IApiProvider {
  constructor(
    @inject(TYPES.ConfigProvider) private configProvider: IConfigProvider, // @inject(TYPES.StripeProviderStorageAdapter) // private storageAdapter: IStripeProviderStorageAdapter,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  async getTiers() {
    return {
      status: 200,
      body: {
        data: this.configProvider.config.tiers,
      },
    } as Response<TierConfig[]>;
  }
}
