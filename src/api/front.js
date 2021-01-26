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
 * 搜索文章
 * @param {Boolean} publish 已发表
 * @param {Number} pageNum 页码
 * @param {Number} pageSize 每页数量
 * @param {String} keyword 关键词
 * @param {Date} startTime 开始时间
 * @param {Date} endTime 结束时间
 * @param {Object} sort 排序条件
 */
function searchArticle(publish, pageNum, pageSize, keyword, startTime, endTime, sort) {
  const parameters = {
    publish: publish,
    pageNum: pageNum,
    pageSize: pageSize
  }
  if (keyword) {
    parameters.keyword = keyword
  }
  if (startTime && endTime) {
    parameters.startTime = startTime
    parameters.endTime = endTime
  }
  if (sort) {
    parameters.sort = sort
  }
  return fetch.get('/api/searchArticle', parameters)
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

// ===========================================================================

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
 * 添加留言
 * @param {String} name 昵称
 * @param {String} content 内容
 * @param {String} avatar 头像
 * @param {String} email 内容
 */
function leavingMessage(name, content, avatar, email) {
  const parameters = {
    name: name,
    imgUrl: avatar,
    content: content,
    email: email,
    date: new Date().getTime()
  }
  return fetch.post('/api/leavingMessage', parameters)
}
// saveLeaveWords({ commit }, payload) {
//   return api.post('/api/saveLeaveW', payload)
// }

// 回复留言
// AddLeaveWords({ commit }, payload) {
//   return api.patch('/api/addReply', payload)
// },

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

/**
 * 回复评论
 * @param {String} commentId 评论id
 * @param {String} name 评论的人
 * @param {String} avatar 头像
 * @param {String} aite 被评论的人
 * @param {String} content 评论的内容
 */
function vistorReplyComment(commentId, name, avatar, aite, content) {
  const parameters = {
    id: commentId,
    name: name,
    aite: aite,
    content: content,
    imgUrl: avatar,
    like: 0,
    date: new Date().getTime()
  }
  return fetch.patch('/api/vistorReplyComment', parameters)
}

/**
 * 点赞评论或回复的评论
 * @param {String} commentId 评论id
 * @param {String} replyId 回复id
 * @param {Number} addOrDel 点赞 1 取消点赞 -1
 */
function likeComment(commentId, replyId, addOrDel) {
  return fetch.patch('/api/likeComment', { commentId: commentId, replyId: replyId, addOrDel: addOrDel })
}

export {
  getTags,
  getArticlesByTime,
  getHotArticles,
  getArticleList,
  getArticlesCount,
  getArticle,
  likeArticle,
  searchArticle,
  commentArticle,
  getMsgBoard,
  getMsgCount,
  leavingMessage,
  getCommets,
  vistorReplyComment,
  likeComment,
  vistorLogin,
  vistorRegister
}
