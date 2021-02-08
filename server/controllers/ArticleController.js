const ArticleService = require('../services').ArticleService
const { InvalidQueryError } = require('../lib/error')

module.exports = {
  // 获取标签
  'GET /api/tags': async (ctx, next) => {
    const publish = !!ctx.query.publish
    const tagArr = []
    const tagMap = {}
    const docs = await ArticleService.findMany({ publish: publish }, { tag: 1, _id: 0 })
    // 计算标签的文章数
    docs.forEach((doc) => {
      for (const tag of doc.tag) {
        tagMap[tag] = tagMap[tag] ? tagMap[tag] + 1 : 1
      }
    })
    for (const key in tagMap) {
      if (Object.hasOwnProperty.call(tagMap, key)) {
        tagArr.push({
          tag: key,
          num: tagMap[key]
        })
      }
    }
    ctx.result = tagArr
    return next()
  },
  // 分页查询文章列表
  'GET /api/getArticleList': async (ctx, next) => {
    const { pageNum, pageSize, publish, tag } = ctx.request.query
    const condition = {}
    if (publish) {
      condition.publish = publish
    }
    if (tag) {
      condition.tag = tag
    }
    const result = await ArticleService.findByPage(condition, pageNum, pageSize)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 获取推荐文章
  'GET /api/getArticlesByPv': async (ctx, next) => {
    const result = await ArticleService.getArticlesByPv()
    if (!result) {
      ctx.error = '文章不存在'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 文章归档
  'GET /api/getArticlesByTime': async (ctx, next) => {
    const publish = !!ctx.query.publish
    const timeArr = []
    const timeMap = {}
    const docs = await ArticleService.findMany({ publish: publish }, { date: 1 })
    if (!docs) {
      ctx.error = '查询出错'
    } else {
      docs.forEach((item) => {
        const yearMonth = new Date(item.date).getFullYear() + '年' + (new Date(item.date).getMonth() + 1) + '月'
        timeMap[yearMonth] = timeMap[yearMonth] ? timeMap[yearMonth] + 1 : 1
      })
      for (const key in timeMap) {
        if (Object.hasOwnProperty.call(timeMap, key)) {
          timeArr.push({
            time: key,
            num: timeMap[key]
          })
        }
      }
      ctx.result = timeArr
    }
    return next()
  },
  // 获取文章数量 暂时不用
  'GET /api/getArticlesCount': async (ctx, next) => {
    const publish = !!ctx.query.publish
    let result = {}
    // 首页请求
    if (!ctx.query.tag && !ctx.query.start && !ctx.query.key) {
      result = await ArticleService.count({ publish: publish })
    }
    // 通过文章标签请求
    if (ctx.query.tag) {
      const tag = ctx.query.tag
      result = await ArticleService.count({ publish: publish, tag: tag })
    }
    // 前台后台时间范围请求
    if (ctx.query.start) {
      const start = new Date(parseInt(ctx.query.start, 10))
      const end = new Date(parseInt(ctx.query.end, 10))
      result = await ArticleService.count({ publish: ctx.query.publish, date: { $gte: start, $lte: end } })
    }
    // 前台后台关键词搜索请求
    if (ctx.query.key) {
      await ArticleService.count({
        publish: ctx.query.publish,
        title: { $regex: ctx.query.key, $options: 'i' }
      })
    }
    ctx.result = result
    return next()
  },
  // 抓取单一文章
  'GET /api/getArticle': async (ctx, next) => {
    const { id } = ctx.request.query
    if (!id) {
      throw new InvalidQueryError()
    }
    const doc = await ArticleService.findById({ _id: id })
    if (doc) {
      ctx.result = doc
      // 更新文章的点击数
      ArticleService.updateById({ _id: id }, { $inc: { pv: 1 } })
      // 查询ip 并提醒后台
      // api.get("http://ip.taobao.com/service/getIpInfo.php", { ip: getIp(ctx.request) }).then((res) => {
      //     console.log(res)
      //     // new db.newMsg({
      //     //     type: "pv",
      //     //     content: data.data.city + "网友 在" + localTime(Date.now()) + "浏览了你的文章--" + doc[0].title
      //     // }).save()
      // })
    } else {
      ctx.error = '查不到文章'
    }
    return next()
  },
  // 更新文章的喜欢字段
  'PATCH /api/likeArticle': async (ctx, next) => {
    const { id, number, title } = ctx.request.body
    const result = await ArticleService.update({ _id: id }, { $inc: { likeNum: number } })
    if (result) {
      ctx.result = result
      // api.get("http://ip.taobao.com/service/getIpInfo.php", { ip: getIp(ctx) }).then((data) => {
      //     // 将点赞加入到新消息
      //     if (ctx.body.num === "1") {
      //         new db.newMsg({
      //             ip: getIp(ctx),
      //             type: "like",
      //             title: ctx.body.title,
      //             content: data.data.city + "网友 在" + localTime(Date.now()) + "赞了你的文章--" + ctx.body.title
      //         }).save()
      //     } else {
      //         //取消赞则将新消息移除
      //         db.newMsg.remove({ type: "like", ip: getIp(ctx), title: ctx.body.title }, (err) => {
      //             if (err) {
      //                 res.status(500).end()
      //             }
      //         })
      //     }
      // })
    } else {
      ctx.error = '点赞失败'
    }
    return next()
  },
  // 前台搜索文章
  'GET /api/searchArticle': async (ctx, next) => {
    const { publish, keyword, startTime, endTime, pageNum, pageSize } = ctx.request.query
    const condition = { publish: publish }
    if (keyword) {
      condition.title = { $regex: keyword, $options: 'i' }
    }
    if (startTime && endTime) {
      const start = new Date(parseInt(startTime, 10))
      const end = new Date(parseInt(endTime, 10))
      condition.date = { $gte: start, $lte: end }
    }
    const docs = await ArticleService.findManyByPage(condition, { content: 0 }, pageNum, pageSize)
    if (docs) {
      ctx.result = docs
    } else {
      ctx.error = '搜索文章出错！'
    }
    return next()
  },
  // 获得上一篇文章和下一篇文章
  'GET /api/preAndNext': async (ctx, next) => {
    const result = {}
    const date = ctx.query.date
    const fields = { _id: 1, title: 1, tag: 1 }
    // pre使用倒序查询，否则只会显示第一条数据，因为他是最早的
    const preArticle = await ArticleService.findOne({ publish: true, date: { $lt: date } }, fields, { _id: -1 }, 1)
    if (preArticle) {
      result.pre = preArticle
    }
    const nextArticle = await ArticleService.findOne({ publish: true, date: { $gt: date } }, fields, { _id: 1 }, 1)
    if (nextArticle) {
      result.next = nextArticle
    }
    ctx.result = result
    return next()
  }
}
