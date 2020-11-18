const md5 = require('md5')
const salt = require('../../secret').salt
const localTime = require("../../utils/reviseTime")

const UserService = require('../../services').UserService

async function initUser() {
    let users = await UserService.findMany({})
    if (users.length === 0) {
        let user = await UserService.save({
            username: 'admin', // 用户名
            password: md5("123456" + salt), // 密码
            nickname: '羊羊羊', // 昵称
            phone_num: '10086', // 电话号码
            salt: salt, // 盐
            last_login_time: localTime(Date.now()), // 上次登录时间
        })
        if (user._id) {
            console.log(user)
            console.log('插入数据成功，按 ctrl + c 退出！')
        } else {
            console.log('添加admin失败！')
        }
    } else {
        console.log("Userinit has done", users)
    }
}

initUser()
