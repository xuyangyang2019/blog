<template>
  <div class="admin-article-list-box">
    <table class="admin-table-articles">
      <!-- 表格头部 -->
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              id="checkAll"
              v-model="allChecked"
              @click="allChoose"
            />
            <label for="checkAll">全选</label>
          </th>
          <th>ID</th>
          <th>标题</th>
          <th>标签</th>
          <th>浏览</th>
          <th>喜欢</th>
          <th>评论</th>
          <th>发表时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <!-- 表格主题 -->
      <tbody class="tbody-list">
        <tr
          v-for="(item, index) in article_list"
          :key="index"
          :class="{ bg: articlesChose.indexOf(item.articleId) !== -1 }"
        >
          <!-- 选中框 -->
          <td>
            <input
              type="checkbox"
              v-bind:value="item.articleId"
              @click="singleChecked()"
              v-model="articlesChose"
            />
            <span style="visibility:hidden;">单选</span>
          </td>
          <!-- 序号 -->
          <td>{{ index + 1 }}</td>
          <!-- 文章名 -->
          <td :title="item.title">{{ item.title }}</td>
          <!-- 标签 -->
          <td>
            <span
              v-for="(tag, index) in item.tag"
              :key="'tag' + index"
              ref="listTag"
              class="tbody-list-tag"
              >{{ tag | changeLife }}</span
            >
          </td>
          <!-- 浏览 -->
          <td v-text="item.pv"></td>
          <!-- 点赞 -->
          <td v-text="item.likeNum"></td>
          <!-- 评论 -->
          <td v-text="item.commentNum"></td>
          <!-- 日期 -->
          <td v-text="$options.filters.reviseTime(item.date)"></td>
          <!-- 操作 -->
          <td class="some-handle">
            <!-- 浏览 -->
            <button class="operation-btn" @click="reviewArticle(item)">
              <i class="fa fa-eye fa-lg" aria-hidden="true" title="预览"></i>
            </button>
            <!-- 修改 -->
            <button
              class="operation-btn"
              @click="modifyArticle(item)"
              :class="{ waiting: updateInfo.wait }"
            >
              <i
                class="fa fa-pencil-square-o fa-lg"
                aria-hidden="true"
                title="修改"
              ></i>
            </button>
            <!-- 删除 -->
            <button
              class="operation-btn"
              @click="deleteArticle(item.articleId, index)"
            >
              <i
                class="fa fa-trash-o fa-lg"
                aria-hidden="true"
                title="删除"
              ></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 批量删除按钮 -->
    <div class="remove-all" v-show="articlesChose.length">
      <button @click="deleteArticles()">删除选中项</button>
    </div>

    <!-- 分页 -->
    <transition name="fade" mode="out-in">
      <page v-show="pageArray.length > 1"></page>
    </transition>

    <!-- 二次确认弹框 -->
    <transition name="fade">
      <div class="validate-mask" v-show="showDeleteDialog">
        <div class="validate-bin">
          <div class="exit-validate">
            <span @click="showDeleteDialog = false">X</span>
          </div>
          <div class="sure-delete">
            <h3>{{ deleteDialogMsg }}</h3>
            <button @click="sureRemove">确定</button>
            <button @click="showDeleteDialog = false">取消</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 过度窗口 -->
    <transition name="fade">
      <div class="validate-mask" v-show="updateInfo.show">
        <div class="update-warning">
          <h3>数据抓取超时，请稍后再试...</h3>
          <button @click="updateInfo = { show: false, wait: false }">
            确定
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import page from "@/components/base/page"

