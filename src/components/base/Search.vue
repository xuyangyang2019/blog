<template>
  <div class="search-abstract">
    <!-- 如果没有文章 -->
    <Loading v-if="searchResults.length === 0 && code === 404" />
    <!-- 搜索结果 -->
    <ArticleList :articleList="searchResults" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { searchArticle, getArticlesCount } from '../../api/front'

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
    // route.params.tag
    return Promise.all([
      getArticlesCount('', '', '', route.params.searchKey).then((res) => {
        store.commit('SET_PAGE_ARR', res.data.count || 0)
      }),
      searchArticle(1, 10, route.params.searchKey).then((res) => {
        console.log(res)
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
  },
  watch: {
    $route(val) {
      console.log(val)
      // this.startSearch()
    }
  },
  methods: {
    ...mapMutations({
      SET_ARTICLES_SEARCH: 'SET_ARTICLES_SEARCH',
      PRODUCT_BG: 'PRODUCT_BG',
      SET_ARTICLES_SUM: 'SET_ARTICLES_SUM',
      SET_PAGE_ARR: 'SET_PAGE_ARR'
    }),
    startSearch() {
      const keyword = this.$route.params.searchKey
      searchArticle(1, 10, keyword).then((res) => {
        console.log(res)
        if (res.code === 200) {
          // const articles = res.data.list
          // const articlesCount = res.data.count || 0
          // this.SET_ARTICLES_SEARCH(articles)
          // this.PRODUCT_BG(articles)
          // this.SET_ARTICLES_SUM(articlesCount)
          // this.SET_PAGE_ARR(articlesCount)
          this.code = 200
        }
      })
    }
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

