import http from 'http';
import mongoose, { Schema } from 'mongoose';
import { MongooseStorageAdapter } from '../src/adapters/mongoose-storage-adapter';
import { SendGridEmailAdapter } from '../src/adapters/send-grid-email-adapter';
import { EmailAuthServer } from '../src/email-auth-server';
import Chance from 'chance';

const chance = new Chance();

export async function initServer(mongoDbUri: string) {
  const mongooseConnection = mongoose.createConnection(mongoDbUri);

  const schema = new Schema({
    _id: {
      type: Buffer,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    dateTimeCreated: {
      type: Date,
      default: () => new Date(),
    },
  });

  schema.index({ emailAddress: 1 });

  mongooseConnection.model('User', schema);

  const mongooseStorageAdapter = new MongooseStorageAdapter(
    mongooseConnection,
    {
      userModel: 'User',
    },
  );

  const sendGridEmailAdapter = new SendGridEmailAdapter({
    apiKey: `SG.${chance.apple_token()}`,
    senderInfo: {
      email: chance.email(),
      name: 'no-reply',
    },
  });

  const server = http.createServer();

  const emailAuthServer = new EmailAuthServer(
    server,
    mongooseStorageAdapter,
    sendGridEmailAdapter,
    {
      jwtSecret: chance.apple_token(),
      jwtTTL: '30d',
    },
  );

  await emailAuthServer.init();

  return {
    server,
    mongooseConnection,
  };
}
