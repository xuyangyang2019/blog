export function getScrollTop() {
  // documentElement 对应的是 html 标签，而 body 对应的是 body 标签
  // 在标准w3c下，document.body.scrollTop恒为0
  // return document.documentElement.scrollTop || document.body.scrollTop
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}
