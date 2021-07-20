const fs = require('fs')
const { logInfo } = require('../utils/log4js')

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('js') && file !== 'index.js')
const services = {}

for (const file of files) {
  // eslint-disable-next-line global-require
  const service = require(`./${file}`)
  services[`${file.replace(/\.js/, '')}`] = service
}

logInfo('Services created')

module.exports = services
