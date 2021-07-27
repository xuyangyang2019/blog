<template>
  <div class="search-abstract">
    <!-- 如果没有文章 -->
    <Loading v-if="articles.all.length == 0 && code === 404" />
    <!-- 提示 -->
    <div class="search-tips">
      <h3>{{ searchTips }}</h3>
    </div>
    <!-- 搜索结果 -->
    <ArticleList :articleList="articles.search" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { searchArticle } from '../../api/front'

import ArticleList from '@/components/article/ArticleList'
import Loading from '@/components/base/Loading'

export default {
  components: {
    ArticleList,
    Loading
  },
  data() {
    return {
      searchTips: '',
      code: 404
    }
  },
  computed: {
    ...mapState({
      articles: 'articles'
    })
  },
  watch: {
    $route() {
      this.startSearch()
    }
  },
  created() {
    this.startSearch()
    document.title = '搜索 -mapblog小站'
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
      searchArticle(true, 1, 10, keyword).then((res) => {
        console.log(res)
        if (res.code === 200) {
          const articles = res.data.list
          const articlesCount = res.data.count || 0
          this.SET_ARTICLES_SEARCH(articles)
          this.PRODUCT_BG(articles)
          this.SET_ARTICLES_SUM(articlesCount)
          this.SET_PAGE_ARR(articlesCount)
          if (articles.length) {
            this.searchTips = '以下是为您搜索到的内容：'
          } else {
            this.searchTips = '杯具啊(┬┬﹏┬┬)啥也没找到···'
          }
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
.search-tips {
  margin-top: 10px;
  padding: 10px;
  /*background: #F7EDED;*/
  background: #faf7f7;
}
</style>

