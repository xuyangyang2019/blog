<template>
  <div class="home">
    <banner></banner>
    <loading v-if="code === 404"></loading>
    <h3 v-if="articles.all.length === 0 && code === 200" class="none-article">还没有文章，敬请期待···</h3>
    <article-list :articleList="articles.all"></article-list>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"

import banner from "@/components/home/Banner"
import loading from "@/components/base/Loading"
import articleList from "@/components/article/ArticleList"
import headMixin from '@/mixins/head-mixin'


export default {
  head() {
    return {
      title: '首页',
      author: 'xuyy',
      keywords: 'koa2 webpack vue-ssr vuex vue-router axios',
      description: '欢迎来到我的小站！',
    }
  },
  asyncData({ store, route }) {
    return Promise.all([
      store.dispatch("GetArticles", {
        publish: true,
        page: 1,
        cache: true
      }),
      store.dispatch("GetArticlesCount", {
        cache: true,
        publish: true
      })
    ]).then(() => {
      store.commit("CHANGE_CODE", 200)
    })
  },
  name: 'Home',
  mixins: [headMixin],
  components: {
    banner,
    loading,
    articleList,
  },
  computed: {
    ...mapState({
      code: 'code',
      articles: 'articles',
    })
  },
  methods: {
    ...mapActions({
      getArticles: 'GetArticles',
      getArticlesCount: 'GetArticlesCount'
    }),
    ...mapMutations({
      clear: 'CLEAR_PAGE',
    })
  },
  beforeRouteLeave(to, from, next) {
    this.clear()
    next()
  },
  mounted() {
    // this.$nextTick(function () {
    //   Prism.highlightAll()
    // })
  },
}
</script>
<style lang = "scss" scoped>
.none-article {
  padding: 20px;
  color: black;
  /*background: #F7EDED;*/
  background: #faf7f7;
  margin-top: 10px;
}
</style>

