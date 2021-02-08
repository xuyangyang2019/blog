// const db = require('../../db/mongodb/mongoDB')

// module.exports = db.defineModel('Counter', {
//     _id: String,
//     seq: Number
// })

module.exports = {
  name: 'counter',
  schema: {
    _id: String,
    seq: Number,
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
