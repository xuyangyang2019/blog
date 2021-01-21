const ArticleService = require('../services').ArticleService
const CommentService = require('../services').CommentService

// const { InvalidQueryError } = require('../lib/error')

module.exports = {
  // 分页获取评论
  'GET /api/getCommentsList': async (ctx, next) => {
    const { pageNum, pageSize } = ctx.request.query
    const result = await CommentService.findByPage({}, pageNum || 1, pageSize || 10)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 获取指定文章的评论
  'GET /api/getComments': async (ctx, next) => {
    // console.log('获取指定文章的评论', ctx.query)
    // console.log('getComments', ctx.request.query)
    const { id } = ctx.request.query
    const result = await CommentService.findMany({ articleId: id })
    // console.log('获取指定文章的评论', result)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 获取评论数量
  'GET /getCommentsCount': async (ctx, next) => {
    const result = await CommentService.count({})
    if (result) {
      ctx.result = result
    } else {
      ctx.error = '获取评论数量出错'
    }
    return next()
  },
  // 评论文章
  'POST /api/commentArticle': async (ctx, next) => {
    const result = await CommentService.save(ctx.request.body)
    if (result._id) {
      ctx.result = result
      // 更新article
      ArticleService.update({ _id: ctx.request.body.articleId }, { $inc: { commentNum: 1 } })
      // 通知admin
      // new db.newMsg({
      // 	type: "comment",
      // 	name: ctx.body.name,
      // 	say: ctx.body.content,
      // 	content: ctx.body.name + "在" + localTime(Date.now()) + "评论了你的文章--" + ctx.body.title
      // }).save()
    } else {
      ctx.error = '评论文章失败'
    }
    return next()
  }
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
