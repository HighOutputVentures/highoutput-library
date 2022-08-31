/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import nock from 'nock';
import { Schema } from 'mongoose';
import MongooseStorageAdapter from '../src/adapters/mongoose-storage-adapter';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';

describe('GET /secret', () => {
  test('when request is valid -> should return client secret', async () => {
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
    const user = await UserModel.create({});

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
      endpointSecret: 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW',
    });

    ctx.app.use(billingServer.expressMiddleware());

    const expected = {
      client_secret: `seti_${faker.random.alphaNumeric(
        24,
      )}_secret_${faker.random.alphaNumeric(24)}`,
    };

    nock(/stripe.com/)
      .post(/\/v1\/customers/)
      .reply(200, { id: `cus_${faker.random.alphaNumeric(24)}` })
      .get(/\/v1\/setup_intents/)
      .reply(200, { data: [] })
      .post(/\/v1\/setup_intents/)
      .reply(200, expected);

    await ctx.request
      .get('/secret')
      .set('Authorization', 'Bearer Token')
      .query({ id: user._id.toString('base64url') })
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
