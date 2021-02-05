const log4js = require('log4js')
const logsConfig = require('../config/log4jsConfig.js')

// 加载配置文件
log4js.configure(logsConfig)

// 调用预先定义的日志名称
const logger = log4js.getLogger('default')
const httpLogger = log4js.getLogger('httpLogger')
const errorLogger = log4js.getLogger('errorLogger')
const handleLogger = log4js.getLogger('handleLogger')

const loggerMiddleware = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  const remoteAddress =
    ctx.headers['x-forwarded-for'] ||
    ctx.ip ||
    ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  const logText = `${ctx.method} ${ctx.status} ${ctx.url} 请求参数： ${JSON.stringify(
    ctx.request.body
  )}  响应参数： ${JSON.stringify(ctx.body)} - ${remoteAddress} - ${ms}ms`
  logger.info(logText)
}

module.exports = {
  logger,
  httpLogger,
  errorLogger,
  handleLogger,
  loggerMiddleware
}
