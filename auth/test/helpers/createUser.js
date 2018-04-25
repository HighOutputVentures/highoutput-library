const Chance = require('chance');

const chance = new Chance();

module.exports = () => ({
  id: chance.string({ pool: 'abcdef0123456789', length: 32 }),
  username: chance.first().toLocaleLowerCase(),
  password: chance.string(),
});
