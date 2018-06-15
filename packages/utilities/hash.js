const crypto = require('crypto');

module.exports = (message, algorithm = 'sha256', salt = '') =>
  crypto.createHash(algorithm)
    .update(message)
    .update(salt)
    .digest();
