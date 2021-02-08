const BaseDAO = require('../lib/baseDAO')
const User = require('../models/mongodb').user

class UserService extends BaseDAO {
  constructor(model) {
    super(model)
  }
}

module.exports = new UserService(User)
