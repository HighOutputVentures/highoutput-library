import nock from 'nock';
import R from 'ramda';
import { MongooseStripeProdiverStorageAdapter } from '../src/adapters/mongoose-stripe-provider-storage.adapter';
import { JwtAuthorizationAdapter } from '../src/adapters/jwt-authorization.adapter';
import { setup, teardown } from './fixture';
import { generateFakeId, IdType } from './helpers/generate-fake-id';
import { generateToken } from './helpers/generate-token';
import { BillingServer } from '../src';

describe('PUT /subscription', () => {
  test.concurrent(
    'customer and tier is valid -> should PUT subscription',
    async () => {
      const ctx = await setup();

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };
      const token = generateToken({ sub: customer.id }, 'secret');
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
        endpointSigningSecret: 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW',
        stripeProviderStorageAdapter: storageAdapter,
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const subscription = {
        id: generateFakeId(IdType.SUBSCRIPTION),
        user: customer.id,
        tier: tier.id,
        quantity: 1,
        status: 'active',
      };

      nock(/stripe.com/)
        .post(/\/v1\/customers/)
        .reply(200, { id: customer.stripeCustomer })
        .post(/\/v1\/subscriptions/)
        .reply(200, subscription);

      await ctx.request
        .put('/subscription')
        .send(R.omit(['status, id, user'], subscription))
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeTruthy();
          expect(res.body.data.subscription).toMatchObject(
            expect.objectContaining({
              stripeSubscription: expect.any(String),
              user: expect.any(String),
              tier: expect.any(String),
              quantity: expect.any(Number),
              stripeStatus: expect.any(String),
            }),
          );
        });

      await teardown(ctx);
    },
    10000,
  );

  test.concurrent(
    'customer does not exist -> should not PUT subscription',
    async () => {
      const ctx = await setup();

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };
      const token = generateToken({ sub: customer.id }, 'secret');

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW',
        stripeProviderStorageAdapter: new MongooseStripeProdiverStorageAdapter(
          ctx.mongoose,
        ),
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const payload = {
        tier: 'starter',
        quantity: 1,
      };

      await ctx.request
        .put('/subscription')
        .send(payload)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toMatch(/cannot be found/);
        });

      await teardown(ctx);
    },
    10000,
  );

  test.concurrent(
    'customer exists but tier is invalid -> should not PUT subscription',
    async () => {
      const ctx = await setup();

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const customer = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
      };
      const token = generateToken({ sub: customer.id }, 'secret');

      await storageAdapter.insertUser(customer);

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW',
        stripeProviderStorageAdapter: storageAdapter,
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      const payload = {
        tier: 'INVALID',
        quantity: 1,
      };

      await ctx.request
        .put('/subscription')
        .send(payload)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toMatch(/cannot be found/);
        });

      await teardown(ctx);
    },
  );
});
