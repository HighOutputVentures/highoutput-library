const assert = require('assert');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ms = require('ms');
const AuthError = require('./error');

function isMongooseModel(model) {
  return typeof model.findOne === 'function' &&
    typeof model.findById === 'function' &&
    typeof model.findByIdAndUpdate === 'function';
}

class Auth {
  constructor(options) {
    assert(options.secretKey, '\'secretKey\' is required');
    assert(options.userModel, '\'userModel\' is required');
    this.options = options;
  }

  createJWT(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.options.secretKey, { algorithm: 'HS256' }, (err, token) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(token);
      });
    });
  }

  verifyJWT(token, subject) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.options.secretKey, subject ? { subject } : null, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(decoded);
      });
    });
  }

  async createAccessToken(params) {
    assert(params.username, '\'username\' is required');
    assert(params.password, '\'password\' is required');

    let account;
    if (isMongooseModel(this.options.userModel)) {
      account = await this.options.userModel
        .findOne({ username: params.username })
        .select({ password: 1 });
    } else {
      account = await this.options.userModel.findByUsername(params.username);
    }

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

    let payload = { sub: account.id };
    if (params.expiresIn) {
      payload = { ...payload, exp: Math.floor((Date.now() + ms(params.expiresIn)) / 1000) };
    }

    if (params.claims) {
      payload = { ...payload, ...params.claims };
    }

    return this.createJWT(payload);
  }

  async verifyAccessToken(params) {
    let decoded;
    try {
      decoded = await this.verifyJWT(params.accessToken, params.subject);
    } catch (err) {
      throw new AuthError(
        'INVALID_TOKEN',
        'Invalid token',
      );
    }

    return decoded;
  }

  async changePassword(params) {
    assert(params.accessToken, '\'accessToken\' is required');
    assert(params.oldPassword, '\'oldPassword\' is required');
    assert(params.newPassword, '\'newPassword\' is required');

    const decoded = await this.verifyAccessToken(params);

    let account;
    if (isMongooseModel(this.options.userModel)) {
      account = await this.options.userModel
        .findById(decoded.sub)
        .select({ password: 1 });
    } else {
      account = await this.options.userModel.findById(decoded.sub);
    }

    const valid = await bcrypt.compare(params.oldPassword, account.password);
    if (!valid) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Invalid password',
      );
    }

    const password = await bcrypt.hash(params.newPassword, 8);
    if (isMongooseModel(this.options.userModel)) {
      await this.options.userModel
        .findByIdAndUpdate(decoded.sub, { password });
    } else {
      await this.options.userModel.updatePassword(decoded.sub, password);
    }
  }

  async requestResetPassword(params) {
    assert(params.subject, '\'subject\' is required');

    let account;
    if (isMongooseModel(this.options.userModel)) {
      account = await this.options.userModel
        .findById(params.subject)
        .select({ _id: 1 });
    } else {
      account = await this.options.userModel.findById(params.subject);
    }

    if (!account) {
      throw new AuthError(
        'USER_NOT_FOUND',
        'User does not exist',
      );
    }

    let payload = { sub: params.subject };
    if (params.expiresIn) {
      payload = { ...payload, exp: Math.floor((Date.now() + ms(params.expiresIn)) / 1000) };
    }

    return this.createJWT(payload);
  }

  async resetPassword(params) {
    assert(params.requestToken, '\'requestToken\' is required');
    assert(params.password, '\'password\' is required');

    const decoded = await this.verifyAccessToken(params);

    const password = await bcrypt.hash(params.password, 8);
    if (isMongooseModel(this.options.userModel)) {
      await this.options.userModel
        .findByIdAndUpdate(decoded.sub, { password });
    } else {
      await this.options.userModel.updatePassword(decoded.sub, password);
    }
  }
}

module.exports = Auth;
