
class User {
  constructor(username , password_hash =null) {
    this.username= username;
    this.password_hash = password_hash;
    this.id=null;
  }

}

module.exports = User;
