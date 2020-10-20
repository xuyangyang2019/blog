// const APIError = require('../middlewares/rest').APIError;

// mysql
// const userService = require('../services/userService')

// mongodb
const db = require("../db/mongodb/db")
// const adminService = require('../services/adminService')

module.exports = {
    // 获取
    // 'GET /api/users': async (ctx, next) => {
    //     ctx.body = await userService.getAllUser()
    // },
    // 获取推荐文章
    'GET /api/getHot': async (ctx, next) => {
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
    // 获取标签
    'GET /api/tags': async (ctx, next) => {
        let publish = ctx.query.publish === "false" ? false : true
        let tagArr = []
        // 所有的标签
        // tagArr = await db.article.find({ publish: publish }).distinct("tag", (err, doc) => { })
        // 所有的文章
        let docs = await db.article.find({ publish: publish }, { tag: 1, _id: 0 })
        let tagMap = {}
        // 计算标签的文章数
        docs.forEach((doc, index, arr) => {
            for (const tag of doc.tag) {
                tagMap[tag] = tagMap[tag] ? tagMap[tag] + 1 : 1
            }
        })
        for (const key in tagMap) {
            if (tagMap.hasOwnProperty(key)) {
                tagArr.push({
                    tag: key,
                    num: tagMap[key]
                })
            }
        }
        ctx.body = tagArr
    },
    // 获取时间轴
    'GET /api/getTime': async (ctx, next) => {
        let publish = ctx.query.publish === "false" ? false : true
        let timeArr = []
        let doc = await db.article.find(
            { publish: publish }, // 查询条件
            { date: 1 }, // 指定返回的字段
            // (err, doc) => {
            //     if (err) {
            //         console.log('查询数据库报错', err)
            //     }
            // }
        )
        let timeMap = {}
        doc.forEach((item, index, arr) => {
            let yearMonth = new Date(item.date).getFullYear() + "年" + (new Date(item.date).getMonth() + 1) + "月"
            timeMap[yearMonth] = timeMap[yearMonth] ? timeMap[yearMonth] + 1 : 1
        })
        for (const key in timeMap) {
            if (timeMap.hasOwnProperty(key)) {
                timeArr.push({
                    time: key,
                    num: timeMap[key]
                })
            }
        }
        // console.log('getTime', timeArr)
        ctx.body = timeArr
    },
    // 'GET /api/admins': async (ctx, next) => {
    //     await adminService.getList(ctx)
    //     // adminModel.find({}, {}, (err, docs) => {
    //     //     console.log(docs)
    //     // })
    // },
    // // 获取
    // 'GET /api/todos': async (ctx, next) => {
    //     ctx.rest({
    //         todos: todos
    //     });
    // },
    // // 新增
    // 'POST /api/todos': async (ctx, next) => {
    //     var
    //         t = ctx.request.body,
    //         todo;
    //     if (!t.name || !t.name.trim()) {
    //         throw new APIError('invalid_input', 'Missing name');
    //     }
    //     if (!t.description || !t.description.trim()) {
    //         throw new APIError('invalid_input', 'Missing description');
    //     }
    //     todo = {
    //         id: nextId(),
    //         name: t.name.trim(),
    //         description: t.description.trim()
    //     };
    //     todos.push(todo);
    //     ctx.rest(todo);
    // },
    // // 更新
    // 'PUT /api/todos/:id': async (ctx, next) => {
    //     var
    //         t = ctx.request.body,
    //         index = -1,
    //         i, todo;
    //     if (!t.name || !t.name.trim()) {
    //         throw new APIError('invalid_input', 'Missing name');
    //     }
    //     if (!t.description || !t.description.trim()) {
    //         throw new APIError('invalid_input', 'Missing description');
    //     }
    //     for (i = 0; i < todos.length; i++) {
    //         if (todos[i].id === ctx.params.id) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     if (index === -1) {
    //         throw new APIError('notfound', 'Todo not found by id: ' + ctx.params.id);
    //     }
    //     todo = todos[index];
    //     todo.name = t.name.trim();
    //     todo.description = t.description.trim();
    //     ctx.rest(todo);
    // },
    // // 删除
    // 'DELETE /api/todos/:id': async (ctx, next) => {
    //     var i, index = -1;
    //     for (i = 0; i < todos.length; i++) {
    //         if (todos[i].id === ctx.params.id) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     if (index === -1) {
    //         throw new APIError('notfound', 'Todo not found by id: ' + ctx.params.id);
    //     }
    //     ctx.rest(todos.splice(index, 1)[0]);
    // }
}
