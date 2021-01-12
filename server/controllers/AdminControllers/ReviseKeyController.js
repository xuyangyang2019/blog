const md5 = require('md5')
const UserService = require('../../services').UserService
const { InvalidQueryError } = require('../../lib/error')

module.exports = {
  'PATCH /api/reviseKey': async (ctx, next) => {
    const { oldKey, newKey } = ctx.request.body
    // 参数不对抛出异常
    if (!oldKey || !oldKey) {
      throw new InvalidQueryError()
    }
    const user = await UserService.findOne({ username: 'admin' })
    if (!user) {
      ctx.error = '用户不存在'
    } else {
      const oldPwd = md5(oldKey + user.salt)
      const newPwd = md5(newKey + user.salt)
      if (user.password !== oldPwd) {
        ctx.error = '原密码错误'
      } else {
        const result = await UserService.update({ username: 'admin' }, { password: newPwd }, {})
        if (!result) {
          ctx.error = '更新密码失败！'
          // ctx.code = 'update-password-fail'
        } else {
          ctx.result = result
        }
      }
    }
    return next()
  }
}
