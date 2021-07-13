const MsgBoardService = require('../../services').MsgBoardService
const { InvalidQueryError } = require('../../lib/error')

module.exports = {
  // 回复留言
  'PATCH /api/replyMsgBoard': async (ctx) => {
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
      ctx.rest(result)
    } else {
      ctx.rest('', -1, '回复失败')
    }
  },
  // 删除留言
  'DELETE /api/deleteMsgBoards': async (ctx) => {
    const ids = ctx.query.ids
    if (!ids) {
      throw new InvalidQueryError()
    }
    const result = await MsgBoardService.delete({ _id: { $in: ids } })
    if (!result) {
      ctx.rest('', -1, '删除留言失败！')
    } else {
      ctx.rest(result)
    }
  },
  // 删除二级留言
  'PATCH /api/updateMsgBoard': async (ctx) => {
    const { msgId, replyId } = ctx.request.body
    if (!msgId || !replyId) {
      throw new InvalidQueryError()
    }
    const result = await MsgBoardService.update({ _id: msgId }, { $pull: { reply: { _id: replyId } } })
    if (!result) {
      ctx.rest('', -1, '删除二级留言失败！')
    } else {
      ctx.rest(result)
    }
  }
}
