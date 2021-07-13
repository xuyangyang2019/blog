const CommentService = require('../../services').CommentService
const { InvalidQueryError } = require('../../lib/error')

module.exports = {
  // 回复评论
  'PATCH /api/replyComment': async (ctx) => {
    const { id, name, aite, imgUrl, content, date, like } = ctx.request.body
    // 参数不对抛出异常
    if (!id || !name || !aite || !imgUrl || !content || !date || typeof like === 'undefined') {
      throw new InvalidQueryError()
    }
    const result = await CommentService.updateById({ _id: id }, { $push: { reply: ctx.request.body } }, { new: true })
    if (result._id) {
      ctx.rest(result)
    } else {
      ctx.rest('', -1, '回复失败')
    }
  },
  // 删除评论
  'DELETE /api/deleteComments': async (ctx) => {
    const ids = ctx.query.ids
    if (!ids) {
      throw new InvalidQueryError()
    }
    const result = await CommentService.delete({ _id: { $in: ids } })
    if (result && result.ok) {
      ctx.rest(result)
    } else {
      ctx.rest('', -1, '删除评论失败！')
    }
  },
  // 删除二级留言
  'PATCH /api/updateComment': async (ctx) => {
    const { commentId, replyId } = ctx.request.body
    if (!commentId || !replyId) {
      throw new InvalidQueryError()
    }
    const result = await CommentService.update({ _id: commentId }, { $pull: { reply: { _id: replyId } } })
    if (result.ok) {
      ctx.rest(result)
    } else {
      ctx.rest('', -1, '删除二级留言失败！')
    }
  }
}