export default {
  data() {
    return {
      allChecked: false, // 全选
      articlesChose: [], // 选中的文章的id的集合
      showDeleteDialog: false, // 显示确认删除的对话框
      deleteDialogMsg: "", // 确人删除的提示语
      articleIdToDel: {}, // 要删除的文章id
      deleteType: "single", // 删除的类型 单独删:single 批量删:multi
      updateInfo: { show: false, wait: false },
      // 标签背景颜色
      color: [
        "#FF9933",
        "#663300",
        "#CC6600",
        "#99CC33",
        "#9933FF",
        "#009966",
        "#FFCC99",
        "#336666",
        "#CC6699",
        "#CCCC00"
      ]
    }
  },
  computed: {
    ...mapGetters({
      pageArray: "admin/pageArray"
    })
  },
  props: {
    article_list: {
      type: Array
    }
  },
  components: {
    page
  },
  //定义过滤器，将life标签替换为“生活”
  filters: {
    changeLife: function(value) {
      if (value === "life") {
        value = "生活"
        return value
      } else {
        return value
      }
    }
  },
  watch: {
    article_list: function() {
      this.allChecked = false
      this.articlesChose = []
      this.$nextTick(() => {
        if (this.article_list.length) {
          this.initBackground()
        }
      })
    }
  },
  methods: {
    // 随机生成标签的背景色 ok
    initBackground() {
      // 随机生成标签的背景色
      // this.$refs.listTag.forEach((item, index, arr) => {
      //   item.style.background = "#" + Math.floor(Math.random() * 0xffffff).toString(16)
      // })
      // 随机选中颜色
      this.$refs.listTag.forEach((item, index, arr) => {
        item.style.background = this.color[Math.floor(Math.random() * 10)]
      })
    },
    // 单选 ok
    singleChecked() {
      // 加定时器是因为先触发click事件，此时articleItem
      // 还没有被推入新的值，因此将此事件推入事件队列，先让articleItem插值完成
      setTimeout(() => {
        if (this.articlesChose.length === this.article_list.length) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
      }, 0)
    },
    // 全选 ok
    allChoose() {
      if (this.articlesChose.length !== this.article_list.length) {
        let _arr = []
        this.article_list.forEach((item, index, arr) => {
          _arr.push(item.articleId)
        })
        this.articlesChose = _arr
      } else {
        this.articlesChose = []
      }
    },
    // 预览文章 ok
    reviewArticle(item) {
      this.$router.push({
        name: "review",
        params: { eTag: item.tag[0], articleId: item.articleId }
      })
    },
    // 修改文章 ok
    modifyArticle(item) {
      this.updateInfo = { show: false, wait: true }
      this.$store
        .dispatch("admin/GetArticle", {
          tag: item.tag[0],
          articleId: item.articleId
        })
        .then(data => {
          if (data.length) {
            this.updateInfo = { show: false, wait: false }
            // 如果当前是草稿箱 跳转到draftrevise
            if (this.$route.path === "/admin/draft") {
              this.$router.push({ name: "draftrevise" })
            } else {
              this.$router.push({ name: "update" })
            }
          } else {
            this.updateInfo = { show: true, wait: false }
          }
        })
    },
    // 删除单篇文章 ok
    deleteArticle(aid, index) {
      this.showDeleteDialog = true
      this.articleIdToDel.aid = aid
      this.articleIdToDel.aindex = index
      this.deleteDialogMsg = "确定删除此项么？"
      this.deleteType = "single"
    },
    // 删除多篇文章 ok
    deleteArticles() {
      this.showDeleteDialog = true
      this.deleteType = "multi"
      this.deleteDialogMsg =
        "确定删除选中的" + this.articlesChose.length + "项么？"
    },
    // 确认删除文章
    sureRemove() {
      if (this.deleteType === "single") {
        this.$store
          .dispatch("admin/RemoveArticle", {
            articleId: [this.articleIdToDel.aid]
          })
          .then(data => {
            // 如果删除成功 删除缓存中的数据
            if (data.deleteCode === 200) {
              this.$store.commit("admin/REDUCE_ARR", {
                name: this.$route.name,
                index: this.articleIdToDel.aindex
              })
            }
          })
      } else {
        this.$store
          .dispatch("admin/RemoveArticle", { articleId: this.articlesChose })
          .then(data => {
            if (data.deleteCode === 200) {
              this.$store.commit("admin/REDUCE_ARR_ALL", {
                name: this.$route.name,
                removeArr: this.articlesChose
              })
            }
          })
      }
      this.showDeleteDialog = false // 退出确认框
    }
  },
  mounted() {
    if (this.article_list.length) {
      this.$nextTick(() => {
        this.initBackground()
      })
    }
  }
}
</script>

<style lang="scss">
.bg {
  background: #fff38f !important;
}
.admin-table-articles {
  width: 100%;
  color: #606266;
  table-layout: fixed;
  border-collapse: collapse;
  tr {
    border-bottom: 1px solid #ccc;
    text-align: center;
  }
  th {
    color: #333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border: 1px solid #ccc;
    padding: 5px;
  }
  td {
    border: 1px solid #ccc;
    padding: 5px;
  }
  td:not(:last-child) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .some-handle {
    .operation-btn {
      cursor: pointer;
      border: solid #ccc 1px;
      color: #606266;
      background: inherit;
      padding: 2px;
      margin: 0 5px;
      border-radius: 2px;
      &:hover {
        background: #409eff;
        .fa-trash-o {
          color: red;
        }
      }
    }
  }

  input[type="checkbox"],
  label {
    vertical-align: middle;
  }
  .tbody-list tr:nth-child(odd) {
    background: #f5f7fa;
  }
  .tbody-list-tag {
    display: inline-block;
    margin: 0 2px;
    padding: 2px 5px;
    border-radius: 3px;
    color: #ffffff;
  }
  // .chose {
  //   text-align: left;
  //   width: 12px;
  //   position: relative;
  //   background: url("/img/checkbox.png") no-repeat;
  //   background-position: 0 50%;
  //   input {
  //     position: absolute;
  //     visibility: hidden;
  //   }
  //   label {
  //     padding-left: 13px;
  //   }
  // }
  // .checked {
  //   background-position: -16px 50%;
  // }
}

.validate-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.validate-bin,
.update-warning {
  margin: 50px auto 0;
  border-radius: 5px;
  width: 30%;
  height: 200px;
  background: #ffffff;
  overflow: hidden;
}
.exit-validate {
  border-radius: 5px 5px 0 0;
  background: #f7f7f7;
  text-align: right;
  padding: 5px 10px 5px 0;
  span {
    cursor: pointer;
  }
}
.sure-delete,
.update-warning {
  text-align: center;
  color: #e6a23c;
  h3 {
    margin-top: 50px;
  }
  button:hover {
    opacity: 0.8;
  }
}
.update-warning h3 {
  margin-top: 70px;
}
.sure-delete button,
.update-warning button {
  outline: none;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 5px 8px;
  background: #409eff;
  margin: 50px 10px 0;
}
.remove-all {
  display: flex;
  button {
    outline: none;
    color: #fff;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    background: #e6a23c;
    margin: 5px 5px 0 0;
  }
  button:hover {
    opacity: 0.9;
  }
}
.waiting,
.waiting span {
  cursor: wait !important;
}

.icon-crop-a,
.icon-eye-a,
.icon-bin-a {
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  font-size: 16px;
  display: inline-block;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.icon-crop-a:hover,
.icon-eye-a:hover {
  color: #ffffff;
  background: #409eff;
}
.icon-bin-a:hover {
  color: red;
  background: #409eff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and(min-width: 768px) {
  .icon-crop-a,
  .icon-eye-a,
  .icon-bin-a {
    margin-left: -5px;
  }
  .icon-eye-a {
    margin-left: -4px;
  }
}
@media screen and(max-width: 767px) {
  .validate-bin {
    width: 80%;
  }
}
</style>
