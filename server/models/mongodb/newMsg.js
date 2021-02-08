module.exports = {
  name: 'newMsg',
  schema: {
    type: String,
    name: String,
    say: String,
    title: String,
    content: String,
    ip: String,
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
