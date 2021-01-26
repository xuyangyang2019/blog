const MsgBoardService = require('../services').MsgBoardService
// const { InvalidQueryError } = require('../lib/error')

module.exports = {
  // 获取留言
  'GET /api/getMsgBoard': async (ctx, next) => {
    const { pageNum, pageSize } = ctx.request.query
    const result = await MsgBoardService.findByPage({}, pageNum || 1, pageSize || 10)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 获取留言数量
  'GET /api/getMsgCount': async (ctx, next) => {
    const result = await MsgBoardService.count()
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 保存留言
  'POST /api/leavingMessage': async (ctx, next) => {
    const doc = ctx.request.body
    const result = await MsgBoardService.save(doc)
    if (result && result._id) {
      ctx.result = result
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
    return next()
  }
  // // 回复留言
  // 'PATCH /addReply': async (ctx, next) => {
  //   let reply = {
  //     name: ctx.request.body.name,
  //     imgUrl: ctx.request.body.imgUrl,
  //     email: ctx.request.body.email,
  //     content: ctx.request.body.content,
  //     date: ctx.request.body.date,
  //     aite: ctx.request.body.aite
  //   }
  //   let doc = await db.msgBoard.findByIdAndUpdate(
  //     { "_id": ctx.request.body.id },
  //     { $push: { reply: reply } },
  //     { new: true })
  //   if (doc._id) {
  //     ctx.rest(doc)
  //   }
  // }
}
