const db = require('../../db/mongodb/mongoDB')

module.exports = db.defineModel('Comment', {
    name: String,
    imgUrl: String,
    email: String,
    content: String,
    reply: [
        {
            name: String,
            imgUrl: String,
            email: String,
            aite: String,
            content: String,
            like: Number,
            date: Date
        }
    ], // 记得加上日期格式
    like: Number,
    articleId: Number,
    title: String,
    date: Date
})