/* eslint-disable import/no-extraneous-dependencies */
import { BillingServer } from '../src';
import { JwtAuthorizationAdapter } from '../src/adapters/jwt-authorization.adapter';
import { MongooseStripeProdiverStorageAdapter } from '../src/adapters/mongoose-stripe-provider-storage.adapter';
import { setup, teardown } from './fixture';
import { generateFakeConfig } from './helpers/generate-fake-config';

describe('GET /tiers', () => {
  test.concurrent(
    'request is authorized -> should return tiers data',
    async () => {
      const config = generateFakeConfig();
      const ctx = await setup();
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o';
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
        .get('/tiers')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data).toStrictEqual(config.tiers);
        });

      await teardown(ctx);
    },
    10000,
  );

  test.concurrent(
    'token is not sent -> should return 401',
    async () => {
      const ctx = await setup();
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
        .get('/tiers')
        .expect('Content-Type', /json/)
        .expect(401)
        .expect((res) => {
          expect(res.body.error.code).toEqual('INVALID_ACCESS');
        });

      await teardown(ctx);
    },
    10000,
  );
});
