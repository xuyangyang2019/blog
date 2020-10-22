// mongodb
const db = require("../db/mongodb/db")
// const confirmToken = require("../middleware/confirmToken")

module.exports = {
	// 获取标签
	'GET /tags': async (ctx, next) => {
		let publish = ctx.query.publish === "false" ? false : true
		let tagArr = []
		// 所有的标签
		// tagArr = await db.article.find({ publish: publish }).distinct("tag", (err, doc) => { })
		// 所有的文章
		let docs = await db.article.find({ publish: publish }, { tag: 1, _id: 0 })
		let tagMap = {}
		// 计算标签的文章数
		docs.forEach((doc, index, arr) => {
			for (const tag of doc.tag) {
				tagMap[tag] = tagMap[tag] ? tagMap[tag] + 1 : 1
			}
		})
		for (const key in tagMap) {
			if (tagMap.hasOwnProperty(key)) {
				tagArr.push({
					tag: key,
					num: tagMap[key]
				})
			}
		}
		ctx.body = tagArr
	}
}