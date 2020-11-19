const BaseDAO = require('../lib/baseDAO')
const MsgBoard = require('../models/mongodb').msgBoard

class CommentService extends BaseDAO {
  constructor(model) {
    super(model)
  }
}

module.exports = new CommentService(MsgBoard)
