const CloudStorage = require('../lib/CloudStorage');

module.exports = {
  instantiate: (opts) => {
    const storage = new CloudStorage(opts);
    return storage;
  },
};
