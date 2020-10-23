const db = require("../db/mongodb/db")
// const localTime = require("../utils/reviseTime")
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
}