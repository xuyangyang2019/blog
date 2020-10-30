<template>
  <div class="hot">
    <h2 class="hot-header">推荐</h2>
    <div class="hot-content">
      <ul v-if="hotArticles.length > 0">
        <li class="hot-item" v-for="(item, index) in hotArticles">
          <span>{{ index + 1 }}. </span>
          <span class="article-title" :title="item.title" @click="jumpHot(item)" v-text="item.title"></span>
        </li>
      </ul>
      <div v-else>没有文章</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  computed: {
    ...mapState({
      articles: 'articles'
    }),
    // 热门文章
    hotArticles() {
      return this.articles.hot || []
    }
  },
  methods: {
    // 跳转到文章
    jumpHot(item) {
      this.$store.commit('CHANGE_TITLE', item.title)
      if (item.tag[0] === "life") {
        this.$router.push({ name: 'lifeShow', params: { id: item.articleId } })
      } else {
        this.$router.push({ name: 'articleShow', params: { articleList: item.tag[0], id: item.articleId } })
      }
    }
  },
  mounted() {
    // 页面加载完成后 获取推荐的文章
    this.$store.dispatch('GetHot')
  }
}
</script>

<style lang="scss" scoped>
.hot {
  background: #faf7f7;

  .hot-header {
    text-align: center;
    padding: 15px;
    color: #eee;
    background: #2e3033;
  }

  .hot-content {
    .hot-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #16a085;
      border-bottom: 1px solid #ddd;
      margin-left: 15px;
      padding: 10px;
      cursor: pointer;
      .article-title:hover {
        border-bottom: solid 1px black;
      }
    }
  }
}
</style>