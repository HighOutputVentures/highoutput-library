/* eslint-disable no-restricted-syntax */
import { Container } from 'inversify';
import { faker } from '@faker-js/faker';
import { generateFakeStripePrice } from '../../__tests__/helpers/generate-fake-stripe-price';
import { generateFakeConfig } from '../../__tests__/helpers/generate-fake-config';
import { generateFakeTiers } from '../../__tests__/helpers/generate-fake-tier';
import { IStripeProvider, ValueType } from '../interfaces/stripe.provider';
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
        findTier: jest.fn(async () => null),
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

      expect(StripeProviderStorageAdapterMock.findTier).toBeCalledTimes(3);
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

    test.concurrent('existing tier is updated', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const StripeMock = {
        prices: {
          create: jest.fn(async () => generateFakeStripePrice()),
        },
        products: {
          update: jest.fn(async () => Promise.resolve()),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findTier: jest.fn(async (id) => {
          const price = generateFakeStripePrice();

          return {
            id,
            stripePrices: [price.id],
            stripeProduct: price.product,
          };
        }),
        updateTier: jest.fn(async () => Promise.resolve()),
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

      expect(StripeMock.products.update).toBeCalledTimes(config.tiers.length);
      expect(StripeMock.prices.create).toBeCalledTimes(config.tiers.length);
      expect(StripeProviderStorageAdapterMock.updateTier).toBeCalledTimes(
        config.tiers.length,
      );
    });
  });

  describe('#initializeCustomerPortal', () => {
    test.concurrent(
      'customer portal is initialized for the first time',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const portalConfig = { id: `bpc_${faker.random.alphaNumeric(24)}` };
        const StripeMock = {
          billingPortal: {
            configurations: {
              create: jest.fn(async () => portalConfig),
            },
          },
        };
        const StripeProviderStorageAdapterMock = {
          listTiers: jest.fn(async () => generateFakeTiers()),
          findValue: jest.fn(async () => null),
          insertValue: jest.fn(async () => Promise.resolve()),
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

        await provider.initializeCustomerPortal();

        expect(StripeProviderStorageAdapterMock.listTiers).toBeCalledTimes(1);
        expect(StripeMock.billingPortal.configurations.create).toBeCalledTimes(
          1,
        );
        expect(StripeMock.billingPortal.configurations.create).toReturnWith(
          Promise.resolve(portalConfig),
        );
        for (const [params] of StripeMock.billingPortal.configurations.create
          .mock.calls as never[][]) {
          expect(params).toHaveProperty('business_profile');
          expect(params).toHaveProperty('features');
          expect(params).toHaveProperty('default_return_url');
        }
      },
    );

    test.concurrent('existing portal config is updated', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const StripeMock = {
        billingPortal: {
          configurations: {
            update: jest.fn(async () => Promise.resolve()),
          },
        },
      };
      const StripeProviderStorageAdapterMock = {
        listTiers: jest.fn(async () => generateFakeTiers()),
        findValue: jest.fn(async () =>
          Promise.resolve({
            id: ValueType.BILLING_PORTAL_CONFIGURATION,
            value: `bpc_${faker.random.alphaNumeric(24)}`,
          }),
        ),
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

      await provider.initializeCustomerPortal();

      expect(StripeProviderStorageAdapterMock.findValue).toBeCalled();
      expect(StripeMock.billingPortal.configurations.update).toBeCalled();
    });
  });
});
