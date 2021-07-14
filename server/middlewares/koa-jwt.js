const jwtSecret = require('../config').jwtSecret
const jwt = require('jsonwebtoken')

// koa-jwt 源码
module.exports = function (ctx) {
  // 将 token 中的数据解密后存到 ctx 中
  try {
    if (typeof ctx.request.headers.authorization === 'string') {
      const token = ctx.request.headers.authorization.slice(7)
      ctx.jwtData = jwt.verify(token, jwtSecret)
    } else {
      throw { code: 401, message: 'no authorization' }
    }
  } catch (err) {
    throw { code: 401, message: err.message }
  }
}
