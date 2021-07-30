const router = require('koa-router')()

// router.get('/index', async (ctx, next) => {
//   await ctx.render('index.html')
//   next()
// })

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
    '/search',
    '/search/:searchKey',
    '/placeOnFile',
    '/placeOnFile/*',
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
module.exports = router
