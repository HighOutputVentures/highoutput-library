import getPort from 'get-port';
import mongoose from 'mongoose';
import request, { SuperTest, Test } from 'supertest';
import { Server } from 'http';
import { promisify } from 'util';

import app from './app';

export type SetupContext = {
  port: number;
  request: SuperTest<Test>;
  server: Server;
  mongo: typeof mongoose | void;
};

export async function setup(this: SetupContext) {
  const dbURI = 'mongodb://localhost:27017/test-middleware';

  const port = await getPort();

  this.port = port;

  this.request = request(`http://localhost:${port}`);

  try {
    this.mongo = await mongoose.connect(dbURI).catch((e) => console.error(e));
    this.server = app.listen(this.port);  
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function teardown(this: SetupContext) {
  if (this.mongo) {
    this.mongo.connection.close();
  }

  if (this.server) {
    await promisify(this.server.close).call(this.server);
  }
}
