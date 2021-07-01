/**
 * vue koa2 ssr中间件
 */

const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const isProd = process.env.NODE_ENV === 'production'
const setUpDevServer = require('../build/setup.dev.server.js')
const { createBundleRenderer } = require('vue-server-renderer')

module.exports = function (app, uri) {
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

  // 如果路由要拆分home 需要把renderData添加在app.context上
  app.context.renderData = function (ctx) {
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
}
