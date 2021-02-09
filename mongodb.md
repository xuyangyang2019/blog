### mongodb.conf

- port=27017 #端口
- dbpath= d:/mongodb/data/db #数据库存文件存放目录
- logpath= d://mongodb/log/mongo.log #日志文件存放路径
- logappend=true #使用追加的方式写日志
- #fork=true #以守护进程的方式运行，创建服务器进程
- maxConns=100 #最大同时连接数
- noauth=true #不启用验证
- journal=true #每次写入会记录一条操作日志（通过 journal 可以重新构造出写入的数据）。
- #即使宕机，启动时 wiredtiger 会- 先将数据恢复到最近一次的 checkpoint 点，然后重放后续的 journal 日志来恢复。
- storageEngine=wiredTiger #存储引擎有 mmapv1、wiretiger、mongorocks
- bind_ip = 0.0.0.0 #这样就可外部访问了，例如从 win10 中去连虚拟机中的 MongoDB

### 打开数据库

- mongod --dbpath "d:/data/db"
- mongod --dbpath "d:/data/db" --logpath "d:/data/log/mongo.log"
- mongod --dbpath "d:/data/db" --logpath "d:/data/log/mongo.log" --logappend
- mongod --dbpath "d:/data/db" --logpath "d:/data/log/mongo.log" --logappend --auth

### 使用数据库

```bash
mongo
```

### 用户名密码启动

```bash
mongo admin -u xuyy -p
```

### 设置一个最高权限的用户的步骤

```bash
mongo
use admin
db.createUser({user:"root",pwd:"password",roles:["root"]})

db.createUser(  
  {  
    user: "admin",  
    pwd: "password",  
    roles: [{role: "userAdminAnyDatabase", db: "admin"}]  
  }  
)
```

### 创建管理员

```bash
use admin
db.auth("admin","password");
use ballmatch
db.createUser({
    user: "football",
    pwd: "password",
    roles: [{role: "readWrite",db: "ballmatch"}]
})
```

### mongodb 有哪些权限:

- read:允许用户读取指定数据库
- readWrite:允许用户读写指定数据库
- dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问 system.profile
- userAdmin：允许用户向 system.users 集合写入，可以找指定数据库里创建、删除和管理用户
- clusterAdmin：只在 admin 数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
- readAnyDatabase：只在 admin 数据库中可用，赋予用户所有数据库的读权限
- readWriteAnyDatabase：只在 admin 数据库中可用，赋予用户所有数据库的读写权限
- userAdminAnyDatabase：只在 admin 数据库中可用，赋予用户所有数据库的 userAdmin 权限
- dbAdminAnyDatabase：只在 admin 数据库中可用，赋予用户所有数据库的 dbAdmin 权限。
- root：只在 admin 数据库中可用。超级账号，超级权限
