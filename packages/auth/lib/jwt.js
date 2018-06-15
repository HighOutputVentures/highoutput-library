const jwt = require('jsonwebtoken');

exports.create = (payload, secret, options = {}) => (
  new Promise((resolve, reject) => {
    delete options.algorithm; /* eslint-disable-line */

    jwt.sign(payload, secret, { algorithm: 'HS256', ...options }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(token);
    });
  })
);

exports.verify = (token, secret, subject) => (
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, subject ? { subject } : null, (err, claims) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(claims);
    });
  })
);
