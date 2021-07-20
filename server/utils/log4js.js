const path = require('path')
const log4js = require('log4js')

const baseLogPath = path.resolve(__dirname, '../../logs') // 日志根目录

// log4js的输出级别6个: trace, debug, info, warn, error, fatal

// "type":"console"，即为控制台打印，多数用于开发测试。

// "type":"file"，表示日志输出为普通文件，在此种配置下日志会输出到目标文件夹的目标文件中，并会随着文件大小的变化自动份文件.。
// maxLogSize：只在type:file模式有效，表示文件多大时才会创建下一个文件（xxx.log.1之类）单位是字节，实际设置时具体的值根据业务来定,但是不推荐大于100Mb.。
// backups：只在type:file模式有效，表示备份的文件数量，如果文件过多则会将最旧的删除。

// "type":"dateFile"，表示是输出按时间分文件的日志，在此种配置下,日志会输出到目标目录下，并以时间格式命名，随着时间的推移，以时间格式命名的文件如果尚未存在，则自动创建新的文件.。
// pattern：只在type:dateFile模式有效，表示一个文件的时间命名模式，在生成文件中会依照pattern配置来在filename的文件结尾追加一个时间串来命名文件。
// alwaysIncludePattern：只在type:dateFile模式有效，这个配置为ture.即最终的日志路径文件名为filename+pattern

// categories 里面存着一个个的logger分类，就是log4js.getLogger(分类)，不啰嗦看下面代码

// 加载配置文件
log4js.configure({
  // 日志输出方式
  appenders: {
    // 设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
    out: { type: 'console' },
    // 请求数据得到响应时输出响应日志
    httpLogger: {
      type: 'dateFile',
      filename: `${baseLogPath}/response/response`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
      // encoding: 'utf-8'
    },
    // 操作数据库进行增删改等敏感操作记录日志
    handleLogger: {
      type: 'dateFile',
      filename: `${baseLogPath}/handle/handle`,
      pattern: 'yyyy-MM-dd.log', // yyyy-MM-dd-hh.log
      alwaysIncludePattern: true
    },
    // 错误日志
    errorLogger: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/error`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  // logger分类，如log4js.getLogger('default')
  categories: {
    default: { appenders: ['out'], level: 'all' },
    httpLogger: { appenders: ['httpLogger'], level: 'info' },
    handleLogger: { appenders: ['handleLogger'], level: 'all' },
    errorLogger: { appenders: ['errorLogger'], level: 'error' }
  }
})

// 调用预先定义的日志名称
const logger = log4js.getLogger('default')
const httpLogger = log4js.getLogger('httpLogger')
const errorLogger = log4js.getLogger('errorLogger')
const handleLogger = log4js.getLogger('handleLogger')

// 格式化日志文本 加上日志头尾和换行方便查看 ==>  普通日志、请求日志、响应日志、操作日志、错误日志
const formatText = {
  request: function (req, resTime) {
    let logText = ''
    const method = req.method
    // 访问方法
    logText += 'request method: ' + method + '\n'
    // 请求原始地址
    logText += 'request originalUrl:  ' + req.originalUrl + '\n'
    // 客户端ip
    logText += 'request client ip:  ' + req.ip + '\n'
    // 请求参数
    if (method === 'GET') {
      logText += 'request query:  ' + JSON.stringify(req.query) + '\n'
      // startTime = req.query.requestStartTime;
    } else {
      logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n'
      // startTime = req.body.requestStartTime;
    }
    // 服务器响应时间
    logText += 'response time: ' + resTime + '\n'
    return logText
  },
  response: function (ctx, resTime) {
    let logText = ''
    // 响应日志开始
    logText += '\n' + '*************** response log start ***************' + '\n'
    // 添加请求日志
    logText += formatText.request(ctx.request, resTime)
    // 响应状态码
    logText += 'response status: ' + ctx.status + '\n'
    // 响应内容
    logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n'
    // 响应日志结束
    logText += '*************** response log end ***************' + '\n'
    return logText
  },
  handle: function (info) {
    let logText = ''
    // 响应日志开始
    logText += '\n' + '***************info log start ***************' + '\n'
    // 响应内容
    logText += 'handle info detail: ' + '\n' + JSON.stringify(info).replace(/\\n/g, '\n') + '\n'
    // 响应日志结束
    logText += '*************** info log end ***************' + '\n'
    return logText
  },
  error: function (ctx, err, resTime) {
    let logText = ''
    // 错误信息开始
    logText += '\n' + '*************** error log start ***************' + '\n'
    // 添加请求日志
    logText += formatText.request(ctx.request, resTime)
    // 错误名称
    logText += 'err name: ' + err.name + '\n'
    // 错误信息
    logText += 'err message: ' + err.message + '\n'
    // 错误详情
    logText += 'err stack: ' + err.stack + '\n'
    // 错误信息结束
    logText += '*************** error log end ***************' + '\n'
    return logText
  }
}

module.exports = {
  // 封装普通日志
  logInfo: function (info) {
    if (info) {
      logger.info(info)
    }
  },
  // 封装响应日志
  logResponse: function (ctx, resTime) {
    if (ctx) {
      httpLogger.info(formatText.response(ctx, resTime))
    }
  },
  // 封装操作日志
  logHandle: function (res) {
    if (res) {
      handleLogger.info(formatText.handle(res))
    }
  },
  // 封装错误日志
  logError: function (ctx, error, resTime) {
    if (ctx && error) {
      errorLogger.error(formatText.error(ctx, error, resTime))
    }
  }
}
