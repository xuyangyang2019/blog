<template>
  <div class="article-list">
    <!-- 文章列表 -->
    <ul>
      <li v-for="(item, index) in articleList" :key="index" class="article-item">
        <!-- title -->
        <h2 class="article-title">
          <a href="javascript: void(0)" @click="jump(item)">{{ item.title }}</a>
        </h2>
        <div class="article-msg">
          <!-- 标签 -->
          <span class="icon-tag-stroke"></span>
          <span class="article-msg-tag">
            <span v-for="(tag, tagIndex) in item.tag" :key="tagIndex">{{ tag | changeLife }}</span>
          </span>
          <!-- 时间 -->
          <span class="icon-clock"></span>
          <span class="article-msg-time">{{ item.updateTime | reviseTime }}</span>
        </div>
        <div class="article-review">
          <!-- 图片 -->
          <div :class="'default tag-bg-img ' + tagBg[index]"></div>
          <!-- 摘要 -->
          <div class="article-abstract">
            <h4>{{ item.abstract }}</h4>
          </div>
        </div>
        <div class="view-msg">
          <!-- 浏览量 -->
          <span class="icon-eye"></span>
          <span class="pv">{{ item.pv }}</span>
          <!-- 品论数 -->
          <span class="icon-commenting-o"></span>
          <span class="comments-num">{{ item.commentNum }}</span>
          <!-- 点赞数 -->
          <span class="icon-like"></span>
          <span class="like-num">{{ item.likeNum }}</span>
        </div>
      </li>
    </ul>
    <!-- 分页 -->
    <transition name="fade" mode="out-in">
      <page v-if="pageArr.length > 1"></page>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Page from '@/components/base/Page'

export default {
  components: {
    Page
  },
  props: {
    articleList: {
      type: Array
    },
    page: {
      type: Array
    }
  },
  computed: {
    ...mapState({
      pageArr: 'pageArr',
      tagBg: 'tagBg'
    })
  },
  methods: {
    ...mapMutations({
      changeTitle: 'CHANGE_TITLE'
    }),
    // 跳转到文章
    jump(item) {
      this.changeTitle(item.title)
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.article-list {
  font-size: 14px;
  line-height: 20px;
  color: #404040;
  img {
    max-width: 100%;
  }
}
.article-item {
  padding: 10px 10px 10px 15px;
  margin-top: 15px;
  border-radius: 3px;
  // background: #F7EDED;
  background: #faf7f7;
  h2 {
    padding: 10px 0;
    a {
      color: #16a085;
    }
  }
}
.article-review {
  color: #646464;
  display: flex;
  align-items: center;
  p img {
    max-width: 100% !important;
    max-height: 100%;
  }
}
.article-title,
.article-title a {
  display: inline-block;
  transition: all ease 0.3s;
}
.article-title:hover {
  transform: translateX(10px);
}
.article-title:hover a {
  color: #d9a800;
  // text-decoration: underline
}
.article-abstract {
  margin-left: 15px;
}
.article-review {
  margin-top: 8px;
}
.article-msg {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // color: #404040
  color: #646464;
}
.article-msg-tag span {
  margin: 0 2px;
}
.article-msg-time {
  margin-left: 5px;
}
.view-msg {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
  color: #404040;
}
.icon-like,
.icon-commenting-o,
.icon-eye {
  margin-right: 5px;
}
.icon-tag-stroke {
  margin-left: 3px;
  margin-top: 2px;
}
.icon-clock {
  margin-left: 16px;
}
.comments-num,
.pv {
  margin-right: 14px;
}
.like-num {
  margin-right: 3px;
}
.no1 {
  margin-right: -4px;
}
@media screen and(max-width: 767px) {
  .article-item {
    border-radius: 0;
    margin-top: 0;
    border-top: 1px solid #ccc;
  }
}
</style>
