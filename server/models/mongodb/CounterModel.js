const db = require('../../db/mongodb/mongoDB')

module.exports = db.defineModel('Counter', {
    _id: String,
    seq: Number
})