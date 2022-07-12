import { setup, teardown } from './fixture';
import { EmailAuthServer } from '../src/email-auth-server';
import { MongooseStorageAdapter } from '../src/adapters';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import cryptoRandomString from 'crypto-random-string';

describe('POST /otp/validate', () => {
  test.concurrent('validate otp', async function () {
    const ctx = await setup();

    const emailAddress = faker.internet.email();

    const userModel = ctx.mongoose.model(
      'User',
      new Schema({
        _id: {
          type: Buffer,
          required: true,
        },
        emailAddress: {
          type: String,
          index: 1,
          required: true,
        },
      }),
    );

    const user = await userModel.create({
      _id: Buffer.from(faker.git.commitSha()),
      emailAddress,
    });

    const mongooseStorageAdapter = new MongooseStorageAdapter(ctx.mongoose, {
      userModel: 'User',
    });

    const otp = cryptoRandomString({
      length: 6,
      type: 'numeric',
    });

    await mongooseStorageAdapter.saveOtp({
      user: user._id,
      otp,
    });

    const emailAdapter = {
      sendEmailOtp: jest.fn(async () => {}),
    };

    const server = new EmailAuthServer(mongooseStorageAdapter, emailAdapter, {
      jwtSecret: faker.git.commitSha(),
      jwtTTL: '30d',
    });

    ctx.app.use(server.expressMiddleware());

    const response = await ctx.request
      .post('/otp/validate')
      .send({
        otp,
      })
      .expect(200);

    expect(response.body).toHaveProperty(['ok'], true);
    expect(response.body).toHaveProperty(['token']);

    await teardown(ctx);
  });
});
