<template>
  <div id="app">
    <!-- 标签 -->
    <page-header></page-header>

    <!-- 主要内容 -->
    <div class="main">
      <div id="anchor"></div>
      <div class="container-wrap">
        <section class="contenter">
          <!-- 导航按钮 -->
          <div v-show="$route.name !== 'home'" class="nav-location">
            <span>当前位置：</span>
            <a href="javascript: void(0)" @click="backHome">首页</a>
            <div v-for="(item, index) in location" :key="index">
              ->
              <a href="javascript: void(0)" @click="back(item)">{{ item.showName }}</a>
            </div>
          </div>

          <!-- 页面再这里展示 -->
          <keep-alive v-if="$route.meta.keepAlive">
            <router-view />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </section>

        <!-- 右边栏 -->
        <section class="side-bar-right">
          <!-- 关于本站 -->
          <about-me></about-me>
          <!-- 推荐 -->
          <hot-articles></hot-articles>
          <!-- 标签 -->
          <article-tags></article-tags>
          <!-- 时间轴 -->
          <place-on-file></place-on-file>
        </section>
      </div>
    </div>

    <!-- 页脚 -->
    <page-footer></page-footer>

    <!-- 回到top -->
    <to-top></to-top>

    <!-- 背景 -->
    <star-bg v-show="false"></star-bg>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PageHeader from './components/base/PageHeader.vue'
import PageFooter from './components/base/PageFooter.vue'
import ToTop from './components/base/ToTop.vue'
import StarBg from './components/outside/StarBg.vue'

import AboutMe from './components/aside/AboutMe.vue'
import ArticleTags from './components/aside/ArticleTags.vue'
import HotArticles from './components/aside/HotArticles.vue'
import PlaceOnFile from './components/aside/PlaceOnFile.vue'

// html的scrollTop
// import { getScrollTop } from "@/utils/getScrollTop"
// 获取指定元素到html的距离
// import { getElementTop } from "@/utils/getElementTop"

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
  data() {
    return {
      location: [], // 导航
      timer: '' // 定时器
    }
  },
  computed: {
    ...mapState({
      currentTitle: 'currentTitle'
    })
  },
  watch: {
    // route改变
    $route() {
      if (this.$route.name === 'home') {
        this.location = []
      }
      this.currentLocation(this.$route)
    },
    // 当articleShow组件的标题变化时，
    currentTitle(val) {
      // 刷新当前位置的文章标题，防止当前文章显示上一篇文章的标题
      this.currentLocation(this.$route)
      // 修改title
      if (val) document.title = `${val} -xyy的小站`
      // 返回顶部
      // this.backTop()
    }
  },
  mounted() {
    // 计算当前的面包屑导航
    this.currentLocation(this.$route)
    //   // 改变窗口大小后对导航栏状态重新进行确认
    //   window.addEventListener('resize', this.scrollResize)
  },
  methods: {
    // 重新获取scrollTop
    // scrollResize() {
    //   this.debounce(this.getTop, 500)
    // },
    // 函数去抖，防止scroll和resize频繁触发
    // debounce: function (func, delay) {
    //   // const context = this
    //   const args = arguments
    //   // 如果有定时器 先清除
    //   if (this.timer) {
    //     clearTimeout(this.timer)
    //   }
    //   // 设置timer
    //   this.timer = setTimeout(function () {
    //     func.apply(this, args)
    //   }, delay)
    // },
    // 回到顶部
    backTop() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },

    // 跳转路由
    back(item) {
      const name = item.pathName
      if (name === 'techincal') {
        this.$router.push({ name: name, params: { articleList: item.params.tag } })
      } else if (name === 'articleShow') {
        this.$router.push({ name: name, params: { articleList: item.params.tag, id: item.params.id } })
      } else if (name === 'lifeShow') {
        this.$router.push({ name: name, params: { id: item.params.id } })
      } else {
        this.$router.push({ name: name })
      }
    },
    // 返回首页
    backHome() {
      this.location = []
      this.$router.push({ name: 'home' })
    },
    // 当前位置的路由信息表
    currentLocation(route) {
      const tag = route.params.tag
      const _tag = route.params.tag
      switch (route.name) {
        case 'article':
          this.location = [{ pathName: 'article', showName: '技术文章' }]
          break
        case 'techincal':
          this.location = [
            { pathName: 'article', showName: '技术文章' },
            { pathName: 'techincal', showName: tag, params: { tag: tag } }
          ]
          break
        case 'articleShow':
          this.location = [
            {
              pathName: 'article',
              showName: '技术文章'
            },
            {
              pathName: 'techincal',
              showName: _tag,
              params: { tag: _tag }
            },
            {
              pathName: 'articleShow',
              showName: this.currentTitle,
              params: { tag: _tag, id: route.params.id }
            }
          ]
          break
        case 'life':
          this.location = [{ pathName: 'life', showName: '生活' }]
          break
        case 'lifeShow':
          this.location = [
            { pathName: 'life', showName: '生活' },
            { pathName: 'lifeShow', showName: this.currentTitle, params: { id: route.params.id } }
          ]
          break
        case 'msgboard':
          this.location = [{ pathName: 'msgboard', showName: '留言板' }]
          break
        case 'search':
          this.location = [{ pathName: 'search', showName: '搜索' }]
          break
        case 'timeLine':
          this.location = [{ pathName: 'timeLine', showName: '时间轴' }]
          break
        default:
          // home页面没有面包屑导航
          break
      }
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
// @import './assets/font-awesome-4.7.0/css/font-awesome.min.css';
@import './assets/font-awesome-4.7.0/css/font-awesome.css';
// iconmoon图标
@import './assets/icomoon/style.css';
// emoji雪碧图
@import './assets/css/emoji-sprite.css';

body {
  font: 400 16px/20px Arial, Helvetica, Tahoma, '华文细黑', 'Microsoft YaHei', '微软雅黑', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  // height: 100%;
  // overflow: hidden;
  // overflow-y: scroll;
  // border: solid red 1px;
}

.main {
  flex: 1 1 auto;
  margin-top: 50px;
  // overflow-y: scroll;
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
  // #app {
  // margin-top: 50px;
  // }
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
