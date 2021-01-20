<template>
  <transition name="mask">
    <div v-show="maskShow" class="vistor-login" @click="exitMask">
      <transition name="login">
        <div v-show="maskShow" class="login-box" @click.stop>
          <!-- 关闭 -->
          <div class="exit-login-box" @click="exitMask">X</div>

          <!-- 登陆 -->
          <div class="self-login">
            <div class="form-item">
              <div class="input-box">
                <label for="userNameId">昵称</label>
                <input
                  id="userNameId"
                  v-model="userName"
                  type="text"
                  placeholder="请输入昵称"
                  @focus="userInfoErr.name = ''"
                />
              </div>
              <div class="error-info">{{ userInfoErr.name }}</div>
            </div>

            <div class="form-item">
              <div class="input-box">
                <label for="passeordId">密码</label>
                <input
                  id="passeordId"
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  @focus="userInfoErr.email = ''"
                />
              </div>
              <div class="error-info">{{ userInfoErr.email }}</div>
            </div>

            <div class="operation">
              <button class="operation-btn" style="margin-right: 20px" @click="vistorLogin">登陆</button>
              <button class="operation-btn" @click="vistorRegister">注册</button>
            </div>
          </div>

          <!-- 第三方登陆 -->
          <div class="third-login">
            <div class="line">第三方登录</div>
            <!-- qq登陆 -->
            <!-- onclick="return window.open('https://graph.qq.com/oauth2.0/authorize?client_id=YourID&response_type=token&scope=all&redirect_uri=http://localhost:6180/qc_back.html', 'oauth2Login_10000' ,'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');" -->
            <a href="javascript: void(0)" class="login-qq" @click="open">
              <img src="/img/qq.png" alt="QQ登录" />
            </a>
            <!-- github登陆 -->
            <a href="javascript: void(0)" class="login-github" @click="open">
              <img src="/img/github.png" alt="github登录" />
            </a>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { vistorLogin } from '../../api/front'

export default {
  data() {
    return {
      userInfoErr: { name: '', email: '' }, // 错误信息
      loginType: '', // 登陆方式
      userName: '', // 用户名
      password: '' // 邮箱
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo',
      maskShow: 'maskShow'
    })
  },
  mounted() {
    this.getLocal()
    // if (!localStorage.getItem("map_blog_userInfo")) {
    //   this.qq_user_info()
    // } else {
    //   this.getLocal()
    // }
  },
  methods: {
    ...mapActions({
      // VistorLogin: 'VistorLogin',
      saveUser: 'SaveUser',
      searchUser: 'SearchUser'
      //   githubUser: 'GithubUser',
    }),
    ...mapMutations({
      set_user: 'SET_USER',
      handleMask: 'HANDLE_MASK'
    }),
    // 打开git-hub
    open() {
      alert('待实现')
      //   this.loginType = "github"
      //   let that = this,
      //     pattern = /githubId/
      //   let auth = window.open("http://localhost:6180/login/git", "_blank", "height=600,width=800,toolbar=no, menubar=no, scrollbars=no")
      //   let timer = setInterval(() => {
      //     let cookieArr = document.cookie.split(";")
      //     let gitCookie = cookieArr.filter((item, index, arr) => {
      //       return pattern.test(item)
      //     })
      //     //检测打开的窗口是否关闭
      //     if (auth.closed) {
      //       clearInterval(timer)
      //     }
      //     if (gitCookie.length) {
      //       auth.close()
      //       clearInterval(timer)
      //       let gitId = gitCookie[0].replace(/(^\s*)|(\s*$)/, "").substring(9, gitCookie[0].length)
      //       that.githubUser(gitId).then((data) => {
      //         that.set_user({ name: data[0].name, imgUrl: data[0].imgUrl, email: "" })
      //         that.handleMask(false)
      //         that.setLocal()
      //       })
      //     }
      //   }, 500)
    },
    // qq信息
    qq_user_info() {
      // let that = this
      // QC.Login(
      //   {
      //     //请求成功后的回调
      //   },
      //   function (oInfo, oOpts) {
      //     that.set_user({
      //       name: oInfo.nickname,
      //       imgUrl: oInfo.figureurl_qq_1,
      //       email: ''
      //     })
      //     that.handleMask(false)
      //     that.setLocal()
      //   },
      //   function () {
      //     console.log('退出成功')
      //   }
      // )
    },
    // 表单验证
    validateReg() {
      const eReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      const nReg = /^[0-9]*$/
      const dName = this.userName
      const dEmail = this.password
      const pattern = /admin|管理员|admin（管理员）/gi
      if (dName.length === 0) {
        this.userInfoErr.name = '请填写用户名'
      } else if (pattern.test(dName)) {
        this.userInfoErr.name = '喔唷~和管理员有点相似...换一个试试？'
      } else if (dName.length > 8) {
        this.userInfoErr.name = '用户名最长8位'
      } else if (nReg.test(dName)) {
        this.userInfoErr.name = '用户名不能全是数字'
      } else {
        this.userInfoErr.name = ''
      }
      if (dEmail.length === 0) {
        this.userInfoErr.email = '请填写邮箱'
      } else if (!eReg.test(dEmail)) {
        this.userInfoErr.email = '请填写正确的邮箱格式'
      } else {
        this.userInfoErr.email = ''
      }
    },
    // 用户登陆
    vistorLogin() {
      this.validateReg()
      // 如果没有错误信息
      if (!this.userInfoErr.name && !this.userInfoErr.email) {
        vistorLogin({ userName: this.userName, password: this.password }).then((res) => {
          console.log(res)
        })
      }
    },
    // 用户注册
    vistorRegister() {
      this.validateReg()
      // 如果没有错误信息
      if (!this.userInfoErr.name && !this.userInfoErr.email) {
        // 查询用户是否存在
        this.searchUser({ name: this.userName }).then((data) => {
          console.log(data)
          if (data.exist === 'yes') {
            this.userInfoErr.name = '该用户名已存在，换一个试试？'
          } else {
            this.saveUser({
              name: this.userName,
              email: this.password
            }).then((data) => {
              console.log(data)
              if (data.code === 200) {
                const userInfo = {
                  name: this.userName,
                  imgUrl: '/img/defaultUser.jpg',
                  email: this.password
                }
                this.set_user(userInfo)
                this.setLocal(userInfo)
                this.exitMask()
              }
            })
          }
        })
      }
    },
    // 退出登陆
    exitMask() {
      this.handleMask(false)
      this.clearErr()
    },
    // 清除错误信息
    clearErr() {
      this.userName = ''
      this.password = ''
      this.userInfoErr.name = ''
      this.userInfoErr.email = ''
    },
    // 获取本地信息
    getLocal() {
      // 如果本地的数据库有信息 就读取
      if (localStorage.getItem('map_blog_userInfo')) {
        const info = JSON.parse(localStorage.getItem('map_blog_userInfo'))
        this.set_user({
          name: info.name,
          imgUrl: info.imgUrl,
          email: info.email
        })
      }
    },
    // 设置本地的信息
    setLocal(info) {
      // let info = this.userInfo
      // let s_info = JSON.stringify({ name: info.name, imgUrl: info.imgUrl, email: info.email })
      localStorage.setItem('map_blog_userInfo', JSON.stringify(info))
    }
  }
}
</script>

