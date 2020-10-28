// mongodb
const db = require("../db/mongodb/db")
// const api = require("../http/server-api")
// const getIp = require("../utils/getIp")

// const localTime = require("../utils/reviseTime")
// const confirmToken = require("../middleware/confirmToken")

module.exports = {
    // 获取推荐文章
    'GET /getHot': async (ctx, next) => {
        let hot = await db.article.find(
            { publish: true },
            { title: 1, articleId: 1, tag: 1 },
            { sort: { pv: -1 } },
            (err, doc) => {
                if (err) {
                    console.log(err)
                }
            }).limit(5)
        ctx.body = hot
    },
    // 抓取文章列表
    'GET /getArticles': async (ctx, next) => {
        let params = {}
        let limit = 8
        let skip = ctx.query.page * limit - limit
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
        let articles = await db.article
            .find(params, { content: 0 }, (err, doc) => { })
            .sort({ "_id": -1 })
            .skip(skip)
            .limit(limit)
        ctx.body = articles
    },
    // 抓取单一文章
    'GET /onlyArticle': async (ctx, next) => {
        let params = {}
        if (ctx.query.tag === undefined) {
            params = {
                publish: ctx.query.publish,
                tag: "life",
                articleId: ctx.query.articleId
            }
        } else {
            params = {
                publish: ctx.query.publish,
                tag: ctx.query.tag,
                articleId: ctx.query.articleId
            }
        }
        let doc = await db.article.find(params, (err, doc) => {
            if (err) {
                console.log(err)
            }
        })
        if (doc.length === 0) {
            ctx.body = [{ title: "您访问的路径不存在" }]
        } else {
            ctx.body = doc
            // 更新文章的点击数
            db.article.update(
                { "articleId": ctx.query.articleId },
                { $inc: { "pv": 1 } },
                (err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                })
            // 查询ip 并提醒后台
            // api.get("http://ip.taobao.com/service/getIpInfo.php", { ip: getIp(ctx.request) }).then((res) => {
            //     console.log(res)
            //     // new db.newMsg({
            //     //     type: "pv",
            //     //     content: data.data.city + "网友 在" + localTime(Date.now()) + "浏览了你的文章--" + doc[0].title
            //     // }).save()
            // })
        }
    },
    // 获得上一篇文章和下一篇文章
    'GET /preAndNext': async (ctx, next) => {
        // pre使用倒序查询，否则只会显示第一条数据，因为他是最早的
        let doc1 = await db.article
            .find(
                { publish: true, date: { "$lt": ctx.query.date } },
                { articleId: 1, title: 1, tag: 1 },
                (err, doc1) => { })
            .sort({ _id: -1 })
            .limit(1)
        // next
        let doc2 = await db.article
            .find(
                { publish: true, date: { "$gt": ctx.query.date } },
                { articleId: 1, title: 1, tag: 1 }, (err, doc2) => { })
            .limit(1)
        ctx.body = { pre: doc1, next: doc2 }
    },
}