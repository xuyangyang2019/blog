/**
 * 防抖
 * @param {Function} fn 回调函数
 * @param {Number} delay 延迟时间
 */
function debounce(fn, delay) {
  let timer = null // 声明计时器
  return function () {
    // eslint-disable-next-line consistent-this
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * 休眠
 * @param {Number} ms 毫秒
 */
function sleep(ms) {
  const start = Date.now()
  // eslint-disable-next-line no-empty
  while (Date.now() - start < ms) {}
}

module.exports = { debounce, sleep }
