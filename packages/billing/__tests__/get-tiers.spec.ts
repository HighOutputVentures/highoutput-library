/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import nock from 'nock';
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
      stripeSecretKey: '',
      authorizationAdapter,
    });
    const ctx = await setup(billingServer);
    const expected = {
      data: [
        {
          id: faker.datatype.uuid(),
          unit_amount: parseInt(faker.random.numeric(), 10),
          currency: 'usd',
          product: {
            id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            metadata: { company: faker.company.name() },
          },
        },
      ],
    };
    nock(/stripe.com/)
      .get(/\/v1\/prices/)
      .reply(200, expected);

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
