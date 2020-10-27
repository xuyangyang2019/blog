<template>
  <div class="msgboard">
    <div id="anchor-msgBoard"></div>
    <h2>我要留言：</h2>
    <div class="say-box">
      <!-- @ -->
      <div v-show="replyInfo.aite.length">
        <strong>回复：@</strong>
        <span>{{ replyInfo.aite }}</span>
        <span @click="replyInfo.aite = ''" class="exit-aite" :title="'取消回复' + replyInfo.aite">x</span>
      </div>
      <!-- 文本域 -->
      <textarea v-model="sayWords" @focus="showLogin" placeholder="这小地盘儿交给你啦 *^_^*"></textarea>
      <!-- 提交 -->
      <div class="icon-submit-box">
        <div class="icon-userInfo-box">
          <!-- emoji按钮 -->
          <div @click="emojiToggle" class="emoji-icon">
            <img src="/img/emoji/grinning.png" height="20px" width="20px" alt />
          </div>
          <!-- | -->
          <span class="fence"></span>
          <!-- 退出 -->
          <div class="reviewer-info" v-show="!!userInfo.name">
            <img :src="userInfo.imgUrl" alt width="20px" height="20px" />
            <span>{{ userInfo.name }}</span>
            <a href="javascript: void(0)" @click="loginOut">退出</a>
          </div>
        </div>
        <!-- 提交留言 -->
        <input ref="pubButton" type="button" value="留言" @click="postLeaveW" />
      </div>
    </div>

    <div class="emoji-box" v-show="emojiShow">
      <span @click="exitEmoji" class="emoji-exit">x</span>
      <emoji @select="selectEmoji"></emoji>
    </div>

    <div class="leavemsg">
      <h2>所有留言：</h2>
      <ul>
        <li v-for="item in msgBoardArr" class="board-item">
          <div class="msg-leaver">
            <div class="profile-pic">
              <img :src="item.imgUrl" alt />
            </div>
            <div class="triangle-line"></div>
            <div class="triangle-bg"></div>
            <div class="board-content">
              <h3>{{ item.name }}：</h3>
              <pre><div class="board-content-s" v-html="item.content"></div></pre>
              <div class="board-content-details">
                <span class="icon-clock"></span>
                <span class="board-content-details-time">{{ item.date | reviseTime }}</span>
              </div>
            </div>
          </div>
          <div class="admin-reply">
            <ul v-if="item.reply.length !== 0">
              <li v-for="rep in item.reply" class="board-reply-item">
                <div class="profile-pic admin-pic">
                  <img :src="rep.imgUrl" alt />
                </div>
                <div class="triangle-line"></div>
                <div class="triangle-bg"></div>
                <div class="board-content">
                  <h3>{{ rep.name }}：@{{ rep.aite }}</h3>
                  <pre><div class="board-content-s" v-html="rep.content"></div></pre>
                  <div class="board-content-details">
                    <span class="icon-clock"></span>
                    <span class="board-content-details-time">{{ rep.date | reviseTime }}</span>
                    <a href="#anchor-msgBoard" class="board-details-reply">
                      <span @click="reply(item._id, rep.name)">回复</span>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="empty-msgboard" v-if="!msgBoardArr.length">
          <h3>( >﹏<。)哎~~没人理我</h3>
        </li>
      </ul>
    </div>

    <transition name="fade">
      <page v-if="pageArr.length > 1"></page>
    </transition>

    <!-- 第三方登录 -->
    <login></login>

    <transition name="mask" v-show="dialogErr.show">
      <div class="mask" v-show="dialogErr.show" @click="dialogErr.show = false">
        <transition name="dialog">
          <div class="dialog" @click.stop>
            <h1>o(╯□╰)o</h1>
            <span>{{ dialogErr.info }}</span>
            <div>
              <button @click="dialogErr.show = false">确定</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"

import page from "@/components/base/Page"
import emoji from "@/components/base/Emoji"
import login from "@/components/userLogin/UserLogin"
import emojiData from "@/assets/js/emoji-data"

