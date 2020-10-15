/**
 * 日志中间件
 * @return {Promise.<void>}
 */

const Koa_Logger = require('koa-logger')
const Moment = require("moment")

module.exports = function () {
    return Koa_Logger((str) => {
        console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
    })
}