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
    comments: [], // 文章评论
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
    // 精准获取文章
    GetArticle({ commit }, payload) {
        // life目录下路由参数只有ID，无tag参数
        let tag = payload.tag === undefined ? 'life' : payload.tag
        api.get("/api/onlyArticle", {
            publish: payload.publish,
            tag: tag,
            articleId: payload.articleId,
            cache: true
        }).then((data) => {
            // 页面title
            commit("CHANGE_TITLE", data[0].title)
            // 文章
            commit("SET_ONLY_ARTICLES", data)
            // 查询上篇文章|下篇文章
            if (data.length) {
                api.get("/api/preAndNext", { date: data[0].date, cache: true }).then((data1) => {
                    commit('SET_PRE_NEXT', data1)
                })
            }
        })
    },
    // 获取对应模块的文章总数，为分页按钮个数提供支持
    GetArticlesCount({ commit }, payload) {
        api.get("/api/getCount", payload).then((data) => {
            commit("SET_ARTICLES_SUM", data)
            commit("SET_PAGE_ARR", data)
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
    // 获取留言
    GetLeaveWords({ commit }, payload) {
        api.get("/api/getMsgBoard", payload).then((data) => {
            commit('SET_MSG_BOARD_ARR', data)
        })
    },
    // 获取留言数量
    GetMsgCount({ commit }, payload) {
        api.get("/api/getMsgCount", payload).then((data) => {
            commit("SET_PAGE_ARR", data)
        })
    },
    // 回复留言
    AddLeaveWords({ commit }, payload) {
        return api.patch("/api/addReply", payload)
    },
    // 添加留言
    SaveLeaveWords({ commit }, payload) {
        return api.post("/api/saveLeaveW", payload)
    },
    // 点赞|取消点赞
    LoveArticle({ commit }, payload) {
        return api.patch("/api/loveArticle", payload)
    },
    // 查询时间轴的文章
    TimeArticles({ commit, state }, payload) {
        api.get("/api/search", payload).then((data) => {
            commit('SET_ARTICLES_TIME', data)
            commit("PRODUCT_BG", data)
        })
    },
    // 获取文章评论
    GetComments({ commit }, payload) {
        api.get("/api/getComments", payload).then((data) => {
            commit('SET_COMMENTS', data)
            //   return data
        })
    },
    // 发表评论
    PostComment({ commit }, payload) {
        return api.post("/api/saveComment", payload)
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
    // 修改本地的留言
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
    SET_MSG_BOARD_ARR(state, data) {
        state.msgBoardArr = data
    },
    // 添加背景
    AddTabBg(state, bool) {
        state.tabBg = bool
    },
    // 设置top的参数
    PositionTop(state, payload) {
        state.anchorScroll = { top: payload.top, move: payload.move }
    },
    CHANGE_TITLE(state, title) {
        state.currentTitle = title
    },
    SET_ONLY_ARTICLES(state, onlyArticles) {
        state.articles.only = onlyArticles
    },
    SET_ARTICLES_TIME(state, timeArticles) {
        state.articles.time = timeArticles
    },
    // 设置上|下页
    SET_PRE_NEXT(state, pn) {
        state.articles.pre_next = pn
    },
    // 设置评论
    SET_COMMENTS(state, data) {
        state.comments = data
    },
    ADD_LOCAL_COMMENTS(state, info) {
        if (info.type === 1) {
            state.comments.unshift(info.add)
        } else {
            state.comments.forEach((item, index, arr) => {
                if (item._id === info._id) {
                    state.comments.splice(index, 1, info.add)
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