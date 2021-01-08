export function getBrowserInfo() {
  const agent = navigator.userAgent.toLowerCase()
  const reg_ie = /msie [\d.]+;/gi
  const reg_ff = /firefox\/[\d.]+/gi
  const reg_chrome = /chrome\/[\d.]+/gi
  const reg_saf = /safari\/[\d.]+/gi
  // IE11以下版本
  if (agent.indexOf('msie') > 0) {
    return agent.match(reg_ie)
  }
  // IE11版本中不包括MSIE字段
  if (agent.indexOf('trident') > 0 && agent.indexOf('rv') > 0) {
    return 'IE ' + agent.match(/rv:(\d+\.\d+)/)[1]
  }
  // firefox
  if (agent.indexOf('firefox') > 0) {
    return agent.match(reg_ff)
  }
  // Chrome
  if (agent.indexOf('chrome') > 0) {
    return agent.match(reg_chrome)
  }
  // Safari
  if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
    return agent.match(reg_saf)
  }
}
