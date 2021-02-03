<template>
  <div class="timeLine">
    <loading v-if="articles.time.length === 0"></loading>
    <article-list :articleList="articles.time"></article-list>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { searchArticle } from '../../api/front'

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
    this.clear()
    next()
  },
  head() {
    return {
      title: '时间轴'
    }
  },
  computed: {
    ...mapState({
      articles: 'articles'
    })
  },
  watch: {
    $route() {
      this.queryArticlesByTime()
    }
  },

  created() {
    this.queryArticlesByTime()
  },
  methods: {
    ...mapActions({
      GetArticlesCount: 'GetArticlesCount',
      timeArticles: 'TimeArticles'
    }),
    ...mapMutations({
      clear: 'CLEAR_PAGE',
      SET_ARTICLES_TIME: 'SET_ARTICLES_TIME',
      PRODUCT_BG: 'PRODUCT_BG',
      SET_ARTICLES_SUM: 'SET_ARTICLES_SUM',
      SET_PAGE_ARR: 'SET_PAGE_ARR'
    }),
    queryArticlesByTime() {
      const timeArr = this.$route.params.time.match(/\d+\-\d+\-\d+/g)
      // utc时间0点起
      const startTime = new Date(Date.parse(timeArr[0])).getTime()
      // utc时间24点
      const endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24

      searchArticle(true, 1, 10, null, startTime, endTime).then((res) => {
        console.log(res)
        if (res.code === 200) {
          const articles = res.data.list
          const articlesCount = res.data.count
          this.SET_ARTICLES_TIME(articles)
          this.PRODUCT_BG(articles)
          this.SET_ARTICLES_SUM(articlesCount)
          this.SET_PAGE_ARR(articlesCount)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

