const md5 = require('md5')
const jwt = require('jsonwebtoken')
const secret = require('../secret')
const localTime = require('../utils/reviseTime')

const { InvalidQueryError } = require('../lib/error')

const UserService = require('../services').UserService

// 创建token
const createToken = (user) => {
  // 方式一
  // return jwt.sign({ id: user._id, username: user.user.username }, secret.jwtSecret, { expiresIn: "10h" })
  // 方式二
  return jwt.sign(
    {
      data: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3 // 3个小时
    },
    secret.jwtSecret
  )
}

module.exports = {
  // 后端登陆
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
      ctx.result = {
        userInfo: {
          id: user._id,
          username: user.username,
          nickname: user.nickname,
          last_login_time: user.last_login_time
        },
        token: createToken(user)
      }
      // 更新用户表的最近一次的登陆时间
      UserService.updateById(user._id, { last_login_time: localTime(Date.now()) })
    }
    return next()
  },
  // 路由闯入编辑器页面进行token验证
  'GET /api/confirmToken': async (ctx, next) => {
    if (!ctx.headers.authorization) {
      // 如果不指定状态码，默认为 500。
      // 5xx 类错误 expose 默认为 false ，即不会将错误信息返回到 response
      ctx.throw(401, 'NoToken', { code: 0, data: null })
    } else {
      const token = ctx.headers.authorization.split(' ')[1]
      try {
        const decoded = jwt.verify(token, secret.jwtSecret)
        ctx.result = decoded
        return next()
      } catch (error) {
        ctx.throw(403, 'TokenError', { code: 0, data: null })
      }
    }
  },
  // 获取admin的信息
  'GET /api/getUserInfo': async (ctx, next) => {
    if (!ctx.headers.authorization) {
      ctx.throw(401, 'NoToken', { code: 0, data: null })
    } else {
      const token = ctx.headers.authorization.split(' ')[1]
      try {
        // 鉴权
        jwt.verify(token, secret.jwtSecret)
        // 查询admin的信息
        ctx.result = await UserService.findOne({ username: 'admin' }, { nickname: 1, username: 1, last_login_time: 1 })
        return next()
      } catch (error) {
        ctx.throw(403, 'TokenError', { code: 0, data: null })
      }
    }
  }
}
