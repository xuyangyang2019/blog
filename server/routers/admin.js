const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

// 管理端页面
router.get(['/admin', '/admin/*'], async (ctx) => {
  const html = fs.readFileSync(path.join(__dirname, '../../dist-admin/index.html'), 'utf-8')
  ctx.body = html
})

module.exports = router
