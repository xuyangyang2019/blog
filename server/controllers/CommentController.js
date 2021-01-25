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
  },
  // 前端 点赞评论
  'PATCH /api/likeComment': async (ctx, next) => {
    const { commentId, replyId, addOrDel } = ctx.request.body
    // 是否为二级评论
    let result = ''
    if (replyId) {
      result = await CommentService.update(
        { _id: commentId, 'reply._id': replyId },
        { $inc: { 'reply.$.like': addOrDel } },
        { new: true }
      )
    } else {
      result = await CommentService.updateById({ _id: commentId }, { $inc: { like: addOrDel } }, { new: true })
    }
    if (result) {
      ctx.result = result
    } else {
      ctx.error = '点赞失败'
    }
    return next()
  }
}
