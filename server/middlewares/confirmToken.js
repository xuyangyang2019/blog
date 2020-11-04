const jwt = require("jsonwebtoken")
const secret = require("../secret")

const confirmToken = (ctx, next) => {
	if (!ctx.headers.authorization) {
		ctx.body = { code: 401 }
	} else {
		const token = ctx.headers.authorization
		jwt.verify(token, secret.jwtSecret, (err) => {
			if (err) {
				ctx.body = { code: 401 }
			} else {
				next()
			}
		})
	}
}

module.exports = confirmToken
