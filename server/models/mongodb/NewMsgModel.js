const db = require('../../db/mongodb/db')

module.exports = db.defineModel('NewMsg', {
    type: "string",
    name: "string",
    say: "string",
    title: "string",
    content: "string",
    ip: "string",
    date: "date"
})