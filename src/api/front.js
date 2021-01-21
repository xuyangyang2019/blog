/**
 * http前端接口
 * xuyangyang
 * 2021-1
 */

import fetch from '../utils/fetchFront'

/**
 * 获取热门文章
 */
function getHotArticles() {
  return fetch.get('/api/getArticlesByPv')
}

/**
 * 归档
 * @param {Boolean} publish 是否已发布 true or false
 */
function getArticlesByTime(publish) {
  return fetch.get('/api/getArticlesByTime', { publish: publish })
}

/**
 * 获取技术文章的tag 生成导航
 * @param {Boolean} publish 是否已发布 true or false
 */
function getTags(publish) {
  return fetch.get('/api/tags', { publish: publish })
}

/**
 * 分页查询文章
 * @param {Boolean} publish 是否发布
 * @param {String} tag 标签
 * @param {Number} pageNum 页码
 * @param {Number} pageSize 每页数据量
 */
function getArticleList(publish, tag, pageNum, pageSize) {
  return fetch.get('/api/getArticleList', { publish: publish, tag: tag, pageNum: pageNum, pageSize: pageSize })
}

/**
 * 通过文章_id查询文章
 * @param {Boolean} publish 是否发表
 * @param {String} tag 标签名
 * @param {String} id 文章的内部id
 */
function getArticle(publish, tag, id) {
  return fetch.get('/api/getArticle', { publish: publish, tag: tag, id: id })
}

/**
 * 获取文章总数
 * @param {Boolean} publish 是否发表
 */
function getArticlesCount(publish) {
  return fetch.get('/api/getArticlesCount', { publish: publish })
}

/**
 * 获取留言
 * @param {Number} pageNum
 * @param {Number} pageSize
 */
function getMsgBoard(pageNum, pageSize) {
  return fetch.get('/api/getMsgBoard', { pageNum: pageNum, pageSize: pageSize })
}

/**
 * 获取留言总数
 */
function getMsgCount() {
  return fetch.get('/api/getMsgCount')
}

/**
 * 获取指定文章的评论
 * @param {String} id 文章的_id
 */
function getCommets(id) {
  return fetch.get('/api/getComments', { id: id })
}

/**
 * 游客登陆
 * @param {String} userName 用户名
 * @param {String} password 密码
 */
function vistorLogin(userName, password) {
  return fetch.post('/api/vistorLogin', { userName: userName, password: password })
}

/**
 * 游客注册
 * @param {String} userName 用户名
 * @param {String} password 密码
 */
function vistorRegister(userName, password) {
  return fetch.post('/api/vistorRegister', { userName: userName, password: password })
}

/**
 * 点赞文章
 * @param {String} id 文章的_id
 * @param {Number} number 点赞1 取消点赞-1
 * @param {String} title 文章的标题
 */
function likeArticle(id, number, title) {
  return fetch.patch('/api/likeArticle', { id: id, number: number, title: title })
}

/**
 * 评论文章
 * @param {*} name 用户名
 * @param {*} avatar 用户头像
 * @param {*} content 评论内容
 * @param {*} articleId 文章id
 * @param {*} articleTitle 文章标题
 */
function commentArticle(name, avatar, content, articleId, articleTitle) {
  const parameters = {
    name: name,
    imgUrl: avatar,
    content: content,
    articleId: articleId,
    title: articleTitle,
    reply: [],
    like: 0,
    date: new Date().getTime()
  }
  return fetch.post('/api/commentArticle', parameters)
}

// // 发表评论
// PostComment({ commit }, payload) {
//   return api.post('/api/saveComment', payload)
// },
// // 回复评论
// AddComment({ commit }, payload) {
//   return api.patch('/api/addComment', payload)
// }
// // 点赞评论
// AddLike({ commit }, payload) {
//   return api.patch('/api/addLike', payload)
// },

export {
  getTags,
  getArticlesByTime,
  getHotArticles,
  getArticleList,
  getArticlesCount,
  getArticle,
  likeArticle,
  commentArticle,
  getMsgBoard,
  getMsgCount,
  getCommets,
  vistorLogin,
  vistorRegister
}
