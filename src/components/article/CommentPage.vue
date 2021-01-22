<template>
  <div class="comment">
    <div id="anchor-comment"></div>
    <h2>说点什么：</h2>
    <div class="say-box">
      <!-- 回复某人的评论 -->
      <div v-show="aite.length">
        <strong>回复：@</strong>
        <span>{{ aite }}</span>
        <span class="exit-aite" :title="'取消回复' + aite" @click="aite = ''">x</span>
      </div>
      <!-- 文本域 -->
      <textarea v-model="sayWords" placeholder="这小地盘儿交给你啦 *^_^*" @focus="showLogin"></textarea>
      <!-- 退出 -->
      <div class="icon-submit-box">
        <div class="icon-userInfo-box">
          <div class="emoji-icon" @click="emojiToggle">
            <img src="/img/emoji/grinning.png" height="20px" width="20px" alt="" />
          </div>
          <span class="fence"></span>
          <div v-show="!!userInfo.name" class="reviewer-info">
            <img :src="userInfo.imgUrl" alt="" width="20px" height="20px" />
            <span>{{ userInfo.name }}</span>
            <a href="javascript: void(0)" @click="userLogOut">退出</a>
          </div>
        </div>
        <!-- 评论 -->
        <input ref="pubButton" type="button" value="发表评论" @click="publishComment" />
      </div>
    </div>

    <!-- emoji表情 -->
    <div v-show="emojiShow" class="emoji-box">
      <span class="emoji-exit" @click="exitEmoji">x</span>
      <emoji @select="selectEmoji"></emoji>
    </div>

    <!-- 所有的评论 -->
    <div class="all-comments">
      <h2>文章评论：</h2>
      <ul>
        <li v-for="(item, index) in comments" :key="index" class="reviewer-item">
          <div class="reviewer">
            <div class="name-img-box">
              <div><img :src="item.imgUrl" alt="" /></div>
              <h3>{{ item.name }}</h3>
            </div>
            <pre><div class="rev-c" v-html="item.content"></div></pre>
            <div class="rev-details">
              <span class="icon-clock"></span>
              <span class="rev-details-time">
                {{ item.date | reviseTime }}
              </span>
              <a href="#anchor-comment" class="rev-details-reply">
                <span @click="rep(item._id, item.name)">回复</span>
              </a>
              <span
                :class="{
                  'icon-thumbsup': hasLiked.indexOf(item._id) !== -1,
                  'icon-like': hasLiked.indexOf(item._id) === -1
                }"
                @click="like(item._id)"
              ></span>
              <span>{{ item.like }}</span>
            </div>
          </div>
          <div v-if="item.reply.length > 0" class="answer">
            <ul>
              <li v-for="(reply, replyIndex) in item.reply" :key="replyIndex">
                <div class="name-img-box">
                  <div><img :src="reply.imgUrl" alt="" /></div>
                  <h3>{{ reply.name }}: @{{ reply.aite }}</h3>
                </div>
                <pre><div class="ans-c" v-html="reply.content"></div></pre>
                <div class="ans-details">
                  <span class="icon-clock"></span>
                  <span class="ans-details-time">
                    {{ reply.date | reviseTime }}
                  </span>
                  <a href="#anchor-comment" class="ans-details-reply">
                    <span @click="rep(item._id, reply.name)">回复</span>
                  </a>
                  <span
                    :class="{
                      'icon-thumbsup': hasLiked.indexOf(reply._id) !== -1,
                      'icon-like': hasLiked.indexOf(reply._id) === -1
                    }"
                    @click="likeCommont(item._id, reply._id)"
                  ></span>
                  <span>{{ reply.like }}</span>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <!-- 没有评论时显示 -->
        <li v-if="!comments.length" class="empty-comment">
          <h3>( >﹏&lg;。)哎~~没人理我</h3>
        </li>
      </ul>
    </div>

    <!-- 登陆框 -->
    <vistor-login></vistor-login>

    <!-- 错误提示框 -->
    <transition v-show="dialogErr.show" name="mask">
      <div v-show="dialogErr.show" class="mask" @click="dialogErr.show = false">
        <transition name="dialog">
          <div class="dialog" @click.stop>
            <h1>o(╯□╰)o</h1>
            <span>{{ dialogErr.info }}</span>
            <div><button @click="dialogErr.show = false">确定</button></div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import Emoji from '@/components/base/Emoji.vue'
import VistorLogin from '@/components/base/VistorLogin.vue'

import emojiData from '@/assets/js/emoji-data'
import { commentArticle } from '../../api/front'

