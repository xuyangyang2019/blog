export function siblings(ele) {
  const arr_siblings = []
  const ele_par = ele.parentNode
  const children = ele_par.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i].nodeType == 1 && children[i] !== ele) {
      arr_siblings.push(children[i])
    }
  }
  return arr_siblings
}
