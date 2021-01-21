module.exports = {
  name: 'msgBoard',
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
