const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const mongo = require('../../lib/mongoDB')
const { logInfo } = require('../../utils/log4js')

const files = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js') && file !== 'index.js')
const Models = {}

// 整合models
console.log(`process models ...`)

files.forEach((file) => {
  // eslint-disable-next-line global-require
  const modelFile = require(path.join(__dirname, file))
  const schema = new mongoose.Schema(modelFile.schema, modelFile.options || {})
  Models[modelFile.name] = mongo.model(modelFile.name, schema)
})

logInfo(`Models created`)

module.exports = Models
