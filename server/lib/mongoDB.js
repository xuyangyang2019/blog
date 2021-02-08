const mongoose = require('mongoose')
// 服务端的配置文件
const config = require('../config').mongoDB
// 日志
const { logger } = require('../middlewares/logger')

// const url = `mongodb://${config.user}:${config.pwd}@${config.host}:${config.port}/${config.db}?authSource=${config.authSource}`
const url = `mongodb://${config.user}:${config.pwd}@${config.host}:${config.port}/${config.db}`
// 创建一个数据库连接
const mongo = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true })

mongo.on('connected', () => logger.info(`Connected to database: ${url}`))

mongo.on('error', () => logger.error(`Failed to connect to database: ${url}`))

mongo.on('disconnected', () => logger.info(`Closed connection to database: ${url}`))

mongo.once('open', () => logger.info('MongoDB is opened'))

module.exports = mongo
