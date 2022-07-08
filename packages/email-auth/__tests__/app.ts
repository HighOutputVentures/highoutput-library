import http from 'http';
import mongoose from 'mongoose';

import { EmailAuthentication } from '../src';
import { SendGridAdapter } from '../src/adapters/send-grid-adapter';
import { MongooseAdapter } from '../src/adapters/mongoose-adapter';
import { Chance } from 'chance';

const dbURI = 'mongodb://localhost:27017/test-middleware';

const chance = new Chance();
(async () => await mongoose.connect(dbURI).catch((e) => console.error(e)))();

const persistenceAdapter = new MongooseAdapter({
  db: mongoose.connection,
  userCollectionString: 'userstests',
});

const emailProviderAdapter = new SendGridAdapter({
  apiKey: `SG.${chance.apple_token()}`,
  from: {
    email: 'chris@identifi.com.com',
    name: 'no-reply',
  },
});

const server = http.createServer();

const emailAuthentication = new EmailAuthentication({
  server,

  persistenceAdapter,

  emailProviderAdapter,

  jwtSecretKey: 'SECRET',
});

emailAuthentication.use();

export default server;
