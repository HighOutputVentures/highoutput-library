import http from 'http';
import mongoose from 'mongoose';

import { EmailAuthentication } from '../../src';
import { SendGridAdapter } from '../../src/adapters/send-grid-adapter';
import { MongooseAdapter } from '../../src/adapters/mongoose-adapter';

const dbURI = 'mongodb://localhost:27017/test-middleware';

(async () => await mongoose.connect(dbURI).catch((e) => console.error(e)))();

const persistenceAdapter = new MongooseAdapter({
  db: mongoose.connection,
  userCollectionString: 'users',
})

const emailProviderAdapter = new SendGridAdapter({
  apiKey: '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',
  from: {
    email: 'chris@identifi.com.com',
    name: 'no-reply',
  },
});

const otpOptions = {
  expiryDuration: 30_000,
  payload: {
    id: Buffer.from('Hello'),
    subject: Buffer.from('Hello'),
  },
};

const server = http.createServer();

const emailAuthentication = new EmailAuthentication({
  server,

  persistenceAdapter,

  emailProviderAdapter,

  jwtSecret: 'SECRET',
});

emailAuthentication.use();

server.listen(8080);