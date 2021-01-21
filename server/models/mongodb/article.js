module.exports = {
  name: 'article',
  schema: {
    // articleId: Number,
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
    createTime: {
      type: Date,
      default: Date.now
    }, // 创建时间
    updateTime: {
      type: Date,
      default: Date.now
    } // 修改时间
  },
  options: {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
}
