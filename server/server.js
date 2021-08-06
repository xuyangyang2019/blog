// const fs = require('fs')
const path = require('path')
const Koa = require('koa') // 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示
const KoaCompress = require('koa-compress')() // 数据压缩
const KoaStatic = require('koa-static') // 解析静态资源
const koaBody = require('koa-body') // 解析POST请求
const cors = require('koa2-cors') // ajax 跨域问题

const logger = require('./middlewares/logger') // 日志中间件
const { logError } = require('./utils/log4js') // 保存错误日志
const errorHandler = require('./middlewares/error') // 错误处理 和 返回处理

const routers = require('./routers/index') // 路由
const restify = require('./middlewares/rest') // rest中间件
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

app.use(logger) // 自己写日志中间件

app.use(errorHandler) // Error Handler

app.use(KoaCompress) // gzip

app.use(koaBody()) // 解析post请求

// 处理静态文件
// 生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。
// 而在开发环境下，我们希望koa能顺带处理静态文件，
// 否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
if (!isProd) {
  // 原生的实现方式
  app.use(KoaStatic(resolve('public'), { index: false, maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
  app.use(KoaStatic(resolve('dist-admin'), { index: false, maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
}

// app.use(helmet()) // Helmet

// 处理跨域
app.use(
  cors({
    origin: function (ctx) {
      // 设置允许来自指定域名请求
      if (ctx.url === '/test') {
        return '*' // 允许来自所有域名请求
      }
      return 'http://182.92.221.114:3000' // 只允许http://localhost:8080这个域名的请求
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

app.use(restify()) // 给ctx添加一个rest()方法

app.use(routers.routes(), routers.allowedMethods()) // 路由拆分

// 错误处理
app.on('error', (err, ctx) => {
  logError(ctx, err)
  console.error('server error: \n%s\n%s ', err.stack || '')
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
