const _ = require('lodash');
const assert = require('assert');

module.exports = (object, keys) => {
  _.each(keys, (key) => {
    assert(object[key], `'${key}' is required`);
  });
};
