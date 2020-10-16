const db = require('../../db/mongodb/db')

module.exports = db.defineModel('Admin', {
    username: String,
    email: String,
    password: String
})