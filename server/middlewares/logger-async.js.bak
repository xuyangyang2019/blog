/* ./middleware/logger-async.js */

function log(ctx) {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
}

module.exports = function () {
  return async function (ctx, next) {
    let start = new Date().getTime()
    let execTime = 0
    log(ctx)
    await next()
    execTime = new Date().getTime() - start
    console.log(`页面执行时间${execTime}ms`)
    //     ctx.response.set('X-Response-Time', `${execTime}ms`)
  }
}