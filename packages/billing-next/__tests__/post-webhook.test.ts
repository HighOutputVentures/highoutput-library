import nock from 'nock';
import Stripe from 'stripe';
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

      await storageAdapter.insertCustomer(customer);
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
        latest_invoice: {
          payment_intent: {
            status: 'succeeded',
          },
        },
      };

      const payload = {
        id: 'evt_test_webhook',
        object: 'event',
        type: 'customer.subscription.created',
        data: {
          object: subscription,
        },
      };

      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      nock(/stripe.com/)
        .get(/\/v1\/subscriptions/)
        .reply(200, subscription);

      await ctx.request
        .post('/webhook')
        .set('stripe-signature', header)
        .send(payloadString)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expected);
        });

      await teardown(ctx);
    },
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
        latest_invoice: {
          payment_intent: {
            status: 'succeeded',
          },
        },
      };

      await storageAdapter.insertCustomer(customer);
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
        id: 'evt_test_webhook',
        object: 'event',
        type: 'customer.subscription.updated',
        data: {
          object: subscription,
        },
      };

      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      nock(/stripe.com/)
        .get(/\/v1\/subscriptions/)
        .reply(200, subscription);

      await ctx.request
        .post('/webhook')
        .set('stripe-signature', header)
        .send(payloadString)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expected);
        });

      await teardown(ctx);
    },
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

      await storageAdapter.insertCustomer(customer);

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
        id: 'evt_test_webhook',
        object: 'event',
        type: 'customer.subscription.deleted',
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
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expected);
        });

      await teardown(ctx);
    },
  );

  test.concurrent('unhandled event -> should return 400', async () => {
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
      id: 'evt_test_webhook',
      object: 'event',
      type: 'customer.subscription.created',
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
  });
});
