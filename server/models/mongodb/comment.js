module.exports = {
  name: 'comment',
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
    articleId: String,
    title: String,
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
