const BaseDAO = require('../lib/baseDAO')
const Article = require('../models/mongodb').article

class ArticleService extends BaseDAO {
  // 如果没有指定，ES2015 会提供默认的类构造函数。
  // 因此，没有必要提供一个空构造函数或一个简单地委托给它的父类的构造函数
  // constructor(model) {
  //   super(model)
  // }
  async getArticlesByPv() {
    const result = await this.model
      .find({ publish: true }, { title: 1, articleId: 1, tag: 1 }, { sort: { pv: -1 } })
      .limit(5)
    return result
  }
}

module.exports = new ArticleService(Article)
