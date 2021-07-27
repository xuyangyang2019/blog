<template>
  <div class="technical">
    <Loading v-if="code === 404" />
    <ArticleList :articleList="articlesTag" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getArticleList, getArticlesCount } from '../../api/front'

import Loading from '@/components/base/Loading'
import ArticleList from '@/components/article/ArticleList'

export default {
  components: {
    Loading,
    ArticleList
  },
  beforeRouteLeave(to, from, next) {
    this.CLEAR_PAGE() // 清除页码数组
    next()
  },
  // 传送门模块切换时复用此组件，故重新获取数据
  beforeRouteUpdate(to, from, next) {
    // this.getArticlesCount({
    //   publish: true,
    //   page: 1,
    //   tag: to.params.articleList
    // })
    // getArticlesCount().then((res) => {
    //   store.commit('SET_ARTICLES_SUM', res.data.count)
    //   store.commit('SET_PAGE_ARR', res.data.count || 0)
    // })
    next()
  },
  asyncData({ store, route }) {
    return Promise.all([
      getArticlesCount(route.params.tag).then((res) => {
        store.commit('SET_PAGE_ARR', res.data.count || 0)
      }),
      getArticleList(route.params.tag).then((res) => {
        store.commit('SET_ARTICLES_TAG', res.data)
        store.commit('PRODUCT_BG', res.data)
      })
    ]).then(() => {
      store.commit('CHANGE_CODE', 200)
    })
  },
  computed: {
    ...mapState({
      code: 'code',
      articlesTag: 'articlesTag'
    })
  },
  methods: {
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
