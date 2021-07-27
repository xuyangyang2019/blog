<template>
  <div class="technical">
    <Loading v-if="code === 404" />
    <ArticleList :articleList="articlesTag" />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

import ArticleList from '@/components/article/ArticleList'
import Loading from '@/components/base/Loading'

export default {
  components: {
    ArticleList,
    Loading
  },
  beforeRouteLeave(to, from, next) {
    this.CLEAR_PAGE() // 清除页码数组
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
  },
  asyncData({ store, route }) {
    // return Promise.all([
    //   store.dispatch('GetArticles', {
    //     publish: true,
    //     page: 1,
    //     tag: route.params.articleList,
    //     cache: true
    //   }),
    //   store.dispatch('GetArticlesCount', {
    //     publish: true,
    //     page: 1,
    //     tag: route.params.articleList,
    //     cache: true
    //   })
    // ]).then(() => {
    //   store.commit('CHANGE_CODE', 200)
    // })
  },
  computed: {
    ...mapState({
      articlesTag: 'articlesTag',
      code: 'code'
    })
  },
  methods: {
    ...mapActions({
      getArticlesCount: 'GetArticlesCount'
    }),
    ...mapMutations({
      CLEAR_PAGE: 'CLEAR_PAGE'
    })
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
