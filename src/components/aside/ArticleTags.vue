<template>
  <div class="tags">
    <h2 class="tags-header">标签</h2>
    <div class="tags-content">
      <ul>
        <li v-for="(item, index) in tags" :key="index" class="tags-item">
          <a ref="tag" href="javascript: void(0)" @click="jumpGate(item.tag)">
            <span>{{ item.tag | changeLife }}</span>
            <span v-if="item.num" v-text="' ' + item.num + '篇'"></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getTags } from '../../api/front'

export default {
  name: 'ArticleTags',
  data() {
    return {
      color: [
        '#FF9933',
        '#663300',
        '#CC6600',
        '#99CC33',
        '#CC6699',
        '#009966',
        '#999999',
        '#336666',
        '#9BBFEA',
        '#CCCC00'
      ] // 随机的颜色库
    }
  },
  computed: {
    ...mapState({
      tags: 'tags' // 标签
    })
  },
  watch: {
    // tag改变重新生成背景色
    tags() {
      this.initBackground()
    }
  },
  mounted() {
    // 获取tags
    getTags(true).then((res) => {
      if (res.code === 200) {
        this.SetTags(res.data)
      }
    })
  },
  methods: {
    ...mapMutations({
      SetTags: 'SetTags'
    }),
    // 初始化背景色
    initBackground() {
      this.$nextTick(() => {
        // IE10不支持refs.tag
        if (this.$refs.tag) {
          this.$refs.tag.forEach((item) => {
            item.style.backgroundColor = this.color[Math.floor(Math.random() * 10)]
          })
        }
      })
    },
    // 跳转到标签
    jumpGate(item) {
      this.$store.commit('CHANGE_TITLE', item)
      if (item === 'life') {
        this.$router.push({ name: 'life' })
      } else {
        this.$router.push({ name: 'techincal', params: { tag: item } })
      }
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
    color: #1a1a1a;
    background: #faf7f7;

    ul {
      display: flex;
      flex-wrap: wrap;
      .tags-item {
        border-radius: 5px;
        margin: 5px;
        overflow: hidden;
        a {
          font-size: 14px;
          display: inline-block;
          padding: 6px 15px;
          border-radius: 5px;
          color: #eee;
          transition: all ease 0.5s;
        }
        a:hover {
          transform: scale(1.5);
        }
      }
    }
  }
}
</style>
