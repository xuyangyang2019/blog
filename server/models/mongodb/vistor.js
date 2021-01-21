module.exports = {
  name: 'vistor',
  schema: {
    name: String,
    password: String,
    email: String,
    imgUrl: String,
    githubID: Number,
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
