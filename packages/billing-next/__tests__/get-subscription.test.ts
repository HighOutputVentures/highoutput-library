import { MongooseStripeProdiverStorageAdapter } from '../src/adapters/mongoose-stripe-provider-storage.adapter';
import { JwtAuthorizationAdapter } from '../src/adapters/jwt-authorization.adapter';
import { setup, teardown } from './fixture';
import { generateFakeId, IdType } from './helpers/generate-fake-id';
import { generateToken } from './helpers/generate-token';
import { BillingServer } from '../src';

describe('GET /subscription', () => {
  test.concurrent(
    'request is authorized and user is subscribed -> should return subscription data',
    async () => {
      const ctx = await setup();

      const storageAdapter = new MongooseStripeProdiverStorageAdapter(
        ctx.mongoose,
      );

      const subscription = {
        id: generateFakeId(IdType.USER),
        stripeSubscription: generateFakeId(IdType.SUBSCRIPTION),
        tier: 'Starter',
        quantity: 1,
      };
      const token = generateToken({ sub: subscription.id }, 'secret');

      await storageAdapter.insertSubscription(subscription);

      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW',
        stripeProviderStorageAdapter: storageAdapter,
        authorizationAdapter: new JwtAuthorizationAdapter({ secret: 'secret' }),
      });

      ctx.app.use(billingServer.expressMiddleware());

      await ctx.request
        .get('/subscription')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toMatchObject(subscription);
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
