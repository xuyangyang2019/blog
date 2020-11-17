module.exports = {
    name: "Article",
    schema: {
        articleId: Number,
        original: Boolean,
        title: {
            type: String,
            required: true
        }, // 标题
        abstract: String,
        content: {
            type: String,
            required: true
        }, // 内容
        publish: Boolean,
        tag: Array,
        commentNum: Number,
        likeNum: Number,
        pv: Number,
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