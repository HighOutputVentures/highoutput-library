import { setup, teardown } from './fixture';
import { faker } from '@faker-js/faker';
import { SupportServer } from '../src/support-server';
import nock from 'nock';

describe('POST /support/messages', () => {
  test.concurrent('add support message to notion', async function () {
    const ctx = await setup();

    const server = new SupportServer({
      notionDatabaseId: faker.git.commitSha(),
      notionAccessToken: faker.git.commitSha(),
      prefix: '/support',
      project: 'HER',
    });

    ctx.app.use(server.expressMiddleware());

    nock('https://api.notion.com/').post('/v1/pages').reply(200, {
      id: faker.git.commitSha(),
    });

    await ctx.request
      .post('/support/messages')
      .send({
        emailAddress: faker.internet.email(),
        message: faker.lorem.paragraph(),
        details: {
          customerName: faker.name.findName(),
          name: faker.name.findName(),
          category: faker.lorem.word(),
        },
      })
      .expect(201);

    await teardown(ctx);
  });

  test.concurrent('invalid data', async function () {
    const ctx = await setup();

    const server = new SupportServer({
      notionDatabaseId: faker.git.commitSha(),
      notionAccessToken: faker.git.commitSha(),
      prefix: '/support',
      project: 'HER',
    });

    ctx.app.use(server.expressMiddleware());

    await ctx.request.post('/support/messages').send({}).expect(400);

    await teardown(ctx);
  });
});
