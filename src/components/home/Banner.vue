<template>
  <!-- 给图片加遮罩层 -->
  <div class="page-banner">
    <!-- 图片 -->
    <ul class="banner-list">
      <transition-group tag="ul" name="slider">
        <li
          v-for="(item, index) in bannerData"
          v-show="currentIndex === index"
          :key="'banner' + index"
          class="banner-item"
          @touchmove.stop="touchMove($event, index)"
          @touchstart.stop="touchStart($event)"
          @touchend.stop="touchEnd($event)"
        >
          <!-- <img ref="img" class="banner-img" :data-src="item.url" alt="" src="/img/pic-loading.gif" /> -->
          <img ref="img" class="banner-img" alt="" :src="item.url" />
          <!-- <img class="banner-img" :src="item.url" /> -->
          <div class="banner-words">
            <div class="wellknown">
              <p>{{ item.word }}</p>
              <br />
              <p>---- {{ item.person }}</p>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
    <!-- 圆点 -->
    <div class="circle-btns">
      <div v-for="(item, index2) in bannerData" :key="index2" class="circle-btn">
        <span
          class="circle"
          :class="{ 'current-circle': index2 === currentIndex }"
          @click="chosePic(index2)"
          @mouseover="stopSlider_cpt"
          @mouseleave="startSlider"
          @touchstart="stopSlider"
          @touchend="startSlider"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0, // 当前的banner
      bannerData: [
        {
          url: '/img/banner/one.jpeg',
          dataUrl: '/img/banner/one.jpeg',
          word: 'Success is not final, failure is not fatal. It is the courage to continue that counts.',
          person: 'Winston Churchill'
        },
        {
          url: '/img/pic-loading.gif',
          dataUrl: '/img/banner/two.jpeg',
          word:
            '生命中最伟大的光辉不在于永不坠落，而是坠落后总能再度升起。我欣赏这种有弹性的生命状态，快乐地经历风雨，笑对人生。',
          person: '曼德拉'
        },
        {
          url: '/img/pic-loading.gif',
          dataUrl: '/img/banner/three.jpeg',
          word: '时间是一只藏在黑暗中的温柔的手，在你一出神一恍惚之间，物走星移。',
          person: '龙应台'
        },
        {
          url: '/img/pic-loading.gif',
          dataUrl: '/img/banner/four.jpeg',
          word: '一个人可以被毁灭，但不能被打败。',
          person: '海明威'
        },
        {
          url: '/img/pic-loading.gif',
          dataUrl: '/img/banner/five.jpeg',
          word:
            '我要纵身跳入时代的奔走，我要纵身跳入时代的年轮：苦痛，欢乐，失败，成功，我都不问，男儿的事业原本要昼夜不停。',
          person: '歌德'
        }
      ], // banner信息
      startPos: { x: '', y: '', date: '' }, // 移动端点击的初始位置和时间
      move: { x: '', y: '' } // 移动端滑动的位置
    }
  },
  mounted() {
    this.play()
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timer)
  },
  methods: {
    // 开始轮播
    play() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.autoPlay()
    },
    // 轮播逻辑
    autoPlay() {
      this.timer = setInterval(() => {
        this.$data.currentIndex++
        if (this.currentIndex >= this.bannerData.length) {
          this.currentIndex = 0
        }
        if (this.currentIndex < 0) {
          this.currentIndex = this.bannerData.length
        }
        // 图片懒加载
        const imgDom = this.bannerData[this.currentIndex]
        if (imgDom.url !== imgDom.dataUrl) {
          this.$refs.img[this.currentIndex].src = imgDom.dataUrl
          imgDom.url = imgDom.dataUrl
        }
      }, 5000)
    },
    // 鼠标悬停 停止滑动
    stopSlider() {
      clearInterval(this.timer)
    },
    // 选择图片
    chosePic(index) {
      // 显示当前点击的图片
      this.currentIndex = index
    },
    // 鼠标离开 开始滑动
    startSlider() {
      this.play()
    },
    // 移动端也会触发mouseover事件（奇怪--），所以做一下判断，否则手动切换图片会消除定时器
    stopSlider_cpt() {
      if (!/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        // 移动端
        clearInterval(this.timer)
      }
    },
    // 移动端滑动
    touchStart(event) {
      clearInterval(this.timer)
      // touches数组对象获得屏幕上所有的touch，取第一个touch
      const touch = event.targetTouches[0]
      // console.log('touchStart', event.targetTouches)
      // 取第一个touch的坐标值
      this.startPos = { x: touch.pageX, y: touch.pageY, date: new Date().getTime() }
    },
    touchMove(event) {
      // 防止滚屏
      event.preventDefault()
      if (event.targetTouches.length > 1 || (event.scale && event.scale !== 1)) return
      // console.log('touchMove', event.targetTouches)
      const touch = event.targetTouches[0]
      // console.log('touchMove', touch)
      this.move.x = touch.pageX - this.startPos.x
      this.move.y = touch.pageY - this.startPos.y
    },
    touchEnd() {
      const changeX = this.move.x
      const changeY = this.move.y
      const changeDate = new Date().getTime() - this.startPos.date
      // console.log(changeDate)
      // 长按事件
      if (changeDate > 1000) return
      // 也可以加上滑动长度限制
      if (Math.abs(changeX) > 150) return
      // 滑动和点击事件处理
      if (Math.abs(changeX) > Math.abs(changeY)) {
        // 左右事件
        if (changeX > 0) {
          // console.log('右滑')
          if (this.currentIndex === 0) {
            this.currentIndex = this.bannerData.length - 1
          } else {
            this.currentIndex--
          }
        } else {
          // console.log('左滑')
          if (this.currentIndex >= this.bannerData.length - 1) {
            this.currentIndex = 0
          } else {
            this.currentIndex++
          }
        }
      } else if (Math.abs(changeY) > Math.abs(changeX)) {
        // 上下事件
        if (changeY > 0) {
          // console.log('下滑')
        } else {
          // console.log('上滑')
        }
      } else {
        // console.log('点击')
      }
      // 重置move
      this.move = { x: 0, y: 0, date: '' }
      // 开始轮播
      this.play()
    },
    // ============================= 另外的方法实现轮播 ==================================
    // 实现图片懒加载
    lazyLoad() {
      this.$refs.img.forEach((item, index) => {
        if (index === this.currentIndex) {
          // 清除定时器，防止图片还没加载完成就轮播到下一张
          clearInterval(this.timer)
          const img = new Image()
          img.src = item.dataset.src
          img.onload = () => {
            item.src = img.src
            this.slider()
          }
        }
      })
    },
    // 滑动
    slider() {
      this.timer = setInterval(() => {
        if (this.currentIndex < this.bannerData.length - 1) {
          this.currentIndex++
          this.lazyLoad()
        } else {
          this.currentIndex = 0
          this.lazyLoad()
        }
      }, 5000)
    }
  }
}
</script>

<style lang="scss">
.page-banner {
  height: 250px;
  position: relative;
  .banner-list {
    width: 100%;
    height: 100%;
    .banner-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .banner-img {
        width: 100%;
        height: 100%;
      }
      .banner-words {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        .wellknown {
          box-sizing: border-box;
          width: 100%;
          color: #eee;
          padding: 0 25px;
          line-height: 1.5;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }

  .circle-btns {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    z-index: 250;
    .circle-btn {
      display: inline-block;
      width: 20px;
      height: 20px;
      text-align: center;
      .circle {
        display: inline-block;
        transition: all ease-in 0.5s;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #eee;
        cursor: pointer;
      }
      .current-circle {
        width: 20px;
        height: 8px;
        border-radius: 4px;
        background: orange;
      }
    }
  }
}

.slider-enter,
.slider-leave-to {
  opacity: 0;
}

.slider-enter-active,
.slider-leave-active {
  transition: all ease 0.5s;
}

@media screen and (max-width: 768px) {
  // .banner {
  //   margin-top: -50px;
  // }
}
</style>
