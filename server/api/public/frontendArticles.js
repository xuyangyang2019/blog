const ArticleService = require('../../services').ArticleService
const { InvalidQueryError } = require('../../lib/error')
// const APIError = require('../middlewares/rest').APIError

module.exports = {
  // 获取文章数量
  'GET /api/articles/total': async (ctx) => {
    const condition = {
      publish: true
    }
    // 通过文章标签请求
    if (ctx.query.tag) {
      condition.tag = ctx.query.tag
    }
    // 前台后台关键词搜索请求
    if (ctx.query.keyword) {
      condition.title = { $regex: ctx.query.keyword, $options: 'i' }
    }
    // 前台后台时间范围请求
    if (ctx.query.start && ctx.query.end) {
      condition.createTime = { $gte: ctx.query.start, $lte: ctx.query.end }
    }
    const result = await ArticleService.count(condition)
    ctx.rest(result)
  },
  // 分页查询文章列表
  'GET /api/articles/list': async (ctx) => {
    const { publish, tag, pageNum, pageSize } = ctx.request.query
    const condition = {}
    if (publish) {
      condition.publish = publish
    }
    if (tag) {
      condition.tag = tag
    }
    const result = await ArticleService.findManyByPage(condition, {}, pageNum, pageSize)
    ctx.rest(result)
    // if (!result) {
    //   ctx.rest ('获取列表失败')
    // }
  },
  // 前台搜索文章
  'GET /api/articles/search': async (ctx) => {
    const { keyword, pageNum, pageSize, startTime, endTime } = ctx.request.query
    const condition = { publish: true }
    if (keyword) {
      condition.title = { $regex: keyword, $options: 'i' }
    }
    if (startTime && endTime) {
      condition.createTime = { $gte: startTime, $lte: endTime }
    }
    const docs = await ArticleService.findManyByPage(condition, { content: 0 }, pageNum, pageSize)
    ctx.rest(docs)
  },
  // 获取标签
  'GET /api/tags': async (ctx) => {
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
    ctx.rest(tagArr)
    // ctx.result = tagArr
    // return next()
  },
  // 获取推荐文章
  'GET /api/articles/hot': async (ctx) => {
    const result = await ArticleService.getArticlesByPv()
    ctx.rest(result)
  },
  // 文章归档
  'GET /api/articles/categories': async (ctx) => {
    const publish = !!ctx.query.publish
    const timeArr = []
    const timeMap = {}
    const docs = await ArticleService.findMany({ publish: publish }, { createTime: 1 })
    docs.forEach((item) => {
      const yearMonth =
          new Date(item.createTime).getFullYear() + '年' + (new Date(item.createTime).getMonth() + 1) + '月'
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
    ctx.rest(timeArr)
  },
  // 抓取单一文章
  'GET /api/articles/item': async (ctx) => {
    const { id } = ctx.request.query
    if (!id) {
      throw new InvalidQueryError()
    }
    const result = {
      article: {},
      pre: {},
      next: {}
    }
    const doc = await ArticleService.findById({ _id: id })
    if (doc) {
      result.article = doc
      // 查询上下篇文章
      const fields = { _id: 1, title: 1, tag: 1 }
      // pre使用倒序查询，否则只会显示第一条数据，因为他是最早的
      const preArticle = await ArticleService.findOne({ publish: true, createTime: { $lt: doc.createTime } }, fields, { _id: -1 }, 1)
      if (preArticle) {
        result.pre = preArticle
      }
      const nextArticle = await ArticleService.findOne({ publish: true, createTime: { $gt: doc.createTime } }, fields, { _id: 1 }, 1)
      if (nextArticle) {
        result.next = nextArticle
      }
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
    }
    ctx.rest(result)
  },
  // 更新文章的喜欢字段
  'PATCH /api/articles/like': async (ctx) => {
    // eslint-disable-next-line no-unused-vars
    const { id, number, title } = ctx.request.body
    const result = await ArticleService.update({ _id: id }, { $inc: { likeNum: number } })
    if (result) {
      ctx.rest(result)
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
  },
  // 获得上一篇文章和下一篇文章
  'GET /api/articles/pre': async (ctx) => {
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
    ctx.rest(result)
  },
  // 获得上一篇文章和下一篇文章
  'GET /api/articles/next': async (ctx) => {
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
    ctx.rest(result)
  }
}
