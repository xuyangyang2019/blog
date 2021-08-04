<template>
  <div class="home">
    <Banner />
    <Loading v-if="code === 404" />
    <ArticleList :articleList="articlesList" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticleList, getArticlesCount } from '../api/front'

import headMixin from '@/mixins/headMixin'
import Banner from '@/components/home/Banner'
import Loading from '@/components/base/Loading.vue'
import ArticleList from '@/components/article/ArticleList.vue'

export default {
  name: 'Home',
  components: {
    Banner,
    Loading,
    ArticleList
  },
  mixins: [headMixin],
  asyncData({ store }) {
    return Promise.all([
      getArticlesCount().then((res) => {
        store.commit('SET_PAGE_ARR', res.data.count || 0)
      }),
      getArticleList().then((res) => {
        store.commit('SET_ARTICLES_LIST', res.data)
        store.commit('PRODUCT_BG', res.data)
      })
    ]).then(() => {
      store.commit('CHANGE_CODE', 200)
    })
  },
  head() {
    return {
      title: '首页',
      author: 'xuyy',
      keywords: 'koa2 webpack vue-ssr vuex vue-router axios',
      description: '欢迎来到我的小站！'
    }
  },
  computed: {
    ...mapState({
      code: 'code',
      articlesList: 'articlesList'
    })
  }
}
</script>
<style lang = "scss" scoped>

</style>

