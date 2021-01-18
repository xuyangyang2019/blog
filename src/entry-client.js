/**
 * 客户端 entry
 * 只需创建应用程序，并且将其挂载到 DOM
 */

import { createApp } from './app.js'
import Vue from 'vue'

// 当路由组件重用（同一路由，但是 params 或 query 已更改，例如，从 user/1 到 user/2）时，
// 也应该调用 asyncData 函数。
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      })
        .then(next)
        .catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

// 客户端特定引导逻辑……

// 在挂载 (mount) 到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据
// 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败。
// 将服务端渲染时候的状态写入vuex中
if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 路由器必须要提前解析路由配置中的异步组件，才能正确地调用组件中可能存在的路由钩子
router.onReady(() => {
  // 客户端数据预取
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c)
    })

    if (!activated.length) {
      return next()
    }

    // 这里如果有加载指示器 (loading indicator)，就触发

    Promise.all(
      activated.map((c) => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to })
        }
      })
    )
      .then(() => {
        // 停止加载指示器(loading indicator)

        next()
      })
      .catch(next)
  })
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
})
