// const db = require('../../db/mongodb/mongoDB')

// module.exports = db.defineModel('Counter', {
//     _id: String,
//     seq: Number
// })

module.exports = {
    name: "user",
    schema: {
        _id: String,
        seq: Number,
        create_time: {
            type: Date,
            default: Date.now
        }, // 创建时间
        update_time: {
            type: Date,
            default: Date.now
        }, // 修改时间
    },
    options: {
        versionKey: false,
        timestamps: { createdAt: 'create_time', updatedAt: 'update_time' }
    }
}