export default {
  components: {
    Emoji,
    VistorLogin
  },
  data() {
    return {
      sayWords: '',
      content: '',
      emojiShow: false,
      replyOthers: false,
      aite: '',
      loginType: '',
      articleId: '',
      hasLiked: [],
      dialogErr: { show: false, info: '' }
    }
  },
  computed: {
    ...mapState({
      comments: 'comments',
      userInfo: 'userInfo',
      articles: 'articles'
    })
  },
  watch: {
    $route() {
      const r = this.$route
      if (r.fullPath.indexOf('#anchor-comment') === -1) {
        this.GetComments({
          id: r.params.id
          // cache: false // 推荐模块切换文章重新抓取评论
        })
      }
    }
  },
  mounted() {
    // 从localStorage读取某文章的点赞
    const key = 'articleId_comment' + this.$route.params.id
    if (localStorage.getItem(key)) {
      this.hasLiked = JSON.parse(localStorage.getItem(key))
    }
    // 从服务端获取评论
    this.GetComments({
      id: this.$route.params.id
      // cache: false
    })
  },
  methods: {
    ...mapActions({
      GetComments: 'GetComments'
      // postComment: 'PostComment',
      // addComment: 'AddComment',
      // addLike: 'AddLike'
    }),
    ...mapMutations({
      SET_USER: 'SET_USER',
      HANDLE_MASK: 'HANDLE_MASK',
      addLocalComments: 'ADD_LOCAL_COMMENTS',
      addLocalCommentsLike: 'ADD_LOCAL_COMMENTS_LIKE'
    }),
    // 用户退出登陆
    userLogOut() {
      // 重置用户信息
      this.SET_USER({ name: '', imgUrl: '', email: '' })
      // this.removeLocal()
      localStorage.removeItem('map_blog_userInfo')
      // 处理第三方登陆信息
      const pattern = /githubId/
      // const gitCookie =
      document.cookie.split(';').filter((item) => {
        return pattern.test(item)
      })
      // // 清除github登陆的cookie信息
      // if (gitCookie.length) {
      //   // 设置cookie的过期时间为一分钟前，让浏览器自动将其删除
      //   let gitId = gitCookie[0].replace(/(^\s*)|(\s*$)/, "")
      //   let exp = new Date(Date.now() - 60 * 1000)//设置为一分钟前
      //   document.cookie = gitId + ";expires=" + exp.toUTCString() + ";path=/"
      // } else {
      //   // 退出qq登陆
      //   QC.Login.signOut()
      // }
    },
    // 展示登陆框
    showLogin() {
      if (!this.userInfo.name && !this.userInfo.imgUrl) {
        this.HANDLE_MASK(true)
      }
    },
    // 展示|隐藏 emoji框
    emojiToggle() {
      this.emojiShow = !this.emojiShow
    },
    // 隐藏emoji框
    exitEmoji() {
      this.emojiShow = false
    },
    // 选emoji
    selectEmoji(emojiCode) {
      this.sayWords += emojiCode
      this.emojiShow = false
    },
    // 表单验证
    validatePub() {
      // 有用户信息
      if (!this.userInfo.name && !this.userInfo.imgUrl) {
        this.HANDLE_MASK(true)
        return true
      }
      // 非空
      if (!this.sayWords.length) {
        this.dialogErr = { show: true, info: '内容不能为空' }
        return true
      }
      // 不能多于500字
      if (this.sayWords.length > 500) {
        this.dialogErr = { show: true, info: '内容过长，请不要超过500个字符' }
        return true
      }
    },
    // emoji替换为img
    productContent() {
      let emojiObject = {}
      let finStr = this.sayWords
      finStr = finStr.replace(new RegExp('<', 'g'), '&lt')
      finStr = finStr.replace(new RegExp('>', 'g'), '&gt')
      Object.values(emojiData).forEach((item) => {
        emojiObject = Object.assign(emojiObject, item)
      })
      Object.keys(emojiObject).forEach((item) => {
        const path = '/img/emoji/'
        const value = emojiObject[item]
        const imgURL = `<span style = "display: inline-block;vertical-align: middle"><img src=${path}${value} alt="" width = "16px" height = "16px" /></span>`
        finStr = finStr.replace(new RegExp(item, 'g'), imgURL)
      })
      return finStr
    },
    // 发表评论
    publishComment() {
      // 表单验证
      if (this.validatePub()) {
        return
      }
      const content = this.productContent()
      // const that = this
      if (!this.replyOthers) {
        // 直接回复文章，一级评论
        this.$refs.pubButton.value = '发表中...'
        const { name, imgUrl } = this.userInfo
        commentArticle(name, imgUrl, content, this.$route.params.id, this.articles.only[0].title).then((res) => {
          console.log('直接回复文章，一级评论', res)
          if (res.code === 200) {
            setTimeout(() => {
              this.$refs.pubButton.value = '发表评论'
              this.sayWords = ''
              this.addLocalComments({ add: res.data, type: 1 })
            }, 200)
          }
        })
      } else {
        // 回复他人,二级评论
        console.log('回复他人,二级评论')
        // this.$refs.pubButton.value = '发表中...'
        // const uif = this.userInfo
        // this.addComment({
        //   _id: this.articleId,
        //   name: uif.name,
        //   imgUrl: uif.imgUrl,
        //   email: uif.email,
        //   aite: this.aite,
        //   content: content,
        //   like: 0,
        //   articleId: this.$route.params.id,
        //   date: Date.now()
        // }).then((data) => {
        //   if (data._id) {
        //     setTimeout(() => {
        //       that.$refs.pubButton.value = '发表评论'
        //       that.sayWords = ''
        //       that.aite = ''
        //       that.replyOthers = false
        //       that.addLocalComments({ add: data, type: 2, _id: that._id })
        //     }, 200)
        //   }
        // })
      }
    },
    // 回复评论
    rep(_id, name) {
      if (this.userInfo.name === name) {
        this.dialogErr = { show: true, info: '不能回复自己的评论！' }
        return
      }
      if (!this.userInfo.name && !this.userInfo.imgUrl) {
        this.aite = name
        this.HANDLE_MASK(true)
      } else {
        this.articleId = _id
        this.aite = name
        this.replyOthers = true
      }
    },
    // 点赞|取消点赞
    likeCommont(rev_id, rep_id) {
      if (rep_id) {
        this.handleLike(rev_id, rep_id, rep_id)
      } else {
        this.handleLike(rev_id, undefined, rev_id)
      }
    },
    // 点赞
    handleLike(rev_id, rep_id, saveLocal) {
      const that = this
      if (this.hasLiked.indexOf(saveLocal) === -1) {
        // 点赞
        this.addLike({
          revId: rev_id,
          repId: rep_id,
          addOrDel: 1
        }).then(() => {
          that.hasLiked.push(saveLocal)
          localStorage.setItem('articleId_comment' + that.$route.params.id, JSON.stringify(that.hasLiked))
          that.addLocalCommentsLike({ type: 1, rev_id: rev_id, rep_id: rep_id })
        })
      } else {
        // 取消赞
        this.addLike({
          revId: rev_id,
          repId: rep_id,
          addOrDel: -1
        }).then(() => {
          that.hasLiked.splice(that.hasLiked.indexOf(saveLocal), 1)
          localStorage.setItem('articleId_comment' + that.$route.params.id, JSON.stringify(that.hasLiked))
          that.addLocalCommentsLike({ type: -1, rev_id: rev_id, rep_id: rep_id })
        })
      }
    }
  }
}
</script>

