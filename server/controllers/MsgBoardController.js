const MsgBoardService = require('../services').MsgBoardService
const { InvalidQueryError } = require('../lib/error')

module.exports = {
  // 获取留言
  'GET /api/getMsgBoard': async (ctx, next) => {
    // const { pageNum, pageSize } = ctx.query
    let pageNum = ctx.query.pageNum || 1
    let pageSize = ctx.query.pageSize || 10
    let result = await MsgBoardService.findByPage({}, pageNum, pageSize)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // // 保存留言
  // 'POST /saveLeaveW': async (ctx, next) => {
  //   let doc = ctx.request.body
  //   let result = await db.msgBoard.create(doc)
  //   if (result._id) {
  //     ctx.rest(result)
  //     // 保存到新消息 提醒后台
  //     db.newMsg.create({
  //       type: "msgboard",
  //       name: result.name,
  //       say: result.content,
  //       content: result.name + "在" + localTime(Date.now()) + "给你留言啦~~"
  //     })
  //     // 		new db.newMsg({
  //     // 			type: "msgboard",
  //     // 			name: ctx.body.name,
  //     // 			say: ctx.body.content,
  //     // 			content: ctx.body.name + "在" + localTime(Date.now()) + "给你留言啦~~"
  //     // 		}).save()
  //   }
  // },
  // // admin获取留言
  // 'GET /getAdminBoard': async (ctx, next) => {
  //   // 后台留言板抓取
  //   let limit = 10
  //   let skip = ctx.query.page * limit - limit
  //   let docs = await db.msgBoard
  //     .find({})
  //     .sort({ _id: -1 })
  //     .skip(skip)
  //     .limit(limit)
  //   ctx.rest(docs)
  // },
  // // 删除指定的留言
  // 'DELETE /removeLeavewords': async (ctx, next) => {
  //   confirmToken(ctx, next)
  //   // 因为用到批量删除，所以删除项的_id均放到数组中
  //   let result = await db.msgBoard.remove({ _id: { $in: ctx.query.id } })
  //   if (result.ok) {
  //     ctx.rest({ deleteCode: 200 })
  //   }
  // },
  // // 后台管理删除二级留言
  // 'PATCH /reduceLeavewords': async (ctx, next) => {
  //   confirmToken(ctx, next)
  //   let result = await db.msgBoard.update(
  //     { "_id": ctx.request.body.mainId },
  //     { $pull: { "reply": { "_id": ctx.request.body.secondId } } })
  //   if (result) {
  //     ctx.rest({ deleteCode: 200 })
  //   }
  // },
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
