<template>
  <div class="article-root-box">
    <h3 v-if="!tags.length" class="none-article">暂时没有文章，敬请期待...</h3>
    <div v-if="tags.length" class="article-root">
      <div class="articles-sum">文章总数：{{ articles.sum }} 篇</div>
      <!-- 列表展示 -->
      <div v-show="!rotate" class="stage-list">
        <ul>
          <li v-for="(item, tagIndex) in tags" :key="tagIndex">
            <a href="javascript: void(0)" @click.stop="jumpArticle(item.tag)">
              <h4>{{ tagIndex + 1 }}. {{ item.tag }}</h4>
              <span>（{{ item.num }} 篇）</span>
            </a>
          </li>
        </ul>
      </div>
      <!-- 滚筒展示 -->
      <div v-show="rotate" class="stage">
        <ul ref="container" class="rotate" @click="leftSlider">
          <li v-for="(item, index) in tags" ref="degItem" :key="index">
            <div class="deg-item-mask">
              <a href="javascript: void(0)" @click.stop="jumpArticle(item.tag)">
                {{ index + 1 }}.{{ item.tag }} （{{ item.num }} 篇）
              </a>
            </div>
          </li>
        </ul>
        <div class="left-move" @click="leftSlider"></div>
        <div class="right-move" @click="rightSlider"></div>
      </div>

      <div v-show="hiddenChange" class="change-stage">
        <button v-show="show3D" :class="{ 'active-bg': rotate }" @click="changeStage('rotate')">3D模式</button>
        <button :class="{ 'active-bg': !rotate }" @click="changeStage('list')">列表模式</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getBrowserInfo } from '@/utils/getBrowserInfo.js'
import headMixin from '@/mixins/head-mixin'

