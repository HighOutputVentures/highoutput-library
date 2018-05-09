process.env.port = 8886;
process.env.mongo = 'mongodb://localhost:27017/oauth-test';

const path = require('path');
const qs = require('querystring');
const test = require('ava');
const mongoose = require('mongoose');
const supertest = require('supertest');
const chance = require('chance')();

const server = require('./fixtures/koa-mongo');
const user = require('../helpers/random/user');
const client = require('../helpers/random/oauth2-client');

const request = supertest(`http://localhost:${process.env.port}`);

let users = [];
let clients = [];

test.before(async () => {
  process.chdir(path.join(__dirname, '/fixtures'));
  await server.start();

  /* generate sample data */
  users = await user.generate();
  clients = await client.generate();
});

test.after(async () => {
  await server.stop();
});

test('client_credentials grant', async (t) => {
  const OAuth2ClientModel = mongoose.connection.model('oauth2-client');

  await OAuth2ClientModel.updateOne(
    { _id: clients[0] },
    { $set: { user: users[0] } },
  );

  const appClient = await OAuth2ClientModel.findOne({ _id: clients[0] });

  /* ask for a token directly */
  const { body } = await request
    .post('/oauth/token')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(qs.stringify({
      grant_type: 'client_credentials',
      client_id: appClient.clientId,
      client_secret: appClient.clientSecret,
      audience: appClient.domain,
    }));

  t.truthy(body.access_token);
  t.truthy(body.expires_in);
  t.is(body.token_type, 'Bearer');
});

test('client_credentials grant, graphql mutation', async (t) => {
  const OAuth2ClientModel = mongoose.connection.model('oauth2-client');

  await OAuth2ClientModel.updateOne(
    { _id: clients[1] },
    { $set: { user: users[1] } },
  );

  const appClient = await OAuth2ClientModel.findOne({ _id: clients[1] });

  /* ask for a token directly */
  const { body } = await request
    .post('/oauth/token')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(qs.stringify({
      grant_type: 'client_credentials',
      client_id: appClient.clientId,
      client_secret: appClient.clientSecret,
      audience: appClient.domain,
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
