const fs = require('fs')
const path = require('path')
const send = require('koa-send')

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
  'GET /downloadDb': async (ctx, next) => {
    download_confirmToken(ctx, next)
    const fileName = 'admin.zip'
    const filePath = path.resolve(process.cwd(), './server/dbBackUp/dbDownload/admin.zip')
    // 判断文件是否存在
    const fileExisted = await isFileExisted(filePath)
    if (fileExisted === 'existed') {
      // 设置实体头（表示消息体的附加信息的头字段）,提示浏览器以文件下载的方式打开
      // 也可以直接设置 ctx.set("Content-disposition", "attachment; filename=" + fileName)
      ctx.attachment(filePath)
      await send(ctx, fileName, { root: path.resolve(process.cwd(), './server/dbBackUp/dbDownload') })
    } else {
      ctx.body = 'file not exist!'
    }
  }
}
