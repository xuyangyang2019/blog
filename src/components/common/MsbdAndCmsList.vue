<template>
  <div class="msgboard-comments">
    <!-- 表头 -->
    <ul class="ul-title">
      <li>
        <input type="checkbox" id="checkAll" @click="allChecked" v-model="allChoose" />
        <label for="checkAll">全选</label>
      </li>
      <li v-for="(th, index) in initTable.th" :key="index" v-text="th"></li>
      <li>操作</li>
    </ul>
    <!-- 内容 -->
    <ul class="ul-content scroll">
      <li
        class="li-item"
        v-for="(item, index) in mcList"
        :key="'item' + index"
        :class="{ 'tr-bg': itemsToDel.indexOf(item._id) !== -1 }"
      >
        <ul class="ul-item">
          <li>
            <input type="checkbox" :value="item._id" @click="singleChecked()" v-model="itemsToDel" />
            <span style="visibility:hidden;">单选</span>
          </li>
          <li v-text="index + 1"></li>
          <li v-if="item.title" :title="item.title" v-text="item.title"></li>
          <li v-text="item.name"></li>
          <li v-html="item.content"></li>
          <li v-text="$options.filters.reviseTime(item.date)"></li>
          <li class="some-handle">
            <button class="operation-btn" @click="reviewBoard(item)">
              <i
                v-if="current.review.indexOf(item._id) === -1"
                class="fa fa-eye fa-lg"
                aria-hidden="true"
                title="预览"
              ></i>
              <i v-else class="fa fa-eye-slash fa-lg" aria-hidden="true" title="预览"></i>
            </button>
            <button class="operation-btn" @click="replyBoard(item)">
              <i class="fa fa-commenting-o fa-lg" aria-hidden="true" title="回复"></i>
            </button>
            <button class="operation-btn" @click="deleteItem(item._id, -1, index, -1)">
              <i class="fa fa-trash-o fa-lg" aria-hidden="true" title="删除"></i>
            </button>
          </li>
        </ul>
        <!-- 查看回复内容 -->
        <transition name="review">
          <ul class="msg-review" v-if="current.review.indexOf(item._id) > -1">
            <li class="msg-review-li" v-if="$route.name === 'comments'">
              <span>文章标题：</span>
              {{ item.title }}
            </li>
            <li class="msg-review-li">
              <span>昵称：</span>
              {{ item.name }}
            </li>
            <li class="msg-review-li">
              <span v-if="$route.name === 'adminMsgBoard'">留言：</span>
              <span v-else-if="$route.name === 'comments'">评论：</span>
              <span v-text="item.content">{{ item.content }}</span>
            </li>
            <li class="msg-review-li">
              <span>时间：</span>
              {{ item.date | reviseTime }}
            </li>
            <!-- 管理员的回复与其他回复 -->
            <li class="admin-reply">
              <span>本条回复：</span>
              <span v-if="!item.reply.length">暂无</span>
              <ul v-else>
                <li class="admin-reply-li" v-for="(rep, _index) in item.reply" :key="'rep' + _index">
                  <div class="reply-from-to ellipsis" v-text="rep.name + '@' + rep.aite"></div>
                  <div class="reply-content" v-text="rep.content"></div>
                  <div class="reply-time" v-text="$options.filters.reviseTime(rep.date)"></div>
                  <div class="reply-opration-btns">
                    <!-- 回复 不能回复自己 -->
                    <button
                      v-if="rep.name !== 'admin（管理员）'"
                      class="reply-opration-btn"
                      @click="replyBoard(item, rep)"
                    >
                      <i class="fa fa-commenting-o fa-lg"></i>
                    </button>
                    <!-- 删除 -->
                    <button class="reply-opration-btn" @click="sureDelete(item._id, rep._id, index, _index)">
                      <i class="fa fa-trash-o fa-lg"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </transition>
        <!-- 管理员回复 -->
        <transition name="review">
          <li v-if="current.reply === item._id" class="msg-reply">
            <textarea
              placeholder="输入回复内容"
              @focus="emptyWarning = false"
              v-model="replyContent"
              :class="{ 'empty-warning': emptyWarning }"
            ></textarea>
            <div class="reply-aite-btn">
              <span>@ {{ aite }}</span>
              <!-- 回复一级留言找到_id直接push即可，二级回复也是直接push，故只需一个参数 -->
              <div>
                <button @click="postReply(item._id)">回复</button>
                <button @click="current.reply = -1">取消</button>
              </div>
            </div>
          </li>
        </transition>
      </li>
    </ul>

    <!-- 删除（multi）按钮 -->
    <div class="remove-all" v-show="itemsToDel.length">
      <!-- <button @click="sureDelete(-1)">删除选中项</button> -->
      <button @click="deleteItems()">删除选中项</button>
    </div>

    <!-- 分页 -->
    <transition name="fade" mode="out-in">
      <page v-show="pageArray.length > 1"></page>
    </transition>

    <!-- 确认删除 -->
    <transition name="fade">
      <div class="validate-mask" v-show="showDeleteDialog">
        <div class="validate-bin">
          <div class="exit-validate">
            <span @click="showDeleteDialog = false">X</span>
          </div>
          <div class="sure-deleteInfo">
            <h3 v-text="warningMsg"></h3>
            <button @click="sureRemove">确定</button>
            <button @click="showDeleteDialog = false">取消</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex"
