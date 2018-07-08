process.env.port = 8886;
process.env.mongo = 'mongodb://localhost:27017/oauth-test';

const path = require('path');
const qs = require('querystring');
const test = require('ava');
const supertest = require('supertest');
const chance = require('chance')();

const server = require('./fixtures/server');

const request = supertest(`http://localhost:${process.env.port}`);

test.before(async () => {
  process.chdir(path.join(__dirname, '/fixtures'));
  await server.start();
});

test.after(async () => {
  await server.stop();
});

test('client_credentials grant', async (t) => {
  /* ask for a token directly */
  const { body } = await request
    .post('/oauth/token')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(qs.stringify({
      grant_type: 'client_credentials',
      client_id: 'swyOqkUMIGfearzFTzbe',
      client_secret: 'NczCAUWE3I18qVUn6mAk',
      audience: 'app.fixture.io',
    }));

  t.truthy(body.access_token);
  t.truthy(body.expires_in);
  t.is(body.token_type, 'Bearer');
});

test('client_credentials grant, graphql mutation', async (t) => {
  /* ask for a token directly */
  const { body } = await request
    .post('/oauth/token')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(qs.stringify({
      grant_type: 'client_credentials',
      client_id: 'swyOqkUMIGfearzFTzbe',
      client_secret: 'NczCAUWE3I18qVUn6mAk',
      audience: 'app.fixture.io',
    }));

  /* use token to access api */
  const input = {
    name: chance.name(),
    clientId: chance.string(),
    clientSecret: chance.string(),
    domains: chance.domain(),
    redirectUris: chance.url(),
    grants: 'client_credentials',
  };

  const response = await request
    .post('/graphql')
    .send({
      query: `
        mutation ($token: String!, $input: createAppInput!) {
          createApp(token: $token, input: $input) { id name }
        }
      `,
      variables: { token: body.access_token, input },
    });

  t.truthy(response.body.data.createApp.id);
  t.is(response.body.data.createApp.name, input.name);
});
