const db = require('../../db/mongodb/db')

module.exports = db.defineModel('Comment', {
    name: "string",
    imgUrl: "string",
    email: "string",
    content: "string",
    reply: [
        {
            name: "string",
            imgUrl: "string",
            email: "string",
            aite: "string",
            content: "string",
            like: "number",
            date: "date"
        }
    ], // 记得加上日期格式
    like: "number",
    articleId: "number",
    title: "string",
    date: "date"
})