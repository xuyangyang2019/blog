import Vue from 'vue'
import Vuex from 'vuex'
import api from "./api"
import modules from './modules'

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
// const fetchBar = function () {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('bar 组件返回 ajax 数据')
//         }, 1000)
//     })
// }


// state
const state = {
    tabBg: false, // tab页是否有background
    anchorScroll: { top: 0, move: 0 }, // 记录scroll位置
    currentTitle: '', // 当前页面的title
    code: 404, // 页面响应
    articles: {
        sum: 0, // 文章总数
        all: [], // 所有的文章
        technical: [], // 科技文章
        life: [], // 生活类文章
        search: [], // 搜索结果
        only: [], // 单个文章
        time: [], // 时间线
        hot: [], // 推荐的文章
        pre_next: {
            pre: [],
            next: []
        }
    },
    msgBoardArr: [], // 留言信息
    userInfo: { name: "", imgUrl: "", email: "" }, // 用户信息
    pageArr: [], // 分页
    tags: [], // 标签
    timeLine: [], // 时间轴
}

// getters
const getters = {
    // tabBg: state => state.tabBg,
}

// actions
const actions = {
    // 获取推荐的文章
    GetHot({ commit }) {
        api.get("/api/getHot", {}).then((data) => {
            commit('SET_HOT', data)
        })
        // return api.get("/api/getHot", {}).then((data) => {
        //     // state.articles.hot = data
        //     // return data
        // })
    },
    //获取技术文章的tag生成导航
    GetTagsClass({ commit }, payload) {
        api.get("/api/tags", { publish: payload.publish }).then((data) => {
            commit("SetTags", data)
        })
        // return api.get("/api/tags", { publish: payload.publish }).then((data) => {
        //     state.tags = data
        //     return data
        // })
    },
    // 获取时间轴
    GetTime({ commit }, payload) {
        api.get("/api/getTime", payload).then((data) => {
            commit('SET_TIME_LINE', data)
        })
        // return api.get("/api/getTime",payload).then((data) =>{
        // 	state.timeLine = data
        // 	return data
        // })
    },
    // fetchBar({ commit }) {
    //     return fetchBar().then((data) => {
    //         commit('SET_BAR', data)
    //     }).catch((err) => {
    //         console.error(err)
    //     })
    // }
}

// mutations
const mutations = {
    // 'SET_BAR'(state, data) {
    //     state.bar = data
    // }
    SET_HOT(state, data) {
        state.articles.hot = data
    },
    SetTags(state, data) {
        state.tags = data
    },
    SET_TIME_LINE(state, data) {
        state.timeLine = data
    }
}

Vue.use(Vuex)
function createStore() {
    return new Vuex.Store({
        modules,
        state,
        getters,
        mutations,
        actions,
        strict: process.env.NODE_ENV !== 'production'
    })
}

export default createStore