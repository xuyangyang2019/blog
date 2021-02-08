module.exports = {
  name: 'user',
  schema: {
    username: {
      type: String,
      required: true
    }, // 用户名
    password: {
      type: String,
      required: true
    }, // 密码
    nickname: String, // 昵称
    phone_num: String, // 电话号码
    email: String, // 邮箱
    birthday: String, // 生日
    salt: String, // 盐
    last_login_time: String, // 上次登录时间
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
