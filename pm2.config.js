module.exports = {
  apps: [
    {
      name: 'xyy-blog', // app名称
      script: './server/server.js', // 要运行的脚本的路径。
      // args: '', // 由传递给脚本的参数组成的字符串或字符串数组
      output: './log/out.log',
      error: './log/error.log',
      log: './log/combined.outerr.log',
      merge_logs: true, // 集群的所有实例的日志文件合并
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      instances: 1, // 进程数 1、数字 2、'max'根据cpu内核数
      max_memory_restart: '1G', // 当内存超过1024M时自动重启
      watching: true,
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
