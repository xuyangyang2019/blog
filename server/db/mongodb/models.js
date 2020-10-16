// scan all models defined in models:
const fs = require('fs')
const path = require('path')

const files = fs.readdirSync(path.resolve(__dirname, './models'))
const js_files = files.filter(f => {
    return f.endsWith('.js')
}, files)

// 默认导出
module.exports = {}

/**
 * 自动导入models下的所有js
 */
for (const f of js_files) {
    // console.log(`import model from file ${f}...`)
    const name = f.substring(0, f.length - 3)
    // console.log(name)
    module.exports[name] = require(path.resolve(__dirname, './models', f))
}