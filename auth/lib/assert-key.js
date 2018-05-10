const assert = require('assert');

module.exports = (object, keys) => {
  keys.forEach((key) => {
    assert(object[key], `'${key}' is required`);
  });
};
