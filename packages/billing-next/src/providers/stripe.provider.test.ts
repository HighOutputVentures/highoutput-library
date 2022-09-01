/* eslint-disable no-restricted-syntax */
import { Container } from 'inversify';
import { generateFakeStripePrice } from '../../__tests__/helpers/generate-fake-stripe-price';
import { generateFakeConfig } from '../../__tests__/helpers/generate-fake-config';
import { IStripeProvider } from '../interfaces/stripe.provider';
import { StripeProvider } from './stripe.provider';
import { TYPES } from '../types';

describe('StripeProvider', () => {
  describe('#initializeTiers', () => {
    test.concurrent('tier is initialized for the first time', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const StripeMock = {
        prices: {
          create: jest.fn(async () => generateFakeStripePrice()),
        },
      };

      const StripeProviderStorageAdapterMock = {
        insertTier: jest.fn(async () => Promise.resolve()),
      };

      container.bind(TYPES.Stripe).toConstantValue(StripeMock);
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(StripeProviderStorageAdapterMock);
      container.bind(TYPES.StripeProvider).to(StripeProvider);

      const provider = container.get<IStripeProvider>(TYPES.StripeProvider);

      await provider.initializeTiers();

      expect(StripeMock.prices.create).toBeCalledTimes(config.tiers.length);
      for (const [params] of StripeMock.prices.create.mock.calls as never[][]) {
        expect(params).toHaveProperty('unit_amount');
        expect(params).toHaveProperty('currency', 'usd');
        expect(params).toHaveProperty('recurring.interval', 'month');
        expect(params).toHaveProperty('product_data.name');
      }
      expect(StripeProviderStorageAdapterMock.insertTier).toBeCalledTimes(
        config.tiers.length,
      );
      for (const [params] of StripeProviderStorageAdapterMock.insertTier.mock
        .calls as never[][]) {
        expect(params).toHaveProperty('id');
        expect(params).toHaveProperty('stripePrices');
        expect(params).toHaveProperty('stripeProduct');
      }
    });

    test.todo('existing tier is updated');
  });
});
