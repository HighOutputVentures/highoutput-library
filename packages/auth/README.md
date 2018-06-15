# Auth

## new Auth(options)

The Auth constructor accepts the following configuration

* **options.secretKey** `string` Secret key to use in generating the JWT.
* **options.model** `model` User model.

```javascript
import mongoose, { Schema } from 'mongoose';
import Auth from 'highoutput-auth';

const AccountModel = {
  async findByUsername(username) => { ... },

  async findById(id) => { ... },

  async updatePassword(id, password) => { ... },
};

const auth = new Auth({
  secretKey: '4fb473f82ba47bf6acbab33e7529fb96',
  model: AccountModel
});
```

### auth.createAccessToken(params)

Create an access token.

* **params.username** `string` Username.
* **params.password** `string` Password.
* **params.expiresIn** `string` (Optional) Amount of time before the **accessToken** expires. Must be compatible to the `ms` package.
* **params.claims** `object` (Optional) Additional claims to include in the JWT.
* Returns: **accessToken** `Promise<string>`
* Throws:
  * `INVALID_CREDENTIALS`

```javascript
await auth.createAccessToken({
  username: 'roger',
  password: '123456Seven',
});
```

### auth.verifyAccessToken(params)

Verify a json web token.

* **params.accessToken** `string` Access token.
* **params.subject** `string | number` (Optional) ID of the owner of the **accessToken**.
* Returns: **claims** `Promise<object>` Claims stored in the JWT.
* Throws:
  * `INVALID_TOKEN`

```javascript
await auth.verifyAccessToken({
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YWQ3MTZlZjc1ZTZhODc1MTQ0Y2Q0NDQiLCJpYXQiOjE1MjQ2MjYzNjMsImV4cCI6MTUyNTIzMTE2M30.z2xgs0BeLQsTBiG9sphjkP_JljYht2o4AgI4ClWgZqw',
});
```

### auth.changePassword(params)

Change the user password.

* **params.accessToken** `string` Access token.
* **params.subject** `string | number` (Optional) ID of the owner of the **accessToken**.
* **params.oldPassword** `string` Old password.
* **params.newPassword** `string` New Password.
* Throws:
  * `INVALID_TOKEN`
  * `INVALID_CREDENTIALS`

```javascript
await auth.changePassword({
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YWQ3MTZlZjc1ZTZhODc1MTQ0Y2Q0NDQiLCJpYXQiOjE1MjQ2MjYzNjMsImV4cCI6MTUyNTIzMTE2M30.z2xgs0BeLQsTBiG9sphjkP_JljYht2o4AgI4ClWgZqw',
  oldPassword: 'password',
  newPassword: '123456Seven',
});
```

### auth.requestResetPassword(params)

Request for a password reset.

* **params.subject** `string | number` ID of the user requesting the password reset.
* **params.expiresIn** `string` (Optional) Amount of time before the **requestToken** expires.
* Returns: **requestToken** `Promise<string>`
* Throws:
  * `USER_NOT_FOUND`

```javascript
await auth.requestResetPassword({
  subject: '507f1f77bcf86cd799439011',
});
```

### auth.resetPassword(params)

Reset password.

* **params.requestToken** `string` Request token.
* **params.subject** `string | number` (Optional) ID of the owner of the **requestToken**.
* **params.password** `string` New Password.
* Throws:
  * `INVALID_TOKEN`

```javascript
await auth.resetPassword({
  requestToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YWQ3MTZlZjc1ZTZhODc1MTQ0Y2Q0NDQiLCJpYXQiOjE1MjQ2MjYzNjMsImV4cCI6MTUyNTIzMTE2M30.z2xgs0BeLQsTBiG9sphjkP_JljYht2o4AgI4ClWgZqw',
  password: '123456Seven',
});
```

## Auth Model

The **model** should have the following methods

* **findByUsername(username)** `Promise<{ id: string | number, username: string, password: string }>`
* **findById(id)** `Promise<{ id: string | number, username: string, password: string }>`
* **updatePassword(id, password)** `Promise<void>`

```javascript
const { bcrypt } = require('highoutput-auth');
const R = require('ramda');

class Model {
  constructor() {
    this.users = [];
  }

  /* additional method for the sake of context */
  async insertUser(user) {
    this.users.push({
      ...user,
      password: await bcrypt.hash(user.password),
    });
  }

  async findByUsername(username) {
    return R.find(R.propEq('username', username))(this.users);
  }

  async findById(id) {
    return R.find(R.propEq('id', id))(this.users);
  }

  async updatePassword(id, password) {
    const user = R.find(R.propEq('id', id))(this.users);

    if (!user) {
      return;
    }

    user.password = password;
  }
}
```
