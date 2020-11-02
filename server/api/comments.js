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
		let result = await db.comment.findByIdAndUpdate(
			{ _id: ctx.request.body._id },
			{ $push: { reply: addInfo } },
			{ new: true },
			(err, doc) => {
			})
		if (result._id) {
			ctx.body = result
		}
	},
}
// router.patch("/api/addLike",(ctx,res) => {
		// 	//是否为二级评论
		// 	if(ctx.body.repId){
		// 		db.comment.update({_id: ctx.body.revId,"reply._id": ctx.body.repId},{$inc: {"reply.$.like": ctx.body.addOrDel}},(err,doc) => {
		// 			if(err){
		// 				res.status(500).end()
		// 			}else{
		// 				res.json({code: 200})
		// 			}
		// 		})
		// 	}else{
		// 		db.comment.update({_id: ctx.body.revId},{$inc: {"like": ctx.body.addOrDel}},(err,doc) => {
		// 			if(err){
		// 				res.status(500).end()
		// 			}else{
		// 				res.json({code: 200})
		// 			}
		// 		})
		// 	}	
		// })
// //后台管理
// router.get("/api/getAdminComments",confirmToken,(ctx,res) =>{
// 	let limit = 10
// 	let skip = ctx.query.page*limit - limit
// 	db.comment.find({},(err,doc) =>{
// 		if(err){
// 			res.status(500).end()
// 		}else{
// 			res.json(doc)
// 		}
// 	}).sort({"_id": -1}).skip(skip).limit(limit)
// })
// //后台管理删除一级评论
// router.delete("/api/removeComments",confirmToken,(ctx,res)=>{
// 	db.comment.remove({_id: {$in: ctx.query.id}},(err)=>{
// 		if(err){
// 			res.status(500).end()
// 		}else{
// 			db.article.update({articleId: ctx.query.articleId},{$inc: {commentNum: -1}},(err,doc) =>{
// 				if(err){
// 					res.status(500)
// 				}
// 			})
// 			res.json({deleteCode: 200})
// 		}
// 	})
// })
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