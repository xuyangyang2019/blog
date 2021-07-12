const md5 = require('md5')
const { randomStr } = require('../utils/random')
const salt = randomStr(5)
const localTime = require('../utils/reviseTime')

const UserService = require('../services').UserService

async function initUser() {
  const users = await UserService.findMany({})
  if (users.length === 0) {
    const user = await UserService.save({
      username: 'admin', // 用户名
      password: md5('123456' + salt), // 密码
      nickname: '羊羊羊', // 昵称
      phoneNum: '10086', // 电话号码
      salt: salt, // 盐
      lastLoginTime: localTime(Date.now()) // 上次登录时间
    })
    if (user._id) {
      console.log(user)
      console.log('插入数据成功，按 ctrl + c 退出！')
    } else {
      console.log('添加admin失败！')
    }
  } else {
    console.log('Userinit has done', users)
  }
}

initUser()
