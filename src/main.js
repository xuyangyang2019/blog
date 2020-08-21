import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

// 导入api接口
import api from "./api"
import filters from "./filters"
// 自定义的toast
import Toast from "./components/toast/index"
// 导入icon-font
import "@/assets/font/iconfont.js"

Vue.config.productionTip = false
// 将api挂载到vue的原型上复制代码
Vue.prototype.$api = api
Vue.use(Toast)
// Vue.prototype.$toast = Toast

// 全局过滤器
Object.keys(filters).forEach((filterName) => {
  Vue.filter(filterName, filters[filterName])
})

// 选择高亮的css 通过babel配置
// prism-coy prism-dark prism-funky prism-okaidia prism-tomorrow prism-twilight
// import "prismjs/themes/prism-okaidia.css"

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app")
