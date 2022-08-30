/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import nock from 'nock';
import { Schema } from 'mongoose';
import MongooseStorageAdapter from '../src/adapters/mongoose-storage-adapter';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';

describe('GET /portal', () => {
  test('when request is valid -> should redirect to portal', async () => {
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

    await storageAdapter.saveUserAsCustomer({
      id: user._id,
      customerId: `cus_${faker.random.alphaNumeric(24)}`,
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

    nock(/stripe.com/)
      .post(/\/v1\/billing_portal\/sessions/)
      .reply(200, {
        url: 'https://example.com',
      });

    await ctx.request
      .get('/portal')
      .set('Authorization', 'Bearer Token')
      .query({ id: user._id.toString('base64url') })
      .expect(302);

    await teardown(ctx);
  });
});
