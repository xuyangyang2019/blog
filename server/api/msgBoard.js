const db = require("../db/mongodb/db")
const localTime = require("../utils/reviseTime")
const confirmToken = require("../middlewares/confirmToken")

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
			// 			name: ctx.body.name,
			// 			say: ctx.body.content,
			// 			content: ctx.body.name + "在" + localTime(Date.now()) + "给你留言啦~~"
			// 		}).save()
		}
	},
	// admin获取留言
	'GET /getAdminBoard': async (ctx, next) => {
		// 后台留言板抓取
		let limit = 10
		let skip = ctx.query.page * limit - limit
		let docs = await db.msgBoard
			.find({})
			.sort({ _id: -1 })
			.skip(skip)
			.limit(limit)
		ctx.body = docs
	},
	// 删除指定的留言
	'DELETE /removeLeavewords': async (ctx, next) => {
		confirmToken(ctx, next)
		// 因为用到批量删除，所以删除项的_id均放到数组中
		let result = await db.msgBoard.remove({ _id: { $in: ctx.query.id } })
		if (result.ok) {
			ctx.body = { deleteCode: 200 }
		}
	},
	// 后台管理删除二级留言
	'PATCH /reduceLeavewords': async (ctx, next) => {
		confirmToken(ctx, next)
		let result = await db.msgBoard.update(
			{ "_id": ctx.request.body.mainId },
			{ $pull: { "reply": { "_id": ctx.request.body.secondId } } })
		if (result) {
			ctx.body = { deleteCode: 200 }
		}
	},
}

// router.patch("/api/addReply", (ctx, res) => {
// 	let reply = {
// 		name: ctx.body.name,
// 		imgUrl: ctx.body.imgUrl,
// 		email: ctx.body.email,
// 		content: ctx.body.content,
// 		date: ctx.body.date,
// 		aite: ctx.body.aite
// 	}
// 	db.msgBoard.findByIdAndUpdate({ "_id": ctx.body.id }, { $push: { reply: reply } }, { new: true }, (err, doc) => {
// 		if (err) {
// 			res.status(500).end()
// 		} else {
// 			res.json(doc)
// 		}
// 	})
// })

