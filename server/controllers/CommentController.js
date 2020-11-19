const CommentService = require('../services').CommentService
const { InvalidQueryError } = require('../lib/error')

module.exports = {
  // 后台获取所有的评论
  'GET /api/getAdminComments': async (ctx, next) => {
    // confirmToken(ctx, next)
    let pageNum = ctx.query.pageNum || 1
    let pageSize = ctx.query.pageSize || 10
    let result = await CommentService.findByPage({}, pageNum, pageSize)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 获取指定文章的评论
  'GET /api/getComments': async (ctx, next) => {
    let result = await CommentService.findMany({ articleId: ctx.query.articleId })
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      console.log(result)
      ctx.result = result
    }
    return next()
  },
  // 获取评论数量
  'GET /getCommentsCount': async (ctx, next) => {
    let num = await db.comment.count({})
    ctx.rest(num)
  },
  // // 保存评论
  // 'POST /api/saveComment': async (ctx, next) => {
  //   let newDoc = await db.comment.create(ctx.request.body)
  //   if (newDoc._id) {
  //     ctx.rest(newDoc)
  //     // 更新article
  //     db.article.update(
  //       { articleId: ctx.body.articleId },
  //       { $inc: { commentNum: 1 } },
  //       (err, doc) => { })
  //     // 通知admin
  //     // new db.newMsg({
  //     // 	type: "comment",
  //     // 	name: ctx.body.name,
  //     // 	say: ctx.body.content,
  //     // 	content: ctx.body.name + "在" + localTime(Date.now()) + "评论了你的文章--" + ctx.body.title
  //     // }).save()
  //   }
  // },
  // // 前后端文章评论回复（二级评论）
  // 'PATCH /api/addComment': async (ctx, next) => {
  //   let addInfo = {
  //     name: ctx.request.body.name,
  //     imgUrl: ctx.request.body.imgUrl,
  //     email: ctx.request.body.email,
  //     aite: ctx.request.body.aite,
  //     content: ctx.request.body.content,
  //     like: ctx.request.body.like,
  //     date: ctx.request.body.date
  //   }
  //   let doc = await db.comment.findByIdAndUpdate(
  //     { _id: ctx.request.body._id },
  //     { $push: { reply: addInfo } },
  //     { new: true })
  //   if (doc._id) {
  //     ctx.rest(doc)
  //   }
  // },
  // // 前端文章点赞
  // 'PATCH /api/addLike': async (ctx, next) => {
  //   //是否为二级评论
  //   if (ctx.request.body.repId) {
  //     let ur = await db.comment.update(
  //       { _id: ctx.request.body.revId, "reply._id": ctx.request.body.repId },
  //       { $inc: { "reply.$.like": ctx.request.body.addOrDel } },
  //       (err, doc) => { })
  //     if (ur) {
  //       ctx.rest({ code: 200 })
  //     }
  //   } else {
  //     let ur = await db.comment.update(
  //       { _id: ctx.request.body.revId },
  //       { $inc: { "like": ctx.request.body.addOrDel } },
  //       (err, doc) => { })
  //     if (ur) {
  //       ctx.rest({ code: 200 })
  //     }
  //   }
  // },
  // 'POST /api/getComment': async (ctx, next) => {
  //   const { article_id } = ctx.request.body
  //   if (!article_id) {
  //     throw new InvalidQueryError()
  //   }
  //   const result = await CommentService.findMany({ article_id })
  //   if (!result) {
  //     ctx.error = '获取评论失败'
  //   } else {
  //     ctx.result = result
  //   }
  //   return next()
  // },
  // 'POST /api/delComment': async (ctx, next) => {
  //   const { _id } = ctx.request.body
  //   if (!_id) {
  //     throw new InvalidQueryError()
  //   }
  //   const result = await CommentService.deleteById(_id)
  //   if (!result) {
  //     ctx.error = '评论不存在'
  //   } else {
  //     ctx.result = result
  //   }
  //   return next()
  // },
  // 'POST /api/postComment': async (ctx, next) => {
  //   const data = ctx.request.body
  //   if (!data) {
  //     throw new InvalidQueryError()
  //   }
  //   const result = await CommentService.save(data)
  //   if (!result) {
  //     ctx.error = '发布失败'
  //   } else {
  //     ctx.result = ''
  //   }
  //   return next()
  // },
  // 'POST /api/modifyComment': async (ctx, next) => {
  //   const data = ctx.request.body
  //   if (!data || !data._id) {
  //     throw new InvalidQueryError()
  //   }
  //   const result = await CommentService.updateById(data._id, data)
  //   if (!result) {
  //     ctx.error = '保存更改失败'
  //   } else {
  //     ctx.result = ''
  //   }
  //   return next()
  // },
}
