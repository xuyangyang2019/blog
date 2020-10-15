<template>
  <div class="home">
    <banner></banner>
    <loading v-if="code === 404"></loading>
    <h3 v-if="articles.all.length === 0 && code === 200" class="none-article">还没有文章，敬请期待···</h3>
    <!-- <article-list :articleList="articles.all"></article-list> -->
  </div>
</template>
<script>
// import { mapActions, mapState, mapMutations } from "vuex"

import banner from "@/components/home/Banner"
import loading from "@/components/base/Loading"
// import articleList from "@/components/article/ArticleList"
import articleList from "../components/article/ArticleList"

export default {
  data() {
    return {
      articles: {
        all: []
      },
      code: 200
    }
  },
  components: {
    banner,
    loading,
    // articleList,
  },
  metaInfo() {
    return {
      title: "首页 -mapblog小站",
      meta: [{ vmid: "description", name: "description", content: "首页 -mapblog小站" }]
    }
  },
  //   asyncData({ store, route }) {
  //     return Promise.all([
  //       store.dispatch("getArticles", {
  //         publish: true,
  //         page: 1,
  //         cache: true
  //       }),
  //       store.dispatch("getArticlesCount", {
  //         cache: true,
  //         publish: true
  //       }).then(() => {
  //         store.commit("changeCode", 200)
  //       })
  //     ])
  //   },
  //   beforeRouteLeave(to, from, next) {
  //     this.clear()
  //     next()
  //   },
  mounted() {
    // this.$nextTick(function () {
    //   Prism.highlightAll()
    // })
  },
  computed: {
    // ...mapState(["articles", "code"]),
  },
  methods: {
    // ...mapActions(["getArticlesCount"]),
    // ...mapMutations(["clear", "changeCode"])
  }
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

