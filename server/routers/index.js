/**
 * 整合所有子路由
 */

const router = require('koa-router')()

// const api = require('./api')
const home = require('./home')
const admin = require('./admin')

// router.use('/api', api.routes(), api.allowedMethods())
// router.use('/', home.routes(), home.allowedMethods())
// router.use('/admin', admin.routes(), admin.allowedMethods())

router.use(home.routes(), home.allowedMethods())
router.use(admin.routes(), admin.allowedMethods())
module.exports = router
