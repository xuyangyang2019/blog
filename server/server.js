const fs = require('fs')
const path = require('path')

// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')
// 日志中间件
const Koa_Logger = require('koa-logger')
const Moment = require("moment")
// 数据压缩
const KoaCompress = require('koa-compress')()
// 解析静态资源
const Koa_Static = require("koa-static")
// 解析POST请求
const bodyParser = require('koa-bodyparser')
// ajax 跨域问题
const jsonp = require('koa-jsonp')
// rest中间件
const rest = require('./middlewares/rest')
// koa 路由中间件
const Router = require('koa-router')
// 缓存
const LRU = require('lru-cache')
// ssr
const { createBundleRenderer } = require('vue-server-renderer')
// 开发环境配置
const setUpDevServer = require('../build/setup.dev.server.js')

// 获取本地ip
const currentIP = require('ip').address()
const appConfig = require('../app.config')
const uri = `http://${currentIP}:${appConfig.appPort}`
// 开发环境
const isProd = process.env.NODE_ENV === 'production'
// const resolve = file => path.resolve(__dirname, file)
function resolve(dir) {
    return path.resolve(process.cwd(), dir)
}
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

// // unjucks模板的reder方法添加到app.context上
// const templating = require('./middlewares/templating');
// // 把render添加在app.context上
// templating('views', {
//     noCache: !isProduction,
//     watch: !isProduction
// }, app)

// 后端Server
// 创建一个Koa对象表示web app本身:
const backendApp = new Koa()

// **************第一个middleware是记录URL以及页面执行时间********************
// generator中间件开发
// generator中间件在koa v2中需要用koa-convert封装一下才能使用
// const convert = require('koa-convert')
// const loggerGenerator  = require('./middlewares/logger-generator')
// app.use(convert(loggerGenerator()))
// async中间件开发
// const loggerAsync = require('./middlewares/logger-async')
// app.use(loggerAsync())
// app.use(logger())
backendApp.use(Koa_Logger((str) => {
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
}))

// gzip压缩
backendApp.use(KoaCompress)

// **************第二个middleware处理静态文件********************************
backendApp.use(Koa_Static(resolve('dist'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
backendApp.use(Koa_Static(resolve('dist-admin'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
backendApp.use(Koa_Static(resolve('public'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))

// 原生实现
// 生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。
// 而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
// if (!isProduction) {
//     let staticFiles = require('./middlewares/static-files');
//     app.use(staticFiles('/static/', __dirname + '/static'));
//     // app.use(staticFiles('/dist/', __dirname + '/dist'));
// }

// **************第三个middleware解析POST请求*******************************
// koa-bodyparser必须在router之前被注册到app对象上
// koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
// 使用ctx.body解析中间件
backendApp.use(bodyParser())

// **************第四个middleware加载引擎模板*******************************
// // 这里优化一下 在app的context添加render方法,这样不用每个请求都去调用
// // 加载Nunjucks模板引擎
// // 中间件的形式的形式,给ctx加上render()来使用Nunjucks
// app.use(
//     templating('views', {
//         noCache: !isProduction,
//         watch: !isProduction
//     })
// )

// **************rest中间件*************************************************
backendApp.use(rest.restify())

// **************ajax 跨域问题**********************************************
backendApp.use(jsonp())
// 原生方法
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

// **************最后一个middleware处理URL路由*******************************
/**
 * 自动扫描controllers文件夹中的js文件 
 * controllers中的js文件 导出模块方法{'GET /login':async (ctx,next)=>{},...}
 * 自动require js文件到 mapping = {'GET /login':async (ctx,next)=>{}}
 * 遍历每个mapping 自动添加router router.get(path, mapping[url])
 */
// 扫描注册Controller，并添加router:
// const routerApi = require('./middlewares/controller')(__dirname + '/controllers');
// backendApp.use(routerApi.routes()).use(routerApi.allowedMethods())

// 初始化路由中间件
const routers = require('./routers/index')
backendApp.use(routers.routes()).use(routers.allowedMethods())


function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        runInNewContext: false // 推荐
    }))
}
let renderer
if (isProd) {
    // 生产环境,从打包好的文件夹读取bundle和manifest
    const template = fs.readFileSync(resolve('dist/index.ssr.html'), 'utf-8')
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

const renderData = (ctx, renderer) => {
    const context = {
        url: ctx.url,
        title: '首页 -xyy的小站', // 默认title
        author: 'xyy', // 默认author
        keywords: 'xyy', // 默认keywords
        description: 'xyy的blog', //默认description 
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

// 实例化路由
const router = new Router()

//前端请求
router.get(["/", "/home", "/article", "/article/:articleList", "/article/:articleList/:id", "/life",
    "/life/:id", "/msgBoard", "/search/:searchKey", "/timeLine/:time", "/login_qq"], async (ctx, next) => {
        // const context = {
        //     title: 'mapBlog',
        //     url: req.url
        // }
        if (!renderer) {
            ctx.type = 'html'
            return ctx.body = 'waiting for compilation... refresh in a moment.'
        }
        // if (Object.keys(proxyConfig).findIndex(vl => ctx.url.startsWith(vl)) > -1) {
        //     return next()
        // }
        let html, status
        try {
            status = 200
            html = await renderData(ctx, renderer)
        } catch (e) {
            console.log('\ne', e)
            if (e.code === 404) {
                status = 404
                html = '404 | Not Found'
            } else {
                status = 500
                html = '500 | Internal Server Error'
            }
        }
        ctx.type = 'html'
        ctx.status = status ? status : ctx.status
        ctx.body = html
        // renderer.renderToString(context, (err, html) => {
        //     const { title, meta } = context.meta.inject()
        //     if (err) {
        //         res.status(500).end('Internal Server Error')
        //         return
        //     }
        //     html = html.replace(/<title.*?<\/title>/g, title.text())
        //     html = html.replace(/<meta\s+.*?name="description".*?>/g, meta.text())
        //     res.end(html)
        // })
    })

//后端请求
router.get(["/admin", "/admin/*", "/login"], async (ctx, next) => {
    let html = fs.readFileSync(path.join(__dirname, '../dist-admin/index.html'), 'utf-8')
    console.log(html)
    // ctx.response.body = html
    ctx.body = html
    // res.render("admin.html",{title: "登录"})
})

router.get('*', function (ctx, next) {
    // res.render('404.html', {
    //     title: 'No Found'
    // })
    ctx.response.body = '<h5>Index</h5>';
})

backendApp.use(router.routes())

// 错误处理
backendApp.on('error', (err) => {
    console.error('Server error: \n%s\n%s ', err.stack || '')
})


backendApp.listen(appConfig.appPort, () => {
    // console.log('服务器端渲染地址： http://localhost:3000')
    console.log(`\n> Starting server... ${uri} \n`)
})


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