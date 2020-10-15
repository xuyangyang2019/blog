module.exports = {
  'GET /admin': async (ctx, next) => {
    // ctx.render('admin.html', {
    //   title: 'koa2-unjucks-demo-admin'
    // })
    ctx.body = 'admin'
  }
};
