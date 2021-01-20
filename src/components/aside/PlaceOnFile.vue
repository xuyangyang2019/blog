<template>
  <div class="timeLine">
    <h1 class="timeLine-header">归档</h1>
    <div class="timeLine-content">
      <ul>
        <li v-for="(item, index) in articles.time" :key="index">
          <!-- <a href="jacascript: void(0)" @click="jumpTime(item.time)"> {{ item.time }}({{ item.num }})</a> -->
          <a :href="jumpTime(item.time)" target="_blank">{{ item.time }}({{ item.num }})</a>
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
      articles: 'articles'
    })
  },
  mounted() {
    getArticlesByTime(true).then((res) => {
      if (res.code === 200) {
        this.SET_ARTICLES_TIME(res.data || [])
      }
    })
  },
  methods: {
    ...mapMutations({
      SET_ARTICLES_TIME: 'SET_ARTICLES_TIME'
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
      // this.$router.push({ name: "timeLine", params: { time: date } })
      return '/timeline/' + date
    }
  }
}
</script>

<style lang="scss" scoped>
.timeLine {
  background: #faf7f7;
}
.timeLine-header {
  text-align: center;
  padding: 15px;
  color: #eee;
  background: #2e3033;
}
.timeLine-content {
  padding: 5px 10px 35px;
  li {
    list-style: none;
    border-bottom: 1px solid #ddd;
  }
  a {
    display: block;
    justify-content: space-between;
    width: 120px;
    padding: 10px;
    margin: 0 auto;
    color: #16a085;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
