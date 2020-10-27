import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import createStore from './store/store.js'
import { sync } from 'vuex-router-sync'

import filters from './filters'
// 全局过滤器
Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
})

// 全局引入 Mixin
import headMixin from './mixins/head-mixin'
Vue.mixin(headMixin)

// 匹配要渲染的视图后，再获取数据
// Vue.mixin({
//     beforeMount() {
//         const { asyncData } = this.$options
//         if (asyncData) {
//             // 将获取数据操作分配给 promise
//             // 以便在组件中，我们可以在数据准备就绪后
//             // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
//             this.dataPromise = asyncData({
//                 store: this.$store,
//                 route: this.$route
//             })
//         }
//     }
// })

// // 当路由组件重用时，也应该调用 asyncData 函数
// Vue.mixin({
//     beforeRouteUpdate(to, from, next) {
//         const { asyncData } = this.$options
//         if (asyncData) {
//             asyncData({
//                 store: this.$store,
//                 route: to
//             }).then(next).catch(next)
//         } else {
//             next()
//         }
//     }
// })

export function createApp() {
  // 创建 router 和 store 实例
  const store = createStore()
  const router = createRouter()

  // 同步路由状态(route state)到 store
  sync(store, router)

  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // 暴露 app, router 和 store。
  return { app, store, router, App }
}