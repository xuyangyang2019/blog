const fs = require('fs')
const router = require('koa-router')()
const confirmToken = require('../../middlewares/confirmToken')

// 扫描当前文件夹下所有的js文件,除了index.js
const files = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js') && file !== 'index.js')

files.forEach((file) => {
  // eslint-disable-next-line global-require
  const mapping = require(`./${file}`)
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      const path = url.substring(4)
      router.get(path, confirmToken, mapping[url])
    } else if (url.startsWith('POST ')) {
      const path = url.substring(5)
      router.post(path, confirmToken, mapping[url])
    } else if (url.startsWith('PUT ')) {
      const path = url.substring(4)
      router.put(path, confirmToken, mapping[url])
    } else if (url.startsWith('PATCH ')) {
      const path = url.substring(6)
      router.patch(path, confirmToken, mapping[url])
    } else if (url.startsWith('DELETE ')) {
      const path = url.substring(7)
      router.del(path, confirmToken, mapping[url])
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
})

module.exports = router
