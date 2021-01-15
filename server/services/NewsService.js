const BaseDAO = require('../lib/baseDAO')
const NewMsg = require('../models/mongodb').newMsg

class NewsService extends BaseDAO {
  constructor(model) {
    super(model)
  }
}

module.exports = new NewsService(NewMsg)
