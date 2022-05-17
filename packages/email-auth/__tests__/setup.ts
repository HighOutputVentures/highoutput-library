import getPort from 'get-port';
import request, { SuperTest, Test } from 'supertest';
import temp from 'temp';
import { Server } from 'http';
import { config } from 'dotenv';

import { main, close } from '../src/db';
import app from '../src/app';

temp.track();
config();

export type SetupContext = {
  mongoUri: string;
  port: number;
  request: SuperTest<Test>;
  server: Server;
};

export async function setup(this: SetupContext) {
  this.mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

  const port = await getPort();

  this.port = port;

  this.request = request(`http://localhost:${port}`);

  try {
    await main(this.mongoUri).then(() => {
      this.server = app.listen(this.port);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function teardown(this: SetupContext) {
  await close();
  this.server.close();
}
