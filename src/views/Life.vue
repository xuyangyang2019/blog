<template>
  <div class="life-module">
    <loading v-if="code === 404"></loading>
    <h3 v-if="articles.life.length == 0 && code === 200" class="none-article">还没有此类文章，敬请期待···</h3>
    <article-list :articleList="articles.life"></article-list>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"

import loading from "@/components/base/Loading"
import articleList from "@/components/article/ArticleList"

export default {
  head() {
    return {
      title: '生活文章',
    }
  },
  //   metaInfo() {
  //     return {
  //       title: "生活文章 -mapblog小站",
  //       meta: [{ vmid: "description", name: "description", content: "生活文章 -mapblog小站" }]
  //     }
  //   },
  asyncData({ store, route }) {
    return Promise.all([
      store.dispatch("GetArticles", {
        publish: true,
        page: 1,
        tag: "life",
        cache: true
      }),
      store.dispatch("GetArticlesCount", {
        publish: true,
        page: 1,
        tag: "life",
        cache: true
      })
    ]).then(() => {
      store.commit("CHANGE_CODE", 200)
    })
  },
  components: {
    articleList,
    loading
  },
  computed: {
    ...mapState({
      code: 'code',
      articles: 'articles',
    })
  },
  methods: {
    ...mapMutations({
      clear: 'CLEAR_PAGE'
    })
  },
  beforeRouteLeave(to, from, next) {
    this.clear()
    next()
  },
}
</script>

<style lang="scss" scoped>
.none-article {
  padding: 20px;
  // background: #F7EDED;
  background: #faf7f7;
  margin-top: 10px;
}
</style>