<template>
  <div class="about">
    <div class="about-header">
      <h2>关于本站</h2>
    </div>
    <div class="about-content">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本站是一个用于知识积累与分享的个人开源博客。主要技术栈为HTML+CSS、vue全家桶、axios、koa2、mongodb。前端采用vue-ssr渲染，支持文章评论与分享，并设置有留言功能，源码请戳
      <a href="https://github.com/xuyangyang2019/blog" target="_blank">github</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutMe'
}
</script>

<style lang = "scss" scoped>
.about-header {
  text-align: center;
  padding: 15px;
  color: #eee;
  background: #2e3033;
}

.about-content {
  color: #1a1a1a;
  background: #faf7f7;
  padding: 15px;
  line-height: 28px;
  font-size: 14px;
  a {
    margin-left: 5px;
    color: #16a085;
  }
}
</style>
