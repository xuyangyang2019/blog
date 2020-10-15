// const APIError = require('../middlewares/rest').APIError;
const userService = require('../services/userService')
// const adminService = require('../services/adminService')


module.exports = {
    // 获取
    'GET /api/users': async (ctx, next) => {
        ctx.body = await userService.getAllUser()
    },
    // 'GET /api/admins': async (ctx, next) => {
    //     await adminService.getList(ctx)
    //     // adminModel.find({}, {}, (err, docs) => {
    //     //     console.log(docs)
    //     // })
    //     // ctx.body = 'admins'
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
