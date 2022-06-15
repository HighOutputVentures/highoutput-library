import http from 'http';
import mongoose from 'mongoose';
import 'dotenv/config';

import { EmailAuthentication } from '../../src';
import { SendGridAdapter } from '../../src/adapters/send-grid-adapter';
import { MongooseAdapter } from '../../src/adapters/mongoose-adapter';

const dbURI = 'mongodb://localhost:27017/test-middleware';

(async () => await mongoose.connect(dbURI).catch((e) => console.error(e)))();

const PERSISTENCE_CONFIG = {
  db: mongoose.connection,
  userCollectionString: 'users',
};

const persistenceAdapter = new MongooseAdapter(PERSISTENCE_CONFIG);

const EMAIL_PROVIDER_CONFIG = {
  apiKey: process.env.SENDGRID_API_KEY as string,
  from: {
    email: process.env.SENDER_EMAIL as string || 'emailauth@hov.co',
    name: process.env.SENDER_NAME as string || 'no-reply',
  }
};
const emailProviderAdapter = new SendGridAdapter(EMAIL_PROVIDER_CONFIG);

const server = http.createServer();

const emailAuthentication = new EmailAuthentication({
  server,

  persistenceAdapter,

  emailProviderAdapter,

  jwtSecretKey: 'SECRET',
});

emailAuthentication.use();

server.listen(8080);