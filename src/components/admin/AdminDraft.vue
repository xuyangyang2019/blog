<template>
  <div class="draft">
    <list :article_list="articles.drafts"></list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import list from "@/components/common/ArticleList"

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      articles: "admin/articles"
    })
  },
  methods: {
    ...mapActions({
      getArticles: "admin/GetArticles"
    }),
    // 分页查询未发表的文章
    allArticles_admin: function() {
      let payload = {
        publish: false,
        page: 1
      }
      this.getArticles(payload)
    }
  },
  components: {
    list
  },
  created() {
    // 查询未发表的文章
    this.allArticles_admin()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.getArticlesCount({ publish: false })
      document.title = "后台管理 -草稿箱"
    })
  }
}
</script>

<style lang="scss">
.draft {
  margin-top: 15px;
  color: black;
}
</style>
