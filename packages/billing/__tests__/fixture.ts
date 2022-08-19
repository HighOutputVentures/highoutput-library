/* eslint-disable import/extensions */
import express, { Express } from 'express';
import { Server } from 'http';
import request, { SuperTest, Test } from 'supertest';
import BillingServer from '../src/billing-server';

export type Context = {
  request: SuperTest<Test>;
  app: Express;
  server: Server;
};

export async function setup(billingServer: BillingServer) {
  const app = express();

  app.use(billingServer.expressMiddleware());

  const server = app.listen(0);

  const supertest = request(server);

  return {
    request: supertest,
    app,
    server,
  } as Context;
}

export async function teardown(ctx: Context) {
  ctx.server.close();
}
