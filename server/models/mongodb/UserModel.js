const db = require('../../db/mongodb/mongoDB')

// username: String,
// email: String,
// password: String,
// wx_avatar: String,
// wx_signature: String

module.exports = db.defineModel('User', {
    user: "string",
    password: "string",
    lastLogin: "string",
    salt: "string"
})