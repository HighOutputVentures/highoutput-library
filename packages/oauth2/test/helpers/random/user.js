const times = require('lodash.times');
const chance = require('chance')();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = {
  generate: async () => {
    const ids = [];
    const UserModel = mongoose.connection.model('user');

    await Promise.all(times(10, async () => {
      const id = mongoose.Types.ObjectId();
      ids.push(id.toHexString());

      await new UserModel({
        _id: id,
        username: chance.email(),
        password: await bcrypt.hash('password123', 8),
        firstname: chance.first(),
        lastname: chance.last(),
      }).save();
    }));

    return ids;
  },
};
