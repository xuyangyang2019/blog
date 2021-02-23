
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
    // 监听滚动事件
    this.scroll()
  },
  methods: {
    // 回到top
    goTop() {
      // 锚点
      const body = window.document.querySelector(this.domName)
      let stepNum = 10
      let scrollTop = body
        ? body.scrollTop
        : document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

      const timeId = setInterval(() => {
        stepNum += stepNum
        if (scrollTop <= 0) clearInterval(timeId)
        const sum = (scrollTop -= stepNum)
        if (body) {
          body.scrollTop = sum
        } else {
          document.documentElement.scrollTop = sum
          window.pageYOffset = sum
          document.body.scrollTop = sum
        }
      }, 80)
    },
    // 监听滚动控制图标展示或隐藏
    scroll() {
      const body = window.document.querySelector(this.domName || 'body')
      body.onscroll = () => {
        const scrollTop =
          body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        // 通过修改样式控制显示/隐藏火箭
        // const innerHeight = window.innerHeight - 500
        // const opacityNum = 1 - (innerHeight - scrollTop) / innerHeight
        // const resNum = opacityNum > 1 ? 1 : opacityNum
        // this.$refs['btn'].style.opacity = scrollTop <= 0 ? 0 : resNum
        // this.$refs['btn'].style.display = scrollTop > innerHeight ? 'block' : 'none'
        // 通过js控制隐现
        if (scrollTop > 500) {
          this.showRocket = true
        } else {
          this.showRocket = false
        }
      }
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
