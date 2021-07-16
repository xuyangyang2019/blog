const jwt = require('jsonwebtoken')
const jwtSecret = require('../config').jwtSecret

const confirmToken = async (ctx, next) => {
  const token = ctx.request.headers.authorization ? ctx.request.headers.authorization.slice(7) : ''
  jwt.verify(token, jwtSecret)
  await next()
}

module.exports = confirmToken
