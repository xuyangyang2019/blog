// 管理员数据模型
const moment = require('moment')
// const md5 = require('md5')
// 配置文件
// const config = require('./server/config')
// 加密前缀
// const md5Pre = config.md5Pre

// const model = require('./models')
// const Admin = model.Admin
const Admin = require('./models/AdminModel')

const admin1 = new Admin({
    username: 'xyy',
    email: 'xyy@163.com',
    // password: md5(md5Pre + '123456'),
    password: '123456',
    creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    is_delete: 0,
    timestamp: moment().format('X')
})

admin1.save((err, newAdmin) => {
    if (err) return console.error(err)
    console.log('插入数据成功，按 ctrl + c 退出！')
    console.log(newAdmin)
})