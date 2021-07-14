const jwtSecret = require('../config').jwtSecret
const jwt = require('jsonwebtoken')

const confirmToken = (ctx, next) => {
  // koa-jwt
  // try {
  //   if (typeof ctx.request.headers.authorization === 'string') {
  //     const token = ctx.request.headers.authorization.slice(7)
  //     ctx.jwtData = jwt.verify(token, jwtSecret)
  //   } else {
  //     throw { code: 401, message: 'no authorization' }
  //   }
  // } catch (err) {
  //   throw { code: 401, message: err.message }
  // }
  if (!ctx.headers.authorization) {
    ctx.body = { code: 401 }
  } else {
    // const token = ctx.headers.authorization
    const token = ctx.request.headers.authorization.slice(7)
    jwt.verify(token, jwtSecret, (err) => {
      if (err) {
        throw { code: 401, message: 'no authorization' }
      } else {
        console.log('token验证通过')
        next()
      }
    })
  }
}

module.exports = confirmToken
