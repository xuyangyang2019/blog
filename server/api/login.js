const md5 = require("md5")
const jwt = require("jsonwebtoken")

const secret = require("../secret")
const db = require("../db/mongodb/db")
const localTime = require("../utils/reviseTime")
const confirmToken = require("../middlewares/confirmToken")

// 创建token
const createToken = (id, name) => {
	return jwt.sign({ id: id, user: name }, secret.jwtSecret, { expiresIn: "10h" })
}

module.exports = {
	// 后端登陆
	'POST /login': async (ctx, next) => {
		let doc = await db.user.findOne({ user: ctx.request.body.user })
		if (doc && doc._id && doc.salt) {
			// 如果有用户且密码正确 返回token
			if (doc.password === md5(ctx.request.body.password + doc.salt)) {
				// 生成token
				let token = createToken(doc._id, doc.user)
				// 上次登陆时间
				let lastTime = doc.lastLogin
				// 当前时间
				let currTime = localTime(Date.now())
				// 更新用户表的最近一次的登陆时间
				db.user.update(
					{ user: ctx.request.body.user },
					{ lastLogin: currTime }, (err, doc) => {
						if (err) {
							console.log(err)
						}
					})
				// 返回
				ctx.rest({
					code: 200,
					id: doc._id,
					name: doc.user,
					lastLogin: lastTime,
					token: token
				})

			} else {
				// 如果密码不对 返回401
				ctx.rest({ code: 401 })
			}
		} else {
			// 如果查不到用户名 返回401
			ctx.rest({ code: 401 })
		}
	},
	// 路由闯入编辑器页面进行token验证
	'GET /confirmToken': async (ctx, next) => {
		confirmToken(ctx, next)
		ctx.state = 200
	}

}