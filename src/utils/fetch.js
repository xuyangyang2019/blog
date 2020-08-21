/**
 * 封装axios
 */

const qs = require("qs")
const axios = require("axios")

import router from "../router"

axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"

//拦截器，为后端每一个请求加上authorization
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("validateToken")
    if (token) {
      config.headers.Authorization = token
      // config.headers["x-access-token"] = token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//拦截器，后端验证token失败后跳转到登录界面
axios.interceptors.response.use(
  data => {
    // 如果返回401
    if (data.data.code && data.data.code === 401) {
      if (router.currentRoute.path !== "/login") {
        router.push({ name: "login" })
      }
    }
    // 如果返回token错误或者失效
    // if (config.data.msg == "token信息错误或失效！") {
    // console.log('token信息错误或失效，请重新登录！')
    // MessageBox.confirm("token信息错误或失效，请重新登录！", "提示", {
    //   confirmButtonText: "确定",
    //   cancelButtonText: "取消",
    //   type: "info"
    // })
    //   .then(() => {
    //     router.replace({
    //       path: "login",
    //       query: { redirect: router.currentRoute.fullPath }
    //     });
    //   })
    //   .catch(() => { });
    // }
    return data
  },
  error => {
    return Promise.reject(error)
  }
)

function ajax(type, url, options) {
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: url,
      // baseURL: "http://localhost:8080",//开发模式下vue-cli已经配置了请求转发，所以不用基础路径即可
      params: type === "get" || type === "delete" ? options : null,
      data: type !== "get" && type !== "delete" ? qs.stringify(options) : null
    })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject("request error in " + url)
        }
      })
      .catch(err => {
        console.log(err, url)
      })
  })
}

const config = {
  get(url, options) {
    return new Promise((resolve, reject) => {
      ajax("get", url, options)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  post(url, options) {
    return new Promise((resolve, reject) => {
      ajax("post", url, options)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  put(url, options) {
    return new Promise((resolve, reject) => {
      ajax("put", url, options)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  patch(url, options) {
    return new Promise((resolve, reject) => {
      ajax("patch", url, options)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  delete(url, options) {
    return new Promise((resolve, reject) => {
      ajax("delete", url, options)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default config
