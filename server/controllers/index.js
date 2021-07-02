module.exports = {
  'GET /admin/*': async (ctx, next) => {
    ctx.render('index.html')
  },
  'GET /': async (ctx, next) => {
    ctx.render('index.html')
  }
}
