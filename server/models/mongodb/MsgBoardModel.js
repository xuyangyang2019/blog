const db = require('../../db/mongodb/db')

module.exports = db.defineModel('MsgBoard', {
    name: "string",
    imgUrl: "string",
    email: "string",
    content: "string",
    date: "date",
    reply: [
        {
            name: "string",
            aite: "string",
            imgUrl: "string",
            content: "string",
            date: "date"
        }
    ]
})