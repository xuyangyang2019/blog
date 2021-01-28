<template>
  <header class="page-header" :class="{ 'tab-bg': tabBg }">
    <div class="page-header-wrap">
      <!-- logo图片 -->
      <img class="logo-img" src="/img/logo.png" alt="" />

      <!-- 搜索栏 -->
      <div class="search-box">
        <input
          v-model="searchKey"
          class="search-input"
          type="text"
          placeholder="请输入关键词"
          @keyup.enter="searchArticle"
        />
        <span class="icon-search search-article" @click="searchArticle"></span>
      </div>

      <!-- 小屏幕下的导航按钮 -->
      <button class="toggle-btn" :class="{ 'toggle-open': show }" @click="navShow">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </button>

      <!-- 导航栏 -->
      <ul class="ul-nav" :class="{ heightZero: show }">
        <li
          v-for="(item, index) in tabs"
          :key="index"
          class="li-nav"
          :class="{ currentRoute: item.name === $route.name }"
          @click="goAnchor(item.name, index)"
        >
          <span class="nav-icon" :class="item.icon" style="margin-right: 10px"></span>
          <span v-text="item.render"></span>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

// import { getScrollTop } from "@/utils/getScrollTop"
// js动画 解决css3无法实现的动画
import { requestAnimation } from '@/utils/requestAnimation'

export default {
  data() {
    return {
      show: false, // 展示导航栏
      searchKey: '', // 搜索的关键词
      // fixed: false,
      // scrollFlag: 0,
      routeName: '', // 路由name
      intervalId: '',
      tabs: [
        { name: 'home', render: '首页', icon: 'icon-home' },
        { name: 'article', render: '文章', icon: 'icon-book' },
        { name: 'life', render: '生活', icon: 'icon-images' },
        { name: 'msgboard', render: '留言', icon: 'icon-messages' }
      ] // 导航列表
    }
  },
  computed: {
    ...mapState({
      tabBg: 'tabBg',
      anchorScroll: 'anchorScroll'
    })
  },
  mounted() {
    requestAnimation()
  },
  methods: {
    // 显示或隐藏 navs
    navShow() {
      this.show = !this.show
    },
    // 搜索
    searchArticle() {
      // 去除前后的空格
      this.searchKey = this.searchKey.replace(/(^\s*)|(\s*$)/g, '')
      if (this.searchKey.length) {
        // this.active = -1
        this.$router.push({ name: 'search', params: { searchKey: this.searchKey } })
      }
    },
    // 平缓滑动到top
    callback() {
      // html的scrollTop
      const htmlTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop
      // 每次移动的px
      const movepx = Math.ceil((this.anchorScroll.move / 250) * (1000 / 60))
      // 要到的基准点
      const bsetTop = this.anchorScroll.top
      if (htmlTop < bsetTop) {
        if (document.documentElement) {
          document.documentElement.scrollTop = Math.min(htmlTop + movepx, bsetTop)
        } else {
          document.body.scrollTop = Math.min(htmlTop + movepx, bsetTop)
        }
        // 当页面不够长使container滚动不到页面顶端时，清除定时器(适合container上方有其他元素时)
        if (bsetTop === htmlTop) {
          this.$router.push({ name: this.routeName })
          window.cancelAnimationFrame(this.intervalId)
        } else {
          window.requestAnimationFrame(this.callback)
        }
      } else if (htmlTop > bsetTop) {
        if (document.documentElement) {
          document.documentElement.scrollTop = Math.max(htmlTop - movepx, bsetTop)
        } else {
          document.body.scrollTop = Math.max(htmlTop - movepx, bsetTop)
        }
        window.requestAnimationFrame(this.callback)
      } else {
        window.cancelAnimationFrame(this.intervalId)
        this.$router.push({ name: this.routeName })
      }
    },
    // 锚点动态跳转
    goAnchor(name) {
      console.log('跳转到', name)
      // console.log(this.show)
      // this.show = !this.show
      this.show = false
      // 重复的路由不处理
      if (this.$route.name === name) return
      this.routeName = name
      this.intervalId = window.requestAnimationFrame(this.callback)
    }
  }
}
</script>

