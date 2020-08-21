<template>
  <div class="publish-article">
    <div class="publish-article-title">
      <div>类型</div>
      <div>标题</div>
      <div>标签</div>
      <div>前言</div>
    </div>
    <div class="publish-article-content">
      <quill-editor></quill-editor>
    </div>
    <div class="publish-article-footer">
      <button @click="publishArticle">发布</button>
      <button @click="saveArticle">草稿</button>
    </div>
  </div>
</template>

<script>
// 调用富文本编辑器
import QuillEditor from "../qe/QuillEditor.vue"

export default {
  data() {
    return {}
  },
  components: {
    QuillEditor
  },
  methods: {
    publishArticle() {
      console.log("发布文章")
    },
    saveArticle() {
      console.log("存为草稿")
    }
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    document.title = "后台管理 -发表文章"
    next()
  }
}
</script>

<style lang="scss" scoped>
.publish-article {
  height: 100%;
  color: black;
  display: flex;
  flex-direction: column;

  &-title {
    border: solid red 1px;
  }
  &-content {
    border: solid red 1px;
    flex: 1 1 auto;
  }
  &-footer {
    border: solid red 1px;
    height: 60px;
  }
}

// @media screen and(max-width: 767px) {
//   .input-warning-box {
//     width: 80%;
//     flex-shrink: 1;
//   }
//   .adminset-mask-box {
//     width: 80%;
//   }
// }
</style>
