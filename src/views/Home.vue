<template>
  <div class="home">
    <Banner />
    <Loading v-if="code === 404" />
    <h3 v-if="articles.all.length === 0 && code === 200" class="none-article">还没有文章，敬请期待···</h3>
    <ArticleList :articleList="articles.all" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Banner from '@/components/home/Banner'
import Loading from '@/components/base/Loading.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import headMixin from '@/mixins/headMixin'

export default {
  name: 'Home',
  components: {
    Banner,
    Loading,
    ArticleList
  },
  mixins: [headMixin],
  asyncData({ store }) {
    // return Promise.all([
    //   store.dispatch('GetArticles', {
    //     publish: true,
    //     page: 1,
    //     cache: true
    //   }),
    //   store.dispatch('GetArticlesCount', {
    //     cache: true,
    //     publish: true
    //   })
    // ]).then(() => {
    //   store.commit('CHANGE_CODE', 200)
    // })

    return store.dispatch('GetArticles', {
      publish: true,
      pageNum: 1,
      pageSize: 10
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
      articles: 'articles'
    })
  },
  mounted() {
    // this.$nextTick(function () {
    //   Prism.highlightAll()
    // })
  }
}
</script>
<style lang = "scss" scoped>
.none-article {
  padding: 20px;
  color: black;
  background: #faf7f7;
  margin-top: 10px;
}
</style>

