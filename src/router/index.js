import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'

Vue.use(Router)

function createRouter() {
    const routes = [
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
            path: '/foo',
            component: () => import(/* webpackChunkName: "foo" */ '../components/Foo.vue') // 异步路由
        }
    ]

    const router = new Router({
        mode: 'history',
        routes
    })

    return router
}

export default createRouter