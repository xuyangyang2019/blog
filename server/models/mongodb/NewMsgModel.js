const db = require('../../db/mongodb/mongoDB')

module.exports = db.defineModel('NewMsg', {
    type: String,
    name: String,
    say: String,
    title: String,
    content: String,
    ip: String,
    date: Date
})