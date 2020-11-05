const fs = require('fs')
const path = require('path')

/**
 * 绑定路由
 * @param {*} router 要绑定的路由
 * @param {*} mapping 要绑定的方法{路由path:方法,...}
 */
function addMapping(router, mapping) {
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4)
      router.get(path, mapping[url])
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
    } else if (url.startsWith('PUT ')) {
      let path = url.substring(4)
      router.put(path, mapping[url])
    } else if (url.startsWith('PATCH ')) {
      let path = url.substring(6)
      router.patch(path, mapping[url])
    } else if (url.startsWith('DELETE ')) {
      let path = url.substring(7)
      router.del(path, mapping[url])
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
function addControllers(router) {
  // console.log('addControllers')
  // 先导入fs模块，然后用readdirSync列出文件
  // 这里可以用sync是因为启动时只运行一次，不存在性能问题:
  // let files = fs.readdirSync(__dirname + `/${controllers_dir}`)
  let controllers_path = path.resolve(__dirname, '../api')
  // console.log(controllers_path)
  let files = fs.readdirSync(controllers_path)
  // 过滤出.js文件:
  let js_files = files.filter((f) => {
    return f.endsWith('.js')
  })

  // 处理每个js文件:
  for (let f of js_files) {
    // console.log(`process controller: ${f}...`)
    // 导入js文件
    let mapping = require(`${controllers_path}/` + f)
    addMapping(router, mapping)
  }
}

module.exports = function () {
  const router = require('koa-router')()
  addControllers(router)
  // return router.routes()
  return router
}