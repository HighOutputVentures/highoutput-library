import getPort from 'get-port';
import mongoose, { Connection } from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import { Server } from 'http';

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

  const app = express();

  const server = app.listen(port);

  const connection = mongoose.createConnection(mongod.getUri());

  return {
    mongoose: connection,
    request,
    mongod,
    server,
    app,
  };
}

export async function teardown(ctx: Context) {
  ctx.server.close();
  await ctx.mongoose.close();
  await ctx.mongod.stop();
}
