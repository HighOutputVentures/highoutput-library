const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schema = new Schema({
  accessToken: String,
  accessTokenExpiresAt: Date,
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  scope: String,
  user: String,
  client: String,
});

schema.index({ code: 1 });

module.exports = mongoose.model('oauth2-token', schema);
