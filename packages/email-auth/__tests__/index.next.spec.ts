import { Chance } from 'chance';
import getPort from 'get-port';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { initServer } from './app.next';
import { promisify } from 'util';
import { Otp, User } from '../src/lib/types';
import { Document } from 'mongoose';
import { MailService } from '@sendgrid/mail';
import cryptoRandomString from 'crypto-random-string';

const chance = new Chance();

async function setup() {
  const mongod = await MongoMemoryServer.create();

  const port = await getPort();

  try {
    const serverData = await initServer(mongod.getUri());
    const mongoDb = serverData.mongooseConnection;
    const server = serverData.server.listen(port);

    const request = supertest(`http://localhost:${port}`);

    return {
      port,
      request,
      server,
      mongod,
      mongoDb,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function teardown(ctx: Awaited<ReturnType<typeof setup>>) {
  if (ctx.server) {
    if (ctx.server) {
      await promisify(ctx.server.close).call(ctx.server);
    }
  }

  if (ctx.mongoDb) {
    await ctx.mongoDb.close();
  }

  if (ctx.mongod) {
    await ctx.mongod.stop();
  }
}

describe('EmailAuthServer', () => {
  describe('POST /otp/generate', () => {
    it('should generate otp', async function () {
      const ctx = await setup();

      const userModel = ctx.mongoDb.model<Document & User>('User');

      const emailAddress = chance.email();

      await userModel.create({
        _id: Buffer.from(chance.apple_token()),
        emailAddress,
      });

      const sendSpy = jest
        .spyOn(MailService.prototype, 'send')
        .mockImplementation(async () => {
          return [
            {
              statusCode: 200,
              body: { ok: true },
              headers: {
                'Content-Type': 'application/json',
              },
            },
            {},
          ];
        });

      await ctx.request
        .post('/otp/generate')
        .send({
          emailAddress,
        })
        .expect(200);

      expect(sendSpy).toBeCalledTimes(1);
      await teardown(ctx);
    });
  });

  describe('POST /otp/validate', () => {
    it('should validate otp', async function () {
      const ctx = await setup();

      const userModel = ctx.mongoDb.model<Document & User>('User');

      const otpModel = ctx.mongoDb.model<Document & Otp>('Otp');

      const emailAddress = chance.email();

      const user = await userModel.create({
        _id: Buffer.from(chance.apple_token()),
        emailAddress,
      });

      const otp = cryptoRandomString({
        length: 6,
        type: 'numeric',
      });

      await otpModel.create({
        user: user._id,
        otp,
      });

      const response = await ctx.request
        .post('/otp/validate')
        .send({
          otp,
        })
        .expect(200);

      expect(response.body).toHaveProperty(['ok'], true);
      await teardown(ctx);
    });
  });
});
