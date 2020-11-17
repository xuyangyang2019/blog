module.exports = {
    name: "comment",
    schema: {
        name: String,
        imgUrl: String,
        email: String,
        content: String,
        reply: [
            {
                name: String,
                imgUrl: String,
                email: String,
                aite: String,
                content: String,
                like: Number,
                date: Date
            }
        ], // 记得加上日期格式
        like: Number,
        articleId: Number,
        title: String,
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