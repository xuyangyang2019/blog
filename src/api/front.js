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

export { getTags, getArticlesByTime, getHotArticles, getArticleList }
