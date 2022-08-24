/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import nock from 'nock';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';

describe('GET /secret', () => {
  test('when there is no existing intent -> should return client secret', async () => {
    const authorizationAdapter = {
      authorize: jest.fn(async () =>
        Promise.resolve({ id: Buffer.from(faker.datatype.uuid()) }),
      ),
    };
    const billingServer = new BillingServer({
      stripeSecretKey:
        'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
      authorizationAdapter,
      config: './__tests__/test-config.json',
    });
    const ctx = await setup(billingServer);
    const expected = {
      client_secret: `seti_${faker.random.alphaNumeric(
        24,
      )}_secret_${faker.random.alphaNumeric(24)}`,
    };
    nock(/stripe.com/)
      .get(/\/v1\/setup_intents/)
      .reply(200, { data: [] });
    nock(/stripe.com/)
      .post(/\/v1\/setup_intents/)
      .reply(200, expected);

    await ctx.request
      .get('/secret')
      .set('Authorization', 'Bearer Token')
      .query({ userId: `cus_${faker.random.alphaNumeric(24)}` })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data.client_secret).toBeTruthy();
        expect(res.body.data).toMatchObject(expected);
      });

    await teardown(ctx);
  });
});
