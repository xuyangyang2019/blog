<template>
  <div class="time-line">
    <h1 class="time-line-header">归档</h1>
    <div class="time-line-content">
      <ul>
        <li v-for="(item, index) in placeOnFile" :key="index" class="time-line-item" @click="jumpTime(item.time)">
          {{ item.time }} ({{ item.num }})
          <!-- <a href="jacascript: void(0)" @click="jumpTime(item.time)"> {{ item.time }}({{ item.num }})</a> -->
          <!-- <a :href="jumpTime(item.time)" target="_blank">{{ item.time }}({{ item.num }})</a> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getArticlesByTime } from '../../api/front'

export default {
  name: 'PlaceOnFile',
  computed: {
    ...mapState({
      placeOnFile: 'placeOnFile'
    })
  },
  mounted() {
    getArticlesByTime(true).then((res) => {
      if (res.code === 200) {
        this.SET_PLACE_ON_FILE(res.data || [])
      }
    })
  },
  methods: {
    ...mapMutations({
      SET_PLACE_ON_FILE: 'SET_PLACE_ON_FILE'
    }),
    // 跳转到时间轴
    jumpTime(time) {
      const year = time.match(/\d+/g)[0]
      let month = parseInt(time.match(/\d+/g)[1], 10)
      let endDay = 31
      let date = new Date().getTime()
      if (month === 2) {
        endDay = 28
      } else if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        endDay = 31
      } else {
        endDay = 30
      }
      for (let i = 0; i < 9; i++) {
        if (month === i) {
          month = '0' + month
        }
      }
      date = year + '-' + month + '-' + '01' + 'to' + year + '-' + month + '-' + endDay
      // return '/placeOnFile/' + date
      // this.$router.push({ name: 'placeOnFile', params: { time: date } })
      const a = document.createElement('a')
      a.setAttribute('href', '/placeOnFile/' + date)
      a.setAttribute('target', '_blank')
      a.setAttribute('id', 'js_time_line_a')
      // 防止反复添加
      if (document.getElementById('js_time_line_a')) {
        document.body.removeChild(document.getElementById('js_time_line_a'))
      }
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(document.getElementById('js_time_line_a'))
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
    ul {
      .time-line-item {
        cursor: pointer;
        width: 120px;
        padding: 10px 0;
        text-align: center;
        margin: 0 auto;
        border-bottom: 1px solid #ddd;
        &:hover {
          color: #16a085;
        }
      }
    }
  }
}
</style>
