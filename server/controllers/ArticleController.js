const ArticleService = require('../services').ArticleService
// const { InvalidQueryError } = require('../lib/error')

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
  // 文章列表
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
  // 获取文章数量 暂时不用
  'GET /api/getArticlesCount': async (ctx, next) => {
    const publish = ctx.query.publish !== 'false'
    let result = {}
    // 首页请求
    if (!ctx.query.tag && !ctx.query.start && !ctx.query.key) {
      result = await ArticleService.getArticlesCount({ publish: publish })
    }
    // 通过文章标签请求
    if (ctx.query.tag) {
      const tag = ctx.query.tag
      result = await ArticleService.getArticlesCount({ publish: publish, tag: tag })
    }
    // 前台后台时间范围请求
    if (ctx.query.start) {
      const start = new Date(parseInt(ctx.query.start, 10))
      const end = new Date(parseInt(ctx.query.end, 10))
      result = await ArticleService.getArticlesCount({ publish: ctx.query.publish, date: { $gte: start, $lte: end } })
    }
    // 前台后台关键词搜索请求
    if (ctx.query.key) {
      await ArticleService.getArticlesCount({
        publish: ctx.query.publish,
        title: { $regex: ctx.query.key, $options: 'i' }
      })
    }
    ctx.result = result
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
  'GET /api/getArticelsByTime': async (ctx, next) => {
    const publish = ctx.query.publish !== 'false'
    const timeArr = []
    const timeMap = {}
    const doc = await ArticleService.findMany({ publish: publish }, { data: 1 })
    if (!doc) {
      ctx.error = '文章不存在'
    } else {
      doc.forEach((item) => {
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
  // 获取已发表的文章标签
  'GET /api/getArticleTags': async (ctx, next) => {
    const publish = ctx.query.publish !== 'false'
    const tagArr = []
    const tagMap = {}
    // 所有的文章
    const docs = await ArticleService.findMany({ publish: publish }, { tag: 1, _id: 0 })
    if (!docs) {
      ctx.error = '文章不存在'
    } else {
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
      ctx.result = tagMap
    }
    return next()
  }
  // // 抓取单一文章
  // 'GET /onlyArticle': async (ctx, next) => {
  //   let params = {}
  //   if (ctx.query.tag === undefined) {
  //     params = {
  //       publish: ctx.query.publish,
  //       tag: "life",
  //       articleId: ctx.query.articleId
  //     }
  //   } else {
  //     params = {
  //       publish: ctx.query.publish,
  //       tag: ctx.query.tag,
  //       articleId: ctx.query.articleId
  //     }
  //   }
  //   let doc = await db.article.find(params, (err, doc) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   })
  //   if (doc.length === 0) {
  //     ctx.rest([{ title: "您访问的路径不存在" }])
  //   } else {
  //     ctx.rest(doc)
  //     // 更新文章的点击数
  //     db.article.update(
  //       { "articleId": ctx.query.articleId },
  //       { $inc: { "pv": 1 } },
  //       (err, doc) => {
  //         if (err) {
  //           console.log(err)
  //         }
  //       })
  //     // 查询ip 并提醒后台
  //     // api.get("http://ip.taobao.com/service/getIpInfo.php", { ip: getIp(ctx.request) }).then((res) => {
  //     //     console.log(res)
  //     //     // new db.newMsg({
  //     //     //     type: "pv",
  //     //     //     content: data.data.city + "网友 在" + localTime(Date.now()) + "浏览了你的文章--" + doc[0].title
  //     //     // }).save()
  //     // })
  //   }
  // },
  // // 获得上一篇文章和下一篇文章
  // 'GET /preAndNext': async (ctx, next) => {
  //   // pre使用倒序查询，否则只会显示第一条数据，因为他是最早的
  //   let doc1 = await db.article
  //     .find(
  //       { publish: true, date: { "$lt": ctx.query.date } },
  //       { articleId: 1, title: 1, tag: 1 },
  //       (err, doc1) => { })
  //     .sort({ _id: -1 })
  //     .limit(1)
  //   // next
  //   let doc2 = await db.article
  //     .find(
  //       { publish: true, date: { "$gt": ctx.query.date } },
  //       { articleId: 1, title: 1, tag: 1 }, (err, doc2) => { })
  //     .limit(1)
  //   ctx.rest({ pre: doc1, next: doc2 })
  // },
  // // 更新文章的喜欢字段
  // 'PATCH /loveArticle': async (ctx, next) => {
  //   // ctx.request.body
  //   let result = await db.article.update(
  //     { articleId: ctx.request.body.articleId },
  //     { $inc: { likeNum: ctx.request.body.num } },
  //     (err, doc) => { })
  //   if (result.ok) {
  //     ctx.rest({ code: 200 })
  //     // api.get("http://ip.taobao.com/service/getIpInfo.php", { ip: getIp(ctx) }).then((data) => {
  //     //     // 将点赞加入到新消息
  //     //     if (ctx.body.num === "1") {
  //     //         new db.newMsg({
  //     //             ip: getIp(ctx),
  //     //             type: "like",
  //     //             title: ctx.body.title,
  //     //             content: data.data.city + "网友 在" + localTime(Date.now()) + "赞了你的文章--" + ctx.body.title
  //     //         }).save()
  //     //     } else {
  //     //         //取消赞则将新消息移除
  //     //         db.newMsg.remove({ type: "like", ip: getIp(ctx), title: ctx.body.title }, (err) => {
  //     //             if (err) {
  //     //                 res.status(500).end()
  //     //             }
  //     //         })
  //     //     }
  //     // })
  //   }
  // },
  // // 前台搜索文章
  // 'GET /search': async (ctx, next) => {
  //   let limit = 8
  //   let skip = ctx.query.page * limit - limit
  //   if (ctx.query.according === "key") {
  //     let docs = await db.article
  //       .find(
  //         { publish: ctx.query.publish, title: { $regex: ctx.query.key, $options: "i" } },
  //         { content: 0 })
  //       .sort({ "_id": -1 })
  //       .skip(skip)
  //       .limit(limit)
  //     ctx.rest(docs)
  //   } else {
  //     // 前台时间轴根据时间范围搜索
  //     let start = new Date(parseInt(ctx.query.start))
  //     let end = new Date(parseInt(ctx.query.end))
  //     let docs = await db.article
  //       .find(
  //         { publish: ctx.query.publish, date: { "$gte": start, "$lte": end } },
  //         { content: 0 })
  //       .sort({ "_id": -1 })
  //       .skip(skip)
  //       .limit(limit)
  //     ctx.rest(docs)
  //   }
  // },
  // 'POST /api/getArticle': async (ctx, next) => {
  //   const { _id } = ctx.request.body
  //   if (!_id) {
  //     throw new InvalidQueryError()
  //   }
  //   const result = await ArticleService.findById(_id)
  //   if (!result) {
  //     ctx.error = '文章不存在'
  //   } else {
  //     ctx.result = result
  //   }
  //   return next()
  // },
}