<style lang = "scss" scoped >
#anchor-comment {
  position: relative;
  top: -55px;
}
li {
  list-style: none;
}
h2 {
  margin-left: 10px;
}
.comment {
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
.say-box {
  margin: 10px 10px 5px;
  textarea {
    font-family: 'STFangsong';
    resize: none;
    overflow-y: none;
    outline: none;
    font-size: 14px;
    padding: 5px;
    border: none;
    border-radius: 6px;
    box-sizing: border-box;
    width: 80%;
    height: 100px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
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
.exit-aite {
  margin-left: 5px;
  color: #5bc0de;
  cursor: pointer;
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
  width: 80%;
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
.all-comments {
  margin-top: 32px;
  h2 {
    margin-bottom: 20px;
    text-align: center;
  }
}
.reviewer {
  border: 1px solid #647155;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  font-family: FangSong;
}
.reviewer-item {
  margin: 10px;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
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
.rev-c,
.ans-c {
  vertical-align: middle;
  font-family: FongSong;
  font-size: 14px;
  padding: 0 10px 0 40px;
}
.answer {
  margin-left: 50px;
}
.answer li {
  border: 1px solid #647155;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
  font-family: FangSong;
  margin-top: 10px;
}
.rev-details,
.ans-details {
  display: flex;
  font-family: '微软雅黑';
  font-size: 12px;
  font-weight: 500;
  justify-content: flex-end;
  margin-right: 10px;
  a {
    color: #404040;
  }
}
.rev-details-time,
.rev-details-reply,
.ans-details-time,
.ans-details-reply {
  margin-right: 15px;
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
.icon-clock {
  margin-top: 4px;
  margin-right: 5px;
}
.icon-like,
.icon-thumbsup {
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-top: 4px;
  margin-right: 4px;
  cursor: pointer;
}

.empty-comment {
  display: flex;
  justify-content: center;
  border-radius: 3px;
  padding: 10px;
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
  .say-box textarea {
    width: 100%;
  }
  .icon-submit-box {
    width: 100%;
  }
  .emoji-box {
    width: 92%;
  }
  .comment {
    padding: 20px 5px;
  }
  .reviewer-item {
    margin: 10px 5px;
  }
  .answer {
    margin-left: 35px;
  }
  .dialog {
    width: 80%;
  }
}
</style>
