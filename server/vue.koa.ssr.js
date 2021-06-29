/**
 * vue koa2 ssr中间件
 */

const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const isProd = process.env.NODE_ENV === 'production'
const setUpDevServer = require('../build/setup.dev.server.js')
const { createBundleRenderer } = require('vue-server-renderer')
// const proxyConfig = require('./../app.config').proxy

module.exports = function (app, uri) {
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

  function resolve(dir) {
    return path.resolve(process.cwd(), dir)
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
    setUpDevServer(app, uri, (bundle, options) => {
      try {
        renderer = createRenderer(bundle, options)
      } catch (e) {
        console.log('\nbundle error', e)
      }
    })
  }

  app.use(async (ctx, next) => {
    if (!renderer) {
      ctx.type = 'html'
      return (ctx.body = 'waiting for compilation... refresh in a moment.')
    }
    // if (Object.keys(proxyConfig).findIndex((vl) => ctx.url.startsWith(vl)) > -1) {
    //   return next()
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
    ctx.status = status || ctx.status
    ctx.body = html
  })
}
