/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import { Schema } from 'mongoose';
import MongooseStorageAdapter from '../src/adapters/mongoose-storage-adapter';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';

describe('GET /subscription', () => {
  test('when request is valid -> should return a user subscription', async () => {
    const ctx = await setup();
    const authorizationAdapter = {
      authorize: jest.fn(async () =>
        Promise.resolve({ id: Buffer.from(faker.datatype.uuid()) }),
      ),
    };
    const UserModel = ctx.mongoose.model(
      'User',
      new Schema({
        _id: {
          type: Buffer,
          default: Buffer.from(faker.datatype.uuid()),
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

    await storageAdapter.updateSubscription({
      id: user._id,
      tier: 'Professional',
      quantity: 1,
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
      user: user._id.toString('base64url'),
      tier: 'Professional',
      quantity: 1,
    };

    await ctx.request
      .get('/subscription')
      .set('Authorization', 'Bearer Token')
      .query({ id: user._id.toString('base64url') })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data).toMatchObject(expected);
      });

    await teardown(ctx);
  });
});
