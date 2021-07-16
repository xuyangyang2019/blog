// 这个middleware处理在其它middleware中出现的异常
// 并将异常消息回传给客户端：{ code: '错误代码', msg: '错误信息' }
const errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // token超时
      ctx.status = 403
      ctx.body = err.message
    } else if (err.name === 'JsonWebTokenError') {
      // token错误
      ctx.status = 401
      ctx.body = err.message
    } else {
      console.log('errorHandler', err.name)
      console.log('errorHandler', err.message)
      // console.log('errorHandler', err.stack)
      // 保证返回状态是 200, 这样前端不会抛出异常
      ctx.status = 200
      ctx.body = {
        code: err.code || -1,
        data: null,
        message: err.message ? err.message.trim() : err
      }
    }
    // 手动释放error事件
    ctx.app.emit('error', err, ctx)
  }
}

module.exports = errorHandler
