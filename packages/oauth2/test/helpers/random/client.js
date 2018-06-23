const times = require('lodash.times');
const Chance = require('chance');
const uuid = require('uuid');

const chance = new Chance();

module.exports = {
  generate: async (model) => {
    const ids = [];

    await Promise.all(times(10, async () => {
      model.client.push({
        id: uuid.v4(),
        name: chance.name(),
        domain: chance.domain(),
        clientId: chance.string(),
        clientSecret: chance.string(),
        redirectUris: ['http://localhost:8888/oauth/callback'],
        grants: ['client_credentials'],
        user: uuid.v4(),
      }).save();
    }));

    return ids;
  },
};
