const test = require('ava');
const Chance = require('chance');
const UserModel = require('./helpers/user-model');
const createUser = require('./helpers/create-user');
const Auth = require('..');

const chance = new Chance();

const model = new UserModel();

const auth = new Auth({
  secretKey: chance.string(),
  model,
});

test('verify access token', async (t) => {
  const user = createUser();
  await model.insertUser(user);

  const accessToken = await auth.createAccessToken({
    username: user.username,
    password: user.password,
  });

  const claims = await auth.verifyAccessToken({ accessToken });

  t.is(typeof claims.sub, 'string');
  t.is(typeof claims.exp, 'number');
  t.is(typeof claims.iat, 'number');
});
