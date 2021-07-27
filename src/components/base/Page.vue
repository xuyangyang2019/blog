<template>
  <div class="page">
    <button :disabled="preDisabled" class="change-btn" @click="prePage"><i class="fa fa-lg fa-angle-left"></i></button>
    <button
      v-for="(page, index) in pageArr"
      :key="index"
      :disabled="page == currentPage"
      :class="{ 'btn-bg': index === currentPage - 1 }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    <button :disabled="nextDisabled" class="change-btn" @click="nextPage">
      <i class="fa fa-lg fa-angle-right"></i>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getArticleList } from '../../api/front'

export default {
  data() {
    return {
      currentPage: 1, // 当前页
      preDisabled: true, // 上一页可用
      nextDisabled: false // 下一些可用
    }
  },
  computed: {
    ...mapState({
      pageArr: 'pageArr'
    })
  },
  watch: {
    currentPage: function () {
      const cpg = this.currentPage
      // 按钮锁定
      if (cpg === 1) {
        this.preDisabled = true
      } else if (cpg > 1) {
        this.preDisabled = false
      }
      // 后退按钮锁定
      if (cpg < this.pageArr.length) {
        this.nextDisabled = false
      } else if (cpg === this.pageArr.length) {
        this.nextDisabled = true
      }
    }
  },
  methods: {
    ...mapActions({
      search: 'search',
      // timeArticles: 'timeArticles',
      gerMsgBoard: 'GetMsgBoard'
    }),
    // 上一页
    prePage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.changePage(this.currentPage)
      }
    },
    // 下一页
    nextPage() {
      if (this.currentPage < this.pageArr.length) {
        this.currentPage++
        this.changePage(this.currentPage)
      }
    },
    // 跳转页
    changePage(page) {
      this.currentPage = page
      console.log(page)
      console.log(this.pageArr)
      // let tag = ''
      // const timeArr = this.$route.params.time.match(/\d+\-\d+\-\d+/g)
      // utc时间0点起
      // const startTime = new Date(Date.parse(timeArr[0])).getTime()
      // // utc时间24点
      // const endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24
      // let params = {}
      switch (this.$route.name) {
        case 'home':
          getArticleList('', page, 10).then((res) => {
            this.$store.commit('SET_ARTICLES_LIST', res.data)
            this.$store.commit('PRODUCT_BG', res.data)
          })
          break
        // case 'techincal':
        //   this.getArticles({
        //     publish: true,
        //     page: page,
        //     tag: this.$route.params.articleList
        //   })
        //   break
        // case 'life':
        //   tag = 'life'
        //   this.getArticles({
        //     publish: true,
        //     page: page,
        //     tag: tag
        //   })
        //   break
        // case 'timeLine':
        //   params = {
        //     publish: true,
        //     page: page,
        //     start: startTime,
        //     end: endTime
        //   }
        //   this.timeArticles(params)
        //   break
        case 'msgboard':
          this.gerMsgBoard({ pageNum: page })
          break
        case 'search':
          this.search({
            publish: true,
            page: page,
            key: this.$route.params.searchKey,
            according: 'key'
          })
      }
    }
  }
}
</script>

<style lang = "scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5px;

  button {
    color: #646464;
    border: 1px solid #85b9c8;
    border-radius: 3px;
    cursor: pointer;
    background: #ffffff;
    display: inline-block;
    width: 30px;
    height: 28px;
    margin: 2px;
    outline: none;
  }

  button[disabled] {
    cursor: not-allowed;
  }

  .btn-bg {
    background: #c6eaf5 !important;
  }

  .change-btn {
    width: 30px;
  }
}
</style>
