const chance = require('chance')();

module.exports = {
  Mutation: {
    async createApp(obj, args) {
      return {
        id: chance.string(),
        ...args.input,
      };
    },
  },
};
