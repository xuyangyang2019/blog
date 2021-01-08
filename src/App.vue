<template>
  <div id="app">
    <!-- 主要内容 -->
    <div class="main">
      <div id="anchor"></div>
      <div class="body-content">
        <!-- 标签 -->
        <tab></tab>
        <!-- 主要内容 -->
        <div class="container">
          <section class="section">
            <!-- 文章 -->
            <div class="content">
              <!-- 导航按钮 -->
              <div class="location" v-show="$route.name !== 'home'">
                <span>当前位置：</span>
                <a href="javascript: void(0)" @click="backHome">首页</a>
                <div v-for="item in location">
                  ->
                  <a href="javascript: void(0)" @click="back(item)">{{ item.showName }}</a>
                </div>
              </div>
              <!-- 页面再这里展示 -->
              <keep-alive v-if="$route.meta.keepAlive">
                <router-view />
              </keep-alive>
              <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
            <!-- 右边栏 -->
            <div class="r-slide">
              <div class="r-slide-content">
                <!-- 关于本站 -->
                <about></about>
                <!-- 推荐 -->
                <hot></hot>
                <!-- 标签 -->
                <gateWay></gateWay>
                <!-- 时间轴 -->
                <file-on-place></file-on-place>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <foot></foot>

    <!-- 动画效果 -->
    <transition name="fade">
      <div class="rocket" v-show="showBackTop">
        <a href="javascript: void(0)" @click="backTop"></a>
      </div>
    </transition>

    <!-- 背景 -->
    <div class="fix-bg"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"

import tab from "@/components/base/Tab"
import about from "@/components/base/About"
import hot from "@/components/base/Hot"
import gateWay from "@/components/base/GateWay"
import fileOnPlace from "@/components/base/FileOnPlace"
import foot from "@/components/base/Foot"

// html的scrollTop
// import { getScrollTop } from "@/utils/getScrollTop"
// 获取指定元素到html的距离
// import { getElementTop } from "@/utils/getElementTop"

export default {
  data() {
    return {
      location: [],
      timer: "",
      showBackTop: true, // 展示回到top的按钮
    }
  },
  components: {
    tab,
    gateWay,
    fileOnPlace,
    about,
    hot,
    foot
  },
  watch: {
    // route改变
    $route() {
      if (this.$route.name === "home") {
        this.location = []
      }
      this.currentLocation(this.$route)
    },
    // 当articleShow组件的标题变化时，
    currentTitle(val) {
      // 刷新当前位置的文章标题，防止当前文章显示上一篇文章的标题
      this.currentLocation(this.$route)
      // 返回顶部
      this.backTop()
      // 修改title
      if (val) document.title = `${val} -xyy的小站`
      // 修改meta
      // if (head.author) document.querySelector('meta[name="author"]').setAttribute('content', `${head.author}`)
      // if (head.keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', head.keywords)
      // if (head.description) document.querySelector('meta[name="description"]').setAttribute('content', head.description)
    }
  },
  computed: {
    ...mapState({
      currentTitle: 'currentTitle'
    })
  },
  methods: {
    ...mapMutations({
      addTabBg: 'AddTabBg',
      positionTop: 'PositionTop',
    }),
    // 监听滚动和窗口
    scrollCotainer() {
      // 监听滚动
      window.addEventListener("scroll", this.scrollResize)
      // 改变窗口大小后对导航栏状态重新进行确认
      window.addEventListener("resize", this.scrollResize)
    },
    // 重新获取scrollTop
    scrollResize() {
      this.debounce(this.getTop, 500)
    },
    // 函数去抖，防止scroll和resize频繁触发
    debounce: function (func, delay) {
      let context = this
      let args = arguments
      // 如果有定时器 先清除
      if (this.timer) {
        clearTimeout(this.timer)
      }
      // 设置timer
      this.timer = setTimeout(function () {
        func.apply(context, args)
      }, delay)
    },
    // 获取基准点
    getTop() {
      // html的scrollTop
      let htmlTop = document.documentElement ? document.documentElement.scrollTop : 0
      // 如果往下滚动了 就显示回到top的按钮
      if (htmlTop > 0) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
      // 如果导航栏遮挡了 container的内容 就把tab的背景设为透明
      if (htmlTop > 50) {
        this.addTabBg(true)
      } else {
        this.addTabBg(false)
      }
      // 计算路由改变需要滚动的距离
      // let tabOffsetTop = getElementTop(this.$refs.container) - 50
      // let move = Math.abs(getScrollTop() - tabOffsetTop)
      // this.positionTop({ top: tabOffsetTop, move: move })
      this.positionTop({ top: 0, move: htmlTop })
    },
    // 跳转路由
    back(item) {
      let name = item.pathName
      if (name === "techincal") {
        this.$router.push({ name: name, params: { articleList: item.params.tag } })
      } else if (name === "articleShow") {
        this.$router.push({ name: name, params: { articleList: item.params.tag, id: item.params.id } })
      } else if (name === "lifeShow") {
        this.$router.push({ name: name, params: { id: item.params.id } })
      } else {
        this.$router.push({ name: name })
      }
    },
    // 回到顶部
    backTop() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    // 返回首页
    backHome() {
      this.location = []
      this.$router.push({ name: "home" })
    },
    // 当前位置的路由信息表
    currentLocation(route) {
      switch (route.name) {
        case "article":
          this.location = [{ pathName: "article", showName: "技术文章" }]
          break
        case "techincal":
          let tag = route.params.articleList
          this.location = [
            { pathName: "article", showName: "技术文章" },
            { pathName: "techincal", showName: tag, params: { tag: tag } }
          ]
          break
        case "articleShow":
          let _tag = route.params.articleList
          this.location = [
            {
              pathName: "article",
              showName: "技术文章"
            },
            {
              pathName: "techincal",
              showName: _tag,
              params: { tag: _tag }
            },
            {
              pathName: "articleShow",
              showName: this.currentTitle,
              params: { tag: _tag, id: route.params.id }
            }
          ]
          break
        case "life":
          this.location = [{ pathName: "life", showName: "生活" }]
          break
        case "lifeShow":
          this.location = [
            { pathName: "life", showName: "生活" },
            { pathName: "lifeShow", showName: this.currentTitle, params: { id: route.params.id } }
          ]
          break
        case "msgboard":
          this.location = [{ pathName: "msgboard", showName: "留言板" }]
          break
        case "search":
          this.location = [{ pathName: "search", showName: "搜索" }]
          break
        case "timeLine":
          this.location = [{ pathName: "timeLine", showName: "时间轴" }]
        default:
          // home页面没有面包屑导航
          break
      }
    }
  },
  mounted() {
    // 计算当前的面包屑导航
    this.currentLocation(this.$route)
    // 监听页面大小和scroll事件
    this.scrollCotainer()
    // 页面重载计算锚点距离并判断tab的背景样式
    this.getTop()
  },

}
</script>

