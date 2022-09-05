/* eslint-disable import/no-extraneous-dependencies */
import express, { Express } from 'express';
import { Server } from 'http';
import request, { SuperTest, Test } from 'supertest';
import mongoose, { Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export type Context = {
  request: SuperTest<Test>;
  app: Express;
  server: Server;
  mongoose: Connection;
  mongod: MongoMemoryServer;
};

export async function setup() {
  const mongod = await MongoMemoryServer.create();
  const connection = mongoose.createConnection(mongod.getUri());
  const app = express();

  const server = app.listen(0);

  const supertest = request(server);

  return {
    request: supertest,
    app,
    server,
    mongoose: connection,
    mongod,
  } as Context;
}

export async function teardown(ctx: Context) {
  ctx.server.close();
  await ctx.mongoose.close();
  await ctx.mongod.stop();
}
