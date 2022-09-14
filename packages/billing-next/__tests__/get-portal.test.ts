import nock from 'nock';
import { faker } from '@faker-js/faker';
import { MongooseStripeProdiverStorageAdapter } from '../src/adapters/mongoose-stripe-provider-storage.adapter';
import { JwtAuthorizationAdapter } from '../src/adapters/jwt-authorization.adapter';
import { setup, teardown } from './fixture';
import { generateFakeId, IdType } from './helpers/generate-fake-id';
import { generateToken } from './helpers/generate-token';
import { BillingServer } from '../src';

describe('GET /portal', () => {
  test.concurrent(
    'request is authorized and user IS registered as customer -> should redirect',
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

      const redirectUrl = faker.internet.url();

      nock(/stripe.com/)
        .post(/\/v1\/billing_portal\/sessions/)
        .reply(200, {
          url: redirectUrl,
        });

      await ctx.request
        .get('/portal')
        .set('Authorization', `Bearer ${token}`)
        .expect(301);

      await teardown(ctx);
    },
    10000,
  );

  test.concurrent(
    'request is authorized and user IS NOT registered as customer -> should create customer and redirect',
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

      const redirectUrl = faker.internet.url();

      nock(/stripe.com/)
        .post(/\/v1\/customers/)
        .reply(200, { id: customer.stripeCustomer })
        .post(/\/v1\/billing_portal\/sessions/)
        .reply(200, {
          url: redirectUrl,
        });

      await ctx.request
        .get('/portal')
        .set('Authorization', `Bearer ${token}`)
        .expect(301);

      await teardown(ctx);
    },
    10000,
  );
});
