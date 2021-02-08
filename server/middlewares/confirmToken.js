const jwt = require('jsonwebtoken')
const secret = require('../secret')

const confirmToken = (ctx, next) => {
  if (!ctx.headers.authorization) {
    ctx.body = { code: 401 }
  } else {
    const token = ctx.headers.authorization
    jwt.verify(token, secret.jwtSecret, (err) => {
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
