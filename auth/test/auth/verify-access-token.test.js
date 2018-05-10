const test = require('ava');
const Chance = require('chance');
const UserModel = require('../helpers/user-model');
const createUser = require('../helpers/create-user');
const { Auth } = require('../..').auth;

const chance = new Chance();

const userModel = new UserModel();

const auth = new Auth({
  secretKey: chance.string(),
  userModel,
});

test('verify access token', async (t) => {
  const user = createUser();
  await userModel.insertUser(user);

  const accessToken = await auth.createAccessToken({
    username: user.username,
    password: user.password,
  });

  const claims = await auth.verifyAccessToken({ accessToken });

  t.is(typeof claims.sub, 'string');
  t.is(typeof claims.exp, 'number');
  t.is(typeof claims.iat, 'number');
});
