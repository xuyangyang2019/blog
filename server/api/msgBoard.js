const db = require("../db/mongodb/db")
const localTime = require("../utils/reviseTime")
// const confirmToken = require("../middleware/confirmToken")

module.exports = {
	// 获取留言
	'GET /getMsgBoard': async (ctx, next) => {
		let limit = 8
		let skip = ctx.query.page * limit - limit
		let docs = await db.msgBoard
			.find({}, (err, doc) => { })
			.sort({ _id: -1 })
			.skip(skip)
			.limit(limit)
		ctx.body = docs
	},
	// 保存留言
	'POST /saveLeaveW': async (ctx, next) => {
		let doc = ctx.request.body
		let result = await db.msgBoard.create(doc)
		if (result._id) {
			ctx.body = result
			// 保存到新消息 提醒后台
			db.newMsg.create({
				type: "msgboard",
				name: result.name,
				say: result.content,
				content: result.name + "在" + localTime(Date.now()) + "给你留言啦~~"
			})
			// 		new db.newMsg({
			// 			type: "msgboard",
			// 			name: req.body.name,
			// 			say: req.body.content,
			// 			content: req.body.name + "在" + localTime(Date.now()) + "给你留言啦~~"
			// 		}).save()
		}
	},
}