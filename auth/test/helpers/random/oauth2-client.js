const times = require('lodash.times');
const Chance = require('chance');
const mongoose = require('mongoose');

const chance = new Chance();

module.exports = {
  generate: async () => {
    const ids = [];
    const OAuth2ClientModel = mongoose.connection.model('oauth2-client');

    await Promise.all(times(10, async () => {
      const id = mongoose.Types.ObjectId();
      ids.push(id.toHexString());

      await new OAuth2ClientModel({
        _id: id,
        name: chance.name(),
        domain: chance.domain(),
        clientId: chance.string(),
        clientSecret: chance.string(),
        redirectUris: ['http://localhost:8888/oauth/callback'],
        grants: ['client_credentials'],
        user: mongoose.Types.ObjectId().toHexString(),
      }).save();
    }));

    return ids;
  },
};
