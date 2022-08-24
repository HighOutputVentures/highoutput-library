/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import nock from 'nock';
import { Schema } from 'mongoose';
import MongooseStorageAdapter from '../src/adapters/mongoose-storage-adapter';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';

describe('PUT /subscription', () => {
  test('when request is valid -> should return subscription object', async () => {
    const ctx = await setup();
    const authorizationAdapter = {
      authorize: jest.fn(async () =>
        Promise.resolve({ id: Buffer.from(faker.datatype.uuid()) }),
      ),
    };
    const UserModel = ctx.mongoose.model(
      'User',
      new Schema({
        emailAddress: {
          type: String,
          required: true,
        },
      }),
    );
    const user = await UserModel.create({
      emailAddress: faker.internet.email(),
    });

    const storageAdapter = new MongooseStorageAdapter({
      connection: ctx.mongoose,
      userModel: 'User',
    });
    const billingServer = new BillingServer({
      stripeSecretKey:
        'sk_test_51LWeDVGrNXva3DrphN3qGT3dnhh2bAoNZ7O80w4XpMEbBlMeLul10aMS7a41PXZHl8vOpcDI6JZ7KoNTSBFyV9r800kV6WzTLo',
      authorizationAdapter,
      storageAdapter,
      config: './__tests__/test-config.json',
    });

    ctx.app.use(billingServer.expressMiddleware());

    const expected = {
      user: user.id,
      tier: 'Professional',
      quantity: 1,
    };

    nock(/stripe.com/)
      .post(/\/v1\/customers/)
      .reply(200, { id: `cus_${faker.random.alphaNumeric(24)}` });
    nock(/stripe.com/)
      .post(/\/v1\/subscriptions/)
      .reply(200, {
        id: expected.tier,
        latest_invoice: {
          payment_intent: {
            status: 'succeeded',
          },
        },
        items: {
          data: [
            {
              price: {
                product: {
                  name: expected.tier,
                },
              },
              quantity: 1,
            },
          ],
        },
      });

    await ctx.request
      .put('/subscription')
      .send({
        id: user.id,
        price: `price_${faker.random.alphaNumeric(24)}`,
        quantity: 1,
      })
      .set('Authorization', 'Bearer Token')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data).toEqual(expected);
      });

    await teardown(ctx);
  });
});
