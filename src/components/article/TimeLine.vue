<template>
  <div class="timeLine">
    <loading v-if="articles.time.length === 0"></loading>
    <article-list :articleList="articles.time"></article-list>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"

import articleList from "@/components/article/ArticleList"
import loading from "@/components/base/Loading"

export default {
  head() {
    return {
      title: "时间轴"
    }
  },
  components: {
    articleList,
    loading
  },
  computed: {
    ...mapState({
      articles: 'articles'
    })
  },
  watch: {
    $route() {
      this.time_arts()
    }
  },
  methods: {
    ...mapActions({
      getArticlesCount: 'GetArticlesCount',
      timeArticles: 'TimeArticles'
    }),
    ...mapMutations({
      clear: 'CLEAR_PAGE'
    }),
    time_arts() {
      let timeArr = this.$route.params.time.match(/\d+\-\d+\-\d+/g)
      // utc时间0点起
      let startTime = new Date(Date.parse(timeArr[0])).getTime()
      // utc时间24点
      let endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24
      let params = {
        publish: true,
        page: 1,
        start: startTime,
        end: endTime,
        according: "time"
      }
      this.timeArticles(params)
      this.getArticlesCount(params)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.clear()
    next()
  },
  created() {
    this.time_arts()
  }
}
</script>

<style lang="scss" scoped>
</style>

