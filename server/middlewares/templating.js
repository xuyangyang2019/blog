// 模版引擎入口
const nunjucks = require('nunjucks')

/**
 * 创建Nunjucks的env对象
 * @param {*} path 模板的路径
 * @param {*} opts 模板的参数
 */
function createEnv(path, opts) {
  const autoescape = opts.autoescape === undefined ? true : opts.autoescape
  const noCache = opts.noCache || false // 在开发环境下，可以关闭cache，这样每次重新加载模板，便于实时修改模板
  const watch = opts.watch || false
  const throwOnUndefined = opts.throwOnUndefined || false

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path || 'views', {
      noCache: noCache,
      watch: watch
    }),
    {
      autoescape: autoescape,
      throwOnUndefined: throwOnUndefined
    }
  )

  if (opts.filters) {
    for (const f in opts.filters) {
      env.addFilter(f, opts.filters[f])
    }
  }

  return env
}

// async中间件的形式调用
// function templating(path, opts) {
//     // 创建Nunjucks的env对象:
//     var env = createEnv(path, opts)
//     return async (ctx, next) => {
//         // 给ctx绑定render函数:
//         ctx.render = function (view, model) {
//             // 把render后的内容赋值给response.body:
//             ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}))
//             // 设置Content-Type:
//             ctx.response.type = 'text/html'
//         }
//         // 继续处理请求:
//         await next()
//     }
// }

// 加载到app.context
function templating(path, opts, app) {
  const env = createEnv(path, opts)
  // app.context为ctx的原型
  app.context.render = function (view, model) {
    this.response.body = env.render(view, Object.assign({}, this.state || {}, model || {}))
    this.response.type = 'text/html'
  }
}

module.exports = templating