<style lang="scss">
// @import "./styles/reset.scss";
// @import "./styles/normalize.scss";
// @import "./styles/common.scss";
// @import "./styles/qqface.scss";
// @import "~@/assets/iconfont/iconfont.css";
// @import "~@/assets/font-awesome/css/font-awesome.css";

// @import "./assets/css/prism.css";
@import './assets/icomoon/style.css';
@import './assets/css/emoji-sprite.css';

* {
  margin: 0;
  padding: 0;
}

a {
  -webkit-tap-highlight-color: transparent;
}

body {
  font: 400 16px/20px Arial, Helvetica, Tahoma, '华文细黑', 'Microsoft YaHei', '微软雅黑', sans-serif;
  color: #000;
}

#app {
  margin: 50px 0 0 0;
  height: 100%;
  overflow: hidden;
}

.main {
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
}

.body-content,
.container {
  position: relative;
}

.location {
  background: #faf7f7;
  margin-top: 10px;
  padding: 10px;
  font-size: 14px;
  a {
    color: #16a085;
  }
  div {
    display: inline;
  }
}

.section {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}

.content {
  width: 68%;
}

.r-slide {
  width: 32%;
}

.rocket {
  position: fixed;
  right: 10px;
  bottom: 10px;
  a {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url('/img/backTop.png') 0 0 no-repeat;
  }
  a:hover {
    background-position: -50px 0;
  }
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all ease 0.5s;
}

.fix-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

//手机端
@media screen and (max-width: 767px) {
  .fix-bg {
    background: #f4f4f4;
  }
  .section {
    flex-wrap: wrap;
    // padding: 10px 15px;
  }
  .section .content,
  .r-slide {
    width: 100%;
  }
  .location {
    margin-top: 0;
  }
}
//平板
@media screen and (min-width: 768px) {
  .fix-bg {
    background: url('../public/img/mainBg2.jpg') 0 0 no-repeat;
    background-size: 100% 100%;
  }
  .section {
    max-width: 760px;
    padding: 10px 30px;
  }
  .navbar {
    max-width: 820px;
  }
  .search {
    padding: 0 30px;
  }
  .nav-header {
    padding: 0 20px 0 35px;
  }
  .r-slide {
    margin-left: 25px;
    margin-top: 10px;
  }
}

//小屏幕pc端
@media screen and (min-width: 992px) {
  .section {
    max-width: 970px;
    padding: 10px 30px;
  }
  .navbar {
    max-width: 1030px;
  }
}

//大屏幕pc端
@media screen and (min-width: 1200px) {
  .section {
    max-width: 1140px;
    padding: 20px 30px;
  }
  .r-slide {
    margin-left: 30px;
  }
  .navbar {
    max-width: 1200px;
  }
}
</style>