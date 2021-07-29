<template>
  <div class="timeLine">
    <Loading v-if="articlesTime.length === 0" />
    <ArticleList :articleList="articlesTime" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchArticle, getArticlesCount } from '../api/front'

import ArticleList from '@/components/article/ArticleList'
import Loading from '@/components/base/Loading'
import headMixin from '@/mixins/headMixin'

export default {
  name: 'TimeLine',
  components: {
    ArticleList,
    Loading
  },
  mixins: [headMixin],
  beforeRouteLeave(to, from, next) {
    // this.clear()
    next()
  },
  asyncData({ store, route }) {
    const timeArr = route.params.time.match(/\d+\-\d+\-\d+/g)
    console.log(route.params.time)
    //   // utc时间0点起
    const startTime = new Date(Date.parse(timeArr[0])).getTime()
    //   // utc时间24点
    const endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24
    return Promise.all([
      getArticlesCount('', startTime, endTime, '').then((res) => {
        console.log(res)
        store.commit('SET_PAGE_ARR', res.data.count || 0)
      })
      // searchArticle(1, 10, route.params.searchKey).then((res) => {
      //   console.log(res)
      //   store.commit('SET_SEARCH_RESULTS', res.data)
      //   store.commit('PRODUCT_BG', res.data)
      // })
    ]).then(() => {
      store.commit('CHANGE_CODE', 200)
    })
  },
  head() {
    return {
      title: '时间轴'
    }
  },
  computed: {
    ...mapState({
      code: 'code',
      articlesTime: 'articlesTime'
    })
  },
  methods: {
    // 查询归档的文章
    // queryArticlesByTime() {
    //   const timeArr = this.$route.params.time.match(/\d+\-\d+\-\d+/g)
    //   // utc时间0点起
    //   const startTime = new Date(Date.parse(timeArr[0])).getTime()
    //   // utc时间24点
    //   const endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24
    //   searchArticle(true, 1, 10, null, startTime, endTime).then((res) => {
    //     console.log(res)
    //     if (res.code === 200) {
    //       const articles = res.data.list
    //       const articlesCount = res.data.count
    //       this.SET_ARTICLES_TIME(articles)
    //       this.PRODUCT_BG(articles)
    //       this.SET_ARTICLES_SUM(articlesCount)
    //       this.SET_PAGE_ARR(articlesCount)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>

