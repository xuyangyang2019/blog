<template>
  <div class="hot">
    <h2 class="hot-header">推荐</h2>
    <div class="hot-content">
      <ul>
        <li v-for="(item, index) in articles.hot" :key="index" class="hot-item">
          <span>{{ index + 1 }}.</span>
          <span class="article-title" :title="item.title" @click="jumpHot(item)" v-text="item.title"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getHotArticles } from '../../api/front'

export default {
  name: 'HotArticles',
  computed: {
    ...mapState({
      articles: 'articles'
    })
  },
  mounted() {
    // 页面加载完成后 获取推荐的文章
    getHotArticles().then((res) => {
      if (res.code === 200) {
        this.SET_ARTICLES_HOT(res.data || [])
      }
    })
  },
  methods: {
    ...mapMutations({
      SET_ARTICLES_HOT: 'SET_ARTICLES_HOT'
    }),
    // 跳转到文章
    jumpHot(item) {
      this.$store.commit('CHANGE_TITLE', item.title)
      if (item.tag[0] === 'life') {
        this.$router.push({ name: 'lifeShow', params: { id: item.articleId } })
      } else {
        this.$router.push({ name: 'articleShow', params: { tag: item.tag[0], id: item._id } })
      }
    }
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
