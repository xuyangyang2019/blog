const { logInfo } = require('../utils/log4jsUtil')

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
  await next()
  const execTime = new Date() - start // 响应间隔时间

  // 返回客户端信息交给logger打印
  const logTextJson = {
    ip: getClientIp(ctx), // ip
    userAgent: isMobile(ctx.request.headers['user-agent']), // 电脑还是手机
    method: ctx.request.method, // 请求方法
    path: ctx.request.path, // 请求路径
    // url: ctx.url,
    // request: ctx.request,
    // body: ctx.body,
    referer: ctx.request.headers['referer'], // 推荐人
    status: ctx.status,
    responseTime: execTime + 'ms'
  }
  // 控制台输出日志
  logInfo(logTextJson)
}

module.exports = log4jsMiddleware
