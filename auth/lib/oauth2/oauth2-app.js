const omit = require('lodash.omit');
const assert = require('../assert-key');
const model = require('./models/mongo/oauth2-client');

module.exports = class OAuth2App {
  constructor(options = {}) {
    this.model = options.model || model;
  }

  /**
   * Create an OAuth2 app
   * @param {string} params.name
   * @param {string} params.domain
   * @param {Array} params.grants
   * @param {number} [params.accessTokenLifeTime]
   * @param {number} [params.refreshTokenLifeTime]
   */
  async create(params) {
    assert(params, ['name', 'domain', 'grants']);
    return this.model.create([params]);
  }

  /**
   * Update an OAuth2 app
   * @param {string} params.id
   * @param {string} [params.name]
   * @param {string} [params.domain]
   * @param {Array} [params.grants]
   * @param {string} [params.clientSecret]
   * @param {number} [params.accessTokenLifeTime]
   * @param {number} [params.refreshTokenLifeTime]
   */
  update(params) {
    assert(params, ['id']);
    const app = omit(params, ['id']);
    return this.model.updateOne({ _id: params.id }, { $set: app });
  }

  /**
   * Delete an OAuth2 app
   * @param {string} id
   */
  async delete(id) {
    const app = await this.model.findOne({ _id: id });
    await this.model.deleteOne({ _id: id });
    return !!app;
  }
};
