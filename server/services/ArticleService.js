const BaseDAO = require('../lib/baseDAO')
const Article = require('../models/mongodb').article

class ArticleService extends BaseDAO {
  constructor(model) {
    super(model)
  }
}

module.exports = new ArticleService(Article)
