const omit = require('lodash.omit');
const assert = require('../assert-key');

function isMongooseModel(model) {
  return typeof model.findOne === 'function' &&
    typeof model.findById === 'function' &&
    typeof model.findByIdAndUpdate === 'function';
}

module.exports = class OAuth2App {
  constructor(options) {
    this.model = options.model;
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

    return isMongooseModel(this.model) ?
      this.model.create([params]) :
      this.model.create(params);
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

    return isMongooseModel(this.model) ?
      this.model.updateOne({ _id: params.id }, { $set: app }) :
      this.model.updateOne(params);
  }

  /**
   * Delete an OAuth2 app
   * @param {string} id
   */
  async delete(id) {
    const app = isMongooseModel(this.model) ?
      await this.model.findOne({ _id: id }) :
      await this.model.findOne(id);

    if (isMongooseModel(this.model)) {
      await this.model.deleteOne({ _id: id });
    } else {
      await this.model.deleteOne(id);
    }

    return !!app;
  }
};
