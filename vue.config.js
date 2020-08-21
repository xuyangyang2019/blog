// vue.config.js
const path = require("path")
const webpack = require("webpack") //导入 webpack 模块

// 包体积分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

function resolve(dir) {
  return path.join(__dirname, dir)
}

console.log("当前的env环境")
console.log(process.env.NODE_ENV)
console.log(process.env.VUE_APP_CURRENTMODE)

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
  // 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
  // baseUrl 从 Vue CLI 3.3 起已弃用，请使用publicPath
  // baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  // outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
  outputDir: "admin-dist", //打包后的目录名称
  // outputDir: process.env.outputDir, //打包后的目录名称

  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static", // 静态资源目录名称
  // 指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
  // indexPath: "index.html",
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
  // 你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: false,

  // lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true,
  // 如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
  // lintOnSave: process.env.NODE_ENV !== 'production',

  // 是否使用包含运行时编译器的 Vue 构建版本。
  // 设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false)
  // runtimeCompiler: false,

  /**
   * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
   * 打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
   * map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
   * 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
   * */
  productionSourceMap: false,

  // 它支持webPack-dev-server的所有选项
  devServer: {
    host: "localhost",
    port: 8081, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    // proxy: 'http://localhost:6180' // 配置跨域处理,只有一个代理
    // 配置多个代理
    proxy: {
      "/api": {
        target: "http://localhost:6180", // 要访问的接口域名
        ws: true, // 是否启用websockets
        // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，
        // 这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true,
        pathRewrite: {
          // 这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，
          // 直接写'/api/user/add'即可
          "^/api": "/api"
        }
      },
      "/ueditor": {
        target: "http://localhost:6180",
        changeOrigin: true,
        pathRewrite: {
          "^/ueditor": "/ueditor"
        }
      },
      "/img": {
        target: "http://localhost:6180",
        changeOrigin: true,
        pathRewrite: {
          "^/img": "/img"
        }
      }
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
    // quill-image-resize-module的配置
    config.plugin("provide").use(webpack.ProvidePlugin, [
      {
        "window.Quill": "quill"
      }
    ])
  },

  configureWebpack: (config) => {
    // 生产环境打包分析体积
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [new BundleAnalyzerPlugin()]
      }
    } else {
      config.devtool = "eval-source-map"
    }
  },

  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: `@import "~@/styles/mixin.scss";
                    @import "~@/styles/_var.scss";
                    `
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `data` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "@/styles/mixin.scss";
         @import "@/styles/_var.scss";`
      }
    }
  },

  pluginOptions: {
    // electronBuilder: {
    //   // chainWebpackMainProcess: config => {
    //   //     // Chain webpack config for electron main process only
    //   // },
    //   // chainWebpackRendererProcess: config => {
    //   //     // Chain webpack config for electron renderer process only
    //   //     // The following example will set IS_ELECTRON to true in your app
    //   //     //     config.plugin('define').tap(args => {
    //   //     //         args[0]['IS_ELECTRON'] = true
    //   //     //         return args
    //   //     //     })
    //   // },
    //   // Use this to change the entrypoint of your app's main process
    //   // mainProcessFile: 'src/background.js',
    //   // Provide an array of files that, when changed, will recompile the main process and restart Electron
    //   // Your main process file will be added by default
    //   // mainProcessWatch: [],
    //   // [1.0.0-rc.4+] Provide a list of arguments that Electron will be launched with during "electron:serve",
    //   // which can be accessed from the main process (src/background.js).
    //   // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
    //   // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
    //   // mainProcessArgs: ['--arg-name', 'arg-value']
    //   builderOptions: {
    //     appId: "com.jubochat.app",
    //     // "productName": "juliao", // 项目名，也是生成的安装文件名，即aDemo.exe
    //     copyright: "Copyright © 2019 jubotech", // 版权信息
    //     // "directories": {
    //     //     "output": "./dist_electron" // 输出文件路径
    //     // },
    //     // "asar": true,
    //     // "dmg": {
    //     //     "contents": [
    //     //         {
    //     //             "x": 410,
    //     //             "y": 150,
    //     //             "type": "link",
    //     //             "path": "/Applications"
    //     //         },
    //     //         {
    //     //             "x": 130,
    //     //             "y": 150,
    //     //             "type": "file"
    //     //         }
    //     //     ]
    //     // },
    //     mac: {
    //       icon: "./public/app.icns"
    //     },
    //     win: {
    //       // win相关配置
    //       icon: "./public/app.ico" // 图标，当前图标在根目录下，注意这里有两个坑
    //       // "target": [
    //       //     {
    //       //         "target": "nsis", // 利用nsis制作安装程序
    //       //         "arch": [
    //       //             "x64", // 64位
    //       //             "ia32" // 32位
    //       //         ]
    //       //     }
    //       // ]
    //     },
    //     nsis: {
    //       oneClick: false, // 是否一键安装
    //       allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
    //       allowToChangeInstallationDirectory: true, // 允许修改安装目录
    //       installerIcon: "./public/app.ico", // 安装图标
    //       uninstallerIcon: "./public/app.ico", //卸载图标
    //       installerHeaderIcon: "./public/app.ico", // 安装时头部图标
    //       createDesktopShortcut: true, // 创建桌面图标
    //       createStartMenuShortcut: true, // 创建开始菜单图标
    //       shortcutName: "聚聊" // 图标名称
    //     }
    //     // "publish": [
    //     //     {
    //     //         "provider": "generic",
    //     //         "url": "http://**.**.**.**:3001/download/",//隐藏版本服务器地址
    //     //     }
    //     // ]
    //   }
    // }
  }
}
