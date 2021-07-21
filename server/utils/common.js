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

// time为Date.now()
function reviseTime(time) {
  // new Data(str)会把时间转换为本地时间，虽然传入的time参数为UTC标准时间，但是在调用方法时，new Data
  // 应该在内部转换为了本地时间，一开始在time中加上了1000*60*60*8，小时数会比本地时间多了8小时。
  // 服务器若设置在国外，则应当换算时区
  const localStamp = time
  const localTime = new Date(localStamp)
  const year = localTime.getFullYear()
  const month = localTime.getMonth() + 1
  const day = localTime.getDate()
  const hours = localTime.getHours()
  let minutes = localTime.getMinutes()
  for (let i = 0; i < 9; i++) {
    if (i === minutes) {
      minutes = '0' + minutes
    }
  }
  const finTime = year + '年' + month + '月' + day + '日' + hours + '时' + minutes + '分'
  return finTime
}

module.exports = {
  deleteFolder,
  deleteFile,
  getIp,
  reviseTime
}
