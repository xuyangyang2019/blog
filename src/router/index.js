import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'

Vue.use(Router)

function createRouter() {
    const routes = [
        // {
        //     path: "*",
        //     name: "miss",
        //     component: miss
        // },
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            name: "home",
            component: Home,
        },
        {
            path: "/article",
            name: "article",
            component: () => import(/* webpackChunkName: "article" */ '../views/ArticleRoot.vue') // 异步路由
        },
        // article的子路由
        // {
        //     path: "/article/:articleList",
        //     name: "techincal",
        //     component: techincal
        // },
        // {
        //     path: "/article/:articleList/:id",
        //     name: "articleShow",
        //     component: articleShow
        // },
        {
            path: "/life",
            name: "life",
            component: () => import(/* webpackChunkName: "life" */ '../views/Life.vue') // 异步路由
        },
        // {
        //     path: "/life/:id",
        //     name: "lifeShow",
        //     component: articleShow
        // },
        {
            path: "/msgboard",
            name: "msgboard",
            component: () => import(/* webpackChunkName: "msgboard" */ '../views/MsgBoard.vue') // 异步路由
        },
        // {
        //     path: "/search/:searchKey",
        //     name: "search",
        //     component: search
        // },
        // {
        //     path: "/timeLine/:time",
        //     name: "timeLine",
        //     component: timeLine
        // },
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