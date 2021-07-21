const fs = require('fs')
const path = require('path')

// 删除文件夹
function deleteFolder(url) {
  // 判断给定的路径是否存在
  if (fs.existsSync(url)) {
    // 返回文件和子目录的数组
    const files = fs.readdirSync(url)
    files.forEach(function (file) {
      const curPath = path.join(url, file)
      if (fs.statSync(curPath).isDirectory()) {
        // fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
        console.log('含有子文件夹', file)
        deleteFolder(curPath)
      } else {
        // 是文件delete file
        fs.unlinkSync(curPath)
      }
    })
    // 清除文件夹
    fs.rmdirSync(url)
  }
}

// 删除文件
function deleteFile(url) {
  // 判断给定的路径是否存在
  if (fs.existsSync(url)) {
    // 返回文件和子目录的数组
    const files = fs.readdirSync(url)
    files.forEach(function (file) {
      const curPath = path.join(url, file)
      if (fs.statSync(curPath).isDirectory()) {
        // fs.statSync同步读取文件夹文件，如果是文件夹，重复触发函数
        deleteFile(curPath)
      } else {
        // 是文件delete file
        fs.unlinkSync(curPath)
      }
    })
  }
}

// 获取ip
function getIp(req) {
  let ip = req.get('X-Real-IP') || req.get('X-Forwarded-For') || req.ip
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0]
  }
  return ip
}

module.exports = {
  deleteFolder,
  deleteFile,
  getIp
}
