/**
 * 整合所有子路由
 */

const router = require('koa-router')()
const publicApi = require('../api/public/index') // rest api
const priviteApi = require('../api/privite/index') // rest api
const home = require('./home') // 客户端页面路由
// const admin = require('./admin') // 管理端页面路由

// router.use('/api', api.routes(), api.allowedMethods())

router.use(publicApi.routes(), publicApi.allowedMethods())
router.use(priviteApi.routes(), priviteApi.allowedMethods())
router.use(home.routes(), home.allowedMethods())
// router.use(admin.routes(), admin.allowedMethods())

module.exports = router
