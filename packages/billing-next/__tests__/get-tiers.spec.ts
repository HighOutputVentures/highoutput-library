// import { faker } from '@faker-js/faker';
// import { Schema } from 'mongoose';
import { BillingServer } from '../src';
import { setup, teardown } from './fixture';
import { generateFakeConfig } from './helpers/generate-fake-config';

describe('GET /tiers', () => {
  test.concurrent(
    'request is authorized -> should return tiers data',
    async () => {
      const config = generateFakeConfig();
      const ctx = await setup();
      const billingServer = new BillingServer({
        stripeSecretKey:
          'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
        configFilePath: './__tests__/assets/config.json',
        endpointSigningSecret: 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW',
        mongoDbConnection: ctx.mongoose,
      });

      ctx.app.use(billingServer.expressMiddleware());

      await ctx.request
        .get('/tiers')
        // .set('Authorization', 'Bearer Token')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data).toStrictEqual(config.tiers);
        });

      await teardown(ctx);
    },
  );

  test.todo('token is not sent -> should return 401');
});
