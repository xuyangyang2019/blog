<template>
  <div id="app">
    <!-- 头部导航 -->
    <PageHeader />
    <!-- 主要内容 -->
    <div class="main">
      <!-- <div id="anchor"></div> -->
      <div class="container-wrap">
        <section class="contenter">
          <!-- 页面再这里展示 -->
          <keep-alive v-if="$route.meta.keepAlive">
            <router-view />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </section>

        <!-- 右边栏 -->
        <section class="side-bar-right">
          <!-- 关于本站 -->
          <AboutMe />
          <!-- 热门文章 -->
          <HotArticles />
          <!-- 标签 -->
          <ArticleTags />
          <!-- 归档 -->
          <PlaceOnFile />
        </section>
      </div>
    </div>
    <!-- 页脚 -->
    <PageFooter />
    <!-- 回到top -->
    <ToTop />
    <!-- 背景 -->
    <StarBg />
    <div class="star-bg-my"></div>
  </div>
</template>

<script>
import PageHeader from './components/base/PageHeader.vue'
import PageFooter from './components/base/PageFooter.vue'
import ToTop from './components/base/ToTop.vue'
import StarBg from './components/outside/StarBg.vue'

import AboutMe from './components/aside/AboutMe.vue'
import ArticleTags from './components/aside/ArticleTags.vue'
import HotArticles from './components/aside/HotArticles.vue'
import PlaceOnFile from './components/aside/PlaceOnFile.vue'

export default {
  components: {
    PageHeader,
    PageFooter,
    AboutMe,
    ArticleTags,
    HotArticles,
    PlaceOnFile,
    StarBg,
    ToTop
  },
  watch: {
    // route改变
    $route() {
      // this.currentLocation(this.$route)
    }
  },
  mounted() {
    // 改变窗口大小后对导航栏状态重新进行确认
    // window.addEventListener('resize', this.windowResize)
  },
  methods: {
    // 窗口大小重置
    // windowResize() {
    //   clearTimeout(this.windowResizeTimer)
    //   this.windowResizeTimer = setTimeout(() => {
    //     console.log('窗口大小重置')
    //     // 处理函数
    //   }, 500)
    // },
    // 回到顶部
    backTop() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }
}
</script>

<style lang="scss">
// 自定义的reset
@import './styles/reset.css';
// 排版样式
// @import './styles/typo.css';
// 适应不同浏览器
// @import './styles/normalize.css';
// 公共的css
@import './styles/common.scss';
// qq表情
// @import "./styles/qqface.scss";
// 代码高亮
// @import "./assets/css/prism.css";
// ====== 第三方图标方案 ======
// 阿里的iconfont
// @import "~@/assets/iconfont/iconfont.css";
// font-awesome
@import './assets/font-awesome-4.7.0/css/font-awesome.min.css';
// @import './assets/font-awesome-4.7.0/css/font-awesome.css';
@import './assets/css/article-background.css';
// emoji雪碧图
@import './assets/css/emoji-sprite.css';

body {
  font: 400 16px/20px Arial, Helvetica, Tahoma, '华文细黑', 'Microsoft YaHei', '微软雅黑', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100%;
}

.main {
  flex: 1 1 auto;
  margin-top: 50px;
}

.container-wrap {
  position: relative;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  flex: 1 1 auto;

  .contenter {
    width: 68%;
    .nav-location {
      background: #faf7f7;
      padding: 10px;
      font-size: 14px;
      a {
        color: #16a085;
      }
      div {
        display: inline;
      }
    }
  }

  .side-bar-right {
    width: 32%;
  }
}

.star-bg-my {
  position: absolute;
  height: 100%;
  width: 100%;
  background: black;
  z-index: -2;
}

//手机端
@media screen and (max-width: 767px) {
  .container-wrap {
    flex-wrap: wrap;
    padding: 0;
    .contenter,
    .side-bar-right {
      width: 100%;
    }
  }
}

//平板
@media screen and (min-width: 768px) {
  .container-wrap {
    max-width: 760px;
    padding: 10px 30px;
    .side-bar-right {
      margin-left: 25px;
    }
  }
}

//小屏幕pc端
@media screen and (min-width: 992px) {
  .container-wrap {
    max-width: 970px;
    padding: 10px 30px;
  }
}

//大屏幕pc端
@media screen and (min-width: 1200px) {
  .container-wrap {
    max-width: 1140px;
    padding: 20px 30px;
    .side-bar-right {
      margin-left: 30px;
    }
  }
}
</style>
