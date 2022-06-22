import { setup, teardown } from './fixture';
import { EmailAuthServer } from '../src/email-auth-server';
import { MongooseStorageAdapter, SendGridEmailAdapter } from '../src/adapters';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';

describe('POST /otp/generate', () => {
  test('generate otp', async function() {
    const ctx = await setup();

    const emailAddress = faker.internet.email();

    const userModel = ctx.mongoose.model(
      'User',
      new Schema({
        emailAddress: {
          type: String,
          index: 1,
          required: true,
        }
      }),
    );

    await userModel.create({
      emailAddress
    });

    const server = new EmailAuthServer(
      ctx.server,
      new MongooseStorageAdapter(ctx.mongoose, {
        userModel: 'User'
      }),
      new SendGridEmailAdapter({
        apiKey: `SG.${faker.random.alphaNumeric(12)}`,
        sender: '',
        subject: '',
        template: ''
      })
    );

    await server.init();

    await ctx.request
      .post('/otp/generate')
      .send({
        emailAddress
      })
      .expect(200);

    expect(true);

    await teardown(ctx);
  });

  test.todo('user does not exist');
});
