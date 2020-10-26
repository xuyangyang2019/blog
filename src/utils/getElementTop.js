// 查询指定element到根元素顶端的距离
export function getElementTop(ele) {
  // 当前元素顶端距离父元素顶端距离,鼠标滚轮不会影响其数值
  let actualTop = ele.offsetTop;
  let current = ele.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent
  }
  return actualTop
}
