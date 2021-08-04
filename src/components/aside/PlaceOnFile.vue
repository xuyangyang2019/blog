<template>
  <div class="time-line">
    <h1 class="time-line-header">归档</h1>
    <ul class="time-line-content">
      <li v-for="(item, index) in placeOnFile" :key="index" class="time-line-item">
        <a :href="jumpTime(item.time)" target="_blank">{{ item.time }}({{ item.num }})</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { getArticlesByTime } from '../../api/front'

export default {
  name: 'PlaceOnFile',
  data() {
    return {
      placeOnFile: []
    }
  },

  mounted() {
    getArticlesByTime(true)
      .then((res) => {
        if (res.code === 200) {
          this.placeOnFile = res.data
        } else {
          this.placeOnFile = []
        }
      })
      .catch(() => {
        this.placeOnFile = []
      })
  },
  methods: {
    // 跳转到时间轴
    jumpTime(time) {
      const year = time.match(/\d+/g)[0]
      const month = parseInt(time.match(/\d+/g)[1], 10)
      return `/placeOnFile/${year}/${month}`
      // const a = document.createElement('a')
      // a.setAttribute('href', '/placeOnFile/' + date)
      // a.setAttribute('target', '_blank')
      // a.setAttribute('id', 'js_time_line_a')
      // // 防止反复添加
      // if (document.getElementById('js_time_line_a')) {
      //   document.body.removeChild(document.getElementById('js_time_line_a'))
      // }
      // a.style.display = 'none'
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(document.getElementById('js_time_line_a'))
    }
  }
}
</script>

<style lang="scss" scoped>
.time-line {
  .time-line-header {
    text-align: center;
    padding: 15px;
    color: #eee;
    background: #2e3033;
  }
  .time-line-content {
    padding: 15px;
    font-size: 14px;
    color: #1a1a1a;
    background: #faf7f7;
    .time-line-item {
      width: 120px;
      padding: 10px 0;
      text-align: center;
      margin: 0 auto;
      border-bottom: 1px solid #ddd;
      // &:hover {
      //   color: #16a085;
      // }
    }
  }
}
</style>
