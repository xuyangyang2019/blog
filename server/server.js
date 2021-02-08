/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')

// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')
// 日志中间件
const Koa_Logger = require('koa-logger')
const Moment = require('moment')
// const { loggerMiddleware } = require('./middlewares/logger')

// 数据压缩
const KoaCompress = require('koa-compress')()
// 解析静态资源
const Koa_Static = require('koa-static')
// 解析POST请求
const koaBody = require('koa-body')
// ajax 跨域问题
const jsonp = require('koa-jsonp')
// rest中间件
// const rest = require('./middlewares/rest')
// 错误处理 和 返回处理
const { errorHandler, responseHandler } = require('./middlewares/response')

// 路由
const viewRouter = require('./routes/view')
const publicRouter = require('./routes/public')
const privateRouter = require('./routes/private')
// 开发环境配置
const setUpDevServer = require('../build/setup.dev.server.js')
// 开发环境
const isProd = process.env.NODE_ENV === 'production'

// 获取本地ip
const { serverPort, defaultHost } = require('./config')
const uri = `http://${defaultHost}:${serverPort}`

function resolve(dir) {
  return path.resolve(process.cwd(), dir)
}

// =================== 后端Server ===================

// 创建一个Koa对象表示web app本身:
const backendApp = new Koa()

// Logger
if (!isProd) {
backendApp.use(
  Koa_Logger((str) => {
      console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
  })
)
// backendApp.use(loggerMiddleware)

// Error Handler
backendApp.use(errorHandler)

// gzip
backendApp.use(KoaCompress)

// 解析post请求
backendApp.use(koaBody())

// 处理静态文件
// 生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。
// 而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
if (!isProd) {
  // 原生的实现方式
  // let staticFiles = require('./middlewares/static-files');
  // app.use(staticFiles('/static/', __dirname + '/static'));
  // app.use(staticFiles('/dist/', __dirname + '/dist'));
  backendApp.use(Koa_Static(resolve('public'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
  backendApp.use(Koa_Static(resolve('dist'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
  // backendApp.use(Koa_Static(resolve('dist-admin'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
}

// // Helmet
// backendApp.use(helmet())

// // rest
// backendApp.use(rest.restify())

// Cors
backendApp.use(jsonp())

// // View
// backendApp.use(views(config.viewsDir))
// backendApp.use(static(config.viewsDir))

// ssr
const LRU = require('lru-cache')
const { createBundleRenderer } = require('vue-server-renderer')
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      runInNewContext: false // 推荐
    })
  )
}
let renderer
if (isProd) {
  // 生产环境,从打包好的文件夹读取bundle和manifest
  const template = fs.readFileSync(resolve('dist/index.ssr.html'), 'utf-8')
  // ssr
  const serverBundle = require(resolve('dist/vue-ssr-server-bundle.json'))
  const clientManifest = require(resolve('dist/vue-ssr-client-manifest.json'))
  renderer = createRenderer(serverBundle, {
    template: template, // （可选）页面模板
    clientManifest: clientManifest // （可选）客户端构建 manifest
  })
} else {
  // 开发环境,从内存中读取bundle和manifest
  setUpDevServer(backendApp, uri, (bundle, options) => {
    try {
      renderer = createRenderer(bundle, options)
    } catch (e) {
      console.log('\nbundle error', e)
    }
  })
}
// 把renderData添加在app.context上
backendApp.context.renderData = function (ctx) {
  const context = {
    url: ctx.url,
    title: '首页 -xyy的小站', // 默认title
    author: 'xyy', // 默认author
    keywords: 'xyy', // 默认keywords
    description: 'xyy的blog', // 默认description
    cookies: ctx.request.headers.cookie
  }
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return reject(err)
      }
      resolve(html)
    })
  })
}

// Routes
backendApp.use(viewRouter.routes(), viewRouter.allowedMethods())
backendApp.use(publicRouter.routes(), publicRouter.allowedMethods())
backendApp.use(privateRouter.routes(), privateRouter.allowedMethods())

// Response
backendApp.use(responseHandler)

// 错误处理
backendApp.on('error', (err) => {
  console.error('Server error: \n%s\n%s ', err.stack || '')
})

backendApp.listen(serverPort)
console.log('[demo] start-quick is starting at ', uri)

// 前端Server
// const frontendApp = new Koa()
// const frontendRouter = new Router()
// frontendApp.use(serve(path.resolve(__dirname, '../dist')))
// frontendRouter.get('/index', (ctx, next) => {
//     let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
//     ctx.type = 'html'
//     ctx.status = 200
//     ctx.body = html
// })
// frontendApp
//     .use(frontendRouter.routes())
//     .use(frontendRouter.allowedMethods())
// frontendApp.listen(3001, () => {
//     console.log('浏览器端渲染地址： http://localhost:3001')
// })
