const jwt = require('jsonwebtoken')
const jwtSecret = require('../config').jwtSecret

const confirmToken = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    const token = ctx.request.headers.authorization.slice(7)
    try {
      jwt.verify(token, jwtSecret)
      await next()
    } catch (error) {
      throw { code: 401, message: err.message }
    }
  } else {
    throw { code: 401, message: 'no authorization' }
  }
}

module.exports = confirmToken
