const db = require('../../db/mongodb/mongoDB')

module.exports = db.defineModel('MsgBoard', {
    name: String,
    imgUrl: String,
    email: String,
    content: String,
    date: Date,
    reply: [
        {
            name: String,
            aite: String,
            imgUrl: String,
            content: String,
            date: Date
        }
    ]
})