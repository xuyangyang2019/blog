const fs = require("fs")
// const path = require("path")

const Koa = require("koa")
const app = new Koa()

// 第 1 步：创建一个 Vue 实例
const Vue = require("vue")
// const createApp = require("./src/app")

// 第 2 步：创建一个 renderer
const template = fs.readFileSync("./src/index.temp.html", "utf-8")
const renderer = require("vue-server-renderer").createRenderer({
  template: template
})
const context = {
  title: "vue ssr",
  meta: `
    <meta name="keyword" content="vue,ssr">
    <meta name="description" content="vue srr demo">
  `
}

// 第 3 步：添加一个中间件来处理所有请求
app.use(async (ctx, next) => {
  const vm = new Vue({
    data: {
      title: "ssr example",
      url: ctx.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
  // const data = { url: ctx.url }
  // const vm = createApp(data)

  // 将 Vue 实例渲染为 HTML
  renderer.renderToString(vm, context, (err, html) => {
    if (err) {
      ctx.res.status(500).end("Internal Server Error")
      return
    }
    ctx.body = html
  })
})

const port = 3000
app.listen(port, function() {
  console.log(`server started at localhost:${port}`)
})
