const db = require('../../db/mongodb/db')

module.exports = db.defineModel('Vistors', {
    name: "string",
    imgUrl: "string",
    email: "string",
    githubID: "number"
})