<style lang = "scss" scoped>
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.9);
  transition: all ease 0.5s;
  transform: translateZ(
    0px
  ); /*开启GPU硬件加速，提高性能和流畅的动画效果,否则其他元素有css动画时，fixed的nav有异常抖动*/
}

.tab-bg {
  background: rgba(0, 0, 0, 0.7);
  span:before,
  span:after {
    height: 0 !important;
  }
}

.page-header-wrap {
  height: 50px;
  margin: 0 auto;
  -moz-box-sizing: border-box; /*Firefox3.5+*/
  -webkit-box-sizing: border-box; /*Safari3.2+*/
  -o-box-sizing: border-box; /*Opera9.6*/
  -ms-box-sizing: border-box; /*IE8*/
  box-sizing: border-box;
  position: relative;

  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;

  .logo-img {
    order: 1;
    width: 42px;
    height: 42px;
  }

  .search-box {
    order: 3;
    margin: 10px;
    position: relative;
    .search-input {
      box-sizing: border-box;
      border: 1px solid #eee;
      height: 30px;
      width: 100%;
      border-radius: 15px;
      padding-left: 15px;
      /* outline: none; */
      /* color: #1a1a1a; */
      background: #eee;
      transition: all ease 0.3s;
      transform: translateZ(0px);
    }
    .icon-search {
      font-size: 16px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(-50%, -50%);
      color: #1a1a1a;
      cursor: pointer;
    }
  }

  .toggle-btn {
    order: 5;
    cursor: pointer;
    background: rgba(0, 0, 0, 0);
    padding: 9px 10px;
    border: 1px solid #333;
    border-radius: 4px;
    transition: all ease 0.5s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    .line {
      height: 2px;
      width: 22px;
      background: #fff;
      margin-top: 3px;
      border-radius: 1px;
    }
  }
  .toggle-open {
    background: #1a1a1a;
  }
}

@media screen and(max-width: 767px) {
  .page-header {
    background: rgba(0, 0, 0, 0.6);
  }
  .page-header-wrap {
    padding: 0 15px;
    .search-box {
      flex-grow: 1;
      min-width: 134px;
      max-width: 70%;
    }
    .ul-nav {
      position: absolute;
      top: 50px;
      left: 0;
      width: 0;
      height: 0;
      background: rgba(0, 0, 0, 0.6);
      overflow: hidden;
      transition: all ease 0.4s;
      .li-nav {
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      }
      .currentRoute {
        background: orange;
        color: #eee;
        &:hover {
          background: orange;
        }
      }
    }
    .heightZero {
      width: 100%;
      height: 300px; /*必须有确切高度 否则触发不了动画*/
    }
  }
}

@media screen and (min-width: 768px) {
  .page-header-wrap {
    max-width: 820px;
    padding: 0 30px;

    .search-box {
      display: flex;
      justify-content: flex-end;
      .search-input {
        width: 200px;
        &:focus {
          width: 300px;
        }
      }
    }
    .toggle-btn {
      display: none;
    }
    .ul-nav {
      order: 2;
      display: flex;
      position: absolute;
      top: 0;
      left: 100px;
      .li-nav {
        position: relative;
        margin-right: 15px;
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        width: 50;
        cursor: pointer;
        .nav-icon {
          display: none;
        }
      }
      .currentRoute {
        color: orange;
      }
      .li-nav :before,
      .li-nav :after {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: -3px;
        width: 100%;
        height: 3px;
        background: #eee;
        transition: all ease 0.3s;
        transform: translateZ(0);
      }
      .li-nav :hover:before {
        transform: translateY(-47px) scale(1.2);
      }
      .li-nav :hover:after {
        transform: scale(1.2);
      }
    }
  }
}

@media screen and (min-width: 992px) {
  .page-header-wrap {
    max-width: 1030px;
  }
}

@media screen and (min-width: 1200px) {
  .page-header-wrap {
    max-width: 1200px;
  }
}
</style>
