const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

// const renderData = require('../server')
// router.get('/index', async (ctx, next) => {
//   await ctx.render('index.html')
//   next()
// })

// router.get('/login', async (ctx, next) => {
//   await ctx.render('login.html')
//   next()
// })

// 前端页面
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
    if (!ctx.renderData) {
      ctx.type = 'html'
      return (ctx.body = 'waiting for compilation... refresh in a moment.')
    }
    let html
    let status
    try {
      status = 200
      html = await ctx.renderData(ctx)
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

// 后台页面
router.get(['/admin', '/admin/*', '/login'], async (ctx) => {
  // const html = fs.readFileSync(path.join(__dirname, '../../dist-admin/index.html'), 'utf-8')
  const html = 'admin'
  ctx.body = html
})

module.exports = router
