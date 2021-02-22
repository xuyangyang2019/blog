
<template>
  <div ref="btn" class="back-to-top" @click="totop">返回</div>
</template>

<script>
export default {
  name: 'ToTop',
  props: ['domName'],
  mounted() {
    this.scroll()
  },
  methods: {
    totop() {
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
    scroll() {
      const body = window.document.querySelector(this.domName || 'body')
      body.onscroll = () => {
        const scrollTop =
          body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        const innerHeight = window.innerHeight - 500
        const opacityNum = 1 - (innerHeight - scrollTop) / innerHeight
        const resNum = opacityNum > 1 ? 1 : opacityNum
        this.$refs['btn'].style.opacity = scrollTop <= 0 ? 0 : resNum
        this.$refs['btn'].style.display = scrollTop > innerHeight ? 'block' : 'none'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.back-to-top {
  position: absolute;
  right: 0.2rem;
  bottom: 1rem;
  width: 1rem;
  height: 1rem;
//   opacity: 0;
  //   display: none;
  //   background: url('../assets/img/ToTop.png') center no-repeat;
  //   background-size: cover;
  //   z-index: 9;
}
</style>
