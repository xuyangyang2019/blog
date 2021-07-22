const { logInfo } = require('../utils/log4js')

/**
 * 获取客户端ip地址
 * @param {*} ctx
 */
function getClientIp(ctx) {
  const remoteAddress =
    ctx.headers['x-forwarded-for'] ||
    ctx.ip ||
    ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  return remoteAddress
}

/**
 * 是手机还是pc
 * @param {*} userAgent
 */
function isMobile(userAgent) {
  // 判断是移动端还是pc端
  return /Mobile/.test(userAgent) ? 'Mobile' : 'PC'
}

const log4jsMiddleware = async (ctx, next) => {
  const start = new Date() // 响应开始时间
  const ip = getClientIp(ctx) // 请求的ip
  const userAgent = isMobile(ctx.request.headers['user-agent']) // 电脑还是手机
  const referer = ctx.request.headers['referer'] // 推荐人
  // const path = ctx.request.path // path
  // const reqText = `<-- ${ip} ${userAgent} ${referer} ${ctx.request.method} ${ctx.request.url}`
  // logInfo(reqText)
  await next()
  const execTime = new Date() - start + 'ms' // 响应间隔时间
  // const rspText = `--> ${ctx.request.method} ${ctx.request.url} ${ctx.status} ${execTime}`
  // logInfo(rspText)
  const logText = `${ip} ${userAgent} ${referer} ${ctx.request.method} ${ctx.request.url} ${ctx.status} ${execTime}`
  // 控制台输出日志
  logInfo(logText)
}

module.exports = log4jsMiddleware