export default {
  head() {
    return {
      title: '留言 -XYY小站',
    }
  },
  // metaInfo() {
  //   return {
  //     title: "留言 -mapblog小站",
  //     meta: [{ vmid: "description", name: "description", content: "留言 -mapblog小站" }]
  //   }
  // },
  asyncData({ store, route }) {
    return Promise.all([
      store.dispatch("GetLeaveWords", {
        page: 1,
        cache: false
      }),
      store.dispatch("GetMsgCount", {
        cache: false
      })
    ])
  },
  components: {
    page,
    emoji,
    login
  },
  data() {
    return {
      sayWords: "", // 想留的言
      content: "",
      emojiShow: false, // 展示emoji框
      hasLiked: [],
      dialogErr: { show: false, info: "" },
      replyInfo: { _id: "", firstLevel: true, aite: "" }
    }
  },
  computed: {
    ...mapState({
      msgBoardArr: 'msgBoardArr', // 留言
      userInfo: 'userInfo', // 用户信息
      pageArr: 'pageArr', // 分页
    })
  },
  methods: {
    ...mapActions({
      addLeaveWords: 'AddLeaveWords',
      saveLeaveWords: 'SaveLeaveWords',
    }),
    ...mapMutations({
      set_user: 'SET_USER',
      handleMask: 'HANDLE_MASK',
      addLocalWords: 'ADD_LOCAL_WORDS'
    }),
    // 展示登陆框
    showLogin() {
      console.log('展示登陆框')
      console.log(this.userInfo)
      if (!this.userInfo.name && !this.userInfo.imgUrl) {
        this.handleMask(true)
      }
    },
    // 退出登陆
    loginOut() {
      // vuex 用户信息重置
      this.set_user({ name: "", imgUrl: "", email: "" })
      // 删除本地保存的用户信息 
      localStorage.removeItem("map_blog_userInfo")
      // 获取cookie
      // let pattern = /githubId/
      // let gitCookie = document.cookie.split(";").filter((item, index, arr) => {
      //   return pattern.test(item)
      // })
      //清除github登陆的cookie信息
      // if (gitCookie.length) {
      //   //设置cookie的过期时间为一分钟前，让浏览器自动将其删除
      //   let gitId = gitCookie[0].replace(/(^\s*)|(\s*$)/, "")
      //   let exp = new Date(Date.now() - 60 * 1000)//设置为一分钟前
      //   document.cookie = gitId + ";expires=" + exp.toUTCString() + ";path=/"

      // } else {
      //   QC.Login.signOut()
      // }
    },
    // 留言
    postLeaveW() {
      console.log('postW')
      if (!this.validatePub()) return
      let content = this.productContent()
      let ui = this.userInfo
      this.$refs.pubButton.value = "发表中..."
      if (this.replyInfo.firstLevel) {
        this.saveLeaveWords({
          name: ui.name,
          imgUrl: ui.imgUrl,
          email: ui.email,
          content: content,
          date: Date.now()
        }).then((data) => {
          if (data._id) {
            setTimeout(() => {
              this.$refs.pubButton.value = "留言"
              this.sayWords = ""
              this.addLocalWords({ add: data, type: 1 })
            }, 200)
          }
        })
      } else {
        this.addLeaveWords({
          id: this.replyInfo._id,
          name: ui.name,
          aite: this.replyInfo.aite,
          imgUrl: ui.imgUrl,
          email: ui.email,
          content: content,
          date: Date.now()
        }).then((data) => {
          if (data._id) {
            that.$refs.pubButton.value = "留言"
            that.sayWords = ""
            that.addLocalWords({ add: data, type: 2, _id: that.replyInfo._id })
          }
        })
      }
    },
    // 回复
    reply(_id, name) {
      this.replyInfo = {
        _id: _id,
        firstLevel: false,
        aite: name
      }
    },
    // 留言验证
    validatePub() {
      // 如果没有登陆
      if (!this.userInfo.name && !this.userInfo.imgUrl) {
        this.handleMask(true)
        return false
      }
      if (!this.sayWords.length) {
        this.dialogErr = { show: true, info: "内容不能为空" }
        return false
      }
      if (this.sayWords.length > 300) {
        this.dialogErr = { show: true, info: "内容过长，请不要超过300个字符" }
        return false
      }
      return true
    },
    // 留言内容emoji转图片 
    productContent() {
      let emojiObject = {}
      let finStr = this.sayWords
      finStr = finStr.replace(new RegExp("<", "g"), "&lt")
      finStr = finStr.replace(new RegExp(">", "g"), "&gt")
      // 把所有的emoji放到一个数组,之后遍历json数组，将所有的json整合到一个json
      Object.values(emojiData).forEach((item, index, arr) => {
        emojiObject = Object.assign(emojiObject, item)
      })
      // 所有key的集合，
      Object.keys(emojiObject).forEach((item) => {
        // 基本路径
        let path = "/img/emoji/"
        // 图片
        let value = emojiObject[item]
        let imgURL = `<span style = "display: inline-block;vertical-align: middle"><img src=${path}${value} alt="" width = "16px" height = "16px" /></span>`
        // content中的emoji替换为img
        finStr = finStr.replace(new RegExp(item, "g"), imgURL)
      })
      return finStr
    },
    // 展示|隐藏 emoji
    emojiToggle() {
      this.emojiShow = !this.emojiShow
    },
    // 退出emoji
    exitEmoji: function () {
      this.emojiShow = false
    },
    // 选中emoji
    selectEmoji(emojiCode) {
      this.sayWords += emojiCode
      this.emojiShow = false
    },
  }
}
</script>

