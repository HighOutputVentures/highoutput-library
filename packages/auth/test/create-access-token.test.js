const test = require('ava');
const Chance = require('chance');
const UserModel = require('./helpers/user-model');
const createUser = require('./helpers/create-user');
const Auth = require('../');

const chance = new Chance();

const model = new UserModel();

const auth = new Auth({
  secretKey: chance.string(),
  model,
});

test('create access token', async (t) => {
  const user = createUser();
  await model.insertUser(user);

  const accessToken = await auth.createAccessToken({
    username: user.username,
    password: user.password,
  });

  t.is(typeof accessToken, 'string');
});

test('invalid credentials', async (t) => {
  const user = createUser();
  await model.insertUser(user);

  const error = await t.throws(auth.createAccessToken({
    username: user.username,
    password: chance.string(),
  }));

  t.is(error.code, 'INVALID_CREDENTIALS');
});
