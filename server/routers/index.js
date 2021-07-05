/**
 * 整合所有子路由
 */

const router = require('koa-router')()

// const api = require('./api')() // rest api
const api = require('../api/index') // rest api
const home = require('./home') // 客户端页面路由
const admin = require('./admin') // 管理端页面路由

// router.use('/api', api.routes(), api.allowedMethods())
// router.use('/', home.routes(), home.allowedMethods())
// router.use('/admin', admin.routes(), admin.allowedMethods())

router.use(api.routes(), api.allowedMethods())
router.use(home.routes(), home.allowedMethods())
router.use(admin.routes(), admin.allowedMethods())

module.exports = router
