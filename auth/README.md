# Auth

## Class: `Auth`

### `new Auth(options)`
* `options.secretKey` `(string)` `required` Secret key to use in generating the JWT

### `auth.createAccessToken(params)`
* `params.username` `(string)` `required` Username
* `params.password` `(string)` `required` Password
* Returns: `(string)`

Create a json web token.

#### Example
```javascript
await auth.createAccessToken({
  username: 'roger',
  password: '123456Seven'
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi...
```
