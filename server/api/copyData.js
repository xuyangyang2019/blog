const fs = require("fs")
const path = require("path")
// const child_process = require('child_process')
const archiver = require("archiver")
const deleteF = require("../utils/deleteF")
const confirmToken = require("../middlewares/confirmToken")

module.exports = {
  // 修改密码
  'GET /copyData': async (ctx, next) => {
    confirmToken(ctx, next)
    // 删除旧的zip
    deleteF.file(path.join(__dirname, "../dbBackUp/dbDownload"))
    // 删除旧的备份文件
    deleteF.folder(path.join(__dirname, "../dbBackUp/dbCopy/admin"))
    // 数据备份到那个目录
    let dbOutPath = path.resolve(process.cwd(), './server/dbBackUp/dbCopy')
    // 备份指定数据库的集合 -d admin
    let cmdOne = "D:/mongodb/bin/mongodump -h 127.0.0.1:27017 -u xuyy -p 1234509876 -d admin -o " + dbOutPath
    // 备份所有MongoDB数据
    let cmdAll = "D:/mongodb/bin/mongodump -h 127.0.0.1:27017 -u xuyy -p 1234509876 -o " + dbOutPath
    // 执行备份脚本
    const util = require('util')
    const exec = util.promisify(require('child_process').exec)
    try {
      const { stdout, stderr } = await exec(cmdOne)
      // console.log('stdout:', stdout)
      // console.error('stderr:', stderr)
      // 压缩备份后的文件夹的路径
      let output = fs.createWriteStream(path.join(__dirname, '../dbBackUp/dbDownload/admin.zip'))
      const archive = archiver('zip', {
        // Sets the compression level.
        zlib: { level: 9 }
      })
      archive.pipe(output)
      // 压缩包里添加文件夹
      archive.directory(path.join(__dirname, '../dbBackUp/dbCopy/admin'), "/admin")
      await archive.finalize()
      ctx.body = { code: 200 }
    } catch (error) {
      console.log(error)
      ctx.body = { code: 500 }
    }
    // child_process.exec(cmdOne, (err, stdout, stderr) => {
    //   if (err !== null) {
    //     console.log('err', err)
    //     throw err
    //   } else {
    //     console.log('stdout', stdout)
    //     console.log('stderr', stderr)
    //     ctx.body = { code: 200 }
    //   }
    // })
  }
}