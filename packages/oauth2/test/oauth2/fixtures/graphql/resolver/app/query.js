const chance = require('chance')();

module.exports = {
  Query: {
    async app(obj, args) {
      return {
        id: args.id,
        name: chance.name(),
        clientId: chance.string(),
        clientSecret: chance.string(),
        domains: chance.domain(),
        redirectUris: chance.url(),
        grants: 'client_credentials',
      };
    },
  },
};
