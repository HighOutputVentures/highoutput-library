/* eslint no-underscore-dangle: off */

const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const R = require('ramda');
const { compare } = require('bcryptjs');

module.exports = class MongoModel {
  constructor(options = {}) {
    this.issuer = options.issuer;
    this.model = {
      code: [],
      token: [],
      client: [],
      user: [],
    };
  }

  async generateAccessToken(client, user, scope) {
    return jwt.sign(
      {
        sub: user.id,
        aud: client.domain,
        scope,
      },
      client.secret,
      {
        jwtid: uuid.v4(),
        issuer: this.issuer,
        expiresIn: ms(client.accessTokenLifetime * 1000),
      },
    );
  }

  async generateRefreshToken(client, user, scope) {
    return jwt.sign(
      {
        sub: user.id,
        aud: client.domain,
        scope,
      },
      client.secret,
      {
        jwtid: uuid.v4(),
        issuer: this.issuer,
        expiresIn: ms(client.refreshTokenLifetime * 1000),
      },
    );
  }

  async getAccessToken(accessToken) {
    const token = R.find(R.propEq('accessToken', accessToken))(this.model.token);
    const client = R.find(R.propEq('clientId', token.client))(this.model.client);
    const user = R.find(R.propEq('id', token.user))(this.model.user);

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scope,
      user: {
        id: user[this.propertyMap.id],
        username: user[this.propertyMap.username],
      },
      client: {
        id: client.clientId,
        secret: client.clientSecret,
        domain: client.domain,
      },
    };
  }

  async getRefreshToken(refreshToken) {
    const token = R.find(R.propEq('refreshToken', refreshToken))(this.model.token);
    const client = R.find(R.propEq('id', token.client))(this.model.client);
    const user = R.find(R.propEq('id', token.user))(this.model.user);

    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      user: {
        id: user[this.propertyMap.id],
        username: user[this.propertyMap.username],
      },
      client: {
        id: client.clientId,
        secret: client.clientSecret,
        domain: client.domain,
      },
    };
  }

  async getAuthorizationCode(authorizationCode) {
    const code = R.find(R.propEq('code', authorizationCode))(this.model.code);
    const client = R.find(R.propEq('id', code.client))(this.model.client);
    const user = R.find(R.propEq('id', code.user))(this.model.user);

    return {
      code: code.code,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      user: {
        id: user[this.propertyMap.id],
        username: user[this.propertyMap.username],
      },
      client: {
        id: client.clientId,
        secret: client.clientSecret,
        domain: client.domain,
      },
    };
  }

  async getClient(clientId, clientSecret) {
    const client = clientSecret ?
      R.find(R.propEq('clientId', clientId) && R.propEq('clientSecret', clientSecret))(this.model.token) :
      R.find(R.propEq('clientId', clientId))(this.model.user);

    return {
      id: client.clientId,
      secret: client.clientSecret,
      redirectUris: client.redirectUris,
      grants: client.grants,
      accessTokenLifetime: client.accessTokenLifetime,
      refreshTokenLifetime: client.refreshTokenLifetime,
      domain: client.domain,
    };
  }

  async getUser(username, password) {
    const user = R.find(R.propEq('username', username))(this.model.user);

    return await compare(password, user.password) ?
      { id: user.id, username: user.username } : null;
  }

  async getUserFromClient(client) {
    const authClient = R.find(R.propEq('clientId', client.id))(this.model.client);
    const user = R.find(R.propEq('id', authClient.user))(this.model.user);

    return { id: user.id, username: user.username };
  }

  async saveToken(token, client, user) {
    const {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      scope,
    } = token;

    this.model.token.push({
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      scope,
      user: user.id,
      client: client.id,
    });

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      scope,
      user,
      client: {
        id: client.clientId,
        secret: client.clientSecret,
        domain: client.domain,
      },
    };
  }

  async saveAuthorizationCode(code, client, user) {
    const {
      authorizationCode,
      expiresAt,
      redirectUri,
      scope,
    } = code;

    this.model.code.push({
      authorizationCode,
      expiresAt,
      redirectUri,
      scope,
      client: client.id,
      user: user.id,
    });
  }

  async revokeToken(token) {
    const refreshToken = R.find(R.propEq('refreshToken', token))(this.model.token);

    R.reject(n => R.propEq('refreshToken', n.token), this.model.token);

    return !!refreshToken;
  }

  async revokeAuthorizationCode(code) {
    const authcode = R.find(R.propEq('code', code))(this.model.code);

    R.reject(n => R.propEq('code', n.code), this.model.code);

    return !!authcode;
  }

  async verifyScope(accessToken, scope) {
    if (!accessToken.scope) {
      return false;
    }

    const requestedScopes = scope.split(' ');
    const authorizedScopes = accessToken.scope.split(' ');

    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }
};
