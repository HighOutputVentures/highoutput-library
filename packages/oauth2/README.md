# OAuth2 Koa Adapter

A custom koa-graphql-oauth2 adapter, this project is an spin off of the [koa-oauth-server](https://github.com/oauthjs/koa-oauth-server) project.

## Getting Started

This library is a koa-graphql-oauth2 adapter

### Installation

Run `npm install highoutput-oauth2` to install

### Features

- The api is copied from the [koa-oauth-server](https://github.com/oauthjs/koa-oauth-server) project
- This is an adapter specific for the [apollo graphql-server](https://github.com/apollographql/apollo-server)

### Quickstart

```javascript
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const cors = require('@koa/cors');
const mongoose = require('mongoose');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const { makeExecutableSchema } = require('graphql-tools');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const OAuth2Adapter = require('highoutput-oauth2');
const OAuth2Model = require('./models/node-oauth2');

const app = new Koa();
const router = new Router();

module.exports = {
  start: async () => {
    await mongoose.connect(process.env.mongo);

    /* eslint-disable */
    require('./models/user');
    require('./models/oauth2-client');
    require('./models/oauth2-code');
    require('./models/oauth2-token');
    /* eslint-enable */

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

    const oauth2 = new OAuth2Adapter({
      issuer: 'api.oauthtest.io',
      model: new OAuth2Model({ issuer: 'api.oauthtest.io' }), /* this is a custom model */
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
```

## new OAuth2Adapter(options)

The stripe constructor accepts the following configuration

- __options.issuer__ `{ String }` the jwt issuer value
- __options.model__ `{ Object }` the model object that contains the defined methods used to access oauth2 data

## Model Specification

The [model spec](https://oauth2-server.readthedocs.io/en/latest/model/spec.html) is exactly how it is defined on [node-oauth2-server](https://github.com/oauthjs/node-oauth2-server), you can instead go to the specified link and follow the model specification.
