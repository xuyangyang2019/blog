const path = require('path')

// 日志根目录
const baseLogPath = path.resolve(__dirname, '../logs')

// log4js的输出级别6个: trace, debug, info, warn, error, fatal

// "type":"console"，即为控制台打印，多数用于开发测试。

// "type":"file"，表示日志输出为普通文件，在此种配置下日志会输出到目标文件夹的目标文件中，并会随着文件大小的变化自动份文件.。
// maxLogSize：只在type:file模式有效，表示文件多大时才会创建下一个文件（xxx.log.1之类）单位是字节，实际设置时具体的值根据业务来定,但是不推荐大于100Mb.。
// backups：只在type:file模式有效，表示备份的文件数量，如果文件过多则会将最旧的删除。

// "type":"dateFile"，表示是输出按时间分文件的日志，在此种配置下,日志会输出到目标目录下，并以时间格式命名，随着时间的推移，以时间格式命名的文件如果尚未存在，则自动创建新的文件.。
// pattern：只在type:dateFile模式有效，表示一个文件的时间命名模式，在生成文件中会依照pattern配置来在filename的文件结尾追加一个时间串来命名文件。
// alwaysIncludePattern：只在type:dateFile模式有效，这个配置为ture.即最终的日志路径文件名为filename+pattern

// categories 里面存着一个个的logger分类，就是log4js.getLogger(分类)，不啰嗦看下面代码

// 日志格式等设置
module.exports = {
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
}
