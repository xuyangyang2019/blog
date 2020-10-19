<template>
  <div class="gateway">
    <h2 class="gateway-header" @click="getTagsClass">标签</h2>
    <div class="gateway-content">
      <ul>
        <li v-for="item in tags">
          <!-- <a href="javascript: void(0)" @click="jumpGate(item.tag)" ref="tag">{{ item.tag | changeLife }}</a> -->
          <a href="javascript: void(0)" @click="jumpGate(item.tag)" ref="tag">{{ item }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"

export default {
  data() {
    return {
      color: ["#FF9933", "#663300", "#CC6600", "#99CC33", "#CC6699", "#009966", "#999999", "#336666", "#9BBFEA", "#CCCC00"]
    }
  },
  filters: {
    changeLife: function (value) {
      if (value == "life") {
        return "生活"
      } else {
        return value
      }
    }
  },
  computed: {
    ...mapState({
      tags: 'tags'
    })
  },
  watch: {
    tags() {
      this.initBackground()
    }
  },
  methods: {
    ...mapActions({
      getTagsClass: 'GetTagsClass'
    }),
    // 初始化背景色
    initBackground: function () {
      this.$nextTick(() => {
        // IE10不支持refs.tag
        this.$refs.tag.forEach((item, index, arr) => {
          item.style.backgroundColor = this.color[Math.floor(Math.random() * 10)]
        })
      })
    },
    // 跳转到标签
    jumpGate(item) {
      console.log(itme)
      // if (item === "life") {
      //   this.$router.push({ name: "life" })
      // } else {
      //   this.$router.push({ name: "techincal", params: { articleList: item } })
      // }
    }
  },
  mounted() {
    this.getTagsClass({ publish: true })
    // this.getTagsClass({ publish: true }).then((data) => {
    //   //没有标签则不要初始化，否则会出错
    //   console.log(data)
    //   if (data.length) {
    //     this.initBackground()
    //   }
    // })
  }
}
</script>

<style lang = "scss" scoped>
.gateway-header {
  text-align: center;
  padding: 15px;
  color: #eee;
  background: #2e3033;
}
.gateway-content:after {
  display: block;
  content: "";
  clear: both;
  line-height: 0;
  height: 0;
  visibility: hidden;
}
.gateway-content {
  background: #faf7f7;
  padding: 10px;
  li {
    list-style: none;
    border-radius: 5px;
    margin: 5px;
    float: left;
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
</style>