export default {
  name: 'ArticleRoot',
  mixins: [headMixin],
  data() {
    return {
      currentIndex: 0,
      reg: 0,
      rotate: true,
      hiddenChange: true,
      show3D: true
    }
  },
  head() {
    return {
      title: '技术文章'
    }
  },
  computed: {
    ...mapState({
      tags: 'tags',
      articles: 'articles'
    })
  },
  watch: {
    tags() {
      if (this.tags.length) {
        const that = this
        this.initRotate()
        window.addEventListener('resize', that.addEvent)
        if (this.tags.length < 9 && this.tags.length > 1) {
          this.rotate = true
        } else {
          this.rotate = false
          this.show3D = false
        }
      }
    }
  },
  mounted() {
    this.regBrowser()
    this.getArticlesCount({ publish: true })
    // 从别的路由跳转到当前路由，若不加条件，当前路由刷新，基于tags的
    if (this.tags.length) {
      const that = this // this.$refs会报错，因为tags还没取到
      this.initRotate()
      // 窗口大小改变重新计算锚点距离
      window.addEventListener('resize', that.addEvent)
      // 最多8个标签时显示3D旋转，否则显示列表模式
      if (this.tags.length < 9 && this.tags.length > 1) {
        this.rotate = true
      } else {
        this.rotate = false
        this.show3D = false
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.addEvent)
  },
  methods: {
    ...mapActions({
      getArticlesCount: 'GetArticlesCount'
    }),
    // 切换展示方式
    changeStage(type) {
      if (type === 'rotate') {
        this.rotate = true
      } else {
        this.rotate = false
      }
    },
    // 右滑
    rightSlider() {
      this.currentIndex++
      ;['mozTransform,webkitTransform', 'msTransform', 'oTransform', 'transform'].forEach((item) => {
        this.$refs.container.style[item] = 'rotateY(' + this.reg * this.currentIndex + 'deg)'
      })
    },
    // 左滑
    leftSlider() {
      this.currentIndex--
      ;['mozTransform,webkitTransform', 'msTransform', 'oTransform', 'transform'].forEach((item) => {
        this.$refs.container.style[item] = 'rotateY(' + this.reg * this.currentIndex + 'deg)'
      })
    },
    // 打开文章
    jumpArticle(item) {
      if (item === 'life') {
        this.$router.push({ name: 'life' })
      } else {
        this.$router.push({ name: 'techincal', params: { tag: item } })
      }
    },
    // 初始化
    initRotate() {
      this.$nextTick(() => {
        const dom = this.$refs.degItem
        const container = this.$refs.container
        const reg = 360 / dom.length
        const z = container.offsetWidth / 2 / Math.tan((reg / 2 / 180) * Math.PI) + 15
        this.reg = reg
        container.style.height = 1.618 * container.offsetWidth + 'px'
        dom.forEach((item, index) => {
          ['mozTransform,webkitTransform', 'msTransform', 'oTransform', 'transform'].forEach((_item) => {
            item.style[_item] = 'rotateY(' + (index + 1) * reg + 'deg)' + ' ' + 'translateZ(' + z + 'px)'
          })
          item.style.background = "url('/img/technical/" + index + ".jpg')  0 0 no-repeat"
          item.style.backgroundSize = '100% 100%'
        })
      })
    },
    // 添加事件
    addEvent() {
      const that = this
      // 窗口大小改变重新计算锚点距离
      this.debounce(that.initRotate, 350)
    },
    // 函数去抖，防止scroll和resize频繁触发
    debounce(func, delay) {
      // eslint-disable-next-line consistent-this
      const context = this
      const args = arguments
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(function () {
        func.apply(context, args)
      }, delay)
    },
    // 检查浏览器是否支持3D模式
    regBrowser() {
      const info = getBrowserInfo()[0]
      const brow_reg = /[a-zA-Z]+/gi
      const ver_reg = /\d+\.\d+/g
      const name = info.match(brow_reg)[0]
      const ver = info.match(ver_reg)[0]
      const warning = '您的浏览器版本过低，将无法查看3D模式'
      if (name === 'chrome' && ver < 49) {
        this.rotate = false
        this.hiddenChange = false
        alert(warning)
      }
      if (name === 'firefox' && ver < 56) {
        this.rotate = false
        this.hiddenChange = false
        alert(warning)
      }
      if (name === 'msie' && ver < 11) {
        this.rotate = false
        this.hiddenChange = false
        alert(warning)
      }
      if (name === 'safari' && ver < 11) {
        this.rotate = false
        this.hiddenChange = false
        alert(warning)
      }
      if (name === 'opera') {
        this.rotate = false
        this.hiddenChange = false
        alert('由于opera浏览器兼容性问题，您将无法查看3D模式')
      }
    }
  }
}
</script>

<style lang="scss">
.none-article {
  padding: 20px;
  margin-top: 10px;
}
.article-root-box {
  // background: #F7EDED;
  background: #faf7f7;
}
.article-root {
  margin-top: 10px;
  width: 100%;
  min-height: 576px;
  box-sizing: border-box;
  position: relative;
}
.articles-sum {
  padding-top: 10px;
  padding-left: 10px;
  color: #16a085;
}
.tips {
  padding: 5px;
  color: #b9b9b9;
  font-size: 12px;
}
.stage {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 1000px;
  -ms-perspective: 1000px;
  -moz-perspective: 1000px;
  -webkit-perspective: 1000px;
  perspective-origin: 50% 0%;
  -ms-perspective-origin: 50% 0%;
  -moz-perspective-origin: 50% 0%;
  -webkit-perspective-origin: 50% 0%;
}
.rotate {
  position: relative;
  transition: all ease 0.5s;
  transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  margin: 100px 0 150px 0;
  width: 22%;
  li {
    // list: none;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
}
.deg-item-mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    color: #eee;
    font-size: 16px;
  }
}
.left-move {
  cursor: pointer;
  background: url('../../public/img/bigmove.png') 0 0 no-repeat;
  position: absolute;
  width: 60px;
  height: 60px;
  top: 50%;
  left: 20px;
  margin-top: -30px;
}
.right-move {
  cursor: pointer;
  background: url('../../public/img/bigmove.png') -60px 0 no-repeat;
  position: absolute;
  top: 50%;
  right: 20px;
  width: 60px;
  height: 60px;
  margin-top: -30px;
}
.stage-list {
  display: flex;
  justify-content: center;
  color: #16a085;
  ul {
    width: 38%;
    margin: 20px 0 30px 0;
  }
  li {
    padding: 5px;
    width: 100%;
    a {
      width: 100%;
      display: flex;
      justify-content: space-between;
      color: #16a085;
    }
  }
}
.change-stage {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 25px;
  button {
    margin: 0 15px;
    padding: 5px;
    background: #5bc0de;
    color: #fff;
    padding: 6px 12px;
    border: 1px solid #46b8da;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
  button:hover {
    background: #46afcb;
  }
}
.change-stage .active-bg {
  background: #46afcb;
}
@media screen and(max-width: 768px) {
  .article-root {
    margin-top: 0;
    border-top: 1px solid #ccc;
  }
  .stage-list ul {
    width: 60%;
  }
  .rotate {
    margin: 60px auto;
    width: 25%;
  }
  .left-move {
    left: 5px;
  }
  .right-move {
    right: 5px;
  }
}
</style>
