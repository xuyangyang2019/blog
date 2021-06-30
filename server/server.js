const fs = require('fs')
const path = require('path')
const Koa = require('koa') // 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示
const Koa_Logger = require('koa-logger') // 日志中间件
const Moment = require('moment') // 日期工具
// const { loggerMiddleware } = require('./middlewares/logger')
const KoaCompress = require('koa-compress')() // 数据压缩
const Koa_Static = require('koa-static') // 解析静态资源
const koaBody = require('koa-body') // 解析POST请求
const cors = require('koa2-cors') // ajax 跨域问题
// const rest = require('./middlewares/rest') // rest中间件
const { errorHandler, responseHandler } = require('./middlewares/response') // 错误处理 和 返回处理
const isProd = process.env.NODE_ENV === 'production' // 开发环境
// 获取本地ip
const { serverPort } = require('./config')
const currentIP = require('ip').address()
const uri = `http://${currentIP}:${serverPort}`

function resolve(dir) {
  return path.resolve(process.cwd(), dir)
}

// =================== 后端Server ===================

// 创建一个Koa对象表示web app本身:
const app = new Koa()

// Logger
app.use(
  Koa_Logger((str) => {
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
  })
) // 使用koa-logger
// app.use(loggerMiddleware) // 自己写日志中间件

// Error Handler
app.use(errorHandler)

// gzip
app.use(KoaCompress)

// 解析post请求
app.use(koaBody())

// 处理静态文件
// 生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。
// 而在开发环境下，我们希望koa能顺带处理静态文件，
// 否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
if (!isProd) {
  // 原生的实现方式
  // let staticFiles = require('./middlewares/static-files');
  // app.use(staticFiles('/static/', __dirname + '/static'));
  // app.use(staticFiles('/dist/', __dirname + '/dist'));
  app.use(Koa_Static(resolve('public'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
}

// // Helmet
// app.use(helmet())

// // rest
// app.use(rest.restify())

// 处理跨域
app.use(
  cors({
    origin: function (ctx) {
      // 设置允许来自指定域名请求
      if (ctx.url === '/test') {
        return '*' // 允许来自所有域名请求
      }
      return 'http://www.xyy.life' // 只允许http://localhost:8080这个域名的请求
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], // 设置获取其他自定义字段
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: true, // 是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // 设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'] // 设置服务器支持的所有头信息字段
  })
)

// // View
// app.use(views(config.viewsDir))
// app.use(static(config.viewsDir))

// api请求

// vue ssr处理
// const vueKoaSSR = require('./vue.koa.ssr')
// vueKoaSSR(app, uri)
const LRU = require('lru-cache')
const setUpDevServer = require('../build/setup.dev.server.js')
const { createBundleRenderer } = require('vue-server-renderer')
const renderData = (ctx, renderer) => {
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
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      runInNewContext: false
    })
  )
}
let renderer
if (isProd) {
  // 生产环境,从打包好的文件夹读取bundle和manifest
  const template = fs.readFileSync(resolve('dist/index.ssr.html'), 'utf-8')
  // eslint-disable-next-line global-require
  const serverBundle = require(resolve('dist/vue-ssr-server-bundle.json'))
  // eslint-disable-next-line global-require
  const clientManifest = require(resolve('dist/vue-ssr-client-manifest.json'))
  renderer = createRenderer(serverBundle, {
    template: template, // （可选）页面模板
    clientManifest: clientManifest // （可选）客户端构建 manifest
  })
} else {
  // 开发环境,从内存中读取bundle和manifest
  setUpDevServer(app, uri, (bundle, options) => {
    try {
      renderer = createRenderer(bundle, options)
    } catch (e) {
      console.log('\nbundle error', e)
    }
  })
}

const router = require('koa-router')()
// 客户端页面
router.get(
  [
    '/',
    '/home',
    '/article',
    '/article/:tag',
    '/article/:tag/:id',
    '/life',
    '/life/:id',
    '/msgBoard',
    '/search/:searchKey',
    '/placeOnFile/:time',
    '/login_qq'
  ],
  async (ctx) => {
    // console.log('前端页面')
    if (!renderer) {
      ctx.type = 'html'
      return (ctx.body = 'waiting for compilation... refresh in a moment.')
    }
    let html
    let status
    try {
      status = 200
      html = await renderData(ctx, renderer)
    } catch (e) {
      if (e.code === 404) {
        status = 404
        html = '404 | Not Found'
      } else {
        status = 500
        html = '500 | Internal Server Error'
      }
    }
    ctx.type = 'html'
    ctx.status = status || ctx.status
    ctx.body = html
  }
)
// 管理端页面
router.get(['/admin', '/admin/*', '/login'], async (ctx) => {
  // const html = fs.readFileSync(path.join(__dirname, '../../dist-admin/index.html'), 'utf-8')
  const html = 'admin'
  ctx.body = html
})
app.use(router.routes(), router.allowedMethods())

// // 如果路由要拆分home 需要把renderData添加在app.context上
// app.context.renderData = function (ctx) {
//   const context = {
//     url: ctx.url,
//     title: '首页 -xyy的小站', // 默认title
//     author: 'xyy', // 默认author
//     keywords: 'xyy', // 默认keywords
//     description: 'xyy的blog', // 默认description
//     cookies: ctx.request.headers.cookie
//   }
//   return new Promise((resolve, reject) => {
//     renderer.renderToString(context, (err, html) => {
//       if (err) {
//         return reject(err)
//       }
//       resolve(html)
//     })
//   })
// }
// const routers = require('./routers/index')
// // 初始化路由中间件
// app.use(routers.routes(), routers.allowedMethods())

// Response
// app.use(responseHandler)

// 错误处理
app.on('error', (err) => {
  console.error('没有处理的错误: \n%s\n%s ', err.stack || '')
})

app.listen(serverPort)
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
