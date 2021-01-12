const md5 = require('md5')
const jwt = require('jsonwebtoken')
const secret = require('../secret')
const localTime = require('../utils/reviseTime')

const UserService = require('../services').UserService
const { InvalidQueryError } = require('../lib/error')

module.exports = {
  'POST /api/login': async (ctx, next) => {
    const { username, password } = ctx.request.body
    // 参数不对抛出异常
    if (!username || !password) {
      throw new InvalidQueryError()
    }
    const user = await UserService.findOne({ username: username })
    if (!user) {
      ctx.error = '用户不存在'
    } else if (user.password !== md5(password + user.salt)) {
      ctx.error = '密码错误'
    } else {
      // 其他方式生成token
      // jwt.sign({ id: user._id, username: user.user.username }, secret.jwtSecret, { expiresIn: "10h" })
      ctx.result = {
        userInfo: {
          id: user._id,
          username: user.username,
          nickname: user.nickname,
          last_login_time: user.last_login_time
        },
        token: jwt.sign(
          {
            data: user._id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3 // 3个小时
          },
          secret.jwtSecret
        )
      }
      // 更新用户表的最近一次的登陆时间
      UserService.updateById(user._id, { last_login_time: localTime(Date.now()) })
    }
    return next()
  }
}
