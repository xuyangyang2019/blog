const db = require("../db/mongodb/db")
// const localTime = require("../utils/reviseTime")
// const confirmToken = require("../middleware/confirmToken")


module.exports = {
	// 获取推荐文章
	'GET /getComments': async (ctx, next) => {
		let comments = await db.comment
			.find(
				{ articleId: ctx.query.articleId },
				(err, doc) => { })
			.sort({ _id: -1 })
		ctx.body = comments
	},
	// 保存评论
	'POST /saveComment': async (ctx, next) => {
		let newDoc = await db.comment.create(ctx.request.body)
		if (newDoc._id) {
			ctx.body = newDoc
			// 更新article
			db.article.update(
				{ articleId: ctx.body.articleId },
				{ $inc: { commentNum: 1 } },
				(err, doc) => { })
			// 通知admin
			// new db.newMsg({
			// 	type: "comment",
			// 	name: ctx.body.name,
			// 	say: ctx.body.content,
			// 	content: ctx.body.name + "在" + localTime(Date.now()) + "评论了你的文章--" + ctx.body.title
			// }).save()
		}
	},
	// 前后端文章评论回复（二级评论）
	'PATCH /addComment': async (ctx, next) => {
		let addInfo = {
			name: ctx.request.body.name,
			imgUrl: ctx.request.body.imgUrl,
			email: ctx.request.body.email,
			aite: ctx.request.body.aite,
			content: ctx.request.body.content,
			like: ctx.request.body.like,
			date: ctx.request.body.date
		}
		let doc = await db.comment.findByIdAndUpdate(
			{ _id: ctx.request.body._id },
			{ $push: { reply: addInfo } },
			{ new: true })
		if (doc._id) {
			ctx.body = doc
		}
	},
	// 前端文章点赞
	'PATCH /addLike': async (ctx, next) => {
		//是否为二级评论
		if (ctx.request.body.repId) {
			let ur = await db.comment.update(
				{ _id: ctx.request.body.revId, "reply._id": ctx.request.body.repId },
				{ $inc: { "reply.$.like": ctx.request.body.addOrDel } },
				(err, doc) => { })
			if (ur) {
				ctx.body = { code: 200 }
			}
		} else {
			let ur = await db.comment.update(
				{ _id: ctx.request.body.revId },
				{ $inc: { "like": ctx.request.body.addOrDel } },
				(err, doc) => { })
			if (ur) {
				ctx.body = { code: 200 }
			}
		}
	},
	// 后台管理
	'GET /getAdminComments': async (ctx, next) => {
		let limit = 10
		let skip = ctx.query.page * limit - limit
		let docs = await db.comment
			.find({})
			.sort({ "_id": -1 })
			.skip(skip)
			.limit(limit)
		if (docs.length) {
			ctx.body = docs
		}
	},
	// 后台管理删除一级评论
	'DELETE /removeComments': async (ctx, next) => {
		let result = await db.comment.remove({ _id: { $in: ctx.query.id } })
		// // 更新文章的评论数
		// db.article.update(
		// 	{ articleId: ctx.query.articleId },
		// 	{ $inc: { commentNum: -1 } },
		// 	(err, doc) => {
		// 		if (err) {
		// 			ctx.status(500)
		// 		}
		// 	})
		if (result.ok) {
			ctx.body = { deleteCode: 200 }
		}
	},
}

// //后台管理

// //后台管理删除二级评论
// router.patch("/api/reduceComments",confirmToken,(ctx,res) =>{
// 	db.comment.update({"_id": ctx.body.mainId},{$pull: {"reply": {"_id": ctx.body.secondId}}},(err,doc) => {
// 		if(err){
// 			res.status(500).end()
// 		}else{
// 			res.json({deleteCode: 200})
// 		}
// 	})
// })	


// module.exports = router