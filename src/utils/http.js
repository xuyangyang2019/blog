/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

// 引入axios
const axios = require("axios")
// 引入路由
import router from "../router"
// 引入vuex
import store from "../store"

// 有赞开源的ui
import { Toast } from "vant"

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  console.log("请求失败后的错误统一处理errorHandle")
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip("登录过期，请重新登录")
      localStorage.removeItem("token")
      store.commit("loginSuccess", null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      tip("请求的资源不存在")
      break
    default:
      console.log(other)
  }
}

// 创建axios实例
const httpInstance = axios.create({
  baseURL: "https://some-domain.com/api/", // 地址
  timeout: 1000 * 12 // 超时
  // withCredentials: false // 跨域
})

// 设置post请求头
httpInstance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
httpInstance.interceptors.request.use(
  config => {
    console.log("步骤2:请求拦截器")
    // 在发送请求之前做些什么
    if (process.env.NODE_ENV === "development") {
      config.url = `http://${location.host}` + config.url // 自定义反向代理
    }
    console.log(location)
    console.log(config.url)
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = localStorage.getItem("validateToken")
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器，后端验证token失败后跳转到登录界面
httpInstance.interceptors.response.use(
  // 请求成功
  res => {
    console.log("步骤3:响应拦截器-请求成功")
    console.log(res)
    if (res.status === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res)
    }
  },
  // 请求失败
  error => {
    console.log("步骤3:响应拦截器-请求失败")
    if (error) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(error.status, error.data.message)
      return Promise.reject(error)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      store.commit("changeNetwork", false)
    }
  }
)

export default httpInstance
