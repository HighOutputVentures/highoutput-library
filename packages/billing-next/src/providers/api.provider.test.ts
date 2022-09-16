import { Container } from 'inversify';
import Stripe from 'stripe';
import { faker } from '@faker-js/faker';
import AppError from '@highoutput/error';
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
          // list: jest.fn(async () => Promise.resolve({ data: [] })),
          create: jest.fn(async () =>
            Promise.resolve({ client_secret: clientSecret }),
          ),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findUser: jest.fn(async () => Promise.resolve(customer)),
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

      expect(StripeProviderStorageAdapterMock.findUser).toBeCalledWith(
        customer.id,
      );
      expect(StripeMock.setupIntents.create).toBeCalledWith({
        payment_method_types: ['card'],
        customer: customer.stripeCustomer,
      });
      expect(output).toEqual({
        status: 200,
        body: {
          data: {
            secret: clientSecret,
          },
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
        findUser: jest.fn(async () => Promise.resolve(null)),
        insertUser: jest.fn(async () => Promise.resolve()),
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

      expect(StripeProviderStorageAdapterMock.findUser).toBeCalledWith(
        customer.id,
      );
      expect(StripeMock.customers.create).toBeCalledWith({
        metadata: {
          id: customer.id,
        },
      });
      expect(StripeProviderStorageAdapterMock.insertUser).toBeCalledWith(
        customer,
      );
      expect(StripeMock.setupIntents.create).toBeCalledWith({
        payment_method_types: ['card'],
        customer: customer.stripeCustomer,
      });
      expect(output).toEqual({
        status: 200,
        body: {
          data: {
            secret: clientSecret,
          },
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
          status: 'incomplete',
        };

        const StripeMock = {
          subscriptions: {
            create: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findUser: jest.fn(async () => Promise.resolve(customer)),
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

        expect(StripeProviderStorageAdapterMock.findUser).toHaveBeenCalledWith(
          customer.id,
        );
        expect(StripeProviderStorageAdapterMock.findTier).toHaveBeenCalledWith(
          tier.id,
        );
        expect(StripeMock.subscriptions.create).toBeCalled();
        expect(response).toMatchObject(
          expect.objectContaining({
            status: 200,
            body: {
              data: expect.objectContaining({
                subscription: expect.objectContaining({
                  stripeSubscription: expect.any(String),
                  user: expect.any(String),
                  tier: expect.any(String),
                  quantity: expect.any(Number),
                  stripeStatus: expect.any(String),
                }),
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
        findUser: jest.fn(async () => Promise.resolve(null)),
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

      expect(
        provider.putSubscription({
          user: customer.id,
          body: {
            tier: 'starter',
          },
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    test.concurrent('tier is invalid -> should throw', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };

      const StripeProviderStorageAdapterMock = {
        findUser: jest.fn(async () => Promise.resolve(customer)),
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

      expect(
        provider.putSubscription({
          user: customer.id,
          body: {
            tier: 'starter',
          },
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
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
        container.bind(TYPES.ApiProvider).to(ApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        expect(
          provider.postWebhook({
            body: {
              rawBody: '',
              signature: '',
            },
          }),
        ).rejects.toBeInstanceOf(AppError);
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

      const StripeProviderStorageAdapterMock = {
        findEvent: jest.fn(async () => Promise.resolve(null)),
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

      expect(
        provider.postWebhook({
          body: {
            endpointSecret: webhookSecret,
            rawBody: payloadString,
            signature: header,
          },
        }),
      ).rejects.toBeInstanceOf(AppError);
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
          status: 'active',
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => ({
              id: generateFakeId(IdType.EVENT),
              type: 'customer.subscription.created',
              data: {
                object: subscription,
              },
              request: {
                idempotency_key: faker.datatype.uuid(),
              },
            })),
          },
          subscriptions: {
            retrieve: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findUser: jest.fn(async () => Promise.resolve(customer)),
          findTier: jest.fn(async () => Promise.resolve(tier)),
          insertSubscription: jest.fn(async () => Promise.resolve()),
          findEvent: jest.fn(async () => Promise.resolve(null)),
          insertEvent: jest.fn(async () => Promise.resolve()),
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
        expect(StripeProviderStorageAdapterMock.findEvent).toBeCalled();
        expect(StripeMock.subscriptions.retrieve).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findUser).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findTier).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.insertSubscription,
        ).toBeCalledWith(
          expect.objectContaining({
            stripeSubscription: expect.any(String),
            user: expect.any(String),
            tier: expect.any(String),
            quantity: expect.any(Number),
            stripeStatus: expect.any(String),
          }),
        );
        expect(StripeProviderStorageAdapterMock.insertEvent).toBeCalledWith(
          expect.objectContaining({
            stripeEvent: expect.any(String),
            stripeEventType: expect.any(String),
            stripeIdempotencyKey: expect.any(String),
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
          status: 'active',
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => ({
              id: generateFakeId(IdType.EVENT),
              type: 'customer.subscription.updated',
              data: {
                object: subscription,
              },
              request: {
                idempotency_key: faker.datatype.uuid(),
              },
            })),
          },
          subscriptions: {
            retrieve: jest.fn(async () => Promise.resolve(subscription)),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findTier: jest.fn(async () => Promise.resolve(tier)),
          updateSubscription: jest.fn(async () => Promise.resolve()),
          findEvent: jest.fn(async () => Promise.resolve(null)),
          insertEvent: jest.fn(async () => Promise.resolve()),
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
        expect(StripeProviderStorageAdapterMock.findEvent).toBeCalled();
        expect(StripeMock.subscriptions.retrieve).toBeCalled();
        expect(StripeProviderStorageAdapterMock.findTier).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.updateSubscription,
        ).toBeCalledWith(
          expect.any(String),
          expect.objectContaining({
            tier: expect.any(String),
            quantity: expect.any(Number),
            stripeStatus: expect.any(String),
          }),
        );
        expect(StripeProviderStorageAdapterMock.insertEvent).toBeCalledWith(
          expect.objectContaining({
            stripeEvent: expect.any(String),
            stripeEventType: expect.any(String),
            stripeIdempotencyKey: expect.any(String),
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
          status: 'active',
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => ({
              id: generateFakeId(IdType.EVENT),
              type: 'customer.subscription.deleted',
              data: {
                object: subscription,
              },
              request: {
                idempotency_key: faker.datatype.uuid(),
              },
            })),
          },
        };

        const StripeProviderStorageAdapterMock = {
          updateSubscription: jest.fn(async () => Promise.resolve()),
          findEvent: jest.fn(async () => Promise.resolve(null)),
          insertEvent: jest.fn(async () => Promise.resolve()),
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
        expect(StripeProviderStorageAdapterMock.findEvent).toBeCalled();
        expect(
          StripeProviderStorageAdapterMock.updateSubscription,
        ).toBeCalledWith(
          expect.any(String),
          expect.objectContaining({
            stripeStatus: expect.any(String),
          }),
        );
        expect(StripeProviderStorageAdapterMock.insertEvent).toBeCalledWith(
          expect.objectContaining({
            stripeEvent: expect.any(String),
            stripeEventType: expect.any(String),
            stripeIdempotencyKey: expect.any(String),
          }),
        );
      },
    );

    test.concurrent('invoice.paid -> event is handled', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const invoice = {
        subscription: generateFakeId(IdType.SUBSCRIPTION),
      };

      const StripeMock = {
        webhooks: {
          constructEvent: jest.fn(() => ({
            id: generateFakeId(IdType.EVENT),
            type: 'invoice.paid',
            data: {
              object: invoice,
            },
            request: {
              idempotency_key: faker.datatype.uuid(),
            },
          })),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findEvent: jest.fn(async () => Promise.resolve(null)),
        updateSubscription: jest.fn(async () => Promise.resolve()),
        insertEvent: jest.fn(async () => Promise.resolve()),
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
      expect(StripeProviderStorageAdapterMock.findEvent).toBeCalled();
      expect(
        StripeProviderStorageAdapterMock.updateSubscription,
      ).toBeCalledWith(expect.any(String), { stripeStatus: 'active' });
      expect(StripeProviderStorageAdapterMock.insertEvent).toBeCalledWith(
        expect.objectContaining({
          stripeEvent: expect.any(String),
          stripeEventType: expect.any(String),
          stripeIdempotencyKey: expect.any(String),
        }),
      );
    });

    test.concurrent('setup_intent.succeeded -> event is handled', async () => {
      const config = generateFakeConfig();

      const container = new Container();

      const setupIntent = {
        id: generateFakeId(IdType.SETUP_INTENT),
        customer: generateFakeId(IdType.USER),
        payment_method: generateFakeId(IdType.PAYMENT_METHOD),
      };

      const StripeMock = {
        webhooks: {
          constructEvent: jest.fn(() => ({
            id: generateFakeId(IdType.EVENT),
            type: 'setup_intent.succeeded',
            data: {
              object: setupIntent,
            },
            request: {
              idempotency_key: faker.datatype.uuid(),
            },
          })),
        },
        customers: {
          update: jest.fn(() => Promise.resolve()),
        },
      };

      const StripeProviderStorageAdapterMock = {
        findEvent: jest.fn(async () => Promise.resolve(null)),
        insertEvent: jest.fn(async () => Promise.resolve()),
        updateUser: jest.fn(async () => Promise.resolve()),
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
      expect(StripeMock.customers.update).toBeCalledWith(
        expect.any(String),
        expect.objectContaining({
          invoice_settings: {
            default_payment_method: expect.any(String),
          },
        }),
      );
      expect(StripeProviderStorageAdapterMock.findEvent).toBeCalled();
      expect(StripeProviderStorageAdapterMock.updateUser).toBeCalledWith(
        expect.any(String),
        expect.objectContaining({
          stripePaymentMethod: expect.any(String),
        }),
      );
      expect(StripeProviderStorageAdapterMock.insertEvent).toBeCalledWith(
        expect.objectContaining({
          stripeEvent: expect.any(String),
          stripeEventType: expect.any(String),
          stripeIdempotencyKey: expect.any(String),
        }),
      );
    });

    test.concurrent(
      'event is already logged -> should return 200',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const event = {
          id: generateFakeId(IdType.EVENT),
          type: 'customer.subscription.created',
          request: {
            idempotency_key: faker.datatype.uuid(),
          },
        };

        const StripeMock = {
          webhooks: {
            constructEvent: jest.fn(() => event),
          },
        };

        const StripeProviderStorageAdapterMock = {
          findEvent: jest.fn(async () => Promise.resolve(event)),
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

        const output = await provider.postWebhook({
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
        expect(StripeProviderStorageAdapterMock.findEvent).toBeCalledWith(
          expect.any(String),
        );
        expect(output).toMatchObject(
          expect.objectContaining({
            status: 200,
            body: expect.any(Object),
          }),
        );
      },
    );
  });
});