<style lang = "scss" scoped >
.msgboard {
  /*background: #F7EDED;*/
  background: #faf7f7;
  margin-top: 10px;
  padding: 20px 10px;
  border-radius: 5px;
  font-size: 14px;
  color: #404040;
  h2 {
    color: #462c2c;
  }
}
#anchor-msgBoard {
  position: relative;
  top: -55px;
}
.exit-aite {
  margin-left: 5px;
  color: #5bc0de;
  cursor: pointer;
}
li {
  list-style: none;
}
h2 {
  margin-left: 10px;
}
.say-box {
  margin: 10px 10px 5px;
  textarea {
    font-family: "STFangsong";
    resize: none;
    overflow-y: none;
    outline: none;
    font-size: 14px;
    padding: 5px;
    border: none;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  }
}
.emoji {
  border-radius: 5px;
}
.emoji-box {
  /* position: absolute; */
  position: relative;
  width: 400px;
  z-index: 500;
  margin-left: 10px;
  margin-top: 2px;
  .emoji-exit {
    position: absolute;
    right: 15px;
    top: 15px;
    /* float: right;
  margin-right: 25px;
  margin-top: 15px; */
    color: red;
    cursor: pointer;
    display: inline-block;
  }
}
.icon-submit-box {
  width: 100%;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.icon-userInfo-box {
  display: flex;
  justify-content: space-between;
}
.reviewer-info {
  display: flex;
  align-items: center;
  margin-top: -5px;
  img {
    margin-left: 20px;
    cursor: pointer;
  }
  span,
  a {
    cursor: pointer;
    margin-left: 10px;
    font-size: 14px;
    color: #5bc0de;
  }
  span:hover,
  a:hover {
    color: #46afcb;
  }
}
.emoji-icon {
  img {
    margin-top: 3px;
    cursor: pointer;
  }
}
.fence {
  display: inline-block;
  margin-top: 3px;
  margin-left: 5px;
  width: 2px;
  height: 20px;
  background: #d8d8d8;
}
.leavemsg {
  margin-top: 32px;
  h2 {
    margin-bottom: 20px;
    text-align: center;
  }
}
.empty-msgboard {
  display: flex;
  justify-content: center;
  border-radius: 3px;
  padding: 10px;
}
.board-item {
  font-family: FangSong;
  box-sizing: border-box;
  padding: 5px 10px;
  width: 100%;
  pre {
    font-family: Arial;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
.board-reply-item {
  margin-left: 60px;
  padding-top: 10px;
}
.msg-leaver {
  display: flex;
  align-items: center;
}
.admin-reply li {
  display: flex;
  align-items: center;
}
.board-content {
  box-sizing: border-box;
  flex-shrink: 1; /*空间不足等比缩放*/
  width: 100%;
  border: 1px solid #647155;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  h3 {
    padding: 5px 0;
  }
}
.profile-pic img {
  width: 45px;
  height: 45px;
}
.admin-pic img {
  border-radius: 22.5px;
}
.board-content-s {
  margin-left: 15px;
}
.board-content-details {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: "微软雅黑";
  font-size: 12px;
}
.board-details-reply {
  margin: 0 5px;
  color: #404040;
}
.triangle-line {
  width: 0;
  height: 0;
  border-width: 13px;
  border-color: transparent #647155 transparent transparent;
  border-style: solid;
  position: relative;
  z-index: 2;
}
.triangle-bg {
  width: 0;
  height: 0;
  border-width: 12px;
  border-color: transparent #faf7f7 transparent transparent;
  border-style: solid;
  margin-left: -23px;
  margin-right: -2px;
  position: relative;
  z-index: 3;
}
.name-img-box {
  display: flex;
  align-items: center;
  img {
    border-radius: 18px;
    width: 36px;
    height: 36px;
  }
  h3 {
    margin-left: 5px;
  }
}
.mask {
  position: fixed;
  z-index: 1200;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /*用opacity会使子元素继承其透明度*/
}
.dialog {
  width: 30%;
  height: 200px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  background: #fff;
  margin: 150px auto;
  h1 {
    font-size: 40px;
    line-height: 40px;
  }
  span {
    display: inline-block;
    margin-top: 50px;
    color: gold;
  }
  div {
    margin-top: 45px;
  }
}
.icon-submit-box input,
.dialog button {
  background: #5bc0de;
  color: #fff;
  padding: 6px 12px;
  border: 1px solid #46b8da;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}
.icon-submit-box input:hover,
.dialog button:hover {
  background: #46afcb;
}
.icon-clock {
  margin-right: 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.dialog-enter-active,
.dialog-leave-active,
.mask-enter-active,
.mask-leave-active {
  transition: all 0.5s ease;
}
.mask-enter,
.mask-leave-to,
.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}
@media screen and(max-width: 767px) {
  .msgboard {
    margin-top: 0;
    border-top: 1px solid #ccc;
    border-radius: 0;
  }
  .say-box textarea {
    width: 100%;
  }
  .icon-submit-box {
    width: 100%;
  }
  .emoji-box {
    width: 92%;
  }
  .profile-pic img {
    width: 25px;
    height: 25px;
  }
  .dialog {
    width: 80%;
  }
  .board-item {
    padding: 5px 0;
  }
  .board-reply-item {
    margin-left: 30px;
  }
}
</style>
