const crypto = require('crypto');

module.exports = (messager, key, algorithm = 'sha256') =>
  crypto.createHmac(algorithm, key)
    .update(message)
    .digest();
