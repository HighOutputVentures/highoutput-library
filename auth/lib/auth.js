const assert = require('assert');
const ms = require('ms');
const jwt = require('./jwt');
const bcrypt = require('./bcrypt');
const AuthError = require('./error');

class Auth {
  constructor(options) {
    assert(options.secretKey, '\'secretKey\' is required');
    assert(options.model, '\'model\' is required');

    this.secretKey = options.secretKey;
    this.model = options.model;
  }

  async createAccessToken(params) {
    assert(params.username, '\'username\' is required');
    assert(params.password, '\'password\' is required');

    const account = await this.model.findByUsername(params.username);

    if (!account) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Invalid credentials',
      );
    }

    assert(account.id, '\'id\' is required');
    assert(account.password, '\'password\' is required');

    const valid = await bcrypt.compare(params.password, account.password);
    if (!valid) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Invalid credentials',
      );
    }

    const payload = {
      sub: account.id,
      exp: Math.floor((Date.now() + ms(params.expiresIn || '30d')) / 1000),
      ...(params.claims || {}),
    };

    return jwt.create(payload, this.secretKey);
  }

  async verifyAccessToken(params) {
    let decoded;
    try {
      decoded = await jwt.verify(params.accessToken, this.secretKey, params.subject);
    } catch (err) {
      throw new AuthError(
        'INVALID_TOKEN',
        'Invalid access token',
      );
    }

    return decoded;
  }

  async changePassword(params) {
    assert(params.accessToken, '\'accessToken\' is required');
    assert(params.oldPassword, '\'oldPassword\' is required');
    assert(params.newPassword, '\'newPassword\' is required');

    const decoded = await this.verifyAccessToken(params);

    const account = await this.model.findById(decoded.sub);

    const valid = await bcrypt.compare(
      params.oldPassword,
      account.password,
    );

    if (!valid) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Invalid password',
      );
    }

    const password = await bcrypt.hash(params.newPassword);
    await this.model.updatePassword(decoded.sub, password);
  }

  async requestResetPassword(params) {
    assert(params.subject, '\'subject\' is required');

    const account = await this.model.findById(params.subject);

    if (!account) {
      throw new AuthError(
        'USER_NOT_FOUND',
        'User does not exist',
      );
    }

    const payload = {
      sub: params.subject,
      exp: Math.floor((Date.now() + ms(params.expiresIn || '12h')) / 1000),
    };

    return jwt.create(payload, this.secretKey);
  }

  async resetPassword(params) {
    assert(params.requestToken, '\'requestToken\' is required');
    assert(params.password, '\'password\' is required');

    let decoded;
    try {
      decoded = await jwt.verify(params.requestToken, this.secretKey, params.subject);
    } catch (err) {
      throw new AuthError(
        'INVALID_TOKEN',
        'Invalid request token',
      );
    }

    const password = await bcrypt.hash(params.password);
    await this.model.updatePassword(decoded.sub, password);
  }
}

module.exports = Auth;
