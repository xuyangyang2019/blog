const db = require('../../db/mongodb/mongoDB')

module.exports = db.defineModel('Vistors', {
    name: String,
    imgUrl: String,
    email: String,
    githubID: Number
})