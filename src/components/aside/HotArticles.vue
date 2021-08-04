<template>
  <div class="hot-articles">
    <h2 class="hot-header" @click="queryHot">推荐</h2>
    <ul class="hot-content">
      <li v-for="(item, index) in hotArticles" :key="index" class="hot-item">
        <a :href="computedUrl(item)">
          <span>{{ index + 1 }}.</span>
          <span :title="item.title" v-text="item.title"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { getHotArticles } from '../../api/front'

export default {
  name: 'HotArticles',
  data() {
    return {
      hotArticles: []
    }
  },
  mounted() {
    this.queryHot()
  },
  methods: {
    // 查询热门文章
    queryHot() {
      getHotArticles()
        .then((res) => {
          if (res.code === 200) {
            this.hotArticles = res.data
          } else {
            this.hotArticles = []
          }
        })
        .catch(() => {
          this.hotArticles = []
        })
    },
    // 计算url
    computedUrl(article) {
      return `/article/${article.tag[0]}/${article._id}`
    }
  }
}
</script>

<style lang="scss" scoped>
.hot-articles {
  .hot-header {
    text-align: center;
    padding: 15px;
    color: #eee;
    background: #2e3033;
  }
  .hot-content {
    padding: 15px;
    font-size: 14px;
    color: #1a1a1a;
    background: #faf7f7;
    .hot-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      cursor: pointer;
      &:hover {
        color: #16a085;
      }
    }
  }
}
</style>
