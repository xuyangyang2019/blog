const fs = require("fs")
const path = require("path")
const pro = require('child_process')
const archiver = require("archiver")
const deleteF = require("../utils/deleteF")
const confirmToken = require("../middlewares/confirmToken")

module.exports = {
  // 修改密码
  'GET /copyData': async (ctx, next) => {
    confirmToken(ctx, next)
    // 下次备份前删除旧的备份文件
    deleteF.file(path.join(__dirname, "../db/copyDownload"))
    deleteF.folder(path.join(__dirname, "../db/dbData/blog"))

    console.log('开始备份数据')
    console.log("D:/mongodb/bin/mongodump -h 127.0.0.1:27017 -u username -p password -d blog -o " + path.join(__dirname, '../db/dbData'))
    pro.exec(
      "D:/mongodb/bin/mongodump -h 127.0.0.1:27017 -u xuyy -p 1234509876 -d admin -o " + path.join(__dirname, '../db/dbData'),
      (err, stdout, stderr) => {
        if (err !== null) {
          console.log(err)
          // res.status(500).end()
        } else {
          // 压缩备份后的文件夹
          let archive = archiver('zip')
          let output = fs.createWriteStream(path.join(__dirname, '../db/copyDownload/dbCopy.zip'))
          archive.pipe(output)
          // 第二个参数是压缩包内的层级目录
          archive.directory(path.join(__dirname, '../db/dbData/blog'), "/dbCopy")
          archive.finalize()
          ctx.body = { code: 200 }
        }
      })
  }
}