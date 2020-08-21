/**
 * Vue插件
 *
 * 原理：通过 vm.extend 构造器，将 .vue 文件做成一个"子类"，实例化后，挂载在html文档上，然后添加到body即可。
 * 具体的操控即可通过'实例'对象来组成了。
 *
 * 参考链接：
 * https://cn.vuejs.org/v2/api/#Vue-extend
 * https://cn.vuejs.org/v2/api/#vm-mount
 */

import ToastComponent from "./Toast"

const Toast = {}
let id = 0

// 全局配置
const globalOptions = {
  show: true,
  duration: 3000,
  showClose: false
}

Toast.install = (Vue) => {
  // 第一步：使用基础 Vue 构造器，创建一个“子类”
  const ToastConstructor = Vue.extend(ToastComponent)
  // 第二步：创造一个组件实例
  const instance = new ToastConstructor()
  // 第三步：挂载实例。挂载的目标就是把模板渲染成最终的DOM。
  instance.$mount()
  // 第四步：在body添加组件
  document.body.appendChild(instance.$el)
  // 第五步：添加实例方法，以供全局调用
  Vue.prototype.$toast = (options) => {
    if (!options.message) return
    options = {
      id: id++,
      ...globalOptions,
      ...options,
      onRemove: () => {
        let i = instance.$data.toasts.findIndex((item) => {
          return item.id === options.id
        })
        // 隐藏toast
        i >= 0 && (options.show = false)
        // 删除toast
        i >= 0 && instance.$data.toasts.splice(i, 1)
      }
    }
    instance.$data.toasts.push(options)
    // 如果toasts超过6个 立马移除第一个
    if (instance.$data.toasts.length > 6) {
      setTimeout(() => {
        clearTimeout(instance.$data.toasts[0].timer)
        instance.$data.toasts[0].onRemove()
      })
    }
    // 添加定时器
    if (options.duration > 0) {
      options.timer = setTimeout(() => {
        options.onRemove()
      }, options.duration)
    } else if (options.duration === 0) {
      console.log("不自动隐藏")
    }
  }
}

export default Toast
