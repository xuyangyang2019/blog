import Vue from "vue"
import Router from "vue-router"

// 正常加载
import Admin from "./views/Admin.vue"

// 按需（懒）加载（vue实现）推荐
// 没有指定webpackChunkName,每个组件打包成一个js文件
// const Login = () => import( /* webpackChunkName: "login" */ './views/Login.vue')

// vue异步组件技术
// 一个组件生成一个js文件
// const Login = resolve => require(["@/views/Login"], resolve)

// 按需（懒）加载（webpack动态导入）不推荐
// const Login = resolve => { require.ensure([], () => { resolve(require('./views/Login.vue')) }, 'login') }

//后台管理界面
// const miss = (resolve) => require(["@/components/base/miss"], resolve)
const eachTag = (resolve) => require(["@/components/article/eachTag"], resolve)
// const review = resolve => require(["@/components/article/review"], resolve)
// const search = (resolve) => require(["@/components/search/search"], resolve)

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      redirect: "/admin/allArticles",
      meta: {
        requireAuth: true,
        keepAlive: true
      },
      children: [
        // 已发表文章
        {
          path: "allArticles",
          name: "allArticles",
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/AdminAllArticles.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 指定标签的 已发表的文章
        {
          path: "allArticles/:tag",
          name: "eachTag",
          component: eachTag,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 文章预览
        {
          path: "review/:eTag/:articleId",
          name: "review",
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/article/ReviewArticle.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 草稿箱
        {
          path: "draft",
          name: "draft",
          // component: draft,
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/AdminDraft.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 留言板
        {
          path: "msgBoard",
          name: "adminMsgBoard",
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/AdminMsgBoard.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 文章评论
        {
          path: "comments",
          name: "comments",
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/AdminComments.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 新消息
        {
          path: "newMsg",
          name: "newMsg",
          // component: newMsg,
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/AdminNewMsg.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 账户设置
        {
          path: "adminSet",
          name: "adminSet",
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/AdminSet.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "/admin/search/:base",
          name: "search",
          component: () =>
            import(
              /* webpackChunkName: "admin" */ "./components/admin/search/search.vue"
            ),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        }
      ]
    },
    // 发表文章
    {
      path: "/admin/qe",
      name: "qe",
      component: () =>
        import(
          /* webpackChunkName: "admin" */ "./components/admin/PublishArticle.vue"
        ),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/admin/md",
      name: "md",
      component: () =>
        import(
          /* webpackChunkName: "admin" */ "./components/admin/PublishArticle.vue"
        ),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/admin/publish",
      name: "publish",
      component: () =>
        import(
          /* webpackChunkName: "admin" */ "./components/ue/InitEditor.vue"
        ),
      meta: {
        requireAuth: true
      }
    },
    // 草稿修改
    {
      path: "/admin/draftrevise",
      name: "draftrevise",
      component: () =>
        import(
          /* webpackChunkName: "admin" */ "./components/ue/InitEditor.vue"
        ),
      meta: {
        requireAuth: true
      }
    },
    // 更新文章
    {
      path: "/admin/update",
      name: "update",
      component: () =>
        import(
          /* webpackChunkName: "admin" */ "./components/ue/InitEditor.vue"
        ),
      meta: {
        requireAuth: true
      }
    },
    // 登陆页面
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/Login.vue")
    },
    // 其他
    {
      path: "/*",
      name: "miss",
      component: () =>
        import(/* webpackChunkName: "admin" */ "@/components/base/MissPage.vue")
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果要去的路由 需要验证
  if (to.matched.some((res) => res.meta.requireAuth)) {
    if (localStorage.getItem("validateToken")) {
      next()
    } else {
      next({
        path: "/login"
        // query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // console.log('全局解析守卫 beforeResolve ')
  // console.log(from.path)
  // console.log(to.path)
  next()
})

// 全局后置钩子
// router.afterEach((to, from) => {
//     console.log('router.afterEach')
//     console.log(to)
//     console.log(from)
// })

router.onError((e) => {
  console.log(e)
})

export default router
