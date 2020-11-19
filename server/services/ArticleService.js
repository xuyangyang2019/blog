const BaseDAO = require('../lib/baseDAO')
const Article = require('../models/mongodb').article

class ArticleService extends BaseDAO {
  constructor(model) {
    super(model)
  }

  async getArticlesByPv() {
    const result = await this.model
      .find(
        { publish: true },
        { title: 1, articleId: 1, tag: 1 },
        { sort: { pv: -1 } })
      .limit(5)
    return result
  }

  async getArticlesCount(condition) {
    const count = await this.model.countDocuments(condition)
    return count
  }
}

module.exports = new ArticleService(Article)
