// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'blog', // app名称
      // cwd:'', // 应用程序所在的目录
      script: './server/server.js', // 要运行的脚本的路径。
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志日期格式，如YYYY-MM-DD HH：mm：ss
      error_file: './log/error.log', // 自定义应用程序的错误日志文件，代码错误可在此文件查找
      out_file: './log/out.log', // 自定义应用程序日志文件，如应用打印大量的标准输出，会导致pm2日志过大
      // pid_file: './log/out.log', // 自定义应用程序的pid文件
      // interpreter: '', // 指定的脚本解释器
      // interpreter_args: '', // 传递给解释器的参数
      exec_mode: 'cluster', // 应用程序启动模式，支持fork和cluster模式，默认是fork
      instances: 1, // 应用启动实例个数，仅在cluster模式有效，默认为fork
      // instances: 1, // 进程数 1、数字 2、'max'根据cpu内核数
      // min_uptime: '60s', // 最小运行时间，这里设置的是60s即如果应用程序在60s内退出，pm2会认为程序异常退出，此时触发重启max_restarts设置数量
      // max_restarts: 3, // 设置应用程序异常退出重启的次数，默认15次（从0开始计数）
      autorestart: true, // 默认为true, 发生异常的情况下自动重启
      max_memory_restart: '1G', // 最大内存限制数，超出自动重启
      watch: false, // 是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件
      // ignore_watch: '', // 忽略监听的文件夹，支持正则表达式
      // args: '', // 由传递给脚本的参数组成的字符串或字符串数组
      merge_logs: true, // 设置追加日志而不是新建日志
      // exec_interpreter: '', // 应用程序的脚本类型，默认是nodejs
      // vizion: '', // 启用/禁用vizion特性(版本控制)
      // force: '', // 默认false，如果true，可以重复启动一个脚本。pm2不建议这么做
      // restart_delay: '', // 异常重启情况下，延时重启时间
      env_test: {
        PORT: 3000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 80,
        NODE_ENV: 'production'
      }
    }
  ]
}
