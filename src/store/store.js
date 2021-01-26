import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

import {
  getArticleList,
  getArticlesCount,
  getArticle,
  getMsgBoard,
  getMsgCount,
  getCommets,
  queryPreNext
} from '../api/front'

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
    time: [], // 归档
    hot: [], // 热门文章
    pre_next: {
      pre: [],
      next: []
    }
  },
  placeOnFile: [], // 归档的数据
  msgBoardArr: [], // 留言信息
  userInfo: { name: '', imgUrl: '', email: '' }, // 用户信息
  pageArr: [], // 分页
  tags: [], // 标签
  maskShow: false, // 展示登陆框
  comments: [] // 文章评论
}

// getters
const getters = {
  // tabBg: state => state.tabBg,
}

// actions
const actions = {
  // 获取文章
  GetArticles({ commit }, payload) {
    //   params = {
    //     publish: payload.publish,
    //     page: payload.page,
    //     cache: true
    //   }
    // return api.get('/api/getArticleList', params).then((res) => {
    const { publish, tag, pageNum, pageSize } = payload
    return getArticleList(publish, tag, pageNum, pageSize).then((res) => {
      if (res.code === 200) {
        if (!payload.tag) {
          commit('SET_ARTICLES_ALL', res.data.list)
        } else if (payload.tag === 'life') {
          commit('SET_ARTICLES_LIFE', res.data.list)
        } else {
          commit('SET_ARTICLES_TECH', res.data.list)
        }
        commit('PRODUCT_BG', res.data.list)
        commit('SET_ARTICLES_SUM', res.data.count)
        commit('SET_PAGE_ARR', res.data.count)
        commit('CHANGE_CODE', 200)
      }
    })
  },
  // 获取对应模块的文章总数，为分页按钮个数提供支持
  GetArticlesCount({ commit }, payload) {
    const { publish } = payload
    return getArticlesCount(publish).then((res) => {
      commit('SET_ARTICLES_SUM', res.data.count)
      commit('SET_PAGE_ARR', res.data.count || 0)
    })
  },
  // 获取留言
  GetMsgBoard({ commit }, payload) {
    const { pageNum, pageSize } = payload
    return getMsgBoard(pageNum, pageSize).then((res) => {
      commit('SET_MSG_BOARD_ARR', res.data.list)
      commit('SET_PAGE_ARR', res.data.count || 0)
    })
  },
  // 获取留言数量
  GetMsgCount({ commit }) {
    return getMsgCount().then((res) => {
      commit('SET_PAGE_ARR', res.data.count || 0)
    })
  },
  // 精准获取文章
  GetArticle({ commit }, payload) {
    // life目录下路由参数只有ID，无tag参数
    // const tag = payload.tag === undefined ? 'life' : payload.tag
    const { publish, tag, id } = payload
    return getArticle(publish, tag, id).then((res) => {
      if (res.code === 200) {
        // 页面title
        commit('CHANGE_TITLE', res.data.title)
        // 文章
        commit('SET_ARTICLES_ONLY', res.data)
        // 查询上篇文章|下篇文章
        if (res.data && res.data.date) {
          queryPreNext(res.data.date).then((res2) => {
            if (res2.code === 200) {
              commit('SET_PRE_NEXT', res2.data)
            }
          })
        }
      }
    })
  },
  // 获取文章评论
  GetComments({ commit }, payload) {
    const { id } = payload
    return getCommets(id).then((res) => {
      if (res.code === 200) {
        commit('SET_COMMENTS', res.data)
      }
    })
  }
}

// mutations
const mutations = {
  // 设置热门文章
  SET_ARTICLES_HOT(state, data) {
    state.articles.hot = data
  },
  // 设置归档数据
  SET_PLACE_ON_FILE(state, data) {
    state.placeOnFile = data
  },
  // 设置指定时间段的文章
  SET_ARTICLES_TIME(state, data) {
    state.articles.time = data
  },
  // 设置文章总数
  SET_ARTICLES_SUM(state, data) {
    state.articles.sum = data
  },
  // 设置所有的文章
  SET_ARTICLES_ALL(state, data) {
    state.articles.all = data
  },
  // 设置生活类文章
  SET_ARTICLES_LIFE(state, data) {
    state.articles.life = data
  },
  // 设置科技文章
  SET_ARTICLES_TECH(state, data) {
    state.articles.technical = data
  },
  SET_ARTICLES_ONLY(state, onlyArticles) {
    // state.articles.only = onlyArticles
    state.articles.only = [onlyArticles]
  },
  // 设置标签
  SetTags(state, data) {
    state.tags = data
  },
  // =========================================
  // 清理分页
  CLEAR_PAGE(state) {
    state.pageArr = []
  },
  // 设置请求状态
  CHANGE_CODE(state, code) {
    state.code = code
  },
  // 设置分页数据
  SET_PAGE_ARR(state, data) {
    const pageNum = Math.ceil(data / 8)
    const arr = []
    for (let i = 1; i < pageNum + 1; i++) {
      arr.push(i)
    }
    state.pageArr = arr
  },
  // 设置搜索的结果
  SET_ARTICLES_SEARCH(state, data) {
    state.articles.search = data
  },
  // 设置文章的背景图片
  PRODUCT_BG(state, data) {
    state.tagBg = []
    const pattern = /^[\u4e00-\u9fa5]+$/
    data.forEach((item) => {
      if (item.tag[0] === '服务器' || item.tag[0] === 'apache' || item.tag[0] === 'tomcat') {
        state.tagBg.push('webserver')
      } else if (item.tag[0] === '云服务器') {
        state.tagBg.push('cloundserver')
      } else if (item.tag[0] === '安全') {
        state.tagBg.push('safe')
      } else if (item.tag[0] === '响应式') {
        state.tagBg.push('response')
      } else if (pattern.test(item.tag[0])) {
        state.tagBg.push('')
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
      state.msgBoardArr.forEach((item, index) => {
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
      state.comments.forEach((item, index) => {
        if (item._id === info._id) {
          state.comments.splice(index, 1, info.add)
          return
        }
      })
    }
  },
  ADD_LOCAL_COMMENTS_LIKE(state, info) {
    if (info.replyId) {
      state.comments.forEach((item) => {
        if (item._id === info.commentId) {
          item.reply.forEach((_item) => {
            if (_item._id === info.replyId) {
              _item.like += info.type
              return
            }
          })
        }
      })
    } else {
      state.comments.forEach((item) => {
        if (item._id === info.commentId) {
          item.like += info.type
          return
        }
      })
    }
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
