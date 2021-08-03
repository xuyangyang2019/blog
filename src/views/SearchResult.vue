<template>
  <div class="search-abstract">
    <!-- 如果没有文章 -->
    <Loading v-if="searchResults.length === 0 && code === 404" />
    <!-- 搜索结果 -->
    <ArticleList :articleList="searchResults" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchArticle, getArticlesCount } from '../api/front'

import headMixin from '@/mixins/headMixin'
import Loading from '@/components/base/Loading'
import ArticleList from '@/components/article/ArticleList'

export default {
  components: {
    ArticleList,
    Loading
  },
  mixins: [headMixin],
  asyncData({ store, route }) {
    return Promise.all([
      getArticlesCount('', '', '', route.params.searchKey).then((res) => {
        store.commit('SET_PAGE_ARR', res.data.count || 0)
      }),
      searchArticle(1, 10, route.params.searchKey).then((res) => {
        store.commit('SET_SEARCH_RESULTS', res.data)
        store.commit('PRODUCT_BG', res.data)
      })
    ]).then(() => {
      store.commit('CHANGE_CODE', 200)
    })
  },
  head() {
    return {
      title: '搜索',
      author: 'xuyy'
      // keywords: 'koa2 webpack vue-ssr vuex vue-router axios',
      // description: '欢迎来到我的小站！'
    }
  },
  computed: {
    ...mapState({
      code: 'code',
      searchResults: 'searchResults'
    })
  }
}
</script>

<style lang = "scss" scoped>
img {
  border: 5px solid red;
  width: 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

