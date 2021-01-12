// mongodb
const db = require('../db/mongodb/db')

module.exports = {
  // 获取文章数量
  'GET /getCount': async (ctx, next) => {
    const publish = ctx.query.publish !== 'false'
    let num = 0
    // 首页请求
    if (!ctx.query.tag && !ctx.query.start && !ctx.query.key) {
      num = await db.article.count({ publish: publish }, (err, num) => {})
    }
    // 通过文章标签请求
    if (ctx.query.tag) {
      const tag = ctx.query.tag
      num = await db.article.count({ publish: publish, tag: tag }, (err, num) => {})
    }
    // 前台后台时间范围请求
    if (ctx.query.start) {
      const start = new Date(parseInt(ctx.query.start))
      const end = new Date(parseInt(ctx.query.end))
      num = await db.article.count({ publish: ctx.query.publish, date: { $gte: start, $lte: end } })
    }
    // 前台后台关键词搜索请求
    if (ctx.query.key) {
      num = await db.article.count({ publish: ctx.query.publish, title: { $regex: ctx.query.key, $options: 'i' } })
    }
    ctx.rest(num)
  },
  // 获取留言数量
  'GET /getMsgCount': async (ctx, next) => {
    const num = await db.msgBoard.count({}, (err, num) => {})
    ctx.rest(num)
  },
  // 获取评论数量
  'GET /getCommentsCount': async (ctx, next) => {
    const num = await db.comment.count({})
    ctx.rest(num)
  }
}
