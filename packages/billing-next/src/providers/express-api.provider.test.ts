import { Container } from 'inversify';
import { generateFakeConfig } from '../../__tests__/helpers/generate-fake-config';
import { IApiProvider } from '../interfaces/api.provider';
import { ExpressApiProvider } from './express-api.provider';
import { TYPES } from '../types';
import {
  generateFakeId,
  IdType,
} from '../../__tests__/helpers/generate-fake-id';

describe('ExpressApiProvider', () => {
  describe('#getSecret', () => {
    test.concurrent(
      'customer exists with no intent -> should create and return new intent',
      async () => {
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

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
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
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        const response = await provider.getSecret({ user: customer.id });

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
        expect(response).toEqual({
          status: 200,
          body: {
            secret: clientSecret,
          },
        });
      },
    );

    test.concurrent(
      'customer exists with intent -> should return existing intent',
      async () => {
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

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
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
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        const response = await provider.getSecret({ user: customer.id });

        expect(StripeProviderStorageAdapterMock.findCustomer).toBeCalledWith(
          customer.id,
        );
        expect(StripeMock.setupIntents.list).toBeCalledWith({
          customer: customer.stripeCustomer,
        });
        expect(response).toEqual({
          status: 200,
          body: {
            secret: clientSecret,
          },
        });
      },
    );
    test.concurrent(
      'customer does not exist -> should create customer and return new intent',
      async () => {
        const config = generateFakeConfig();

        const container = new Container();

        const clientSecret = generateFakeId(IdType.SETUP_INTENT_SECRET);

        const customer = {
          id: generateFakeId(IdType.USER),
          stripeCustomer: generateFakeId(IdType.CUSTOMER),
        };

        const StripeMock = {
          setupIntents: {
            list: jest.fn(async () =>
              Promise.resolve({ data: [{ client_secret: clientSecret }] }),
            ),
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
        container.bind(TYPES.ApiProvider).to(ExpressApiProvider);

        const provider = container.get<IApiProvider>(TYPES.ApiProvider);

        const response = await provider.getSecret({ user: customer.id });

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
        expect(response).toEqual({
          status: 200,
          body: {
            secret: clientSecret,
          },
        });
      },
    );
  });
});
