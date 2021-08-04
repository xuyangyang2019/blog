import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

import { getCommets } from '../api/front'

// state
const state = {
  currentTitle: '', // 当前页面的title
  code: 404, // 页面响应
  articlesList: [], // 文章列表
  articlesTag: [], // 指定标签的文章
  pageArr: [], // 分页
  tags: [], // 标签
  placeOnFile: [], // 归档的数据
  msgBoardArr: [], // 留言信息
  searchResults: [], // 搜索结果
  articlesTime: [], // 归档的文章
  currentArticle: {
    article: {},
    pre: {},
    next: {}
  }, // 当前的文章
  // =======================================
  articles: {
    sum: 0, // 文章总数
    all: [], // 所有的文章
    // technical: [], // 科技文章
    // life: [], // 生活类文章
    search: [], // 搜索结果
    only: [], // 单个文章
    time: [], // 归档
    hot: [], // 热门文章
    pre_next: {
      pre: [],
      next: []
    }
  },
  userInfo: { name: '', imgUrl: '', email: '' }, // 用户信息
  maskShow: false, // 展示登陆框
  comments: [] // 文章评论
}

// getters
const getters = {
  article: (state) => state.currentArticle.article,
  preArticle: (state) => state.currentArticle.pre,
  nextArticle: (state) => state.currentArticle.next
}

// actions
const actions = {
  // ============================================================
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
  SET_ARTICLES_LIST: (state, data) => {
    state.articlesList = data
  },
  SET_ARTICLES_TAG: (state, data) => {
    state.articlesTag = data
  },
  SET_SEARCH_RESULTS: (state, data) => {
    state.searchResults = data
  },
  // 设置指定时间段的文章列表
  SET_ARTICLES_TIME(state, data) {
    state.articlesTime = data
  },
  SET_CURRENT_ARTICLE(state, data) {
    state.currentArticle = data
  },
  // ===================================
  // 设置归档数据
  SET_PLACE_ON_FILE(state, data) {
    state.placeOnFile = data
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
    const pageNum = Math.ceil(data / 10)
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
