import getPort from 'get-port';
import request, { SuperTest, Test } from 'supertest';
import temp from 'temp';
import { Server } from 'http';

import logger from '../logger';
import { main, close } from '../src/db';
import app from '../src/app';

temp.track();

export type SetupContext = {
  mongoUri: string;
  port: number;
  request: SuperTest<Test>;
  server: Server;
};

export async function setup(this: SetupContext) {
  this.mongoUri = 'mongodb://localhost:2717/test';

  const port = await getPort();

  this.port = port;

  this.request = request(`http://localhost:${port}`);

  try {
    await main(this.mongoUri).then(() => {
      this.server = app.listen(this.port, () => logger.info(`Server is listening on port ${this.port}...`));
    });
  } catch (error) {
    logger.error(error as Error);
    throw error;
  }
}

export async function teardown(this: SetupContext) {
  await close();
  this.server.close();
}
