const times = require('lodash.times');
const chance = require('chance')();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

module.exports = {
  generate: async (model) => {
    const ids = [];

    await Promise.all(times(10, async () => {
      model.user.push({
        id: uuid.v4(),
        username: chance.email(),
        password: await bcrypt.hash('password123', 8),
        firstname: chance.first(),
        lastname: chance.last(),
      }).save();
    }));

    return ids;
  },
};
