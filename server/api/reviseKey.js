const db = require('../db/mongodb/db')
// const md5 = require("js-md5")
const md5 = require('md5')
const secret = require('../secret')

const confirmToken = require('../middlewares/confirmToken')

module.exports = {
  // 修改密码
  'PATCH /reviseKey': async (ctx, next) => {
    confirmToken(ctx, next)
    const salt = secret.salt
    const pwd = md5(ctx.request.body.newKey + salt)
    const doc = await db.user.findOne({ user: 'admin' })
    if (doc) {
      if (doc.password === md5(ctx.request.body.oldKey + doc.salt)) {
        const result = await db.user.update({ user: 'admin' }, { password: pwd, salt: salt })
        if (result.ok) {
          ctx.rest({ code: 200 })
        }
      } else {
        ctx.rest({ code: 'oldkey-401' })
      }
    }
  }
}
