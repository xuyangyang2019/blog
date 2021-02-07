const { logger } = require('../utils/log4jsUtil')

/**
 * @param {*} ctx ctx
 * @method 获取客户端ip地址
 */
function getClientIp(ctx) {
  // return (
  //   req.headers['x-forwarded-for'] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   req.connection.socket.remoteAddress
  // )
  const remoteAddress =
    ctx.headers['x-forwarded-for'] ||
    ctx.ip ||
    ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  return remoteAddress
}

function isMobile(userAgent) {
  // 判断是移动端还是pc端
  return /Mobile/.test(userAgent) ? 'Mobile' : 'PC'
}

const log4jsMiddleware = async (ctx, next) => {
  // console.log(ctx)
  const start = new Date() // 响应开始时间
  await next()
  const pesponsTime = new Date() - start // 响应间隔时间
  // ${JSON.stringify(ctx.body)}

  // const ip = getClientIp(ctx) // ip
  // const userAgent = isMobile(ctx.request.headers['user-agent']) // 电脑还是手机
  // const method = ctx.request.method // 请求方法
  // const path = ctx.request.path // 请求路径
  // const referer = ctx.request.headers['referer'] // 推荐人
  // const status = ctx.status // 结果
  // const logTextStr = `${userAgent} ${ip} ${method} ${path} 请求参数： ${JSON.stringify(
  //   ctx.request.body
  // )} - ${status} - ${pesponsTime}ms`

  // 返回客户端信息交给logger打印
  const logTextJson = {
    ip: getClientIp(ctx),
    userAgent: isMobile(ctx.request.headers['user-agent']),
    method: ctx.request.method,
    path: ctx.request.path,
    url: ctx.url,
    request: ctx.request,
    body: ctx.body,
    referer: ctx.request.headers['referer'],
    status: ctx.status,
    responseTime: pesponsTime + 'ms'
  }
  // 控制台输出日志
  logger.info(logTextJson)
}

module.exports = {
  log4jsMiddleware
}
