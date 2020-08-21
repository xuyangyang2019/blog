<template>
  <msbdAndCmsList :mcList="msgBoard" :initTable="tableTitle"></msbdAndCmsList>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import msbdAndCmsList from "@/components/common/MsbdAndCmsList.vue"

export default {
  data() {
    return {
      tableTitle: { th: ["序号", "用户名", "留言", "时间"] }
    }
  },
  components: {
    msbdAndCmsList
  },
  computed: {
    ...mapGetters({
      msgBoard: "admin/msgBoard"
    })
  },
  methods: {
    ...mapActions({
      getMsgBoard: "admin/GetMsgBoard",
      getMsgCount: "admin/GetMsgCount"
    })
  },
  created() {
    this.getMsgBoard({ page: 1 })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getMsgCount()
      document.title = "后台管理 -留言管理"
    })
  }
}
</script>
