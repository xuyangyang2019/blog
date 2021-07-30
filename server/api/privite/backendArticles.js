const ArticleService = require('../../services').ArticleService

const { InvalidQueryError } = require('../../lib/error')
const ImgUploadService = require('../../services/fileService/ImgUploadService')

module.exports = {
  // 获取文章数量
  'GET /api/admin/articles/count': async (ctx) => {
    const { publish, tag } = ctx.query
    console.log(publish, tag)
    const condition = {}
    if (publish) {
      condition.publish = publish
    }
    if (tag) {
      condition.tag = tag
    }
    // // 前台后台关键词搜索请求
    // if (ctx.query.keyword) {
    //   condition.title = { $regex: ctx.query.keyword, $options: 'i' }
    // }
    // // 前台后台时间范围请求
    // if (ctx.query.start && ctx.query.end) {
    //   condition.createTime = { $gte: ctx.query.start, $lte: ctx.query.end }
    // }
    const result = await ArticleService.count(condition)
    ctx.rest(result)
  },
  // 分页查询文章列表
  'GET /api/admin/articles/list': async (ctx) => {
    const { publish, tag, pageNum, pageSize } = ctx.request.query
    const condition = {}
    if (publish) {
      condition.publish = publish
    }
    if (tag) {
      condition.tag = tag
    }
    const result = await ArticleService.findManyByPage(condition, {}, pageNum, pageSize)
    ctx.rest(result)
  },
  // 添加文章
  'POST /api/article': async (ctx) => {
    const data = ctx.request.body
    if (!data) {
      throw new InvalidQueryError()
    }
    // data.state = 1
    const result = await ArticleService.save(data)
    if (result._id) {
      ctx.result = result
      ctx.rest(result)
    } else {
      ctx.rest('', -1, '发布失败')
    }
  },
  // 删除文章
  'DELETE /api/articles': async (ctx) => {
    const ids = ctx.query.ids
    if (!ids) {
      throw new InvalidQueryError()
    }
    const result = await ArticleService.delete({ _id: { $in: ids } })
    if (!result) {
      ctx.rest('', -1, '文章不存在')
    } else {
      ctx.rest(result)
    }
  },
  // 更新文章
  'PATCH /api/article': async (ctx) => {
    const data = ctx.request.body
    if (!data || !data.articleId) {
      throw new InvalidQueryError()
    }
    const result = await ArticleService.updateById(data.articleId, data)
    if (!result) {
      ctx.rest('', -1, '保存更改失败')
    } else {
      ctx.rest(result)
    }
  },
  // 上传图片
  'POST /api/uploadArticleImg': async (ctx) => {
    // 按月存放上传的图片
    const date = new Date()
    const year = date.getFullYear()
    const month = (Array(2).join(0) + (date.getMonth() + 1)).slice(-2)
    const uploadPath = `/img/${year}/${month}`
    const imgUploadService = new ImgUploadService(uploadPath)
    imgUploadService.execute(ctx)
  },
  // 获取文章信息
  'GET /api/admin/getArticle': async (ctx) => {
    const { id } = ctx.request.query
    if (!id) {
      throw new InvalidQueryError()
    }
    const doc = await ArticleService.findById({ _id: id })
    if (doc) {
      ctx.rest(doc)
    } else {
      ctx.rest('', -1, '查不到文章')
    }
  },
  // 获取草稿箱里的文章
  'GET /api/articles/draft': async (ctx) => {
    const result = await ArticleService.findOne({ state: 0 })
    if (!result) {
      ctx.rest('', -1, '无草稿')
    } else {
      ctx.rest(result)
    }
  }
}
