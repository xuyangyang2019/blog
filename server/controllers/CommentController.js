const ArticleService = require('../services').ArticleService
const CommentService = require('../services').CommentService

const { InvalidQueryError } = require('../lib/error')

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
    const { id } = ctx.request.query
    const result = await CommentService.findMany({ articleId: id })
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
  },
  // 前端回复评论（二级评论）
  'PATCH /api/vistorReplyComment': async (ctx, next) => {
    const { id, name, aite, imgUrl, content, date, like } = ctx.request.body
    // 参数不对抛出异常
    if (!id || !name || !aite || !imgUrl || !content || !date || typeof like === 'undefined') {
      throw new InvalidQueryError()
    }
    const result = await CommentService.updateById({ _id: id }, { $push: { reply: ctx.request.body } }, { new: true })
    if (result._id) {
      ctx.result = result
    } else {
      ctx.error = '回复评论失败'
    }
    return next()
  }
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
