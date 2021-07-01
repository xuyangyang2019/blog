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

const rest = require('./middlewares/rest') // rest中间件
const controller = require('./middlewares/controller')
const routers = require('./routers/index') // 路由
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

// View模板渲染
// app.use(views(config.viewsDir))
// app.use(static(config.viewsDir))

// vue ssr处理
const vueKoaSSR = require('./vue.koa.ssr')
vueKoaSSR(app, uri)

// // bind .rest() for ctx:
// app.use(rest.restify())

// // add controllers:
// app.use(controller())

// 初始化路由中间件
app.use(routers.routes(), routers.allowedMethods())

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
