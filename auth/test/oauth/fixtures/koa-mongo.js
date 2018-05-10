const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const cors = require('@koa/cors');
const mongoose = require('mongoose');

const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const { makeExecutableSchema } = require('graphql-tools');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const { OAuth2KoaAdapter } = require('../../../').oauth2;

const app = new Koa();
const router = new Router();

module.exports = {
  start: async () => {
    await mongoose.connect(process.env.mongo);
    require('./models/user'); // eslint-disable-line

    const graphqlschema = ctx => ({
      schema: makeExecutableSchema({
        typeDefs: mergeTypes(
          fileLoader(
            path.join(process.cwd(), '/graphql/type'),
            { recursive: true },
          ),
          { all: true },
        ),
        resolvers: mergeResolvers(fileLoader(
          path.join(process.cwd(), '/graphql/resolver'),
          { recursive: true },
        )),
      }),
      context: ctx,
    });

    const oauth2 = new OAuth2KoaAdapter({
      issuer: 'api.oauthtest.io',
      userModel: mongoose.connection.model('user'),
    });

    router.post('/oauth/token', oauth2.token());
    router.get('/oauth/authorize', oauth2.authorize());

    router.post('/graphql', oauth2.authenticate(), graphqlKoa(graphqlschema));
    router.get('/graphql', oauth2.authenticate(), graphqlKoa(graphqlschema));
    router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

    app.use(cors());
    app.use(bodyparser());
    app.use(router.routes());
    app.use(router.allowedMethods());

    this.server = app.listen(process.env.port);
  },
  stop: async () => {
    await mongoose.disconnect();

    await new Promise((resolve) => {
      this.server.close(resolve);
    });
  },
};
