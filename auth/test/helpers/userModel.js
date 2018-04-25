const bcrypt = require('bcrypt');
const R = require('ramda');

class UserModel {
  constructor() {
    this.users = [];
  }

  async insertUser(user) {
    this.users.push({
      ...user,
      password: await bcrypt.hash(user.password, 8),
    });
  }

  async findByUsername(username) {
    return R.find(R.propEq('username', username))(this.users);
  }

  async findById(id) {
    return R.find(R.propEq('id', id))(this.users);
  }

  async updatePassword(id, password) {
    const user = R.find(R.propEq('id', id))(this.users);

    if (!user) {
      return;
    }

    user.password = password;
  }
}

module.exports = UserModel;
