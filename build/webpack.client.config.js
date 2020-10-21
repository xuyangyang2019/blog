/**
 * webpack client配置
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')()
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')


const isProd = process.env.NODE_ENV === 'production'

const config = merge(baseConfig, {
  entry: {
    app: path.join(process.cwd(), 'src/entry-client.js'),
    // vendors: ['axios', "@/assets/js/prism.js"],
    // vues: ['vue', 'vuex', 'vue-router']
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
  //   optimization: {
  //     splitChunks: {
  //         chunks: "all"
  //     }
  // },
  mode: isProd ? 'production' : 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // 此插件在输出目录中,生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
    // 此插件在输出目录中,生成 index.html,用来演示spa
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/index.html'),
    //   filename: 'index.html'
    // })
  ]
})

module.exports = config