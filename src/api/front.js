/**
 * http前端接口
 * xuyangyang
 * 2021-1
 */

import fetch from '../utils/fetchFront'

/**
 * 获取技术文章的tag 生成导航
 * @param {Boolean} publish 已发布的文章标签
 */
function getTags(publish) {
  return fetch.get('/api/tags', { publish: publish })
}

export { getTags }
