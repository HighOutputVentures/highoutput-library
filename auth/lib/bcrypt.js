const bcrypt = require('bcryptjs');

exports.hash = password => bcrypt.hash(password, 8);

exports.compare = (password, hash) => bcrypt.compare(password, hash);
