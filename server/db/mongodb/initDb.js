const md5 = require('md5')
const salt = require('../../secret').salt
const localTime = require("../../utils/reviseTime")

const User = require('../../models/mongodb/UserModel')

User.find({}, (err, docs) => {
    if (err) {
        console.log(err)
    } else {
        if (!docs.length) {
            const user = new User({
                user: "admin",
                password: md5("123456" + salt),
                salt: salt,
                lastLogin: localTime(Date.now()),
            })
            user.save((err, newUser) => {
                if (err) return console.error(err)
                console.log(newUser)
                console.log('插入数据成功，按 ctrl + c 退出！')
            })
        } else {
            console.log("Userinit has done")
        }
    }
})