const auth = require('./lib/auth');
const oauth2 = require('./lib/oauth2');

module.exports = auth;
module.exports.auth = auth;
module.exports.oauth2 = oauth2;
module.exports.bcrypt = require('./lib/bcrypt');
module.exports.jwt = require('./lib/jwt');
