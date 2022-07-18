import { setup, teardown } from './fixture';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Request, Response, NextFunction } from 'express';
import { Client } from '@notionhq/client';
import { SupportServer } from '../src/support-server';

describe('POST /support/messages', () => {
  test.concurrent('add support message to notion', async function () {
    const ctx = await setup();

    const server = new SupportServer({
      databaseId: '347e80b6-e191-43d4-b07a-aabc02c47953',
      notionAccessToken: 'secret_zoRIPHp52c4lkVAjtccpSuc34wBE9X2gNhSOfZaTBnF',
      prefix: '/support',
      project: 'HER',
    });

    ctx.app.use(server.expressMiddleware());

    await ctx.request
      .post('/support/messages')
      .send({
        emailAddress: faker.internet.email(),
        message: faker.lorem.paragraph(),
        details: {
          name: faker.name.findName(),
          category: faker.lorem.word(),
        },
      })
      .expect(201);

    await teardown(ctx);
  });

  test.concurrent('invalid email address', async function () {
    const ctx = await setup();

    const server = new SupportServer({
      databaseId: '347e80b6-e191-43d4-b07a-aabc02c47953',
      notionAccessToken: 'secret_zoRIPHp52c4lkVAjtccpSuc34wBE9X2gNhSOfZaTBnF',
      prefix: '/support',
      project: 'HER',
    });

    ctx.app.use(server.expressMiddleware());

    await ctx.request.post('/support/messages').send({}).expect(400);

    await teardown(ctx);
  });
});
