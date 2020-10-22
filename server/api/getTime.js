// mongodb
const db = require("../db/mongodb/db")

module.exports = {
	// 获取时间轴
	'GET /getTime': async (ctx, next) => {
		let publish = ctx.query.publish === "false" ? false : true
		let timeArr = []
		let doc = await db.article.find(
			{ publish: publish }, // 查询条件
			{ date: 1 }, // 指定返回的字段
			// (err, doc) => {
			//     if (err) {
			//         console.log('查询数据库报错', err)
			//     }
			// }
		)
		let timeMap = {}
		doc.forEach((item, index, arr) => {
			let yearMonth = new Date(item.date).getFullYear() + "年" + (new Date(item.date).getMonth() + 1) + "月"
			timeMap[yearMonth] = timeMap[yearMonth] ? timeMap[yearMonth] + 1 : 1
		})
		for (const key in timeMap) {
			if (timeMap.hasOwnProperty(key)) {
				timeArr.push({
					time: key,
					num: timeMap[key]
				})
			}
		}
		// console.log('getTime', timeArr)
		ctx.body = timeArr
	}
}