import page from "@/components/base/page"

export default {
  data() {
    return {
      allChoose: false, // 全选
      itemsToDel: [], // 要删除的项目
      showDeleteDialog: false, // 二次确认框
      warningMsg: "", // 警告消息
      deleteType: "single", // 单独删除还是批量删除
      deleteInfo: { oneLevelId: -1, twoLevelId: -1, oneIndex: -1, twoIndex: -1 }, // 要删除的信息
      current: { review: [], reply: -1 }, // 需要展示的留言
      aite: "", // 要@的人
      sureInfo: { warning: "", type: "" }, // 确认删除
      replyContent: "", // 回复的内容
      emptyWarning: false // 回复内容为空发出警告
    }
  },
  computed: {
    ...mapGetters({
      pageArray: "admin/pageArray",
      page: "admin/page"
    })
  },
  components: {
    page
  },
  props: {
    mcList: {
      type: Array
    },
    initTable: {
      type: Object
    }
  },
  watch: {
    //换页后清除所有状态
    mcList() {
      this.allChoose = false
      this.itemsToDel = []
      this.currentIndex = -1
    }
  },
  methods: {
    ...mapMutations({
      reduceArr: "admin/REDUCE_ARR",
      reduceArr_all: "admin/REDUCE_ARR_ALL",
      addLocalWord: "admin/ADD_LOCAL_WORD",
      addLocalComment: "admin/ADD_LOCAL_COMMENT"
    }),
    ...mapActions({
      addBoardReply: "admin/AddBoardReply",
      addCommentsReply: "admin/AddCommentsReply",
      removeLeavewords: "admin/RemoveLeavewords",
      removeComments: "admin/RemoveComments",
      reduceLeavewords: "admin/ReduceLeavewords",
      reduceComments: "admin/ReduceComments"
    }),
    // 单选
    singleChecked() {
      //加定时器是因为先触发click事件，此时articleItem
      //还没有被推入新的值，因此将此事件推入事件队列，先让articleItem插值完成
      setTimeout(() => {
        if (this.itemsToDel.length === this.mcList.length) {
          this.allChoose = true
        } else {
          this.allChoose = false
        }
      }, 0)
    },
    // 全选
    allChecked() {
      if (this.itemsToDel.length !== this.mcList.length) {
        let _arr = []
        this.mcList.forEach((item, index, arr) => {
          _arr.push(item._id)
        })
        this.itemsToDel = _arr
      } else {
        this.itemsToDel = []
      }
    },
    // 预览
    reviewBoard(item) {
      let rid = this.current.review.indexOf(item._id)
      if (rid >= 0) {
        this.current.review.splice(rid, 1)
      } else {
        this.current.review.push(item._id)
      }
    },
    // 回复
    replyBoard(item, rep) {
      if (this.current.reply === item._id && !rep) {
        this.current.reply = null
      } else {
        this.current.reply = item._id
        if (rep) {
          this.aite = rep.name
        } else {
          this.aite = item.name
        }
      }
    },
    // 提交回复
    postReply(id) {
      console.log("提交回复")
      console.log(id)
      console.log(this.replyContent)
      // let that = this
      if (!this.replyContent.length) {
        this.emptyWarning = true
        return
      }
      // //留言回复
      // if (this.$route.name === "adminMsgBoard") {
      //   this.addBoardReply({
      //     id: id,
      //     name: "admin（管理员）",
      //     aite: this.aite,
      //     imgUrl: "/img/logo.png",
      //     content: this.replyContent,
      //     date: new Date()
      //   }).then(data => {
      //     if (data._id) {
      //       that.addLocalWord(data)
      //       that.replyContent = ""
      //     }
      //   })
      // }
      //评论回复
      // if (this.$route.name === "comments") {
      //   this.addCommentsReply({
      //     _id: id,
      //     name: "admin（管理员）",
      //     aite: this.aite,
      //     imgUrl: "/img/logo.png",
      //     content: this.replyContent,
      //     like: 0,
      //     email: "",
      //     date: new Date()
      //   }).then(data => {
      //     if (data._id) {
      //       that.addLocalComment(data)
      //       that.replyContent = ""
      //     }
      //   })
      // }
    },
    // 是否删除
    sureDelete(mainId, secondId, oneIndex, twoIndex) {
      //选中删除操作
      if (mainId === -1) {
        let w = this.$route.name === "comments" ? "条评论么？" : "条留言么？"
        this.sureInfo.type = "all"
        this.sureInfo.warning = "确定删除选中的" + this.itemsToDel.length + w
      } else {
        let w = this.$route.name === "comments" ? "评论么？" : "留言么？"
        let info = this.deleteInfo
        this.sureInfo = {
          type: "single",
          warning: "确定删除此条" + w
        }
        this.deleteInfo = {
          oneLevelId: mainId,
          twoLevelId: secondId,
          oneIndex: oneIndex,
          twoIndex: twoIndex
        }
      }
    },
    deleteItem() {
      console.log("deleteItem")
      this.showDeleteDialog = true
      this.deleteType = "single"
      if (this.$route.name === "comments") {
        this.warningMsg = "确定删除此条评论么？"
      } else {
        this.warningMsg = "确定删除此条条留言么？"
      }
    },
    deleteItems() {
      console.log("deleteItems")
      this.showDeleteDialog = true
      this.deleteType = "multi"
      let itemNum = this.itemsToDel.length
      if (this.$route.name === "comments") {
        this.warningMsg = `确定删除${itemNum}条评论么？`
      } else {
        this.warningMsg = `确定删除${itemNum}条留言么？`
      }
    },
    // 删除
    sureRemove() {
      if (this.deleteType === "single") {
        let ol = this.deleteInfo.oneLevelId,
          tl = this.deleteInfo.twoLevelId,
          oi = this.deleteInfo.oneIndex,
          ti = this.deleteInfo.twoIndex,
          that = this
        // 删除留言
        if (this.$route.name === "adminMsgBoard") {
          //删除一级留言
          if (ol !== -1 && tl == -1) {
            this.removeLeavewords({ id: [ol] }).then(data => {
              if (data.deleteCode === 200) {
                that.reduceArr({ name: "adminMsgBoard", oneIndex: oi, twoIndex: ti })
                that.sureInfo.type = ""
              }
            })
          }
          //删除二级留言
          if (ol !== -1 && tl !== -1) {
            this.reduceLeavewords({ mainId: ol, secondId: tl }).then(data => {
              if (data.deleteCode === 200) {
                that.reduceArr({ name: "adminMsgBoard", oneIndex: oi, twoIndex: ti })
                that.sureInfo.type = ""
              }
            })
          }
        }
        // 删除文章评论
        if (this.$route.name === "comments") {
          // 删除一级评论
          if (ol !== -1 && tl === -1) {
            this.removeComments({ id: [ol] }).then(data => {
              if (data.deleteCode === 200) {
                that.reduceArr({ name: "comments", oneIndex: oi, twoIndex: ti })
                that.sureInfo.type = ""
              }
            })
          }
          //删除二级评论
          if (ol !== -1 && tl !== -1) {
            this.reduceComments({ mainId: ol, secondId: tl }).then(data => {
              if (data.deleteCode === 200) {
                that.reduceArr({ name: "comments", oneIndex: oi, twoIndex: ti })
                that.sureInfo.type = ""
              }
            })
          }
        }
      } else {
        // this.removeAll()
        let that = this
        if (this.$route.name === "adminMsgBoard") {
          this.removeLeavewords({ id: this.itemsToDel }).then(data => {
            if (data.deleteCode === 200) {
              that.reduceArr_all({ name: "adminMsgBoard", removeArr: that.itemsToDel })
              that.sureInfo.type = ""
            }
          })
        }
        if (this.$route.name === "comments") {
          this.removeComments({ id: this.itemsToDel }).then(data => {
            if (data.deleteCode === 200) {
              that.reduceArr_all({ name: "comments", removeArr: that.itemsToDel })
              that.sureInfo.type = ""
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-btn {
  cursor: pointer;
  width: 30px;
  color: #606266;
  background: inherit;
  padding: 2px;
  border-radius: 2px;
  border: solid #ccc 1px;
  &:hover {
    color: #fff;
    background: #409eff;
    .fa-trash-o {
      color: red;
    }
  }
}
.msgboard-comments {
  color: #606266;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .ul-title {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 5px 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    min-height: 30px;
    li {
      width: 80px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    li:last-child {
      width: 150px;
    }
    li:nth-last-child(2) {
      width: 150px;
    }
    li:nth-last-child(3) {
      width: 150px;
    }
  }
  .ul-content {
    flex: 1 1 atuo;
    overflow: auto;
    .li-item:nth-child(odd) {
      background: #f5f7fa;
    }
    .tr-bg {
      background: #fff38f !important;
    }
    .li-item {
      display: flex;
      flex-direction: column;
      .ul-item {
        @extend .ul-title;
        padding: 5px 0;
        border: none;
        .some-handle {
          .operation-btn {
            @extend .base-btn;
            margin: 0 5px;
          }
        }
      }
      .msg-review {
        border-bottom: 1px solid #ccc;
        .msg-review-li {
          padding: 5px;
          width: 90%;
          margin-left: 5%;
          text-align: start;
          span:first-child {
            color: orange;
          }
        }
        .admin-reply {
          @extend .msg-review-li;
          .admin-reply-li {
            // border: solid red 1px;
            display: flex;
            justify-content: space-between;
            padding: 5px 5px 5px 20px;
            .reply-from-to {
              width: 250px;
              color: #e6a23c;
            }
            .reply-time {
              width: 150px;
              text-align: center;
            }
            .reply-opration-btns {
              width: 80px;
              text-align: end;
              .reply-opration-btn {
                @extend .base-btn;
                margin-left: 10px;
              }
            }
          }
        }
      }
      .msg-reply {
        padding: 5px;
        width: 90%;
        margin-left: 5%;
        textarea {
          outline: none;
          border: 1px solid #6aa7fc;
          border-radius: 4px;
          width: 100%;
          height: 50px;
          padding: 5px;
          box-sizing: border-box;
          resize: none;
        }
        .reply-aite-btn {
          display: flex;
          justify-content: space-between;
          span {
            margin-left: 5px;
          }
          button {
            background: #5bc0de;
            color: #fff;
            padding: 3px 10px;
            margin-left: 5px;
            border: 1px solid #46b8da;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
          }
          button:hover {
            background: #46afcb;
          }
        }
      }
    }
  }
}

.empty-warning {
  border: 1px solid red !important;
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
.validate-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  .validate-bin {
    margin: 50px auto 0;
    border-radius: 5px;
    width: 30%;
    height: 200px;
    background: #ffffff;
    .exit-validate {
      border-radius: 5px 5px 0 0;
      background: #f7f7f7;
      text-align: right;
      padding: 5px 10px 5px 0;
      span {
        cursor: pointer;
      }
    }
    .sure-deleteInfo {
      text-align: center;
      color: #e6a23c;
      h3 {
        margin-top: 60px;
      }
      button {
        outline: none;
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        padding: 5px 8px;
        background: #409eff;
        margin: 50px 10px;
      }
      button:hover {
        opacity: 0.8;
      }
    }
  }
}
@media screen and(min-width: 768px) {
  .icon-commenting-o-mc,
  .icon-eye-mc,
  .icon-bin-mc {
    margin-left: -5px;
  }
}
@media screen and(max-width: 767px) {
  .validate-bin {
    width: 80%;
  }
}
</style>
