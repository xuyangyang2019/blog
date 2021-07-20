const mongoose = require('mongoose')
// 服务端的配置文件
const config = require('../config').mongoDB
// 日志
const { logInfo, logError } = require('../utils/log4js')

// const url = `mongodb://${config.user}:${config.pwd}@${config.host}:${config.port}/${config.db}?authSource=${config.authSource}`
const url = `mongodb://${config.user}:${config.pwd}@${config.host}:${config.port}/${config.db}`
// 创建一个数据库连接
const mongo = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true })

mongo.on('connected', () => logInfo(`Connected to database: ${url}`))

mongo.on('error', (err) => {
  logInfo(err)
  logError(null, `Failed to connect to database: ${url}:${err}`)
})

mongo.on('disconnected', () => logInfo(`Closed connection to database: ${url}`))

mongo.once('open', () => logInfo('MongoDB is opened'))

module.exports = mongo
