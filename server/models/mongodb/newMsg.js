// module.exports = db.defineModel('NewMsg', {
//     type: String,
//     name: String,
//     say: String,
//     title: String,
//     content: String,
//     ip: String,
//     date: Date
// })

module.exports = {
    name: "NewMsg",
    schema: {
        type: String,
        name: String,
        say: String,
        title: String,
        content: String,
        ip: String,
        date: Date,
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