const NewsService = require('../../services').NewsService

// const { InvalidQueryError } = require('../../lib/error')

module.exports = {
  'GET /api/getNews': async (ctx, next) => {
    console.log('getNews')
    const result = await NewsService.findMany({})
    if (!result) {
      ctx.error = '文章不存在'
    } else {
      ctx.result = result
    }
    return next()
  }
  // 'Delete /api/deleteNews': async (ctx, next) => {
  // NewsService.delete({type: req.query.type},(err) =>{
  //   if(err){
  //     res.status(500).end()
  //   }else{
  //     res.json({deleteCode: 200})
  //   }
  // })
  // const data = ctx.request.body
  // if (!data) {
  //   throw new InvalidQueryError()
  // }
  // data.state = 1
  // const result = await ArticleService.save(data)
  // if (!result) {
  //   ctx.error = '发布失败'
  // } else {
  //   ctx.result = result
  // }
  // return next()
  // }
}
