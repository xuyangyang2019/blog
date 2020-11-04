// mongodb
const db = require("../db/mongodb/db")
// const api = require("../http/server-api")
// const getIp = require("../utils/getIp")
// const localTime = require("../utils/reviseTime")

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
    // 更新文章的喜欢字段
    'PATCH /loveArticle': async (ctx, next) => {
        // ctx.request.body
        let result = await db.article.update(
            { articleId: ctx.request.body.articleId },
            { $inc: { likeNum: ctx.request.body.num } },
            (err, doc) => { })
        if (result.ok) {
            ctx.body = { code: 200 }
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
        }
    },
    // 前台搜索文章
    'GET /search': async (ctx, next) => {
        let limit = 8
        let skip = ctx.query.page * limit - limit
        if (ctx.query.according === "key") {
            let docs = await db.article
                .find(
                    { publish: ctx.query.publish, title: { $regex: ctx.query.key, $options: "i" } },
                    { content: 0 },
                    (err, doc) => { })
                .sort({ "_id": -1 })
                .skip(skip)
                .limit(limit)
            ctx.body = docs
        } else {
            //前台时间轴根据时间范围搜索
            let start = new Date(parseInt(ctx.query.start))
            let end = new Date(parseInt(ctx.query.end))
            let articles_time = await db.article
                .find(
                    { publish: ctx.query.publish, date: { "$gte": start, "$lte": end } },
                    { content: 0 },
                    (err, doc) => { })
                .sort({ "_id": -1 })
                .skip(skip)
                .limit(limit)
            ctx.body = articles_time
        }
    },
    // =========================== admin ================================
    // 后台抓取文章
    'GET /getAdminArticles': async (ctx, next) => {
        let params = {}
        let limit = 10
        let skip = ctx.query.page * limit - limit
        //抓取首页文章
        if (!ctx.query.tag) {
            params = {
                publish: ctx.query.publish
            }
        } else {
            params = {
                publish: ctx.query.publish,
                tag: ctx.query.tag
            }
        }
        try {
            let docs = await db.article
                .find(params, { content: 0 })
                .sort({ "_id": -1 })
                .skip(skip)
                .limit(limit)
            ctx.body = docs
        } catch (error) {
            console.log(error)
        }
    },
    'GET /getAdminArticle': async (ctx, next) => {
        let doc = await db.article.find(ctx.query, (err, doc) => { })
        ctx.body = doc
    },
    'GET /getAdminArticle': async (ctx, next) => {
        let doc = await db.article.find(ctx.query, (err, doc) => { })
        ctx.body = doc
    },
    //   //修改文章
    //   router.patch("/api/updata", confirmToken, (ctx, res) => {
    //     let r = ctx.body
    //     db.article.update({ articleId: ctx.body.articleId }, {
    //       publish: r.publish,
    //       original: r.original,
    //       title: r.title,
    //       abstract: r.abstract,
    //       tag: r.tag,
    //       content: r.content
    //     }, (err, doc) => {
    //       if (err) {
    //         res.status(500).end()
    //       } else {
    //         res.json({ code: 200 })
    //       }
    //     })
    //   })
    //   //存储文章
    //   router.post("/api/saveArticle", confirmToken, (ctx, res) => {
    //     let r = ctx.body
    //     let newArticle = new db.article({
    //       articleId: 0,
    //       original: r.original,
    //       title: r.title,
    //       abstract: r.abstract,
    //       content: r.content,
    //       tag: r.tag,
    //       publish: r.publish,
    //       date: r.date,
    //       commentNum: 0,
    //       likeNum: 0,
    //       pv: 0
    //     })
    //     newArticle.save((err, doc) => {
    //       if (err) {
    //         res.json({ code: 500 })
    //       } else {
    //         res.json({ code: 200 })
    //       }
    //     })
    //   })
    //   //删除文章
    //   router.delete("/api/deleteArticle", confirmToken, (ctx, res) => {
    //     //$in是为了批量删除，出入的articleId是数组
    //     db.article.remove({ articleId: { $in: ctx.query.articleId } }, (err) => {
    //       if (err) {
    //         res.status(500).end()
    //       } else {
    //         res.json({ deleteCode: 200 })
    //         db.comment.remove({ articleId: { $in: ctx.query.articleId } }, (err) => {
    //           if (err) {
    //             console.log(err)
    //           }
    //         })
    //       }
    //     })
    //   })
    //   //后台管理搜索文章
    //   router.get("/api/adminSearch", confirmToken, (ctx, res) => {
    //     let limit = 10
    //     let skip = ctx.query.page * limit - limit
    //     //后台管理根据关键词搜索
    //     if (ctx.query.according === "key") {
    //       db.article.find({ publish: ctx.query.publish, title: { $regex: ctx.query.key, $options: "i" } }, { content: 0 }, (err, doc) => {
    //         if (err) {
    //           res.status(500).end()
    //         } else {
    //           res.json(doc)
    //         }
    //       }).sort({ "_id": -1 }).skip(skip).limit(limit)
    //       //后台管理根据时间范围搜索
    //     } else {
    //       let start = new Date(parseInt(ctx.query.start))
    //       let end = new Date(parseInt(ctx.query.end))
    //       db.article.find({ publish: ctx.query.publish, date: { "$gte": start, "$lte": end } }, { content: 0 }, (err, doc) => {
    //         if (err) {
    //           res.status(500).end()
    //         } else {
    //           res.json(doc)
    //         }
    //       }).sort({ "_id": -1 }).skip(skip).limit(limit)
    //     }
    //   })
}