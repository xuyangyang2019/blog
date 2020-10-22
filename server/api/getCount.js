// const express = require('express');
// const router = express.Router();
// const db = require("../db/db")
const router = require('koa-router')()
// mongodb
const db = require("../db/mongodb/db")

module.exports = {
	// 获取文章数量
	'GET /getCount': async (ctx, next) => {
		let publish = ctx.query.publish === "false" ? false : true
		let num = 0
		// 首页请求
		if (!ctx.query.tag && !ctx.query.start && !ctx.query.key) {
			num = await db.article.count({ publish: publish }, (err, num) => { })
		}
		// 通过文章标签请求
		if (ctx.query.tag) {
			let tag = ctx.query.tag
			num = await db.article.count({ publish: publish, tag: tag }, (err, num) => { })
		}
		// 前台后台时间范围请求
		if (ctx.query.start) {
			let start = new Date(parseInt(ctx.query.start))
			let end = new Date(parseInt(ctx.query.end))
			num = await db.article.count({ publish: ctx.query.publish, date: { "$gte": start, "$lte": end } }, (err, num) => {
				// if (err) {
				//     res.status(500).end()
				// } else {
				//     res.json(num)
				// }
			})
		}
		// 前台后台关键词搜索请求
		if (ctx.query.key) {
			num = await db.article.count({ publish: ctx.query.publish, title: { $regex: ctx.query.key, $options: "i" } }, (err, num) => {
				// if (err) {
				//     res.status(500).end()
				// } else {
				//     res.json(num)
				// }
			})
		}
		ctx.body = num
	}
}