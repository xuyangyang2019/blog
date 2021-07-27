const MsgBoardService = require('../../services').MsgBoardService
const { InvalidQueryError } = require('../../lib/error')

module.exports = {
  // 获取留言
  'GET /api/messages/list': async (ctx) => {
    const { pageNum, pageSize } = ctx.request.query
    const result = await MsgBoardService.findManyByPage({}, {}, pageNum || 1, pageSize || 10)
    ctx.rest(result)
  },
  // 获取留言数量
  'GET /api/messages/total': async (ctx) => {
    const result = await MsgBoardService.count()
    ctx.rest(result)
  },
  // 保存留言
  'POST /api/messages/save': async (ctx) => {
    const doc = ctx.request.body
    const result = await MsgBoardService.save(doc)
    if (result && result._id) {
      ctx.rest(result)
      //   // 保存到新消息 提醒后台
      //   db.newMsg.create({
      //     type: "msgboard",
      //     name: result.name,
      //     say: result.content,
      //     content: result.name + "在" + localTime(Date.now()) + "给你留言啦~~"
      //   })
      //   // 		new db.newMsg({
      //   // 			type: "msgboard",
      //   // 			name: ctx.body.name,
      //   // 			say: ctx.body.content,
      //   // 			content: ctx.body.name + "在" + localTime(Date.now()) + "给你留言啦~~"
      //   // 		}).save()
      // }
    } else {
      ctx.error = '留言失败'
    }
  },
  // 回复留言
  'PATCH /api/messages/reply': async (ctx) => {
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
      ctx.error = '回复失败'
    }
  }
}
