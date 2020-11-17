// module.exports = db.defineModel('MsgBoard', {
//     name: String,
//     imgUrl: String,
//     email: String,
//     content: String,
//     date: Date,
//     reply: [
//         {
//             name: String,
//             aite: String,
//             imgUrl: String,
//             content: String,
//             date: Date
//         }
//     ]
// })

module.exports = {
    name: "MsgBoard",
    schema: {
        name: String,
        imgUrl: String,
        email: String,
        content: String,
        date: Date,
        reply: [
            {
                name: String,
                aite: String,
                imgUrl: String,
                content: String,
                date: Date
            }
        ],
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