const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

// 数据库地址
const DB_URL = 'mongodb://xyy:123456@localhost:27017/blog'
// 连接数据库
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// 定义model
function defineModel(name, attributes, plugin = '') {
    // 通用的参数
    // attributes.creat_date = {
    //     type: String
    // }
    // attributes.update_date = {
    //     type: String
    // }
    // attributes.is_delete = {
    //     type: Number
    // }
    // attributes.timestamp = {
    //     type: Number
    // }
    // 定义一个schema, 描述此集合里有哪些字段，字段是什么类型
    const schema = new Schema(attributes)
    if (plugin) {
        schema.plugin(require(plugin))
    }
    // 创建模型，可以用它来操作数据库中的集合，指的是整体
    const model = mongoose.model(name, schema)
    return model
}

// 读取所有的schema
const fs = require('fs')
const path = require('path')
const files = fs.readdirSync(path.resolve(__dirname, './schema'))
const js_files = files.filter(f => {
    return f.endsWith('.js')
}, files)

// db
let db = {}
for (const f of js_files) {
    const name = f.substring(0, f.length - 3)
    let schema = require(path.resolve(__dirname, './schema', f))
    db[name] = defineModel(name, schema)
}

// 连接成功
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL)
})

// 连接异常
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err)
})

// 连接断开
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected')
})

// 初始化数据库 
// mongoose.connection.once("open", () => {
//     initDbUser()
// })

// const exp = {
//     defineModel
// }
// 基本属性类型有字符串、日期型、数值型、布尔型、null、数组、内嵌文档等
// const TYPES = ['String', 'Number', 'Boolean', 'Array', 'Buffer', 'Date', 'ObjectId', 'Mixed']
// for (const type of TYPES) {
//     exp[type] = Schema.Types[type]
// }
// 主键的数据类型
// exp.ID = ID_TYPE 
// exp.generateId = generateId // 主键
// module.exports = exp

module.exports = db