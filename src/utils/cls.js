export function cls(cls) {
  if (document.getElementsByClassName) {
    return document.getElementsByClassName(cls)[0]
  } else {
    const arr = document.getElementsByTagName('*')
    const tempArr = []
    for (let i = 0; i < arr.length; i++) {
      const clsArr = arr[i].className.split(' ')
      for (let k = 0; k < clsArr.length; k++) {
        if (clsArr[k] === cls) {
          tempArr.push(arr[i])
        }
      }
    }
    return tempArr[0]
  }
}
