const log4js = require('log4js')
const logsConfig = require('../config/log4jsConfig.js')

// 加载配置文件
log4js.configure(logsConfig)

// 调用预先定义的日志名称
const logger = log4js.getLogger('default')
const httpLogger = log4js.getLogger('httpLogger')
const errorLogger = log4js.getLogger('errorLogger')
const handleLogger = log4js.getLogger('handleLogger')

module.exports = {
  logger,
  httpLogger,
  errorLogger,
  handleLogger
}
