
<template>
  <transition name="fade">
    <div v-show="showRocket" ref="btn" class="back-to-top" @click="goTop">
      <i class="fa fa-rocket fa-2x" aria-hidden="true"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToTop',
  props: ['domName'],
  data() {
    return {
      showRocket: false
    }
  },
  mounted() {
    // 页面刷新后是否显示rocket
    this.showOrHideRocket()
    // 监听滚动事件
    this.domScroll()
  },
  methods: {
    // 回到top
    goTop() {
      // // 锚点
      // const body = window.document.querySelector(this.domName)
      // let scrollTop = body
      //   ? body.scrollTop
      //   : document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      // let stepNum = 10
      // const timeId = setInterval(() => {
      //   stepNum += stepNum
      //   if (scrollTop <= 0) clearInterval(timeId)
      //   const sum = (scrollTop -= stepNum)
      //   if (body) {
      //     body.scrollTop = sum
      //   } else {
      //     document.documentElement.scrollTop = sum
      //     window.pageYOffset = sum
      //     document.body.scrollTop = sum
      //   }
      // }, 80)

      // js动画
      this.rocketId = window.requestAnimationFrame(this.toTargerTop)
    },
    // 平缓滑动到指定的top
    toTargerTop() {
      // html的scrollTop
      const htmlTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop
      // 每次移动的px
      const movepx = Math.ceil((htmlTop / 250) * (1000 / 60))
      // 要到的基准点
      const baseTop = 0

      if (htmlTop < baseTop) {
        if (document.documentElement) {
          document.documentElement.scrollTop = Math.min(htmlTop + movepx, baseTop)
        } else {
          document.body.scrollTop = Math.min(htmlTop + movepx, baseTop)
        }
        // 当页面不够长使container滚动不到页面顶端时，清除定时器(适合container上方有其他元素时)
        if (baseTop === htmlTop) {
          this.$router.push({ name: this.routeName })
          window.cancelAnimationFrame(this.intervalId)
        } else {
          window.requestAnimationFrame(this.toTargerTop)
        }
      } else if (htmlTop > baseTop) {
        if (document.documentElement) {
          document.documentElement.scrollTop = Math.max(htmlTop - movepx, baseTop)
        } else {
          document.body.scrollTop = Math.max(htmlTop - movepx, baseTop)
        }
        window.requestAnimationFrame(this.toTargerTop)
      } else {
        window.cancelAnimationFrame(this.rocketId)
      }
    },
    // 监听指定元素的滚动事件
    domScroll() {
      // 要监控的元素 默认是body
      const body = window.document.querySelector(this.domName || 'body')
      // 监控
      body.onscroll = () => {
        // 通过修改样式控制显示/隐藏火箭
        // const innerHeight = window.innerHeight - 500
        // const opacityNum = 1 - (innerHeight - scrollTop) / innerHeight
        // const resNum = opacityNum > 1 ? 1 : opacityNum
        // this.$refs['btn'].style.opacity = scrollTop <= 0 ? 0 : resNum
        // this.$refs['btn'].style.display = scrollTop > innerHeight ? 'block' : 'none'
        // 通过js控制隐现
        clearTimeout(this.rocketTimer)
        this.rocketTimer = setTimeout(() => {
          const scrollTop =
            body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          this.showRocket = !!(scrollTop > 50)
        }, 500)
      }
    },
    // 展示还是隐藏火箭
    showOrHideRocket() {
      const body = window.document.querySelector(this.domName || 'body')
      const scrollTop =
        body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      this.showRocket = !!(scrollTop > 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all ease 0.5s;
}

.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 50px;
  color: #909399;
  .fa-rocket {
    transform: rotate(315deg);
  }
  &:hover {
    cursor: pointer;
    color: #c0c4cc;
  }
  //   opacity: 0;
  //   display: none;
}
</style>
