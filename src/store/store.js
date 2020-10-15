import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
const fetchBar = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('bar 组件返回 ajax 数据')
        }, 1000)
    })
}

function createStore() {
    const store = new Vuex.Store({
        state: {
            bar: '',
            tabBg: false, // tab页是否有background
            anchorScroll: { top: 0, move: 0 }, // 记录scroll位置
        },
        getters: {
            tabBg: state => state.tabBg,
            anchorScroll: state => state.tabBg
        },
        actions: {
            fetchBar({ commit }) {
                return fetchBar().then((data) => {
                    commit('SET_BAR', data)
                }).catch((err) => {
                    console.error(err)
                })
            }
        },
        mutations: {
            'SET_BAR'(state, data) {
                state.bar = data
            }
        }
    })

    // 运行环境不一定是浏览器，这里需要对window做判断，防止报错
    // 如果有window.__INITIAL_STATE__属性，
    // 说明服务器已经把所有初始化需要的异步数据都获取完成了，
    // 要对store中的状态做一个替换，保证统一。
    // if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    //     store.replaceState(window.__INITIAL_STATE__)
    // }

    return store
}

export default createStore