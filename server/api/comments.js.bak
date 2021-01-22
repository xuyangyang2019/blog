const db = require('../db/mongodb/db')
// const localTime = require("../utils/reviseTime")
const confirmToken = require('../middlewares/confirmToken')

module.exports = {
  // 获取推荐文章
  'GET /getComments': async (ctx, next) => {
    const comments = await db.comment.find({ articleId: ctx.query.articleId }, (err, doc) => {}).sort({ _id: -1 })
    ctx.rest(comments)
  },
  // 保存评论
  'POST /saveComment': async (ctx, next) => {
    const newDoc = await db.comment.create(ctx.request.body)
    if (newDoc._id) {
      ctx.rest(newDoc)
      // 更新article
      db.article.update({ articleId: ctx.body.articleId }, { $inc: { commentNum: 1 } }, (err, doc) => {})
      // 通知admin
      // new db.newMsg({
      // 	type: "comment",
      // 	name: ctx.body.name,
      // 	say: ctx.body.content,
      // 	content: ctx.body.name + "在" + localTime(Date.now()) + "评论了你的文章--" + ctx.body.title
      // }).save()
    }
  },
  // 前后端文章评论回复（二级评论）
  'PATCH /addComment': async (ctx, next) => {
    const addInfo = {
      name: ctx.request.body.name,
      imgUrl: ctx.request.body.imgUrl,
      email: ctx.request.body.email,
      aite: ctx.request.body.aite,
      content: ctx.request.body.content,
      like: ctx.request.body.like,
      date: ctx.request.body.date
    }
    const doc = await db.comment.findByIdAndUpdate(
      { _id: ctx.request.body._id },
      { $push: { reply: addInfo } },
      { new: true }
    )
    if (doc._id) {
      ctx.rest(doc)
    }
  },
  // 前端文章点赞
  'PATCH /addLike': async (ctx, next) => {
    // 是否为二级评论
    if (ctx.request.body.repId) {
      const ur = await db.comment.update(
        { _id: ctx.request.body.revId, 'reply._id': ctx.request.body.repId },
        { $inc: { 'reply.$.like': ctx.request.body.addOrDel } },
        (err, doc) => {}
      )
      if (ur) {
        ctx.rest({ code: 200 })
      }
    } else {
      const ur = await db.comment.update(
        { _id: ctx.request.body.revId },
        { $inc: { like: ctx.request.body.addOrDel } },
        (err, doc) => {}
      )
      if (ur) {
        ctx.rest({ code: 200 })
      }
    }
  },
  // 后台管理
  'GET /getAdminComments': async (ctx, next) => {
    confirmToken(ctx, next)
    const limit = 10
    const skip = ctx.query.page * limit - limit
    const docs = await db.comment.find({}).sort({ _id: -1 }).skip(skip).limit(limit)
    if (docs.length) {
      ctx.rest(docs)
    }
  },
  // 后台管理删除一级评论
  'DELETE /removeComments': async (ctx, next) => {
    confirmToken(ctx, next)
    const result = await db.comment.remove({ _id: { $in: ctx.query.id } })
    // // 更新文章的评论数
    // db.article.update(
    // 	{ articleId: ctx.query.articleId },
    // 	{ $inc: { commentNum: -1 } },
    // 	(err, doc) => {
    // 		if (err) {
    // 			ctx.status(500)
    // 		}
    // 	})
    if (result.ok) {
      ctx.rest({ deleteCode: 200 })
    }
  },
  // 后台管理删除二级评论
  'PATCH /reduceComments': async (ctx, next) => {
    confirmToken(ctx, next)
    const result = await db.comment.update(
      { _id: ctx.request.body.mainId },
      { $pull: { reply: { _id: ctx.request.body.secondId } } }
    )
    if (result) {
      ctx.rest({ deleteCode: 200 })
    }
  }
}
