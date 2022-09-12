import { Container } from 'inversify';
import Stripe from 'stripe';
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

  describe('#postWebhook', () => {
    test.concurrent(
      'request is not Stripe verified -> should throw',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => null),
          },
        };

        container.bind(TYPES.Stripe).toConstantValue(StripeMock);
        container.bind(TYPES.ConfigProvider).toConstantValue({
          config,
        });
        container.bind(TYPES.StripeProviderStorageAdapter).toConstantValue({});
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        try {
          await provider.postWebhook({
            body: {
              rawBody: '',
              signature: '',
            },
          });
        } catch (error) {
          expect((error as Error).message).toEqual(
            'Cannot verify payload without signing secret.',
          );
        }
      },
    );

    test.concurrent('unhandled event -> should throw', async () => {
      const config = generateFakeConfig();

      const container = new Container();
      const stripe = new Stripe('', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        apiVersion: null,
      });

      const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';
      const payloadString = JSON.stringify({}, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      const StripeMock = {
        webhooks: {
          constructEvent: jest.fn(() => ({
            type: 'UNHANDLED_EVENT',
          })),
        },
      };

      container.bind(TYPES.Stripe).toConstantValue(StripeMock);
      container.bind(TYPES.ConfigProvider).toConstantValue({
        config,
      });
      container.bind(TYPES.StripeProviderStorageAdapter).toConstantValue({});
      container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

      const provider = container.get<IApiProvider>(TYPES.ApiProvider);

      try {
        await provider.postWebhook({
          body: {
            endpointSecret: webhookSecret,
            rawBody: payloadString,
            signature: header,
          },
        });
      } catch (error) {
        expect((error as Error).message).toMatch(/Unhandled event type/);
      }
    });

    test.concurrent(
      'customer.subscription.created and payment succeeded -> event is handled',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };
        const tier = {
          id: 'starter',
          stripeProduct: generateFakeId(IdType.PRODUCT),
        };
        const subscription = {
          id: generateFakeId(IdType.SUBSCRIPTION),
          customer: customer.stripeCustomer,
          items: {
            data: [
              {
                quantity: 1,
                price: {
                  product: {
                    id: tier.stripeProduct,
                  },
                },
              },
            ],
          },
          latest_invoice: {
            payment_intent: {
              status: 'succeeded',
            },
          },
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => ({
              type: 'customer.subscription.created',
              data: {
                object: subscription,
              },
            })),
          },
          subscriptions: {
            retrieve: jest.fn(async () => Promise.resolve(subscription)),
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
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        await provider.postWebhook({
          body: {
            endpointSecret: '',
            rawBody: Buffer.from(''),
            signature: '',
          },
        });

        expect(StripeMock.webhooks.constructEvent).toBeCalledWith(
          expect.any(Buffer),
          expect.any(String),
          expect.any(String),
        );
        expect(StripeMock.subscriptions.retrieve).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findTier).toBeCalled();
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
      },
    );

    test.concurrent(
      'customer.subscription.updated and payment succeeded-> event is handled',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };
        const tier = {
          id: 'starter',
          stripeProduct: generateFakeId(IdType.PRODUCT),
        };
        const subscription = {
          id: generateFakeId(IdType.SUBSCRIPTION),
          customer: customer.stripeCustomer,
          items: {
            data: [
              {
                quantity: 1,
                price: {
                  product: {
                    id: tier.stripeProduct,
                  },
                },
              },
            ],
          },
          latest_invoice: {
            payment_intent: {
              status: 'succeeded',
            },
          },
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => ({
              type: 'customer.subscription.updated',
              data: {
                object: subscription,
              },
            })),
          },
          subscriptions: {
            retrieve: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findCustomer: jest.fn(async () => Promise.resolve(customer)),
          findTier: jest.fn(async () => Promise.resolve(tier)),
          updateSubscription: jest.fn(async () => Promise.resolve()),
        };

        container.bind(TYPES.Stripe).toConstantValue(StripeMock);
        container.bind(TYPES.ConfigProvider).toConstantValue({
          config,
        });
        container
          .bind(TYPES.StripeProviderStorageAdapter)
          .toConstantValue(StripeProviderStorageAdapterMock);
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        await provider.postWebhook({
          body: {
            endpointSecret: '',
            rawBody: Buffer.from(''),
            signature: '',
          },
        });

        expect(StripeMock.webhooks.constructEvent).toBeCalledWith(
          expect.any(Buffer),
          expect.any(String),
          expect.any(String),
        );
        expect(StripeMock.subscriptions.retrieve).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findTier).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.updateSubscription,
        ).toBeCalledWith(
          expect.any(String),
          expect.objectContaining({
            stripeSubscription: expect.any(String),
            tier: expect.any(String),
            quantity: expect.any(Number),
          }),
        );
      },
    );

    test.concurrent(
      'customer.subscription.deleted -> event is handled',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };
        const tier = {
          id: 'starter',
          stripeProduct: generateFakeId(IdType.PRODUCT),
        };
        const subscription = {
          id: generateFakeId(IdType.SUBSCRIPTION),
          customer: customer.stripeCustomer,
          items: {
            data: [
              {
                quantity: 1,
                price: {
                  product: {
                    id: tier.stripeProduct,
                  },
                },
              },
            ],
          },
          latest_invoice: {
            payment_intent: {
              status: 'succeeded',
            },
          },
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => ({
              type: 'customer.subscription.deleted',
              data: {
                object: subscription,
              },
            })),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findCustomer: jest.fn(async () => Promise.resolve(customer)),
          updateSubscription: jest.fn(async () => Promise.resolve()),
        };

        container.bind(TYPES.Stripe).toConstantValue(StripeMock);
        container.bind(TYPES.ConfigProvider).toConstantValue({
          config,
        });
        container
          .bind(TYPES.StripeProviderStorageAdapter)
          .toConstantValue(StripeProviderStorageAdapterMock);
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        await provider.postWebhook({
          body: {
            endpointSecret: '',
            rawBody: Buffer.from(''),
            signature: '',
          },
        });

        expect(StripeMock.webhooks.constructEvent).toBeCalledWith(
          expect.any(Buffer),
          expect.any(String),
          expect.any(String),
        );
        expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.updateSubscription,
        ).toBeCalledWith(
          expect.any(String),
          expect.objectContaining({
            stripeSubscription: expect.any(String),
            tier: undefined,
            quantity: undefined,
          }),
        );
      },
    );
  });
});
