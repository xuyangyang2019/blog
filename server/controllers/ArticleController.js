const ArticleService = require('../services').ArticleService
const { InvalidQueryError } = require('../lib/error')

module.exports = {
  // // 获取推荐文章
  // 'GET /getHot': async (ctx, next) => {
  //   let hot = await db.article.find(
  //     { publish: true },
  //     { title: 1, articleId: 1, tag: 1 },
  //     { sort: { pv: -1 } },
  //     (err, doc) => {
  //       if (err) {
  //         console.log(err)
  //       }
  //     }).limit(5)
  //   ctx.rest(hot)
  // },
  // 文章列表
  'GET /api/getArticles': async (ctx, next) => {
    let params = {}
    let pageSize = 10
    let pageNum = ctx.query.page
    if (!ctx.query.tag) {  // 抓取首页文章
      params = {
        publish: ctx.query.publish
      }
    } else {
      params = {
        publish: ctx.query.publish,
        tag: ctx.query.tag
      }
    }
    //   const { pageNum, pageSize } = ctx.request.body
    let result = await ArticleService.findByPage(params, pageNum, pageSize)
    if (!result) {
      ctx.error = '获取列表失败'
    } else {
      console.log(result)
      ctx.result = result
    }
    return next()
  },
  // 获取文章数量 暂时不用
  'GET /api/getCount': async (ctx, next) => {
    // let publish = ctx.query.publish === "false" ? false : true
    // let num = 0
    // // 首页请求
    // if (!ctx.query.tag && !ctx.query.start && !ctx.query.key) {
    //   num = await db.article.count({ publish: publish }, (err, num) => { })
    // }
    // // 通过文章标签请求
    // if (ctx.query.tag) {
    //   let tag = ctx.query.tag
    //   num = await db.article.count({ publish: publish, tag: tag }, (err, num) => { })
    // }
    // // 前台后台时间范围请求
    // if (ctx.query.start) {
    //   let start = new Date(parseInt(ctx.query.start))
    //   let end = new Date(parseInt(ctx.query.end))
    //   num = await db.article.count({ publish: ctx.query.publish, date: { "$gte": start, "$lte": end } })
    // }
    // // 前台后台关键词搜索请求
    // if (ctx.query.key) {
    //   num = await db.article.count({ publish: ctx.query.publish, title: { $regex: ctx.query.key, $options: "i" } })
    // }
    // return next()
  },
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
