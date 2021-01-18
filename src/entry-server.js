/**
 * 服务器 entry
 */

import { createApp } from './app.js'

// export default context => {
//     const { app } = createApp();

//     return app;
// }

// vuex demo
// export default context => {
//     return new Promise((resolve, reject) => {
//         const { app, store, App } = createApp();

//         let components = App.components;
//         let asyncDataPromiseFns = [];

//         Object.values(components).forEach(component => {
//             if (component.asyncData) {
//                 asyncDataPromiseFns.push(component.asyncData({ store }));
//             }
//         });

//         Promise.all(asyncDataPromiseFns).then((result) => {
//             // 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
//             context.state = store.state;
//             console.log(store.state);
//             resolve(app);
//         }, reject);
//     });
// }

// router demo
export default (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, store, router } = createApp()

    // 设置服务器端 router 的位置,路由配置里如果设置过base，url需要把url.replace(base,'')掉，不然会404
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      // 找该url路由所匹配到的组件
      const matchedComponents = router.getMatchedComponents()

      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // 使用Promise.all执行匹配到的Component的asyncData方法，即预取数据
      Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            // 不知道为什么用return 先注释掉看看有没有问题
            // return Component.asyncData({ store, route: router.currentRoute })
            Component.asyncData({ store, router, route: router.currentRoute })
          }
        })
      ).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        // Promise 应该 resolve 应用程序实例，以便它可以渲染
        resolve(app)
      })
    }, reject)
  })
}
