import getPort from 'get-port';
import mongoose, { Connection } from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import http, { Server } from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';

export type Context = {
  mongoose: Connection;
  request: SuperTest<Test>;
  server: Server;
  mongod: MongoMemoryServer;
};

export async function setup() {
  const mongod = await MongoMemoryServer.create();

  const port = await getPort();

  const request = supertest(`http://localhost:${port}`);

  const server = http.createServer();
  server.listen(port);

  const connection = await mongoose.createConnection(mongod.getUri());

  return {
    mongoose: connection,
    request,
    server,
    mongod,
  }
}

export async function teardown(ctx: Context) {
  ctx.server.close();
  await ctx.mongoose.close();
  await ctx.mongod.stop();
}
