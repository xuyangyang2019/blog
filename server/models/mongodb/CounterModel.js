const db = require('../../db/mongodb/db')

module.exports = db.defineModel('Counter', {
    _id: "string",
    seq: "number"
})