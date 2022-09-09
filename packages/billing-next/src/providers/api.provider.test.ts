import { Container } from 'inversify';
import { generateFakeConfig } from '../../__tests__/helpers/generate-fake-config';
import { IApiProvider } from '../interfaces/api.provider';
import { ApiProvider } from './api.provider';
import { TYPES } from '../types';
import {
  generateFakeId,
  IdType,
} from '../../__tests__/helpers/generate-fake-id';

describe('ApiProvider', () => {
  describe('#getSecret', () => {
    test.concurrent('customer exists with no intent', async () => {
      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };

      const config = generateFakeConfig();

      const container = new Container();

      const clientSecret = generateFakeId(IdType.SETUP_INTENT_SECRET);

      const StripeMock = {
        setupIntents: {
          list: jest.fn(async () => Promise.resolve({ data: [] })),
          create: jest.fn(async () =>
            Promise.resolve({ client_secret: clientSecret }),
          ),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findCustomer: jest.fn(async () => Promise.resolve(customer)),
      };

      container.bind(TYPES.Stripe).toConstantValue(StripeMock);
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(StripeProviderStorageAdapterMock);
      container.bind(TYPES.ApiProvider).to(ApiProvider);

      const provider = container.get<IApiProvider>(TYPES.ApiProvider);

      const output = await provider.getSecret({ user: customer.id });

      expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalledWith(
        customer.id,
      );
      expect(StripeMock.setupIntents.list).toBeCalledWith({
        customer: customer.stripeCustomer,
      });
      expect(StripeMock.setupIntents.create).toBeCalledWith({
        payment_method_types: ['card'],
        customer: customer.stripeCustomer,
      });
      expect(output).toEqual({
        status: 200,
        body: {
          secret: clientSecret,
        },
      });
    });

    test.concurrent('customer exists with intent', async () => {
      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };

      const config = generateFakeConfig();

      const container = new Container();

      const clientSecret = generateFakeId(IdType.SETUP_INTENT_SECRET);

      const StripeMock = {
        setupIntents: {
          list: jest.fn(async () =>
            Promise.resolve({ data: [{ client_secret: clientSecret }] }),
          ),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findCustomer: jest.fn(async () => Promise.resolve(customer)),
      };

      container.bind(TYPES.Stripe).toConstantValue(StripeMock);
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(StripeProviderStorageAdapterMock);
      container.bind(TYPES.ApiProvider).to(ApiProvider);

      const provider = container.get<IApiProvider>(TYPES.ApiProvider);

      const output = await provider.getSecret({ user: customer.id });

      expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalledWith(
        customer.id,
      );
      expect(StripeMock.setupIntents.list).toBeCalledWith({
        customer: customer.stripeCustomer,
      });
      expect(output).toEqual({
        status: 200,
        body: {
          secret: clientSecret,
        },
      });
    });

    test.concurrent('customer does not exist', async () => {
      const clientSecret = generateFakeId(IdType.SETUP_INTENT_SECRET);

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };

      const config = generateFakeConfig();

      const container = new Container();

      const StripeMock = {
        setupIntents: {
          list: jest.fn(async () => Promise.resolve({ data: [] })),
          create: jest.fn(async () =>
            Promise.resolve({
              client_secret: clientSecret,
            }),
          ),
        },
        customers: {
          create: jest.fn(async () =>
            Promise.resolve({ id: customer.stripeCustomer }),
          ),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findCustomer: jest.fn(async () => Promise.resolve(null)),
        insertCustomer: jest.fn(async () => Promise.resolve()),
      };

      container.bind(TYPES.Stripe).toConstantValue(StripeMock);
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(StripeProviderStorageAdapterMock);
      container.bind(TYPES.ApiProvider).to(ApiProvider);

      const provider = container.get<IApiProvider>(TYPES.ApiProvider);

      const output = await provider.getSecret({ user: customer.id });

      expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalledWith(
        customer.id,
      );
      expect(StripeMock.customers.create).toBeCalledWith({
        metadata: {
          id: customer.id,
        },
      });
      expect(StripeProviderStorageAdapterMock.insertCustomer).toBeCalledWith(
        customer,
      );
      expect(StripeMock.setupIntents.create).toBeCalledWith({
        payment_method_types: ['card'],
        customer: customer.stripeCustomer,
      });
      expect(output).toEqual({
        status: 200,
        body: {
          secret: clientSecret,
        },
      });
    });
  });

  describe('#putSubscription', () => {
    test.concurrent(
      'customer and tier is valid -> should create subscription',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };
        const tier = {
          id: 'starter',
          stripePrices: [generateFakeId(IdType.PRICE)],
          stripeProduct: generateFakeId(IdType.PRODUCT),
        };
        const subscription = {
          id: generateFakeId(IdType.SUBSCRIPTION),
          latest_invoice: {
            payment_intent: {
              status: 'pending',
            },
          },
        };

        const StripeMock = {
          subscriptions: {
            create: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findCustomer: jest.fn(async () => Promise.resolve(customer)),
          findTier: jest.fn(async () => Promise.resolve(tier)),
        };

        container.bind(TYPES.Stripe).toConstantValue(StripeMock);
        container.bind(TYPES.ConfigProvider).toConstantValue({
          config,
        });
        container
          .bind(TYPES.StripeProviderStorageAdapter)
          .toConstantValue(StripeProviderStorageAdapterMock);
        container.bind(TYPES.ApiProvider).to(ApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        const response = await provider.putSubscription({
          user: customer.id,
          body: {
            tier: tier.id,
          },
        });

        expect(
          StripeProviderStorageAdapterMock.findCustomer,
        ).toHaveBeenCalledWith(customer.id);
        expect(StripeProviderStorageAdapterMock.findTier).toHaveBeenCalledWith(
          tier.id,
        );
        expect(StripeMock.subscriptions.create).toBeCalled();
        expect(response).toMatchObject(
          expect.objectContaining({
            status: 200,
            body: {
              data: expect.objectContaining({
                tier: expect.any(String),
                quantity: expect.any(Number),
                payment_status: expect.any(String),
              }),
            },
          }),
        );
      },
    );
    test.concurrent('customer does not exist -> should throw', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const customer = {
        id: generateFakeId(IdType.USER),
      };

      const StripeProviderStorageAdapterMock = {
        findCustomer: jest.fn(async () => Promise.resolve(null)),
      };

      container.bind(TYPES.Stripe).toConstantValue({});
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(StripeProviderStorageAdapterMock);
      container.bind(TYPES.ApiProvider).to(ApiProvider);

      const provider = container.get<IApiProvider>(TYPES.ApiProvider);

      try {
        await provider.putSubscription({
          user: customer.id,
          body: {
            tier: 'starter',
          },
        });
      } catch (error) {
        expect((error as Error).message).toEqual('Cannot find customer.');
      }
    });

    test.concurrent('tier is invalid -> should throw', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };

      const StripeProviderStorageAdapterMock = {
        findCustomer: jest.fn(async () => Promise.resolve(customer)),
        findTier: jest.fn(async () => Promise.resolve(null)),
      };

      container.bind(TYPES.Stripe).toConstantValue({});
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(StripeProviderStorageAdapterMock);
      container.bind(TYPES.ApiProvider).to(ApiProvider);

      const provider = container.get<IApiProvider>(TYPES.ApiProvider);

      try {
        await provider.putSubscription({
          user: customer.id,
          body: {
            tier: 'starter',
          },
        });
      } catch (error) {
        expect((error as Error).message).toEqual('Cannot find product.');
      }
    });

    test.concurrent(
      'payment succeeded -> should update subscription database',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };
        const tier = {
          id: 'starter',
          stripePrices: [generateFakeId(IdType.PRICE)],
          stripeProduct: generateFakeId(IdType.PRODUCT),
        };
        const subscription = {
          id: generateFakeId(IdType.SUBSCRIPTION),
          latest_invoice: {
            payment_intent: {
              status: 'succeeded',
            },
          },
        };

        const StripeMock = {
          subscriptions: {
            create: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findCustomer: jest.fn(async () => Promise.resolve(customer)),
          findTier: jest.fn(async () => Promise.resolve(tier)),
          insertSubscription: jest.fn(async () => Promise.resolve()),
        };

        container.bind(TYPES.Stripe).toConstantValue(StripeMock);
        container.bind(TYPES.ConfigProvider).toConstantValue({
          config,
        });
        container
          .bind(TYPES.StripeProviderStorageAdapter)
          .toConstantValue(StripeProviderStorageAdapterMock);
        container.bind(TYPES.ApiProvider).to(ApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        const response = await provider.putSubscription({
          user: customer.id,
          body: {
            tier: tier.id,
          },
        });

        expect(
          StripeProviderStorageAdapterMock.findCustomer,
        ).toHaveBeenCalledWith(customer.id);
        expect(StripeProviderStorageAdapterMock.findTier).toHaveBeenCalledWith(
          tier.id,
        );
        expect(StripeMock.subscriptions.create).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.insertSubscription,
        ).toBeCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            stripeSubscription: expect.any(String),
            tier: expect.any(String),
            quantity: expect.any(Number),
          }),
        );
        expect(response).toMatchObject(
          expect.objectContaining({
            status: 200,
            body: {
              data: expect.objectContaining({
                tier: expect.any(String),
                quantity: expect.any(Number),
                payment_status: expect.any(String),
              }),
            },
          }),
        );
      },
    );

    test.concurrent(
      'payment is not succeeded -> shoud not update subscription database',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };
        const tier = {
          id: 'starter',
          stripePrices: [generateFakeId(IdType.PRICE)],
          stripeProduct: generateFakeId(IdType.PRODUCT),
        };
        const subscription = {
          id: generateFakeId(IdType.SUBSCRIPTION),
          latest_invoice: {
            payment_intent: {
              status: 'pending',
            },
          },
        };

        const StripeMock = {
          subscriptions: {
            create: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findCustomer: jest.fn(async () => Promise.resolve(customer)),
          findTier: jest.fn(async () => Promise.resolve(tier)),
          insertSubscription: jest.fn(async () => Promise.resolve()),
        };

        container.bind(TYPES.Stripe).toConstantValue(StripeMock);
        container.bind(TYPES.ConfigProvider).toConstantValue({
          config,
        });
        container
          .bind(TYPES.StripeProviderStorageAdapter)
          .toConstantValue(StripeProviderStorageAdapterMock);
        container.bind(TYPES.ApiProvider).to(ApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        const response = await provider.putSubscription({
          user: customer.id,
          body: {
            tier: tier.id,
          },
        });

        expect(
          StripeProviderStorageAdapterMock.findCustomer,
        ).toHaveBeenCalledWith(customer.id);
        expect(StripeProviderStorageAdapterMock.findTier).toHaveBeenCalledWith(
          tier.id,
        );
        expect(StripeMock.subscriptions.create).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.insertSubscription,
        ).not.toBeCalled();
        expect(response).toMatchObject(
          expect.objectContaining({
            status: 200,
            body: {
              data: expect.objectContaining({
                tier: expect.any(String),
                quantity: expect.any(Number),
                payment_status: expect.any(String),
              }),
            },
          }),
        );
      },
    );
  });
});
