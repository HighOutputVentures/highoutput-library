const CloudStorage = require('../lib/CloudStorage');

module.exports = {
  instantiate: (opts) => {
    const storage = new CloudStorage(opts);
    return storage;
  },
  getInstance: () => {
    const opts = {
      scope: 'some-scope',
      accessKey: 'AKIAIOSFODNN7EXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    };
    const storage = new CloudStorage(opts);
    return storage;
  },
};
