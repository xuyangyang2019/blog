// const products = require('../products')

const APIError = require('../middlewares/rest').APIError

module.exports = {
  'GET /api/products': async (ctx, next) => {
    ctx.rest({
      products: [1, 2, 3, 4]
    })
  },

  'POST /api/products': async (ctx, next) => {
    // const p = products.createProduct(
    //   ctx.request.body.name,
    //   ctx.request.body.manufacturer,
    //   parseFloat(ctx.request.body.price)
    // )
    // ctx.rest(p)
  },

  'DELETE /api/products/:id': async (ctx, next) => {
    // console.log(`delete product ${ctx.params.id}...`)
    // const p = products.deleteProduct(ctx.params.id)
    // if (p) {
    //   ctx.rest(p)
    // } else {
    //   throw new APIError('product:not_found', 'product not found by id.')
    // }
  }
}