<style lang = "scss" scoped >
.vistor-login {
  position: fixed;
  z-index: 1200;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /*用opacity会使子元素继承其透明度*/

  .login-box {
    position: relative;
    width: 380px;
    background: #fff;
    margin: 50px auto;
    padding: 20px;
    border-radius: 5px;
    transition: all 0.5s ease;

    .exit-login-box {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      font-size: 16px;
    }

    .self-login {
      margin-top: 20px;
      .form-item {
        height: 65px;
        .input-box {
          display: flex;
          align-items: center;
          label {
            font-size: 14px;
            width: 40px;
            font-weight: 600;
          }
          input {
            height: 24px;
            line-height: 24px;
            flex: 1 1 auto;
            font-size: 14px;
            border: 1px solid #ccc;
            padding: 3px;
            border-radius: 5px;
            outline: none;
          }
        }
        .error-info {
          color: red;
          padding: 5px 5px 5px 45px;
        }
      }

      .operation {
        display: flex;
        justify-content: center;
        /* justify-content: flex-end; */
        /* margin-top: 15px; */
        /* border: solid red 1px; */
        .operation-btn {
          color: #fff;
          background: #5bc0de;
          padding: 6px 22px;
          border: 1px solid #46b8da;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
          &:hover {
            background: #46afcb;
          }
        }
      }
    }

    .third-login {
      padding: 0 15px;
      text-align: center;
      a {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: 20px;
      }
      img {
        border: none;
        width: 100%;
        height: 100%;
      }
      .line {
        color: #b9b9b9;
        margin: 15px 0;
        font-size: 10px;
        text-align: center;
      }
    }
  }
}

.login-enter-active,
.login-leave-active,
.mask-enter-active,
.mask-leave-active {
  transition: all 0.5s ease;
}

.login-enter,
.login-leave-to {
  opacity: 0;
  transform: translateY(-400px);
}
.mask-enter,
.mask-leave-to {
  opacity: 0;
}

@media screen and(max-width: 767px) {
  .login-box {
    width: 90%;
    margin: 10px auto;
    padding: 10px;
  }
  .self-login {
    label {
      font-size: 12px;
    }
    input {
      font-size: 12px;
    }
  }
}
</style>
