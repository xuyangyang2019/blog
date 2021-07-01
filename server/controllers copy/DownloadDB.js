const fs = require('fs')
const path = require('path')
// const send = require('koa-send')
const download_confirmToken = require('../middlewares/download_confirmToken')

// 判断文件是否存在
function isFileExisted(filePath) {
  return new Promise(function (resolve, reject) {
    fs.access(filePath, (err) => {
      if (err) {
        reject(err.message)
      } else {
        resolve('existed')
      }
    })
  })
}

module.exports = {
  // 下载数据库备份文件
  'GET /api/downloadDb': async (ctx, next) => {
    console.log('下载数据库备份文件')
    // 验证token
    download_confirmToken(ctx, next)
    // 文件路径
    const fileName = 'admin.zip'
    const filePath = path.resolve(process.cwd(), `./server/dbBackUp/dbDownload/${fileName}`)
    // 判断文件是否存在
    const fileExisted = await isFileExisted(filePath)
    if (fileExisted === 'existed') {
      // 原生的下载方式
      const rs = fs.createReadStream(filePath)
      ctx.set('Content-disposition', 'attachment; filename=' + fileName)
      ctx.body = rs // koa做了针对stream类型的处理，详情可以看之前的koa篇
      return
      // // 设置实体头（表示消息体的附加信息的头字段）,提示浏览器以文件下载的方式打开
      // ctx.attachment(filePath)
      // await send(ctx, filePath)
      // // await send(ctx, fileName, { root: path.resolve(process.cwd(), './server/dbBackUp/dbDownload') })
      // // ctx.result = '200'
    } else {
      ctx.error = '文件不存在！'
      return next()
    }
  }
}
