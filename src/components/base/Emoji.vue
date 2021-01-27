<template>
  <div class="emoji">
    <!-- 分类 -->
    <ul class="emoji-controller">
      <li
        v-for="(pannel, index) in pannels"
        :key="index"
        :class="{ active: index === activeIndex }"
        @click="changeActive(index)"
      >
        {{ pannel }}
      </li>
    </ul>
    <!-- emoji 列表 -->
    <ul class="emoji-container">
      <!-- <li v-for="(emojiGroup, index) in emojis" style="padding: 0" :key="index" v-if="index === activeIndex">
        <a href="javascript:;" v-for="(emoji, index) in emojiGroup" :key="index" @click="selectItem(emoji)">
          <span class="emoji-item" :title="emoji" :class="'sprite-' + getPureName(emoji)"></span>
        </a>
      </li> -->
      <li style="padding: 0">
        <a v-for="(emoji, index) in emojis[activeIndex]" :key="index" href="javascript:;" @click="selectItem(emoji)">
          <span class="emoji-item" :title="emoji" :class="'sprite-' + getPureName(emoji)"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import data from '@/assets/js/emoji-data.js'

export default {
  name: 'Emoji',
  data() {
    return {
      emojiData: data, // emoji数据name:png
      pannels: ['表情', '自然', '物品', '地点', '符号'],
      activeIndex: 0 // 当前pannel
    }
  },
  computed: {
    // 返回所有emoji的键值组成的数组
    emojis() {
      return this.pannels.map((item) => {
        return Object.keys(this.emojiData[item])
      })
    }
  },
  methods: {
    // 改变emoji类别
    changeActive(index) {
      this.activeIndex = index
    },
    // emoji的英文名
    getPureName(name) {
      return name.replace(/:/g, '')
    },
    // 选中表情
    selectItem(emoji) {
      // console.log("子元素触发")
      this.$emit('select', emoji)
    }
  }
}
</script>

<style lang='scss' scoped>
.emoji {
  width: 380px;
  height: 186px;
  bottom: 30px;
  background: #fff;
  z-index: 10;
  padding: 10px;
  margin-right: 10px;
  .emoji-controller {
    height: 36px;
    overflow: hidden;
    margin-bottom: 0;
    li {
      float: left;
      width: 65px;
      font-size: 12px;
      line-height: 36px;
      cursor: pointer;
      text-align: center;
      position: relative;
      &.active::after {
        content: '';
        width: 100%;
        height: 1px;
        background: #0689dd;
        left: 0;
        bottom: 4px;
        position: absolute;
      }
    }
  }
  .emoji-container {
    height: 140px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    li {
      font-size: 0;
      padding: 5px;
      a {
        float: left;
        overflow: hidden;
        height: 35px;
        transition: all ease-out 0.2s;
        border-radius: 4px;
        &:hover {
          background-color: #d8d8d8;
          border-color: #d8d8d8;
        }
        span {
          width: 25px;
          height: 25px;
          display: inline-block;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
    }
  }
  .emojiExit {
    position: absolute;
  }
}
@media screen and(max-width: 767px) {
  .emoji {
    width: 95%;
  }
}
</style>
