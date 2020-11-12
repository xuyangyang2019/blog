/*下载请求是在a标签中发起的，所以token在请求参数中带上，故重写token验证函数*/

const jwt = require("jsonwebtoken")
const secret = require("../secret")

const download_confirmToken = (ctx, next) => {
	if (!ctx.query.authToken) {
		ctx.status = 401
	} else {
		const token = ctx.query.authToken
		jwt.verify(token, secret.jwtSecret, (err) => {
			if (err) {
				ctx.status = 401
			} else {
				console.log("通过")
				next()
			}
		})
	}
}

module.exports = download_confirmToken
