<template>
  <div class="article-show">
    <!-- 文章详情 -->
    <div class="article-show-content">
      <div v-for="(item, index) in articles.only" :key="index" class="article-body">
        <!-- 文章标题 -->
        <h2 class="article-title">{{ item.title }}</h2>
        <!-- 文章详情 -->
        <div class="article-details">
          <!-- 标签 -->
          <div class="article-details-tag">
            <span class="icon-tag-stroke i-p"></span>
            <span v-for="(tag, tagIndex) in item.tag" :key="tagIndex" class="each-tag">{{ tag | changeLife }}</span>
          </div>
          <div class="article-details-other">
            <!-- 发布时间 -->
            <div class="time">
              <span class="icon-clock i-p"></span>
              <span>{{ item.date | reviseTime }} 发表</span>
            </div>
            <!-- 阅读数|评论数|点赞数 -->
            <div class="pv-c-l">
              <span class="icon-eye i-p"></span>
              <span>{{ item.pv }} 次阅读</span>
              <span class="icon-commenting-o i-p"></span>
              <span>{{ item.commentNum }} 条评论</span>
              <span class="icon-like i-p"></span>
              <span>{{ item.likeNum }} 个赞</span>
            </div>
          </div>
        </div>
        <hr />
        <!-- 文章内容 -->
        <!-- <div v-html="item.content" class="article-body">{{ item.content }}</div> -->
        <div class="article-body" v-html="item.content"></div>

        <!-- 点赞 -->
        <div
          class="article-like"
          :class="{ 'article-like-after': lovedArr.indexOf(item._id) !== -1 }"
          @click="love(item.articleId, item._id)"
        >
          <span class="love-text">{{ love_t }}</span>
        </div>

        <!-- 文章出处 -->
        <div v-if="item.original" class="article-warning">
          <h6>本文为作者原创文章，转载请注明出处：</h6>
          <i>
            <a href="javascript: void(0)">http://www.xyy.ink{{ fullPath }}</a>
          </i>
        </div>
        <div class="article-line"></div>

        <!-- 分享栏 -->
        <h4>分享：</h4>
        <div class="share">
          <!--分享到qq  -->
          <a
            href="javascript: void(0)"
            class="design-bg-qq"
            @click="share('QQ', 'http://connect.qq.com/widget/shareqq/index.html')"
          ></a>
          <!-- 分享到qq空间 -->
          <a
            href="javascript: void(0)"
            class="design-bg-qzone"
            @click="share('qzone', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey')"
          ></a>
          <!-- 分享到新浪微博 -->
          <a
            href="javascript: void(0)"
            class="design-bg-sina"
            @click="share('sina', 'http://v.t.sina.com.cn/share/share.php')"
          ></a>
          <!-- 分享到微信 -->
          <a href="javascript: void(0)" class="design-bg-weixin" @click="showQRCode"></a>
          <!-- 分享到豆瓣 -->
          <a
            href="javascript: void(0)"
            class="design-bg-douban"
            @click="share('douban', 'http://shuo.douban.com/!service/share')"
          ></a>
        </div>

        <div class="otherArticle"></div>

        <!-- vue-qr 生成二维码 -->
        <div v-show="qrShow" class="qrcode-box">
          <p>
            <span>微信扫一扫分享到朋友圈</span>
            <span class="exit-qrcode" @click="qrShow = false">X</span>
          </p>
          <vue-qr v-show="qrShow" backgroundColor="#ccc" :logoSrc="qrLogo" :text="qrText" :size="200"></vue-qr>
        </div>

        <div class="pre-next">
          <div v-if="articles.pre_next.pre" class="pre">
            <h6>上一篇：</h6>
            <a href="javascript: void(0)">
              <span @click="jumpPn(articles.pre_next.pre)">{{ articles.pre_next.pre.title }}</span>
            </a>
          </div>
          <div v-if="articles.pre_next.next" class="next">
            <h6>下一篇：</h6>
            <a href="javascript: void(0)">
              <span @click="jumpPn(articles.pre_next.next)">{{ articles.pre_next.next.title }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论组件 -->
    <comment-page></comment-page>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { likeArticle } from '../../api/front'

import Prism from 'prismjs'
import VueQr from 'vue-qr'
import headMixin from '@/mixins/headMixin'
import CommentPage from './CommentPage.vue'

const qrLogo = require('../../../public/img/defaultUser.jpg')

export default {
  name: 'ArticleShow',
  components: {
    VueQr,
    CommentPage
  },
  mixins: [headMixin],
  asyncData({ store, route }) {
    return store.dispatch('GetArticle', {
      publish: true,
      tag: route.params.tag,
      id: route.params.id
      // cache: true
    })
  },
  data() {
    return {
      qrShow: false, // 显示二维码与否
      loveText: '赞', // 点赞文字
      lovedArr: [], // 电站的id集合
      fullPath: '', // 完整的path
      qrLogo: qrLogo, // 二维码的log
      qrText: '' // 二维码的地址
    }
  },
  head() {
    return {
      title: this.currentTitle
    }
  },
  computed: {
    ...mapState({
      articles: 'articles',
      currentTitle: 'currentTitle'
    }),
    // 是否点赞
    love_t() {
      if (this.lovedArr.indexOf(this.articles.only[0]._id) !== -1) {
        return '已赞'
      } else {
        return '赞'
      }
    },
    // 获取文章成功
    ifCatch() {
      return this.articles.only
    }
  },
  watch: {
    // 抓取数据延时较高时，确保抓取到数据之后进行一次代码样式的渲染
    ifCatch() {
      this.$nextTick(function () {
        Prism.highlightAll()
      })
    }
  },
  mounted() {
    // 读取本地的点赞数据
    if (localStorage.getItem('articleLoved')) {
      this.lovedArr = JSON.parse(localStorage.getItem('articleLoved'))
    }
    // 代码高亮
    this.$nextTick(function () {
      Prism.highlightAll()
    })
    this.getOriginUrl()
  },
  methods: {
    ...mapMutations({
      changeTitle: 'CHANGE_TITLE'
    }),
    // 点击回复按钮会在地址栏加上锚点，故刷新时去除，第三方分享链接亦如此
    getOriginUrl() {
      if (this.$route.fullPath.indexOf('#anchor-comment') > -1) {
        this.fullPath = this.$route.fullPath.substring(0, this.$route.fullPath.indexOf('#'))
      } else {
        this.fullPath = this.$route.fullPath
      }
    },
    // 点赞|取消点赞
    love(aid, _id) {
      // 如果登陆，继续操作
      // ...待实现
      if (this.lovedArr.indexOf(_id) === -1) {
        likeArticle(_id, 1, document.title).then((res) => {
          if (res.code === 200) {
            // 更新并保存点赞的状态
            this.lovedArr.push(_id)
            localStorage.setItem('articleLoved', JSON.stringify(this.lovedArr))
          }
        })
      } else {
        likeArticle(_id, -1, document.title).then((res) => {
          if (res.code === 200) {
            // 更新并保存点赞的状态
            this.lovedArr.splice(this.lovedArr.indexOf(_id), 1)
            localStorage.setItem('articleLoved', JSON.stringify(this.lovedArr))
          }
        })
      }
      // 未登陆先登陆
      // ... 待实现
    },
    // 跳转页面
    jumpPn(item) {
      console.log('跳转页面', item)
      if (item.tag[0] === 'life') {
        this.$router.push({ name: 'lifeShow', params: { id: item._id } })
      } else {
        this.$router.push({ name: 'articleShow', params: { tag: item.tag[0], id: item._id } })
      }
    },
    // 分享
    share(type, url) {
      const title = document.title + ' 这是一个积累web知识的个人博客'
      const el = document.createElement('a')
      let _href
      let _url
      if (window.location.href.indexOf('#anchor-comment') > -1) {
        _url = window.location.href.substring(0, window.location.href.indexOf('#'))
      } else {
        _url = window.location.href
      }
      el.target = '_blank'
      switch (type) {
        case 'QQ':
          _href = url + '?title=' + title + '&url=' + _url + '&desc=我分享了一篇文章，快来看看哦~' + '&site=mapblog小站'
          break
        case 'qzone':
          _href =
            url +
            '?title=' +
            title +
            '&url=' +
            _url +
            '&desc=我分享了一篇文章，快来看看哦~' +
            '&site=mapblog小站' +
            'summary='
          break
        case 'sina':
          _href = url + '?title=' + title + '&url=' + _url
          break
        case 'weixin':
          _href = url + '&url=' + _url
          break
        case 'douban':
          _href = url + '?name=' + title + '&href=' + _url
      }
      el.href = _href
      el.click()
    },
    // 展示二维码
    showQRCode() {
      this.qrShow = !this.qrShow
      this.qrText = window.location.href
    }
  }
}
</script>

<style lang = "scss" scoped>
.article-show-content {
  margin-top: 10px;
  /*background: #F7EDED;*/
  background: #faf7f7;
  color: #404040;
  font-size: 14px;
  line-height: 1.8;
  padding: 15px;
  border: 5px 5px 0 0;
  border-radius: 3px;
  hr {
    margin: 15px 0;
    height: 0;
    border: 0;
    border-top: 1px solid #ccc;
  }
  img {
    max-width: 100%;
  }
}
.article-title {
  padding: 5px 0;
  color: #16a085;
}
.article-body li {
  margin-left: 15px;
}
.article-details {
  font-size: 12px;
  line-height: 24px;
  color: #404040;
}
.article-details-tag {
  display: flex;
  align-items: center;
}
.each-tag {
  margin-right: 8px;
}
.icon-tag-stroke,
.icon-eye,
.icon-clock {
  margin-top: 2px;
}
.article-details-other {
  display: flex;
  /*align-items: center;*/
  justify-content: space-between;
  flex-wrap: wrap;
}
.i-p {
  margin: 0 5px;
}
.article-like {
  background: url('/img/love-before.png') no-repeat;
  width: 50px;
  height: 50px;
  margin: 15px auto;
  cursor: pointer;
  text-align: center;
  transition: all ease 0.5s;
}
.love-text {
  display: inline-block;
  user-select: none;
  color: #f7eded;
  margin-top: 7px;
}
.article-like-after {
  transform: rotateY(360deg);
  background: url('/img/love-after.png') no-repeat;
}
.article-like-after:hover,
.article-like:hover {
  animation: move 1.5s;
}
@keyframes move {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.article-line {
  height: 2px;
  margin-top: 10px;
  background: #ccc;
}
.share a {
  display: inline-block;
  width: 32px;
  height: 32px;
  padding: 1px;
  margin: 0 5px;
  transition: all ease 0.5s;
}
.share a:hover {
  opacity: 0.8;
  transform: rotate(360deg);
}
.share .design-bg-qq {
  margin: 0 5px 0 0;
  background: url('/img/share.png') 0 0 no-repeat !important;
}
.design-bg-qzone {
  background: url('/img/share.png') -57px 0 no-repeat !important;
}
.design-bg-sina {
  background: url('/img/share.png') -118px -71px no-repeat !important;
}
.design-bg-douban {
  background: url('/img/share.png') -118px -138px no-repeat !important;
}
.design-bg-weixin {
  background: url('/img/share.png') 0 -71px no-repeat !important;
}
.qrcode-box {
  position: fixed;
  z-index: 2000;
  p {
    padding: 0 10px;
    font-size: 14px;
    background: #ccc;
  }
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.exit-qrcode {
  float: right;
  margin-right: 2px;
  cursor: pointer;
}

.article-warning {
  h6 {
    line-height: 1.2;
    padding: 1px 0 0 5px;
    display: inline-block;
    border-left: 5px solid orange;
  }
  a {
    display: inline-block;
    color: #404040;
  }
  a:hover {
    text-decoration: underline;
    color: #16a085;
  }
}
.pre-next {
  margin-top: 10px;
  h6 {
    display: inline-block;
  }
  a {
    color: #404040;
  }
  a:hover {
    color: #16a085;
    text-decoration: underline;
  }
}
</style>
