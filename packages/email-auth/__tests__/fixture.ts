import getPort from 'get-port';
import request, { SuperTest, Test } from 'supertest';
import http, { Server } from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';

export type Context = {
  request: SuperTest<Test>;
  server: Server;
  mongod: MongoMemoryServer;
};

export async function setup(ctx: Context) {
  ctx.mongod = await MongoMemoryServer.create();

  const port = await getPort();

  ctx.request = request(`http://localhost:${port}`);

  ctx.server = http.createServer();
  ctx.server.listen(port);

  return ctx;
}

export async function teardown(ctx: Context) {
  ctx.server.close();
  await ctx.mongod.stop();
}
