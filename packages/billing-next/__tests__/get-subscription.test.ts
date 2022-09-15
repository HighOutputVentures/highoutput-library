import nock from 'nock';
import { MongooseStripeProdiverStorageAdapter } from '../src/adapters/mongoose-stripe-provider-storage.adapter';
import { JwtAuthorizationAdapter } from '../src/adapters/jwt-authorization.adapter';
import { setup, teardown } from './fixture';
import { generateFakeId, IdType } from './helpers/generate-fake-id';
import { generateToken } from './helpers/generate-token';
import { BillingServer } from '../src';
import { Subscription } from '../src/interfaces/stripe.provider';

describe('GET /subscription', () => {
  test.concurrent(
    'request is authorized and user is subscribed -> should return subscription data',
    async () => {
      const ctx = await setup();

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const user = {
        id: generateFakeId(IdType.USER),
        stripeCustomer: generateFakeId(IdType.CUSTOMER),
        stripePaymentMethod: generateFakeId(IdType.PAYMENT_METHOD),
      };
      const tier = {
        id: 'starter',
        stripePrices: [generateFakeId(IdType.PRICE)],
        stripeProduct: generateFakeId(IdType.PRODUCT),
      };
      const subscription: Omit<Subscription, 'id'> = {
        stripeSubscription: generateFakeId(IdType.SUBSCRIPTION),
        user: user.id,
        tier: tier.id,
        quantity: 1,
        stripeStatus: 'active',
      };
      const token = generateToken({ sub: user.id }, 'secret');

      await storageAdapter.insertUser(user);
      await storageAdapter.insertSubscription(subscription);
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

      nock(/stripe.com/)
        .get(`/v1/payment_methods/${user.stripePaymentMethod}`)
        .reply(200, {
          card: {
            brand: 'visa',
            country: 'US',
            exp_month: 9,
            exp_year: 2023,
            last4: '4242',
          },
        });

      await ctx.request
        .get('/subscription')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeTruthy();
          expect(res.body.data.subscription).toMatchObject(
            expect.objectContaining({
              stripeSubscription: expect.any(String),
              user: expect.any(Object),
              tier: expect.any(Object),
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
    'request is authorized and user is not subscribed -> should return null',
    async () => {
      const ctx = await setup();
      const user = generateFakeId(IdType.USER);
      const token = generateToken({ sub: user }, 'secret');

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

      await ctx.request
        .get('/subscription')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });

      await teardown(ctx);
    },
    10000,
  );
});
