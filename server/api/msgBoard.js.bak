const db = require('../db/mongodb/db')
const localTime = require('../utils/reviseTime')
const confirmToken = require('../middlewares/confirmToken')

module.exports = {
  // 获取留言
  'GET /getMsgBoard': async (ctx, next) => {
    const limit = 8
    const skip = ctx.query.page * limit - limit
    const docs = await db.msgBoard
      .find({}, (err, doc) => {})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
    ctx.rest(docs)
  },
  // 保存留言
  'POST /saveLeaveW': async (ctx, next) => {
    const doc = ctx.request.body
    const result = await db.msgBoard.create(doc)
    if (result._id) {
      ctx.rest(result)
      // 保存到新消息 提醒后台
      db.newMsg.create({
        type: 'msgboard',
        name: result.name,
        say: result.content,
        content: result.name + '在' + localTime(Date.now()) + '给你留言啦~~'
      })
      // 		new db.newMsg({
      // 			type: "msgboard",
      // 			name: ctx.body.name,
      // 			say: ctx.body.content,
      // 			content: ctx.body.name + "在" + localTime(Date.now()) + "给你留言啦~~"
      // 		}).save()
    }
  },
  // admin获取留言
  'GET /getAdminBoard': async (ctx, next) => {
    // 后台留言板抓取
    const limit = 10
    const skip = ctx.query.page * limit - limit
    const docs = await db.msgBoard.find({}).sort({ _id: -1 }).skip(skip).limit(limit)
    ctx.rest(docs)
  },
  // 删除指定的留言
  'DELETE /removeLeavewords': async (ctx, next) => {
    confirmToken(ctx, next)
    // 因为用到批量删除，所以删除项的_id均放到数组中
    const result = await db.msgBoard.remove({ _id: { $in: ctx.query.id } })
    if (result.ok) {
      ctx.rest({ deleteCode: 200 })
    }
  },
  // 后台管理删除二级留言
  'PATCH /reduceLeavewords': async (ctx, next) => {
    confirmToken(ctx, next)
    const result = await db.msgBoard.update(
      { _id: ctx.request.body.mainId },
      { $pull: { reply: { _id: ctx.request.body.secondId } } }
    )
    if (result) {
      ctx.rest({ deleteCode: 200 })
    }
  },
  // 回复留言
  'PATCH /addReply': async (ctx, next) => {
    const reply = {
      name: ctx.request.body.name,
      imgUrl: ctx.request.body.imgUrl,
      email: ctx.request.body.email,
      content: ctx.request.body.content,
      date: ctx.request.body.date,
      aite: ctx.request.body.aite
    }
    const doc = await db.msgBoard.findByIdAndUpdate(
      { _id: ctx.request.body.id },
      { $push: { reply: reply } },
      { new: true }
    )
    if (doc._id) {
      ctx.rest(doc)
    }
  }
}
