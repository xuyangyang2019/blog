const db = require('../../db/mongodb/db')

// // 实现自增序列
// articleSchema.pre("save", function (next) {
//     let _this = this
//     db.counter.find({}, (err, doc) => {
//         if (err) {
//             res.status(500).end()
//         } else {
//             if (!doc.length) {
//                 new db.counter({ _id: 'entityId', seq: 1 }).save()
//                 next()
//             } else {
//                 db.counter.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function (error, counter) {
//                     if (error) {
//                         return next(error)
//                     } else {
//                         _this.articleId = counter.seq
//                         next()
//                     }
//                 })
//             }
//         }
//     })
// })

module.exports = db.defineModel('Article', {
    articleId: "number",
    original: "boolean",
    title: "string",
    abstract: "string",
    content: "string",
    publish: "boolean",
    tag: "array",
    commentNum: "number",
    likeNum: "number",
    pv: "number",
    date: "date"
})