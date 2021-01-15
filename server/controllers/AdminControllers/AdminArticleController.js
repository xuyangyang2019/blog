const ArticleService = require('../../services').ArticleService

const { InvalidQueryError } = require('../../lib/error')
const ImgUploadService = require('../../services/fileService/ImgUploadService')

module.exports = {
  // // 路由闯入编辑器页面进行token验证
  // 'GET /api/confirmToken': async (ctx, next) => {
  //   console.log('鉴权')
  //   ctx.result = '鉴权通过'
  //   return next()
  // },
  // 添加文章
  'POST /api/addArticle': async (ctx, next) => {
    console.log('添加文章', ctx.request.body)
    const data = ctx.request.body
    if (!data) {
      throw new InvalidQueryError()
    }
    data.state = 1
    const result = await ArticleService.save(data)
    if (!result) {
      ctx.error = '发布失败'
    } else {
      ctx.result = result
    }
    return next()
  },
  // 删除文章
  'DELETE /api/deleteArticle': async (ctx, next) => {
    console.log('删除文章')
    // const { _id } = ctx.request.body
    // if (!_id) {
    //   throw new InvalidQueryError()
    // }
    // const result = await ArticleService.deleteById(_id)
    // if (!result) {
    //   ctx.error = '文章不存在'
    // } else {
    //   ctx.result = result
    // }
    // return next()
  },
  // 更新文章
  'PATCH /api/updateArticle': async (ctx, next) => {
    console.log('更新文章')
    // const data = ctx.request.body
    // if (!data || !data._id) {
    //   throw new InvalidQueryError()
    // }
    // const result = await ArticleService.updateById(data._id, data)
    // if (!result) {
    //   ctx.error = '保存更改失败'
    // } else {
    //   ctx.result = ''
    // }
    // return next()
  },
  // 上传图片
  'POST /api/uploadArticleImg': async (ctx, next) => {
    // 按月存放上传的图片
    const date = new Date()
    const year = date.getFullYear()
    const month = (Array(2).join(0) + (date.getMonth() + 1)).slice(-2)
    const uploadPath = `/img/${year}/${month}`

    const imgUploadService = new ImgUploadService(uploadPath)
    imgUploadService.execute(ctx)
    return next()
  },
  // 'POST /api/saveDraft': async (ctx, next) => {
  //   const data = ctx.request.body
  //   if (!data) {
  //     throw new InvalidQueryError()
  //   }
  //   data.state = 0
  //   let result = null
  //   if (data._id) {
  //     result = await ArticleService.updateById(data._id, data)
  //   } else {
  //     result = await ArticleService.save(data)
  //   }
  //   if (!result) {
  //     ctx.error = '保存失败'
  //   } else {
  //     ctx.result = ''
  //   }
  //   return next()
  // },
  // 获取草稿箱里的文章
  'GET /api/getDraft': async (ctx, next) => {
    const result = await ArticleService.findOne({ state: 0 })
    if (!result) {
      ctx.error = '无草稿'
    } else {
      ctx.result = result
    }
    return next()
  }
}
