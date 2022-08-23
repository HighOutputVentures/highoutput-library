/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';

describe('GET /tiers', () => {
  test('request is valid -> should return products[]', async () => {
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

    await ctx.request
      .get('/tiers')
      .set('Authorization', 'Bearer Token')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data).toBeInstanceOf(Array);
      });

    await teardown(ctx);
  });
});
