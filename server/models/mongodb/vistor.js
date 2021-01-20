module.exports = {
  name: 'vistor',
  schema: {
    name: String,
    password: String,
    email: String,
    imgUrl: String,
    githubID: Number,
    create_time: {
      type: Date,
      default: Date.now
    }, // 创建时间
    update_time: {
      type: Date,
      default: Date.now
    } // 修改时间
  },
  options: {
    versionKey: false,
    timestamps: { createdAt: 'create_time', updatedAt: 'update_time' }
  }
}
