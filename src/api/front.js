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

export { getTags, getArticlesByTime, getHotArticles, getArticleList, getArticlesCount, getMsgBoard, getMsgCount }
