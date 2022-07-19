import getPort from 'get-port';
import supertest, { SuperTest, Test } from 'supertest';
import express from 'express';
import { Server } from 'http';

export type Context = {
  request: SuperTest<Test>;
  server: Server;
};

export async function setup() {

  const port = await getPort();

  const request = supertest(`http://localhost:${port}`);

  const app = express();

  const server = app.listen(port);

  return {
    request,
    server,
    app,
  };
}

export async function teardown(ctx: Context) {
  ctx.server.close();
}
