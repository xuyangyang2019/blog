// 这个middleware处理在其它middleware中出现的异常
// 并将异常消息回传给客户端：{ code: '错误代码', msg: '错误信息' }
const errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log('errorHandler', err)
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      message: err.message
    }
    // 手动释放error事件 可以被onerror捕捉
    // ctx.app.emit('error', err, ctx)
  }
  // return next().catch((err) => {
  //   if (err.name === 'UnauthorizedError') {
  //     // 身份验证失败返回 401
  //     ctx.status = 401
  //     ctx.body = err.originalError || 'Authentication Error'
  //   } else {
  //     if (err.code === null) {
  //       logger.error(err.stack)
  //     }
  //     // 保证返回状态是 200, 这样前端不会抛出异常
  //     ctx.status = 200
  //     ctx.body = {
  //       code: err.code || -1,
  //       data: null,
  //       msg: err.message ? err.message.trim() : err
  //     }
  //   }
  //   return Promise.resolve()
  // })
}

module.exports = errorHandler
