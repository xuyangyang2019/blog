const MsgBoardService = require('../../services').MsgBoardService
const { InvalidQueryError } = require('../../lib/error')

module.exports = {
  // 回复留言
  'PATCH /api/replyMsgBoard': async (ctx, next) => {
    const { id, name, aite, imgUrl, content, date } = ctx.request.body
    // 参数不对抛出异常
    if (!id || !name || !aite || !imgUrl || !content || !date) {
      throw new InvalidQueryError()
    }
    const reply = {
      name: name,
      imgUrl: imgUrl,
      // email: email,
      content: content,
      date: date,
      aite: aite
    }
    const result = await MsgBoardService.updateById({ _id: id }, { $push: { reply: reply } }, { new: true })
    if (result) {
      ctx.result = result
    } else {
      ctx.error = '回复失败'
    }
    return next()
  },
  // 删除留言
  'DELETE /api/deleteMsgBoards': async (ctx, next) => {
    const ids = ctx.query.ids
    if (!ids) {
      throw new InvalidQueryError()
    }
    const result = await MsgBoardService.delete({ _id: { $in: ids } })
    if (!result) {
      ctx.error = '删除留言失败！'
    } else {
      console.log(result)
      ctx.result = result
    }
    return next()
  },
  // 删除二级留言
  'PATCH /api/updateMsgBoard': async (ctx, next) => {
    const { msgId, replyId } = ctx.request.body
    if (!msgId || !replyId) {
      throw new InvalidQueryError()
    }
    const result = await MsgBoardService.update({ _id: msgId }, { $pull: { reply: { _id: replyId } } })
    if (!result) {
      ctx.error = '删除二级留言失败！'
    } else {
      ctx.result = result
    }
    return next()
  }
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
