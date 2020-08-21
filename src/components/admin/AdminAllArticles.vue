<template>
  <div class="admin-articles">
    <list :article_list="articles.all"></list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import list from "@/components/common/ArticleList"

export default {
  components: {
    list
  },
  computed: {
    ...mapGetters({
      articles: "admin/articles"
    })
  },
  methods: {
    // ...mapActions(["getArticles", "getArticlesCount"]),
    ...mapActions({
      getArticles: "admin/GetArticles",
      getArticlesCount: "admin/GetArticlesCount"
    }),
    allArticles_admin: function() {
      let payload = {
        publish: true,
        page: 1
      }
      this.getArticles(payload)
    }
  },
  created() {
    this.allArticles_admin()
  },
  //组件缓存后，为了让每个模块显示正确的页码，故重新计算页码数
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getArticlesCount({ publish: true })
      document.title = "后台管理 -已发表文章"
    })
  }
}
</script>
<style lang="scss">
.admin-articles {
  margin-top: 15px;
}
</style>
