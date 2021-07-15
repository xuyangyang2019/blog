const UserService = require('../../services').UserService

module.exports = {
  // 获取admin的信息
  'GET /api/user/info': async (ctx) => {
    const result = await UserService.findOne({ username: 'admin' }, { nickname: 1, username: 1, lastLoginTime: 1 })
    ctx.rest(result)
  }
}
