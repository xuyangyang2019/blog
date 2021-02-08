const reviseTime = (value) => {
  const localTime = new Date(value)
  const year = localTime.getFullYear()
  const month = localTime.getMonth() + 1
  const day = localTime.getDate()
  const hours = localTime.getHours()
  let minutes = localTime.getMinutes()
  // seconds = localTime.getSeconds(),
  for (let i = 0; i < 10; i++) {
    if (i === minutes) {
      minutes = '0' + minutes
    }
  }
  const finTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
  // + ":" +seconds
  return finTime
}

const changeLife = (value) => {
  if (value === 'life') {
    return '生活'
  } else {
    return value
  }
}

export default {
  reviseTime,
  changeLife
}
