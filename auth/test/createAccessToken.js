const test = require('ava');
const Chance = require('chance');
const UserModel = require('./helpers/userModel');
const Auth = require('../index');

const chance = new Chance();

const userModel = new UserModel();

const auth = new Auth({
  secretKey: chance.string(),
  userModel,
});

test('create access token', async (t) => {
  const user = {
    id: chance.string({ pool: 'abcdef0123456789', length: 32 }),
    username: chance.first().toLocaleLowerCase(),
    password: chance.string(),
  };
  await userModel.insertUser(user);

  const accessToken = await auth.createAccessToken({
    username: user.username,
    password: user.password,
  });

  t.is(typeof accessToken, 'string');
});

test('invalid credentials', async (t) => {
  const user = {
    id: chance.string({ pool: 'abcdef0123456789', length: 32 }),
    username: chance.first().toLocaleLowerCase(),
    password: chance.string(),
  };
  await userModel.insertUser(user);

  const error = await t.throws(auth.createAccessToken({
    username: user.username,
    password: chance.string(),
  }));

  t.is(error.code, 'INVALID_CREDENTIALS');
});
