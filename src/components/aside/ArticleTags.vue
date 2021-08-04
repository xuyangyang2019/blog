<template>
  <div class="tags">
    <h2 class="tags-header">标签</h2>
    <ul class="tags-content">
      <li v-for="(item, index) in tags" :key="index" class="tags-item">
        <a :href="computedTagUrl(item)">
          <span>{{ item.tag | changeLife }}</span>
          <span v-if="item.num" v-text="' ' + item.num + '篇'"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { getTags } from '../../api/front'

export default {
  name: 'ArticleTags',
  data() {
    return {
      tags: []
    }
  },
  mounted() {
    // 获取tags
    getTags(true)
      .then((res) => {
        if (res.code === 200) {
          this.tags = res.data
        } else {
          this.tags = []
        }
      })
      .catch(() => {
        this.tags = []
      })
  },
  methods: {
    // 跳转到标签
    computedTagUrl(tagItem) {
      // this.$router.push({ name: 'techincal', params: { tag: item } })
      return `/article/${tagItem.tag}`
    }
  }
}
</script>

<style lang = "scss" scoped>
.tags {
  .tags-header {
    text-align: center;
    padding: 15px;
    color: #eee;
    background: #2e3033;
  }

  .tags-content {
    padding: 15px;
    font-size: 14px;
    background: #faf7f7;
    display: flex;
    flex-wrap: wrap;

    .tags-item {
      color: #1a1a1a;
      border-radius: 5px;
      margin: 5px;
      overflow: hidden;
      font-size: 14px;
      padding: 6px 15px;
      transition: all ease 0.5s;
      &:hover {
        cursor: pointer;
        transform: scale(1.5);
      }
    }
  }
}
</style>
