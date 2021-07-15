const jwt = require('jsonwebtoken')
const jwtSecret = require('../config').jwtSecret

const confirmToken = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    const token = ctx.request.headers.authorization.slice(7)
    jwt.verify(token, jwtSecret)
    await next()
  } else {
    ctx.throw(401, 'NoToken', { code: 0, data: null })
  }
}

module.exports = confirmToken
