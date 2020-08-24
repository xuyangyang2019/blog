<template>
  <div class="home">
    <div>Home</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      user: "", // 用户名
      password: "", // 密码
      err: { user: "", password: "", validate: "" }, // 错误信息
      btnInfo: { text: "登录", disabled: false } // 登录按钮的状态
    }
  },
  computed: {
    // ...mapState(["toPath"])
    ...mapGetters({
      toPath: "toPath"
    })
  },
  methods: {
    // ...mapActions(["admin/Login"]),
    // ...mapActions({
    //   login: "admin/Login"
    // }),
    // 表单验证
    validate: function(toPath) {
      let payload = {
        user: this.user,
        password: this.password
      }
      if (!this.user) {
        this.err.user = "请填写用户名"
      }
      if (!this.password) {
        this.err.password = "请填写密码"
      }
      if (!!this.password && !!this.user) {
        // 修改按钮显示的文字 不能再次点击
        this.btnInfo = { text: "登录中...", disabled: true }
        // admin 登陆
        this.$api.admin.login(payload).then((data) => {
          this.btnInfo = { text: "登录", disabled: false }
          if (data.code === 200) {
            localStorage.setItem("userName", data.name)
            localStorage.setItem("lastLogin", data.lastLogin)
            localStorage.setItem("validateToken", data.token)
            // 页面跳转
            this.$router.push({ path: toPath })
          } else if (data.code === 401) {
            // 错误提示
            this.err.validate = "用户名或密码不正确"
          }
        })
        setTimeout(() => {
          this.btnInfo = { text: "登录", disabled: false }
        }, 5000)
      }
    },
    // 清除错误信息
    clearErr: function() {
      this.err = { user: "", password: "", validate: "" }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  border: solid red 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // overflow: hidden;
  // background: url("/img/login-bg.jpeg") 0 0 no-repeat;
  // background-size: 100% 100%;
  color: #000;
}
</style>
