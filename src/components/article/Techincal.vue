<template>
  <div class="technical">
    <loading v-if="code === 404"></loading>
    <h3 v-if="articles.technical.length === 0 && code === 200" class="none-article">还没有文章，敬请期待···</h3>
    <article-list :articleList="articles.technical"></article-list>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

import articleList from '@/components/article/ArticleList'
import loading from '@/components/base/Loading'

export default {
  components: {
    articleList,
    loading
  },
  //   metaInfo() {
  //     let title = this.$route.params.articleList
  //     return {
  //       title: title + "文章 -mapblog小站",
  //       meta: [{ vmid: "description", name: "description", content: title + "文章 -mapblog小站" }]
  //     }
  //   },
  asyncData({ store, route }) {
    return Promise.all([
      store.dispatch('GetArticles', {
        publish: true,
        page: 1,
        tag: route.params.articleList,
        cache: true
      }),
      store.dispatch('GetArticlesCount', {
        publish: true,
        page: 1,
        tag: route.params.articleList,
        cache: true
      })
    ]).then(() => {
      store.commit('CHANGE_CODE', 200)
    })
  },
  computed: {
    ...mapState({
      articles: 'articles',
      code: 'code'
    })
  },
  methods: {
    ...mapActions({
      getArticlesCount: 'GetArticlesCount'
    }),
    ...mapMutations({
      clear: 'CLEAR_PAGE',
      changeCode: 'CHANGE_CODE'
    })
  },
  beforeRouteLeave(to, from, next) {
    this.clear() // 清除页码数组
    next()
  },
  // 传送门模块切换时复用此组件，故重新获取数据
  beforeRouteUpdate(to, from, next) {
    this.getArticlesCount({
      publish: true,
      page: 1,
      tag: to.params.articleList
    })
    next()
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.none-article {
  padding: 20px;
  // background: #F7EDED;
  background: #faf7f7;
  margin-top: 10px;
}
</style>
