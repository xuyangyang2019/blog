// 扫描注册Controller
// 文件系统模块
const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

/**
 * 绑定路由
 * @param {*} router 要绑定的路由
 * @param {*} mapping 要绑定的方法{路由path:方法,...}
 */
function addMapping(router, mapping) {
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      const path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`register URL mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      const path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`register URL mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      const path = url.substring(4)
      router.put(path, mapping[url])
      console.log(`register URL mapping: PUT ${path}`)
    } else if (url.startsWith('PATCH ')) {
      const path = url.substring(6)
      router.patch(path, mapping[url])
    } else if (url.startsWith('DELETE ')) {
      const path = url.substring(7)
      router.del(path, mapping[url])
      console.log(`register URL mapping: DELETE ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

/**
 * 过滤js文件、导入js文件
 * @param {*} router 路由的实列
 * @param {*} controllers_dir js文件夹
 */
function addControllers(router, controllersPath) {
  // 先导入fs模块，然后用readdirSync列出文件
  // 这里可以用sync是因为启动时只运行一次，不存在性能问题:
  fs.readdirSync(controllersPath)
    .filter((f) => {
      return f.endsWith('.js')
    })
    .forEach((f) => {
      console.log(`process controller: ${f}...`)
      // eslint-disable-next-line global-require
      const mapping = require(`${controllersPath}/` + f)
      addMapping(router, mapping)
    })
}

module.exports = function (dirName = 'controllers') {
  // 如果不传参数，扫描目录默认为'controllers'
  const controllersPath = path.resolve(__dirname, `../${dirName}`)
  addControllers(router, controllersPath)
  return router.routes()
  //   return router
}
