module.exports = function (pathPrefix) {
  // REST API前缀，默认为/api/:
  pathPrefix = pathPrefix || '/api/'
  return async (ctx, next) => {
    // 是否是REST API前缀?
    if (ctx.request.path.startsWith(pathPrefix)) {
      // 绑定rest()方法:
      ctx.rest = (data, code, message) => {
        ctx.response.type = 'application/json'
        ctx.response.body = {
          code: code || 200,
          message: message || 'success',
          data: data
        }
      }
    }
    await next()
  }
}
