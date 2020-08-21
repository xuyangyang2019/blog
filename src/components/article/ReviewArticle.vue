<template>
  <div class="article-review">
    <div v-for="(item, index) in articles.only" :key="index">
      <!-- 文章标题 -->
      <div class="review-title">
        <h2>{{ item.title }}</h2>
      </div>
      <!-- 标签|前言|时间 -->
      <div class="review-tags">
        <h4 class="review-article-h4">标签：</h4>
        <span
          class="review-article-span"
          v-for="(t, index) in item.tag"
          :key="'tab' + index"
          v-text="t"
        ></span>
      </div>
      <div class="review-abstract">
        <h4 class="review-article-h4">前言：</h4>
        <span class="review-article-span" v-text="item.abstract"></span>
      </div>
      <div class="review-date">
        <h4 class="review-article-h4">发表时间：</h4>
        <span
          class="review-article-span"
          v-text="$options.filters.reviseTime(item.date)"
        ></span>
      </div>
      <!-- 文章内容 -->
      <div class="review-content" v-html="item.content"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Prism from "prismjs"

export default {
  // 离开之前清空预览
  beforeRouteLeave(to, from, next) {
    this.$store.commit("admin/ClearOnly")
    next()
  },
  // 页面创建之前获取文章
  created() {
    this.getOnlyArticle()
    document.title = "后台管理 -文章预览"
  },
  watch: {
    $route() {
      if (this.$route.name === "review") {
        this.getOnlyArticle()
      }
    }
  },
  computed: {
    ...mapGetters({
      articles: "admin/articles"
    })
  },
  methods: {
    // 精准获取文章
    getOnlyArticle() {
      this.$store
        .dispatch("admin/GetArticle", {
          tag: this.$route.params.eTag,
          articleId: this.$route.params.articleId
        })
        .then((data) => {
          this.$nextTick(() => {
            // 代码高亮
            Prism.highlightAll()
          })
        })
    }
  }
}
</script>

<style lang="scss">
.article-review {
  width: 80%;
  height: 100%;
  color: #404040;
  margin: 0 auto;
  padding: 0 20px;
  border-radius: 2px;
  // border: solid 1px rgba(0, 0, 0, 0.8);
  overflow: auto;
  // overflow: hidden;
  @include scroll;

  .review-title {
    text-align: center;
  }
  .review-tags,
  .review-abstract,
  .review-date {
    text-align: start;
    .review-article-h4 {
      display: inline-block;
    }
    .review-article-span {
      display: inline-block;
      padding: 5px;
    }
  }

  .review-content {
    text-align: start;
    // li {
    //   margin-left: 15px;
    //   border: solid red 1px;
    // }
    // hr {
    //   margin: 15px 0;
    //   height: 0;
    //   border: 0;
    //   border-top: 1px solid #ccc;
    // }
    // img {
    //   max-width: 100%;
    // }
  }
}

@media screen and(max-width: 767px) {
  .article-review {
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    pre {
      box-sizing: border-box;
    }
  }
}
</style>
