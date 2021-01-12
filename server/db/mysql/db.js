const mysql = require('mysql')

// const connection = mysql.createConnection({
//     host: '127.0.0.1',   // 数据库地址
//     user: 'root',    // 数据库用户
//     password: '123456',   // 数据库密码
//     database: 'test'  // 选中数据库
// })

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });

// // 执行sql脚本对数据库进行读写
// connection.query('SELECT * FROM user', (error, results, fields) => {
//     if (error) throw error
//     // connected!
//     console.log(results)
// })

// // 结束会话
// connection.end();

// 创建数据池
const pool = mysql.createPool({
  host: '127.0.0.1', // 数据库地址
  user: 'root', // 数据库用户
  password: '123456', // 数据库密码
  database: 'test' // 选中数据库
})

// 在数据池中进行会话操作
pool.getConnection(function (err, connection) {
  if (err) throw err // not connected!
  // Use the connection
  connection.query('SELECT * FROM user', function (error, results, fields) {
    console.log(results)

    // When done with the connection, release it.
    connection.release()

    // Handle error after the release.
    if (error) throw error

    // Don't use the connection here, it has been returned to the pool.
  })
})

setTimeout(() => {
  pool.end(() => {
    console.log('关闭连接池')
  })
}, 1000)
