<template>
  <msbdAndCmsList :mcList="comments" :initTable="tableTitle"></msbdAndCmsList>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"

import msbdAndCmsList from "@/components/common/MsbdAndCmsList"

export default {
  data() {
    return {
      tableTitle: { th: ["序号", "文章标题", "昵称", "评论", "时间"] }
    }
  },
  components: {
    msbdAndCmsList
  },
  computed: {
    ...mapGetters({
      comments: "admin/comments"
    })
  },
  methods: {
    ...mapActions({
      getAdminComments: "admin/GetAdminComments",
      getCommentsCount: "admin/GetCommentsCount"
    })
  },
  created() {
    // 获取评论
    this.getAdminComments({ page: 1 })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 获取评论数
      vm.getCommentsCount()
      document.title = "后台管理 -文章评论"
    })
  }
}
</script>
