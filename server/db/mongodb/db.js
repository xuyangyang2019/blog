const mongoose = require('mongoose')
const Schema = mongoose.Schema
// bluebird实现了将异步回调写法转变为链式写法，并且扩展出了catch、finally、bind等api
const Promise = require('bluebird')

// 配置文件
// const config = require('../config')

// 生成唯一标识符
// const uuid = require('node-uuid')

// /**
//  * 生成唯一标识符
//  */
// function generateId() {
//     return uuid.v1() // 基于时间戳生成
//     // return uuid.v4(); // 随机生成
// }

// 连接数据库 mongod 服务器端  mongo客户端
// 数据库的名称可以是不存在 创建一个zf数据库
const DB_URL = 'mongodb://localhost:27017/test' /** * 连接 */
// var db = mongoose.connect('mongodb://user:pass@localhost:port/database')
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

/** * 连接成功 */
db.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL)
})

/** * 连接异常 */
db.on('error', function (err) {
    console.log('Mongoose connection error: ' + err)
})

/** * 连接断开 */
db.on('disconnected', function () {
    console.log('Mongoose connection disconnected')
})

// 类型
// const ID_TYPE = Sequelize.STRING(50)

function defineModel(name, attributes, plugin = '') {
    console.log('defineModel')
    // 通用的参数
    attributes.creat_date = {
        type: String
    }
    attributes.update_date = {
        type: String
    }
    attributes.is_delete = {
        type: Number
    }
    attributes.timestamp = {
        type: Number
    }
    // 定义一个schema, 描述此集合里有哪些字段，字段是什么类型
    const schema = new Schema(attributes)
    if (plugin) {
        schema.plugin(require(plugin))
    }
    // 创建模型，可以用它来操作数据库中的集合，指的是整体
    const model = mongoose.model(name, schema)
    Promise.promisifyAll(model)
    Promise.promisifyAll(model.prototype)
    return model
}

const exp = {
    defineModel
}

// 基本属性类型有字符串、日期型、数值型、布尔型、null、数组、内嵌文档等
const TYPES = ['String', 'Number', 'Boolean', 'Array', 'Buffer', 'Date', 'ObjectId', 'Mixed']
for (const type of TYPES) {
    exp[type] = Schema.Types[type]
}

// exp.ID = ID_TYPE // 主键的数据类型
// exp.generateId = generateId // 主键

module.exports = exp