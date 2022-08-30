/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { faker } from '@faker-js/faker';
import nock from 'nock';
import { Schema } from 'mongoose';
import MongooseStorageAdapter from '../src/adapters/mongoose-storage-adapter';
import BillingServer from '../src/billing-server';
import { setup, teardown } from './fixture';
import stripe from '../src/lib/setup';

describe('POST /webhook', () => {
  test('when customer.subscription.created event is sent -> should update user subscription', async () => {
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

    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'customer.subscription.created',
      data: {
        object: {
          id: `sub_${faker.random.alphaNumeric(24)}`,
          customer: `cus_${faker.random.alphaNumeric(24)}`,
        },
      },
    };

    const payloadString = JSON.stringify(payload, null, 2);
    const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: webhookSecret,
    });

    nock(/stripe.com/)
      .get(/\/v1\/customer/)
      .reply(200, {
        metadata: {
          id: user.id,
        },
      });

    await ctx.request
      .post('/webhook')
      .set('stripe-signature', header)
      .send(payloadString)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data).toEqual({ received: true });
      });

    await teardown(ctx);
  });

  test('when customer.subscription.updated event is sent -> should update user subscription', async () => {
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

    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: `sub_${faker.random.alphaNumeric(24)}`,
          customer: `cus_${faker.random.alphaNumeric(24)}`,
        },
      },
    };

    const payloadString = JSON.stringify(payload, null, 2);
    const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: webhookSecret,
    });

    nock(/stripe.com/)
      .get(/\/v1\/customer/)
      .reply(200, {
        metadata: {
          id: user.id,
        },
      });

    await ctx.request
      .post('/webhook')
      .set('stripe-signature', header)
      .send(payloadString)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data).toEqual({ received: true });
      });

    await teardown(ctx);
  });

  test('when customer.subscription.deleted event is sent -> should update user subscription', async () => {
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

    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: `sub_${faker.random.alphaNumeric(24)}`,
          customer: `cus_${faker.random.alphaNumeric(24)}`,
        },
      },
    };

    const payloadString = JSON.stringify(payload, null, 2);
    const webhookSecret = 'whsec_T1sWT0N2rHkaFNG8EDgJfryNdlg6r2MW';
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: webhookSecret,
    });

    nock(/stripe.com/)
      .get(/\/v1\/customer/)
      .reply(200, {
        metadata: {
          id: user.id,
        },
      });

    await ctx.request
      .post('/webhook')
      .set('stripe-signature', header)
      .send(payloadString)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(res.body.data).toEqual({ received: true });
      });

    await teardown(ctx);
  });
});
