import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'

Vue.use(Router)

// 修改路由push方法,阻止重复点击报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 修改路由replace方法,阻止重复点击报错
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

function createRouter() {
  const routes = [
    // {
    //     path: "*",
    //     name: "miss",
    //     component: miss
    // },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/article',
      name: 'article',
      component: () => import(/* webpackChunkName: "article" */ '../views/ArticleRoot.vue')
    },
    // article的子路由
    // 标签
    {
      path: '/article/:articleList',
      name: 'techincal',
      component: () => import(/* webpackChunkName: "article" */ '../components/article/Techincal.vue')
    },
    // 具体的文章
    {
      path: '/article/:articleList/:id',
      name: 'articleShow',
      component: () => import(/* webpackChunkName: "article" */ '../components/article/ArticleShow.vue')

    },
    // 生活
    {
      path: '/life',
      name: 'life',
      component: () => import(/* webpackChunkName: "life" */ '../views/Life.vue')
    },
    // {
    //     path: "/life/:id",
    //     name: "lifeShow",
    //     component: articleShow
    // },
    // 留言
    {
      path: '/msgboard',
      name: 'msgboard',
      component: () => import(/* webpackChunkName: "msgboard" */ '../views/MsgBoard.vue')
    },
    // 搜索
    {
      path: '/search/:searchKey',
      name: 'search',
      component: () => import(/* webpackChunkName: "msgboard" */ '../components/base/Search.vue') // 异步路由
    },
    // 时间轴
    {
      path: '/timeLine/:time',
      name: 'timeLine',
      component: () => import(/* webpackChunkName: "article" */ '../components/article/TimeLine.vue')
    }
    // {
    //     path: "/login_github",
    //     name: "loginGithub",
    //     component: loginGithub
    // }
    // {
    //     path: '/foo',
    //     component: () => import(/* webpackChunkName: "foo" */ '../components/Foo.vue') // 异步路由
    // }
  ]

  const router = new Router({
    mode: 'history',
    routes
  })

  return router
}

export default createRouter
