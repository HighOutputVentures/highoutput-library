/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import asyncMap from 'p-map';
import { IConfigProvider } from '../interfaces/config.provider';
import {
  IStripeProvider,
  IStripeProviderStorageAdapter,
} from '../interfaces/stripe.provider';
import { TYPES } from '../types';
import { TierConfig } from '../typings';

@injectable()
export class StripeProvider implements IStripeProvider {
  constructor(
    @inject(TYPES.Stripe) private stripe: Stripe,
    @inject(TYPES.ConfigProvider) private configProvider: IConfigProvider,
    @inject(TYPES.StripeProviderStorageAdapter)
    private storageAdapter: IStripeProviderStorageAdapter,
  ) {}

  async initializeTiers() {
    await asyncMap(
      this.configProvider.config.tiers,
      async (tier) => this.initializeTier(tier),
      { concurrency: 2 },
    );
  }

  private async initializeTier(config: TierConfig) {
    const tier = await this.storageAdapter.findTier(config.id);

    if (tier) {
      await this.stripe.products.update(tier.stripeProduct, {
        name: config.name,
        metadata: config.metadata,
      });

      const price = await this.stripe.prices.create({
        unit_amount: config.free ? 0 : config.pricePerUnit,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: tier.stripeProduct,
      });

      await this.storageAdapter.updateTier(tier.stripeProduct, {
        stripePrices: [price.id],
      });

      return;
    }

    const price = await this.stripe.prices.create({
      unit_amount: config.free ? 0 : config.pricePerUnit,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      product_data: {
        name: config.name,
        metadata: config.metadata,
      },
    });

    await this.storageAdapter.insertTier({
      id: config.id,
      stripePrices: [price.id],
      stripeProduct: price.product as string,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async initializeCustomerPortal() {
    // eslint-disable-next-line no-console
    console.log('not implemented');
  }
}
