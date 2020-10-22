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
    maskShow: false, // 展示登陆框
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
    // 获取文章
    GetArticles({ commit }, payload) {
        let params = {}
        if (!payload.tag) {
            params = {
                publish: payload.publish,
                page: payload.page,
                cache: true
            }
        } else {
            params = payload
        }
        api.get("/api/getArticles", params).then((data) => {
            if (!payload.tag) {
                commit("SET_ARTICLES_ALL", data)
            } else if (payload.tag === "life") {
                commit("SET_ARTICLES_LIFE", data)
            } else {
                commit("SET_ARTICLES_TECH", data)
            }
            commit("PRODUCT_BG", data)
            // return data
        })
        // return api.get("/api/getArticles", params).then((data) => {
        //     if (!payload.tag) {
        //         state.articles.all = data
        //     } else if (payload.tag === "life") {
        //         state.articles.life = data
        //     } else {
        //         state.articles.technical = data
        //     }
        //     commit("productBg", data)
        //     return data
        // })
    },
    // 获取对应模块的文章总数，为分页按钮个数提供支持
    GetArticlesCount({ commit }, payload) {
        api.get("/api/getCount", payload).then((data) => {
            commit("SET_ARTICLES_SUM", data)
            commit("SET_PAGE_ARR", data)
            commit("CHANGE_CODE", 200)
            // return data
        })
        // return api.get("/api/getCount", payload).then((data) => {
        //     commit("SET_PAGE_ARR", data)
        //     return data
        // })
    },
    // 查询用户名是否存在
    SearchUser({ commit }, payload) {
        return api.get("/api/searchUser", payload)
    },
    // 保存用户
    SaveUser({ commit }, payload) {
        return api.post("/api/saveDesignUser", payload)
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
    },
    CLEAR_PAGE(state) {
        state.pageArr = []
    },
    CHANGE_CODE(state, code) {
        state.code = code
    },
    SET_PAGE_ARR(state, data) {
        let pageNum = Math.ceil(data / 8)
        let arr = []
        for (let i = 1; i < pageNum + 1; i++) {
            arr.push(i)
        }
        state.pageArr = arr
    },
    SET_ARTICLES_SUM(state, data) {
        state.articles.sum = data
    },
    SET_ARTICLES_ALL(state, data) {
        state.articles.all = data
    },
    SET_ARTICLES_LIFE(state, data) {
        state.articles.life = data
    },
    SET_ARTICLES_TECH(state, data) {
        state.articles.technical = data
    },
    PRODUCT_BG(state, data) {
        state.tagBg = []
        let pattern = /^[\u4e00-\u9fa5]+$/
        data.forEach((item, index, arr) => {
            if (item.tag[0] === "服务器" || item.tag[0] === "apache" || item.tag[0] === "tomcat") {
                state.tagBg.push("webserver")
            } else if (item.tag[0] === "云服务器") {
                state.tagBg.push("cloundserver")
            } else if (item.tag[0] === "安全") {
                state.tagBg.push("safe")
            } else if (item.tag[0] === "响应式") {
                state.tagBg.push("response")
            } else if (pattern.test(item.tag[0])) {
                state.tagBg.push("")
            } else {
                state.tagBg.push(item.tag[0])
            }
        })
    },
    SET_USER(state, info) {
        state.userInfo = info
    },
    HANDLE_MASK(state, bool) {
        state.maskShow = bool
    },
    ADD_LOCAL_WORDS(state, info) {
        if (info.type === 1) {
            state.msgBoardArr.unshift(info.add)
        } else {
            state.msgBoardArr.forEach((item, index, arr) => {
                if (item._id === info._id) {
                    state.msgBoardArr.splice(index, 1, info.add)
                    return
                }
            })
        }
    },
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