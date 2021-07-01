// 修改密码
const md5 = require('md5')
const UserService = require('../../services').UserService
const { InvalidQueryError } = require('../../lib/error')
// 拷贝数据
const fs = require('fs')
const util = require('util')
const path = require('path')
const archiver = require('archiver')
const { deleteFile, deleteFolder } = require('../../utils/deleteFile')
const exec = util.promisify(require('child_process').exec)

module.exports = {
  // 修改密码
  'PATCH /api/reviseKey': async (ctx, next) => {
    const { oldKey, newKey } = ctx.request.body
    // 参数不对抛出异常
    if (!oldKey || !oldKey) {
      throw new InvalidQueryError()
    }
    const user = await UserService.findOne({ username: 'admin' })
    if (!user) {
      ctx.error = '用户不存在'
    } else {
      const oldPwd = md5(oldKey + user.salt)
      const newPwd = md5(newKey + user.salt)
      if (user.password !== oldPwd) {
        ctx.error = '原密码错误'
      } else {
        const result = await UserService.update({ username: 'admin' }, { password: newPwd }, {})
        if (!result) {
          ctx.error = '更新密码失败！'
          // ctx.code = 'update-password-fail'
        } else {
          ctx.result = result
        }
      }
    }
    return next()
  },
  // 拷贝数据
  'GET /api/copyData': async (ctx, next) => {
    // 删除旧的备份文件
    deleteFolder(path.join(__dirname, '../../dbBackUp/dbCopy/admin'))
    // 删除旧的zip
    deleteFile(path.join(__dirname, '../../dbBackUp/dbDownload'))
    // 数据备份到那个目录
    const dbOutPath = path.resolve(process.cwd(), './server/dbBackUp/dbCopy')
    // 备份指定数据库的集合 -d admin
    const cmdOne = 'D:/mongodb/bin/mongodump -h 127.0.0.1:27017 -u xuyy -p 1234509876 -d admin -o ' + dbOutPath
    // 备份所有MongoDB数据
    // const cmdAll = 'D:/mongodb/bin/mongodump -h 127.0.0.1:27017 -u xuyy -p 1234509876 -o ' + dbOutPath
    // 执行备份脚本
    try {
      // const { stdout, stderr } = await exec(cmdOne)
      // console.log('stdout:', stdout)
      // console.error('stderr:', stderr)
      // 执行备份命令
      await exec(cmdOne)
      // 压缩备份后的文件夹的路径
      const output = fs.createWriteStream(path.join(__dirname, '../../dbBackUp/dbDownload/admin.zip'))
      const archive = archiver('zip', {
        // Sets the compression level.
        zlib: { level: 9 }
      })
      archive.pipe(output)
      // 压缩包里添加文件夹
      archive.directory(path.join(__dirname, '../../dbBackUp/dbCopy/admin'), '/admin')
      await archive.finalize()
      ctx.result = '数据库备份成功'
    } catch (error) {
      ctx.error = error
    }
    return next()
  }
}
