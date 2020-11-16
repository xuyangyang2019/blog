// const md5 = require("js-md5")

//请自行设置盐值和密码
const createSecret = {
	salt: Math.ceil(Math.random() * 100000),
	jwtSecret: "12345"
}

module.exports = createSecret