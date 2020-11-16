const db = require('../../db/mongodb/mongoDB')

module.exports = db.defineModel('User', {
    user: String,
    password: String,
    lastLogin: String,
    salt: String
})