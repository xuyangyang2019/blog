/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

// 序列化
const qs = require('qs')
// 引入axios
const axios = require('axios')
// 引入路由
import router from '../router'
// 缓存
const LRU = require('lru-cache')
import md5 from 'md5'

// 缓存api数据
const cached = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 15
})

// 引入vuex
// import store from '../store'
// ui
// import { Message } from 'element-ui'
// 配置文件
// import { baseUrl, baseUrlDev } from '../../app.config'

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param {String} errData 错误信息
 */
const errorHandle = (status, errData) => {
  switch (status) {
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      router.replace({
        path: '/',
        query: { redirect: router.currentRoute.fullPath }
      })
      break
    // 403 token过期
    // 登录过期对用户进行提示
    // 清除本地token和清空vuex中token对象
    // 跳转登录页面
    case 403:
      console.log('登录过期，请重新登录')
      console.log(`状态码:${status},错误信息:${errData}`)
      // MessageBox.alert(`登录过期，请重新登录`, '错误信息', {
      //   type: 'error',
      //   confirmButtonText: '确定',
      //   callback: (action) => {
      //     // this.$message({
      //     //   type: 'info',
      //     //   message: `action: ${action}`
      //     // })
      //     console.log(action)
      //     // 清除token
      //     // localStorage.removeItem('token')
      //     // store.commit('loginSuccess', null)
      //     // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      //     // setTimeout(() => {
      //     //   router.replace({
      //     //     path: '/login',
      //     //     query: {
      //     //       redirect: router.currentRoute.fullPath
      //     //     }
      //     //   })
      //     // }, 1000)
      //   }
      // })
      break
    // 404请求不存在
    case 404:
      console.log(`状态码:${status},错误信息:${errData}`)
      // MessageBox.alert(`网络请求不存在`, '错误信息', {
      //   type: 'error',
      //   confirmButtonText: '确定'
      // })
      break
    // 其他错误，直接抛出错误提示
    default:
      console.log(`状态码:${status},错误信息:${errData}`)
    // MessageBox.alert(`状态码:${status},错误信息:${errMsg}`, '错误信息', {
    //   type: 'error',
    //   confirmButtonText: '确定'
    // })
  }
}

// 配置方法的优先级是 axios请求配置 > axios实例配置 > axios全局配置

// axios全局配置
axios.defaults.timeout = 10000 // 请求超时时间

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  // axios.defaults.baseURL = 'http://192.168.31.134:3000'
  axios.defaults.baseURL = 'http://192.168.0.111:3000'
} else if (process.env.NODE_ENV === 'production') {
  // PM2部署的时候改成服务器地址
  // axios.defaults.baseURL = 'http://182.92.221.114:3000'
  // 使用nginx代理
  axios.defaults.baseURL = 'http://xyy.life'
}

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

// // axios配置
// axios.defaults.withCredentials = true // 携带cookie
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest' // 判断是否为ajax请求

// 创建axios实例
// 如果需要访问多个服务地址，而这些服务请求和响应的结构也可能都完全不同
// 那么你可以通过axios.create创建不同的实例来处理。
const httpInstance = axios.create({
  // url: "/data.json", // 请求的路径
  // baseURL: "http://localhost:8080", // 请求的域名，基本地址
  timeout: 10000, // 请求的超时时长，单位毫秒
  method: 'get,post,put,patch,delete', // 请求方法
  withCredentials: true, // 跨域
  params: {}, // 请求参数拼接在URL上
  data: {} // 请求参数放在请求体里
})
// // 设置post请求头
// httpInstance.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded; charset=UTF-8"

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
httpInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // if (process.env.NODE_ENV === "development") {
    //   config.url = `http://${location.host}` + config.url // 自定义反向代理
    // }
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    // token && (config.headers.Authorization = token)

    // 如果后端使用的是koa-jwt鉴权
    // const token = localStorage.getItem('validateToken')
    // token && (config.headers.Authorization = 'Bearer ' + token)
    // console.log(config)
    return config
  },
  (error) => {
    // Message.error({ message: '请求超时!' })
    return Promise.reject(error)
  }
)

// 响应拦截器，后端验证token失败后跳转到登录界面
httpInstance.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status && response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
    // 如果需要统一处理错误msg
    // if (response.status && response.status === 200 && response.data.code === -1) {
    //   Message.error({ message: response.data.msg })
    //   // return
    // }
    // return response
  },
  (error) => {
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    if (error.response && error.response.status) {
      errorHandle(error.response.status, error.data ? error.data : error)
    } else {
      // console.log('响应拦截器-请求失败', error)
      console.log('请求超时或断网', error)
      // Message({
      //   type: 'error',
      //   message: `请求超时或断网:${error}`,
      //   duration: 3000
      // })
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit("changeNetwork", false)
    }
    return Promise.reject(error)
  }
)

function apiAxios(method, url, params, options) {
  return new Promise((resolve, reject) => {
    httpInstance({
      url: url,
      method: method,
      // baseURL: 'http://localhost:3000',
      params: method === 'GET' || method === 'DELETE' ? params : null,
      paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false })
      },
      data: method !== 'GET' && method !== 'DELETE' ? qs.stringify(params) : null
    })
      .then((res) => {
        if (method === 'GET' && cached && options.cache) {
          cached.set(options.key, res.data)
        }
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  get: function (url, params, options = {}) {
    const key = md5(url + JSON.stringify({ ...params, ...options }))
    // 如果缓存中有数据
    if (cached && cached.has(key)) {
      return Promise.resolve(cached.get(key))
    }
    if (options.cache) {
      options.key = key
    }
    return apiAxios('GET', url, params, options)
  },
  post: function (url, params) {
    return apiAxios('POST', url, params)
  },
  postJson: function (url, params) {
    return new Promise((resolve, reject) => {
      httpInstance({
        url: url,
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  put: function (url, params) {
    return apiAxios('PUT', url, params)
  },
  patch: function (url, params) {
    return apiAxios('PATCH', url, params)
  },
  delete: function (url, params) {
    return apiAxios('DELETE', url, params)
  }
}
