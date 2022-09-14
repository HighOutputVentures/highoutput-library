import nock from 'nock';
import Stripe from 'stripe';
import { faker } from '@faker-js/faker';
import { MongooseStripeProdiverStorageAdapter } from '../src/adapters/mongoose-stripe-provider-storage.adapter';
import { JwtAuthorizationAdapter } from '../src/adapters/jwt-authorization.adapter';
import { setup, teardown } from './fixture';
import { generateFakeId, IdType } from './helpers/generate-fake-id';
import { BillingServer } from '../src';

describe('POST /webhook', () => {
  test.concurrent(
    'customer.subscription.created event is sent -> should create subscription',
    async () => {
      const ctx = await setup();
      const stripe = new Stripe('', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        apiVersion: null,
      });

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };
      const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';
      const tier = {
        id: 'starter',
        stripePrices: [generateFakeId(IdType.PRICE)],
        stripeProduct: generateFakeId(IdType.PRODUCT),
      };

      await storageAdapter.insertUser(customer);
      await storageAdapter.insertTier(tier);

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: webhookSecret,
        stripeProviderStorageAdapter: storageAdapter,
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const expected = {
        received: true,
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

      const payload = {
        id: generateFakeId(IdType.EVENT),
        object: 'event',
        type: 'customer.subscription.created',
        data: {
          object: subscription,
        },
        request: {
          id: null,
          idempotency_key: faker.datatype.uuid(),
        },
      };

      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      nock(/stripe.com/)
        .get(`/v1/subscriptions/${subscription.id}`)
        .query({ expand: ['items.data.price.product'] })
        .reply(200, subscription);

      await ctx.request
        .post('/webhook')
        .set('stripe-signature', header)
        .send(payloadString)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual(expected);
        });

      await teardown(ctx);
    },
    10000,
  );
  test.concurrent(
    'customer.subscription.updated event is sent -> should update user subscription',
    async () => {
      const ctx = await setup();
      const stripe = new Stripe('', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        apiVersion: null,
      });

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };
      const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';
      const tier = {
        id: 'starter',
        stripePrices: [generateFakeId(IdType.PRICE)],
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

      await storageAdapter.insertUser(customer);
      await storageAdapter.insertTier(tier);
      await storageAdapter.insertSubscription({
        id: subscription.id,
        user: customer.id,
        tier: tier.id,
        quantity: 1,
        status: 'active',
      });

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: webhookSecret,
        stripeProviderStorageAdapter: storageAdapter,
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const expected = {
        received: true,
      };

      const payload = {
        id: generateFakeId(IdType.EVENT),
        object: 'event',
        type: 'customer.subscription.updated',
        data: {
          object: subscription,
        },
        request: {
          id: null,
          idempotency_key: faker.datatype.uuid(),
        },
      };

      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      nock(/stripe.com/)
        .get(`/v1/subscriptions/${subscription.id}`)
        .query({ expand: ['items.data.price.product'] })
        .reply(200, subscription);

      await ctx.request
        .post('/webhook')
        .set('stripe-signature', header)
        .send(payloadString)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual(expected);
        });

      await teardown(ctx);
    },
    10000,
  );
  test.concurrent(
    'customer.subscription.deleted event is sent -> should remove user subscription',
    async () => {
      const ctx = await setup();
      const stripe = new Stripe('', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        apiVersion: null,
      });

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };
      const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';

      await storageAdapter.insertUser(customer);

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: webhookSecret,
        stripeProviderStorageAdapter: storageAdapter,
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const expected = {
        received: true,
      };

      const subscription = {
        id: generateFakeId(IdType.SUBSCRIPTION),
        customer: customer.stripeCustomer,
      };

      const payload = {
        id: generateFakeId(IdType.EVENT),
        object: 'event',
        type: 'customer.subscription.deleted',
        data: {
          object: subscription,
        },
        request: {
          id: null,
          idempotency_key: faker.datatype.uuid(),
        },
      };

      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      await ctx.request
        .post('/webhook')
        .set('stripe-signature', header)
        .send(payloadString)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual(expected);
        });

      await teardown(ctx);
    },
    10000,
  );

  test.concurrent(
    'unhandled event -> should return 400',
    async () => {
      const ctx = await setup();
      const stripe = new Stripe('', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        apiVersion: null,
      });

      const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: webhookSecret,
        stripeProviderStorageAdapter: new MongooseStripeProdiverStorageAdapter(
          ctx.mongoose,
        ),
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const subscription = {
        id: generateFakeId(IdType.SUBSCRIPTION),
      };

      const payload = {
        id: generateFakeId(IdType.EVENT),
        object: 'event',
        type: 'INVALID_EVENT',
        data: {
          object: subscription,
        },
      };

      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      await ctx.request
        .post('/webhook')
        .set('stripe-signature', header)
        .send(payloadString)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              error: expect.any(String),
            }),
          );
        });

      await teardown(ctx);
    },
    10000,
  );

  test.concurrent('webhook event is already processed and logged', async () => {
    const ctx = await setup();
    const stripe = new Stripe('', {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      apiVersion: null,
    });

    const storageAdapter = new MongooseStripeProdiverStorageAdapter(
      ctx.mongoose,
    );

    const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';

    const payload = {
      id: generateFakeId(IdType.EVENT),
      type: 'customer.subscription.updated',
      request: {
        id: null,
        idempotency_key: faker.datatype.uuid(),
      },
    };

    await storageAdapter.insertEvent({
      id: payload.id,
      type: payload.type,
      requestId: payload.request.id,
      idempotencyKey: payload.request.idempotency_key,
    });

    const billingServer = new BillingServer({
      stripeSecretKey:
        'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
      configFilePath: './__tests__/assets/config.json',
      endpointSigningSecret: webhookSecret,
      stripeProviderStorageAdapter: storageAdapter,
      authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
    });

    ctx.app.use(billingServer.expressMiddleware());

    const expected = {
      received: true,
    };

    const payloadString = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: webhookSecret,
    });

    await ctx.request
      .post('/webhook')
      .set('stripe-signature', header)
      .send(payloadString)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toEqual(expected);
      });

    await teardown(ctx);
  });
});
