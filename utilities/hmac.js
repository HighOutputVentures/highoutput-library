const crypto = require('crypto');

module.exports = (message, key, algorithm = 'sha256') =>
  crypto.createHmac(algorithm, key)
    .update(message)
    .digest();
