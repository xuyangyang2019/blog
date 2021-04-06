<template>
  <div class="star-bg">
    <svg width="100%" height="100%" viewBox="-400 -300 800 600" preserveAspectRatio="xMidYMid slice">
      <!-- 星星 -->
      <defs>
        <polygon id="star" points="0 -10 2 -2 10 0 2 2 0 10 -2 2 -10 0 -2 -2" fill="white" />
      </defs>
      <!-- 湖面部分 -->
      <g id="real">
        <!-- 星星背景 -->
        <g id="star-group" width="100%" height="80%" />
        <!-- 月亮部分 -->
        <g id="moon-group">
          <!-- 创建蒙版，显示月牙部分 -->
          <mask id="moon-mask">
            <circle cx="-320" cy="-225" r="30" fill="white" />
            <circle cx="-305" cy="-235" r="30" fill="black" />
          </mask>
          <!-- 月亮 -->
          <circle cx="-320" cy="-225" r="30" fill="yellow" mask="url(#moon-mask)" />
        </g>
        <!-- 灯塔部分 -->
        <g id="light-tower" transform="translate(350,0)">
          <defs>
            <!-- 灯塔的颜色，线性渐变 -->
            <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#999" />
              <stop offset="1" stop-color="#333" />
            </linearGradient>
            <!-- 灯光的颜色，径向渐变 -->
            <radialGradient id="light" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stop-color="rgba(255,255,255,.8)" />
              <stop offset="1" stop-color="rgba(255,255,255,0)" />
            </radialGradient>
            <!-- 光圈三角形路径 -->
            <clipPath id="light-clip">
              <polygon points="0,-50 -400,-65 -400,-35" fill="rgba(255,0,0,.5)">
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 0 -50"
                  to="360 0 -50"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </polygon>
            </clipPath>
          </defs>
          <!-- 灯光发射点 -->
          <circle cx="0" cy="-50" r="2" fill="white" />
          <!-- 灯塔 -->
          <polygon points="0,-50 5,0 -5,0" fill="url(#tower)" />
          <!-- 灯光 -->
          <ellipse cx="0" cy="-50" rx="300" ry="100" fill="url(#light)" clip-path="url(#light-clip)" />
        </g>
      </g>
      <!-- 绘制反射,倒影部分 -->
      <g id="reflact" transform="translate(0,0)" mask="url(#fading)">
        <defs>
          <!-- 倒影的颜色，线性渐变 -->
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="rgba(255,255,255,0.3)" />
            <stop offset="0.5" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
          <mask id="fading">
            <!-- 倒影 -->
            <rect x="-400" y="0" width="800" height="600" fill="url(#fade)" />
          </mask>
        </defs>
        <use xlink:href="#real" transform="scale(1,-1) " />
        <line x1="-400" y1="0" x2="400" y2="0" stroke="white" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  mounted() {
    const SVG_NS = 'http://www.w3.org/2000/svg'
    const XLINK_NS = 'http://www.w3.org/1999/xlink'
    renderStar() // 创建引用的use标签

    function use(origin) {
      const _use = document.createElementNS(SVG_NS, 'use')
      _use.setAttributeNS(XLINK_NS, 'xlink:href', '#' + origin.id)
      return _use
    }

    // 产生最大值最小值之间的随机数随机数
    function random(min, max) {
      return min + (max - min) * Math.random()
    }

    function renderStar() {
      const starRef = document.getElementById('star')
      const starGroup = document.getElementById('star-group')
      let starCount = 100
      let star
      while (starCount--) {
        star = use(starRef)
        // 改变透明度，位置和大小
        star.setAttribute('opacity', random(0.3, 0.6))
        star.setAttribute(
          'transform',
          'translate(' + random(-400, 400) + ',' + random(-300, 0) + ')' + 'scale(' + random(0.1, 0.6) + ')'
        )
        starGroup.appendChild(star) // 添加星星
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.star-bg {
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  background: black;
}
</style>
