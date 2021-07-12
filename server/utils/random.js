/**
 * 任意范围的随机数生成函数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * 任意范围的随机整数生成函数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 返回随机字符
 * @param {Number} length 字符串长度
 */
function randomStr(length) {
  let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  ALPHABET += 'abcdefghijklmnopqrstuvwxyz'
  ALPHABET += '0123456789-_'
  let str = ''
  for (let i = 0; i < length; ++i) {
    const rand = Math.floor(Math.random() * ALPHABET.length)
    str += ALPHABET.substring(rand, rand + 1)
  }
  return str
}

module.exports = {
  getRandomArbitrary,
  getRandomInt,
  randomStr
}
