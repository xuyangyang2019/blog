const path = require('path')
const currentIP = require('ip').address()

module.exports = {
  devHost: 'localhost', // 开发时的host
  prodHost: '', // 线上的host
  defaultHost: currentIP, // 默认的host
  serverPort: 3000, // 服务器端口
  mongoDB: {
    host: '127.0.0.1',
    port: 27017,
    user: 'xyy',
    pwd: '123456',
    db: 'blog',
    authSource: 'admin'
  }, // mongodb配置文件
  // =====================================
  tokenConfig: {
    secret: 'havana',
    expired: 60 * 60 * 24 // 1h
  },
  publicDir: path.resolve(__dirname, './public'),
  // viewsDir: path.resolve(__dirname, './views'),
  logPath: path.resolve(__dirname, './logs/koa-server')
}
