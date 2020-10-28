<template>
  <div class="hot">
    <h2 class="hot-header">推荐</h2>
    <div class="hot-content">
      <ul v-if="hotArticles.length > 0">
        <li v-for="(item, index) in hotArticles">
          <div class="hot-item">
            <span>{{ index + 1 }}. </span>
            <a href="jacascript: void(0)" :title="item.title" @click="jumpHot(item)">
              {{ item.title }}
            </a>
          </div>
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
      // console.log('跳转到文章', item)
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
}

.hot-header {
  text-align: center;
  padding: 15px;
  color: #eee;
  background: #2e3033;
}

.hot-content {
  li {
    font-size: 14px;
    list-style: none;
    color: #16a085;
    border-bottom: 1px solid #ddd;
    margin-left: 15px;
  }
  a {
    display: inline-block;
    padding: 10px;
    color: #16a085;
  }
  a:hover {
    text-decoration: underline;
  }
}

.hot-item {
  overflow: hidden;
  text-overflow: ellipsis; //超出部分显示省略号
  white-space: nowrap;
}
</style>