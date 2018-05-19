const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schema = new Schema({
  code: String,
  expiresAt: Date,
  scope: String,
  client: String,
  user: String,
});

schema.index({ code: 1 });

module.exports = mongoose.model('oauth2-code', schema);
