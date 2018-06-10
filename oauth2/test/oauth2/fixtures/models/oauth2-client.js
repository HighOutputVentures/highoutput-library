const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schema = new Schema({
  name: String,
  clientId: String,
  clientSecret: String,
  domain: String,
  redirectUris: [String],
  grants: [String],
  accessTokenLifetime: { type: Number, default: 86400 }, /* default is 1 day in seconds */
  refreshTokenLifetime: { type: Number, default: 604800 }, /* default is 7 days in seconds */
  user: String,
});

schema.index({ clientId: 1, clientSecret: 1 }, { unique: true });

module.exports = mongoose.model('oauth2-client', schema);
