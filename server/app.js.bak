const fs = require('fs');
const path = require('path')

// 文件上传
const { uploadFile } = require('./utils/upload')
const { uploadAsync } = require('./utils/uploadAsync')

// 判断当前环境是否是production环境 production development
const config = require('./config')
const isProduction = config.mode === 'prod';
// console.log(process.env.NODE_ENV)

// 创建app实例
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 日志中间件
const logger = require('koa-logger')


// 创建一个Koa对象表示web app本身:
const app = new Koa();

// /**
//  * 用Promise封装异步读取文件方法
//  * @param  {string} page html文件名称
//  * @return {promise}      
//  */
// function render(page) {
//     return new Promise((resolve, reject) => {
//         let viewUrl = `./views/${page}`
//         fs.readFile(viewUrl, "binary", (err, data) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data)
//             }
//         })
//     })
// }

// unjucks模板的reder方法添加到app.context上
const templating = require('./middlewares/templating');
// 把render添加在app.context上
templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}, app)

// **************第一个middleware是记录URL以及页面执行时间********************
// generator中间件开发
// generator中间件在koa v2中需要用koa-convert封装一下才能使用
// const convert = require('koa-convert')
// const loggerGenerator  = require('./middlewares/logger-generator')
// app.use(convert(loggerGenerator()))

// async中间件开发
// const loggerAsync = require('./middlewares/logger-async')
// app.use(loggerAsync())

app.use(logger())

// ************************************************************************


// **************第二个middleware处理静态文件********************************
// // koa-static中间件使用 有问题暂时不用
// const static = require('koa-static')
// // 静态资源目录对于相对入口文件index.js的路径
// const staticPath = './static'
// app.use(static(
//     path.join(__dirname, staticPath)
// ))

// 原生实现
// 生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。
// 而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
if (!isProduction) {
    let staticFiles = require('./middlewares/static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
    // app.use(staticFiles('/dist/', __dirname + '/dist'));
}
// ************************************************************************


// **************第三个middleware解析POST请求*******************************
// koa-bodyparser必须在router之前被注册到app对象上
// koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
const bodyParser = require('koa-bodyparser');
// 使用ctx.body解析中间件
app.use(bodyParser())
// ************************************************************************


// **************第四个middleware加载引擎模板*******************************
// // 加载ejs模板引擎
// const view = require('koa-views')
// app.use(view(path.join(__dirname, './views'), {
//     extension: 'ejs'
// }))
// app.use(async (ctx) => {
//     let title = 'hello koa2'
//     await ctx.render('index', {
//         title,
//     })
// })

// // 这里优化一下 在app的context添加render方法,这样不用每个请求都去调用
// // 加载Nunjucks模板引擎
// // 中间件的形式的形式,给ctx加上render()来使用Nunjucks
// app.use(
//     templating('views', {
//         noCache: !isProduction,
//         watch: !isProduction
//     })
// )
// ************************************************************************

// **************rest中间件*************************************************
// rest中间件
const rest = require('./middlewares/rest');
app.use(rest.restify());

// 返回封装
// app.use(require('./server/middlewares/return'))
// app.use(proxy(app))

// ************************************************************************

// **************ajax 跨域问题**********************************************
// jsonp
const jsonp = require('koa-jsonp')
// 使用中间件
app.use(jsonp())
// app.use(async (ctx, next) => {
//     // 如果jsonp 的请求为GET
//     if (ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {
//         // // 获取jsonp的callback
//         // let callbackName = ctx.query.callback || 'callback'
//         // let returnData = {
//         //     success: true,
//         //     data: {
//         //         text: 'this is a jsonp api',
//         //         time: new Date().getTime(),
//         //     }
//         // }
//         // // jsonp的script字符串
//         // let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`
//         // // 用text/javascript，让请求支持跨域获取
//         // ctx.type = 'text/javascript'
//         // // 输出jsonp字符串
//         // ctx.body = jsonpStr
//         let returnData = {
//             success: true,
//             data: {
//                 text: 'this is a jsonp api',
//                 time: new Date().getTime(),
//             }
//         }
//         // 直接输出JSON
//         ctx.body = returnData
//     } else {
//         // ctx.body = 'hello jsonp'
//         await next()
//     }
// })
// ************************************************************************


// **************最后一个middleware处理URL路由*******************************
// 初始化路由中间件
// const routers = require('./routers/index')
// app.use(routers.routes()).use(routers.allowedMethods())

/**
 * 自动扫描controllers文件夹中的js文件 
 * controllers中的js文件 导出模块方法{'GET /login':async (ctx,next)=>{},...}
 * 自动require js文件到 mapping = {'GET /login':async (ctx,next)=>{}}
 * 遍历每个mapping 自动添加router router.get(path, mapping[url])
 */
// 扫描注册Controller，并添加router:
const router = require('./middlewares/controller')(__dirname + '/controllers');
app.use(router.routes()).use(router.allowedMethods())

// app.use(controller.generateRouter(path.join(__dirname, 'server/controllers')))
// app.use(controller.allowedMethods())
// ************************************************************************


// =========================================================
// vue-cli用到 所有的请求都指向index.html
// router.get(/^\/[^\.]*$/, async (ctx, next) => {
//     let path = __dirname + '/static/index2.html'
//     // 构造解析 异步读取
//     const { status, body } = await read(path);
//     // 同步读取
//     // body = fs.readFileSync(path, 'utf-8');
//     ctx.state = status;
//     ctx.type = 'text/html';
//     ctx.body = body;
// });

// // add router middlewares:
// app.use(router.routes());


// =========================================================

// const websocket = req
// const websocketServer = require('./websocket/websocketServer'); 
// let parseUser = websocketServer.parseUser
// let createWebSocketServer = websocketServer.createWebSocketServer
// parse user from cookie:
// app.use(async (ctx, next) => {
//     console.log('parse user from cookie')
//     ctx.state.user = parseUser(ctx.cookies.get('name') || '');
//     await next();
// });

// ================websocket=========================

// let server = app.listen(3000);
// app.wss = createWebSocketServer(server);

module.exports = app;