<template>
  <div class="search-abstract">
    <!-- 如果没有文章 -->
    <loading v-if="articles.all.length == 0 && code === 404"></loading>
    <!-- 提示 -->
    <div class="search-tips">
      <h3>{{ searchTips }}</h3>
    </div>
    <!-- 搜索结果 -->
    <article-list :articleList="articles.search"></article-list>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"

import articleList from "@/components/article/ArticleList"
import loading from "@/components/base/Loading"

export default {
  data() {
    return {
      searchTips: "",
      code: 404
    }
  },
  metaInfo() {
    return {
      title: "搜索 -mapblog小站"
    }
  },
  created() {
    this.startSearch()
  },
  components: {
    articleList,
    loading
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
  methods: {
    ...mapActions({
      search: 'SearchArticles',
      getArticlesCount: 'GetArticlesCount'
    }),
    ...mapMutations({
      clear: 'CLEAR_PAGE'
    }),
    startSearch() {
      this.search({
        publish: true,
        page: 1,
        key: this.$route.params.searchKey,
        according: "key"
      }).then((data) => {
        this.$store.commit("SET_ARTICLES_SEARCH", data)
        this.$store.commit("PRODUCT_BG", data)
        if (data.length) {
          this.searchTips = "以下是为您搜索到的内容："
        } else {
          this.searchTips = "杯具啊(┬┬﹏┬┬)啥也没找到···"
        }
        this.code = 200
      })
      // 文章总数
      this.getArticlesCount({
        publish: true,
        key: this.$route.params.searchKey,
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

