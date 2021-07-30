<template>
  <div class="timeLine">
    <Loading v-if="code === 404" />
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
    const timeArr = route.params.pathMatch.split('/')
    const year = Number(timeArr[0])
    const month = Number(timeArr[1])
    // 本月的开始时间
    const monthStartDate = new Date(year, month - 1, 1)
    // 本月的结束时间
    const monthEndDate = new Date(year, month, 0)
    return Promise.all([
      getArticlesCount('', monthStartDate, monthEndDate, '').then((res) => {
        store.commit('SET_PAGE_ARR', res.data.count || 0)
      }),
      searchArticle(1, 10, '', monthStartDate, monthEndDate).then((res) => {
        store.commit('SET_ARTICLES_TIME', res.data)
        store.commit('PRODUCT_BG', res.data)
      })
    ]).then(() => {
      store.commit('CHANGE_CODE', 200)
    })
  },
  head() {
    return {
      title: '归档'
    }
  },
  computed: {
    ...mapState({
      code: 'code',
      articlesTime: 'articlesTime'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>

