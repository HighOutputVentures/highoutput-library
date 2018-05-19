const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schema = new Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
});

schema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('user', schema);
