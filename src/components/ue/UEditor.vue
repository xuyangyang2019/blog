<template>
  <div class="my-ue">
    <!-- 返回|退出 -->
    <div class="back">
      <i
        class="fa fa-home fa-2x"
        aria-hidden="true"
        @click="backHome"
        title="回到管理首页"
      ></i>
      <span class="client-greet">{{ greet }}好，admin！</span>
      <span class="phone-greet">{{ greet }}好，admin！</span>
      <i
        class="fa fa-sign-out"
        aria-hidden="true"
        title="退出管理界面"
        @click="exit"
      ></i>
    </div>

    <!-- 类型|标题|标签|前言 -->
    <div class="article-details">
      <!-- 类型 -->
      <div class="article-details-type">
        <div class="item-title">类 型 ：</div>
        <div class="item-content">
          <input
            id="original"
            type="radio"
            name="original"
            value="true"
            v-model="articleInfo.original"
          />
          <label class="itme-label" for="original">原创</label>

          <input
            id="reprint"
            type="radio"
            name="original"
            value="false"
            v-model="articleInfo.original"
          />
          <label class="itme-label" for="reprint">转载</label>
          <!-- <input
          type="radio"
          name="original"
          value="3"
          id="translate"
          v-model="articleInfo.original"
        />
          <label for="translate">翻译</label>-->
        </div>
      </div>
      <!-- 标题 -->
      <div class="article-details-item">
        <div class="item-title">标 题 ：</div>
        <div class="item-content">
          <input
            type="text"
            class="item-input"
            placeholder="请输入文章标题"
            v-model="articleInfo.title"
          />
        </div>
      </div>
      <!-- 标签 -->
      <div class="article-details-tags">
        <div class="item-title">标 签 ：</div>
        <div
          class="item-content"
          @mousedown="canHide = false"
          @click="getFocus"
        >
          <!-- 已经选择的标签 -->
          <div class="has-chosed">
            <span
              class="first-floor-span"
              v-for="(tag, index) in articleInfo.tags"
              :key="'tag' + index"
            >
              {{ tag }}
              <span class="remove" @click="removeTag(tag, index)">x</span>
            </span>
          </div>

          <!-- 推荐标签 -->
          <div class="input-box-move">
            <input
              type="text"
              class="item-input"
              placeholder="请输入标签(最多四个)"
              v-model="createTag"
              @keyup="tagIndex($event)"
              @compositionstart="start"
              @compositionend="end"
              @focus="getFocus"
              @blur="blurChange"
              ref="ipt"
            />
            <!--  componsitionstart和componsitionend为中文输入法下，在input框中预输入的英文字符触发的事件，
            ..start在预输入的第一个字符时触发一次，输入完成时（回车输入中文字符或者删除全部字符），
            ..end事件触发，然后触发input绑定的keyup事件-->
            <!-- 增加@focus事件解决页面切换回来导致标签索引不显示-->

            <div class="tag-chart" v-show="tagFlag.recommend" ref="tagChart">
              <!-- 推荐的标签的nav -->
              <div class="tag-nav">
                <span
                  v-for="(tag, index) in recommendTags"
                  :key="index"
                  :class="{ 'nav-bg': currentTagNav === index }"
                  @click="currentTagNav = index"
                  v-text="tag.name"
                ></span>
              </div>
              <!-- 推荐的标签的nav的数据 -->
              <div class="tag-content">
                <span
                  v-for="(tag, index) in recommendTags[currentTagNav].data"
                  :key="'tag' + index"
                  @click="choseRecommend(tag)"
                  v-text="tag"
                ></span>
              </div>
            </div>
            <!-- 筛选|创建 标签 -->
            <div class="diy-tag" ref="recommend" v-show="tagFlag.filter">
              <li
                v-for="(recom, index) in screenTags"
                :key="'recom' + index"
                @click="choseOrCreateTag(recom)"
              >
                {{ recom }}
              </li>
              <li @click="choseOrCreateTag(createTag)">
                创建标签 {{ createTag }}
              </li>
            </div>
          </div>
        </div>
      </div>
      <!-- 前言 -->
      <div class="article-details-item">
        <div class="item-title">前 言 ：</div>
        <div class="item-content">
          <input
            type="text"
            class="item-input"
            placeholder="请输入文章前言"
            v-model="articleInfo.abstract"
          />
        </div>
      </div>
    </div>

    <!-- 百度富文本编辑器 | 预览 -->
    <div class="editor-container">
      <!-- 百度富文本编辑器 -->
      <div class="editor-write">
        <div
          id="editor"
          type="text/plain"
          style="width:100%;height:350px;"
        ></div>
      </div>
      <!-- 预览 -->
      <!-- <div class="preview">
        <div v-html="articleInfo.content"></div>
      </div>-->
    </div>

    <!-- 对文章的一系列操作: 1.文章发表 2.存为草稿 3.已发表文章的更新 4.草稿的更新 5.草稿发表 -->
    <!-- 操作 -->
    <div class="article-handle">
      <!-- 发布文章 发表文章按钮 | 存为草稿按钮 -->
      <div class="publish" v-if="this.$route.path === '/admin/publish'">
        <button
          :disabled="wating.disabled"
          class="true-publish"
          @click="publishArticle(1)"
        >
          {{ wating.info.p }}
        </button>
        <button
          :disabled="wating.disabled"
          class="false-publish"
          @click="publishArticle(0)"
        >
          {{ wating.info.sd }}
        </button>
      </div>
      <!-- 已发表的文章 更新按钮 -->
      <div class="publish" v-if="this.$route.path === '/admin/update'">
        <button
          v-show="showBtn"
          :disabled="wating.disabled"
          class="published-update"
          @click="updateOrDraftPublish(1)"
        >
          {{ wating.info.su }}
        </button>
      </div>
      <!-- 草稿箱的按钮 更新按钮 | 发表文章按钮 -->
      <div class="publish" v-if="this.$route.path === '/admin/draftrevise'">
        <button
          v-show="showBtn"
          :disabled="wating.disabled"
          class="draft-update"
          @click="updateOrDraftPublish(2)"
        >
          {{ wating.info.su }}
        </button>
        <button
          :disabled="wating.disabled"
          class="draft-publish"
          @click="updateOrDraftPublish(3)"
        >
          {{ wating.info.p }}
        </button>
      </div>
    </div>

    <transition name="publish">
      <div class="publish-mask" v-show="dialog.show">
        <div class="mask-box">
          <h3>{{ dialog.info }}</h3>
          <button @click="dialog = { show: false, info: '' }">确认</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

// 高亮的css
// import "@/../public/UE/prism.css"
// 代码高亮的js
// import Prism from "@/../public/UE/prism.js"
import Prism from "prismjs"
// ue相关的文件
import "@/../public/UE/ueditor.config.js"
import "@/../public/UE/ueditor.all.min.js"
import "@/../public/UE/lang/zh-cn/zh-cn"
// 下面注释的文件会报错
// import "@/../public/UE/ueditor.parse.min.js"
import "@/../public/UE/themes/default/css/ueditor.css"

export default {
  props: {
    config: {
      type: Object
    }
  },
  data() {
    return {
      editor: null, // ueditor
      // 文章信息
      articleInfo: {
        original: "true", // 原创
        title: "", // 标题
        tags: [], // 标签
        abstract: "", // 前言
        content: "" // 内容
      },
      currentTagNav: "languages", // 当前的标签nav
      // 标签库
      recommendTags: {
        languages: {
          name: "开发语言",
          data: [
            "html",
            "css",
            "javascript",
            "nodejs",
            "less",
            "sass",
            "php",
            "pythen",
            "typescript",
            "ruby",
            "objective-c",
            "asp.net",
            "perl",
            "java",
            "c",
            "c++"
          ]
        },
        plants: {
          name: "平台框架",
          data: [
            "vue",
            "angular",
            "react",
            "express",
            "jQuery",
            "axios",
            "Dojo",
            "prototype",
            "Yui-ext",
            "laravel",
            "spring",
            "koa",
            "ruby-on-rails",
            "struts"
          ]
        },
        servers: {
          name: "服务器",
          data: [
            "nginx",
            "apache",
            "tomcat",
            "linux",
            "windows",
            "ubuntu",
            "centos",
            "unix",
            "docker"
          ]
        },
        dbs: {
          name: "数据库和缓存",
          data: ["mysql", "mongodb", "nosql", "oracle", "redis", "sql"]
        },
        tools: {
          name: "开发工具",
          data: [
            "git",
            "github",
            "chrome",
            "sublime-text",
            "eclipse",
            "ide",
            "xcode",
            "vue-tools",
            "visual-studio"
          ]
        },
        browsers: {
          name: "浏览器",
          data: [
            "chrome",
            "firefox",
            "ie",
            "opera",
            "safari",
            "android",
            "ios",
            "windows",
            "linux"
          ]
        }
      },
      canHide: true, // 能隐藏标签页面
      createTag: "", // 创建标签
      screenTags: [], // 标签搜索结果
      inputFlag: true, // 中文输入法下预输入触发事件的标志位
      tagFlag: {
        recommend: false, // 显示推荐标签
        filter: false // 显示过滤的标签
        // delete: false // 删除标签
      },

      showBtn: false, // 显示按钮
      dialog: { show: false, info: "" }, // 对话框
      wating: {
        disabled: false,
        info: { p: "发表文章", sd: "存为草稿", su: "更新" }
      }
    }
  },
  computed: {
    ...mapGetters({
      articles: "admin/articles"
    }),
    // 所有标签集合
    filterArray() {
      let filter_arr = []
      for (const key in this.recommendTags) {
        if (this.recommendTags.hasOwnProperty(key)) {
          const tags = this.recommendTags[key].data
          filter_arr = filter_arr.concat(tags)
        }
      }
      return filter_arr
    },
    // 问候语
    greet() {
      let hour = new Date().getHours()
      if (hour >= 0 && hour < 6) {
        return "凌晨"
      }
      if (hour >= 6 && hour < 11) {
        return "上午"
      }
      if (hour >= 11 && hour < 14) {
        return "中午"
      }
      if (hour >= 14 && hour < 18) {
        return "下午"
      }
      if (hour >= 18 && hour < 24) {
        return "晚上"
      }
      return ""
    }
  },
  methods: {
    ...mapActions({
      SaveArticle: "admin/SaveArticle",
      UpdateArticle: "admin/UpdateArticle"
    }),
    // 返回首页
    backHome() {
      this.$router.push({ name: "admin" })
    },
    // 退出
    exit() {
      localStorage.removeItem("map_blog_token_info_item_name")
      localStorage.removeItem("userName")
      localStorage.removeItem("lastLogin")
      this.$router.push({ name: "login" })
    },
    // 标签框获取焦点
    getFocus() {
      this.canHide = true
      // 获取输入框的焦点
      this.$refs.ipt.focus()
      // 显示推荐标签页面
      if (!this.tagFlag.filter) {
        this.tagFlag.recommend = true
      }
    },
    /*标签框input只要获得焦点，此标志位和tagFlag.recommend均为true，点击其他位置
     *时触发blur事件，tagFlag.recommend为设为false,标签推荐页隐藏。点击标签框中的
     *div时，首先触发mousedown事件（先于blur事件），标志位flag赋值false,此时标签框input
     *失焦点，blur事件触发，this.itSelf为false,没有反应。这样就避免了标签推荐
     *页由于input的得失焦点而产生的“闪烁”问题
     */
    blurChange() {
      if (this.canHide) {
        this.tagFlag.recommend = false
        this.tagFlag.filter = false
        this.createTag = ""
      }
    },
    // 选择标签
    choseRecommend(tag) {
      let tags = this.articleInfo.tags
      // this.tagFlag.delete = true
      if (tags.indexOf(tag) === -1 && tags.length < 4) {
        this.articleInfo.tags.push(tag)
      } else if (tags.length === 4) {
        this.$toast({
          message: "最多只能设置4个标签！",
          type: "warning",
          duration: 2000
        })
      }
    },
    // 移除标签
    removeTag(tag, index) {
      // 如果文章类型是生活
      this.articleInfo.tags.splice(index, 1)
      // 选中科技文章 这里已经去掉了
      // this.$refs.a.checked = true
    },
    // 中文环境输入开始
    start() {
      // this.tagFlag.delete = false
      this.inputFlag = false
    },
    // 中文环境输入结束
    end() {
      this.inputFlag = true
    },
    // 自动匹配标签
    tagIndex(event) {
      // 如果输入结束
      if (this.inputFlag) {
        this.createTag = this.createTag.trim()
        // 如果没有创建标签
        if (this.createTag === "") {
          // if (
          //   this.tagFlag.delete &&
          //   event.keyCode === 8 &&
          //   this.articleInfo.tags.indexOf("life") === -1
          // ) {
          //   this.articleInfo.tags.pop()
          // }
          this.tagFlag = {
            filter: false,
            recommend: true
            // delete: true
          }
        } else {
          this.tagFlag = {
            filter: true,
            recommend: false
            // delete: false
          }
          let tag = this.createTag
          let pattern = new RegExp("^" + tag, "gi")
          this.screenTags = this.filterArray.filter((item, index, arr) => {
            return pattern.test(item)
          })
        }
      }
    },
    // 选择或创建标签
    choseOrCreateTag(tag) {
      let tags = this.articleInfo.tags
      if (tags.indexOf(tag) === -1 && tags.length < 4) {
        this.articleInfo.tags.push(tag)
      } else if (tags.length === 4) {
        this.$toast({
          message: "最多只能设置4个标签！",
          type: "warning",
          duration: 2000
        })
      }
      this.tagFlag.filter = false
      this.createTag = ""
      setTimeout(() => {
        this.tagFlag.recommend = false //先让getFocus触发
      }, 0)
    },
    // 表单验证验证
    validate() {
      if (this.articleInfo.title === "") {
        // this.dialog = { show: true, info: "请填写文章标题" }
        this.$toast({
          message: "请填写文章标题",
          type: "warning",
          duration: 2000
        })
        return false
      }
      if (this.articleInfo.tags.length === 0) {
        // this.dialog = { show: true, info: "请填写文章标签" }
        this.$toast({
          message: "请填写文章标签",
          type: "warning",
          duration: 2000
        })
        return false
      }
      if (this.articleInfo.abstract === "") {
        // this.dialog = { show: true, info: "请填写文章前言" }
        this.$toast({
          message: "请填写文章前言",
          type: "warning",
          duration: 2000
        })
        return false
      }
      if (this.articleInfo.content.length === 0) {
        // this.dialog = { show: true, info: "内容不能为空" }
        this.$toast({
          message: "内容不能为空",
          type: "warning",
          duration: 2000
        })
        return false
      }
      return true
    },
    // 发表文章或存为草稿，通过设置isPublish来区别
    publishArticle(flag) {
      // 如果验证通过
      if (this.validate()) {
        let isPublish = flag ? true : false
        let _original = this.articleInfo.original === "true" ? true : false
        if (flag) {
          this.wating = {
            disabled: true,
            info: { p: "发表中...", sd: "存为草稿", su: "更新" }
          }
        } else {
          this.wating = {
            disabled: true,
            info: { p: "发表文章", sd: "保存中...", su: "更新" }
          }
        }
        this.SaveArticle({
          articleId: 0,
          title: this.articleInfo.title,
          abstract: this.articleInfo.abstract,
          content: this.articleInfo.content,
          tag: this.articleInfo.tags,
          publish: flag ? true : false,
          original: this.articleInfo.original === "true" ? true : false,
          pv: 0,
          date: Date.now()
        }).then((data) => {
          if (data.code === 200) {
            this.editor.setContent("") //清空编辑器
            this.wating = {
              disabled: false,
              info: { p: "发表文章", sd: "存为草稿", su: "更新" }
            }
            this.articleInfo = {
              original: "true",
              title: "",
              tags: [],
              content: "",
              abstract: ""
            }
            if (isPublish) {
              this.dialog = { show: true, info: "文章发表成功！" }
            } else {
              this.dialog = { show: true, info: "草稿保存成功！" }
            }
          }
        })
      }
    },
    // updateOrDraftPublish三个作用  ---> 已发表文章的更新 + 草稿的更新 + 草稿文章的发表
    updateOrDraftPublish(flag) {
      // 如果通过表单验证
      if (this.validate()) {
        let isPublish
        let a = this.articles.only[0]
        let _original = this.articleInfo.original === "true" ? true : false
        console.log(a)
        // switch (flag) {
        //   // 已发表文章的更新
        //   case 1:
        //     isPublish = false
        //     this.wating = {
        //       disabled: true,
        //       info: { p: "发表文章", sd: "存为草稿", su: "更新中..." }
        //     }
        //     this.dialog.info = "更新成功！"
        //     break
        //   // 草稿的更新
        //   case 2:
        //     isPublish = true
        //     this.wating = {
        //       disabled: true,
        //       info: { p: "发表文章", sd: "存为草稿", su: "更新中..." }
        //     }
        //     this.dialog.info = "更新成功！"
        //     break
        //   // 草稿文章的发表
        //   case 3:
        //     isPublish = true
        //     this.wating = {
        //       disabled: true,
        //       info: { p: "发表中...", sd: "存为草稿", su: "更新" }
        //     }
        //     this.dialog.info = "发表成功！"
        //     break
        //   default:
        //     break
        // }

        // this.UpdateArticle({
        //   articleId: a.articleId,
        //   original: _original,
        //   title: this.articleInfo.title,
        //   abstract: this.articleInfo.abstract,
        //   content: this.articleInfo.content,
        //   tag: this.articleInfo.tags,
        //   publish: isPublish
        // }).then((data) => {
        //   this.editor.setContent("") //清空编辑器
        //   this.articleInfo = {
        //     original: "true",
        //     title: "",
        //     tags: [],
        //     content: "",
        //     abstract: ""
        //   }
        //   this.wating = {
        //     disabled: false,
        //     info: { p: "发表文章", sd: "存为草稿", su: "更新" }
        //   }
        //   this.dialog.show = true
        // })
      }
    },
    //
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent()
    },
    // 转化内容
    transformStr() {
      let dom = document.createElement("div")
      dom.innerHTML = this.getUEContent()
      let strArr = dom.getElementsByTagName("pre")
      for (let i = 0; i < strArr.length; i++) {
        let el = strArr[i],
          preContent = el.innerHTML,
          code = document.createElement("code"),
          cls =
            "language-" + el.className.substring(6, el.className.indexOf(";"))
        let tempCls = el.className
        el.className = tempCls + " " + "line-numbers"
        code.className = cls
        code.innerHTML = preContent
        let str = code.outerHTML
        el.innerHTML = str
      }
      this.articleInfo.content = dom.innerHTML
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    },
    // 初始化编辑器
    initUeditor() {
      // eslint-disable-next-line no-undef
      this.editor = UE.getEditor("editor", this.config) // 初始化UE
      //editor内容变化监听事件
      this.editor.addListener("contentChange", () => {
        if (!this.showBtn) {
          this.showBtn = true
        }
        this.transformStr()
      })
      this.editor.addListener("ready", () => {
        if (this.articles.only.length) {
          this.editor.setContent(this.articles.only[0].content)
        }
      })
    },
    // 初始化编辑器内容
    initUeditorContent() {
      if (this.articles.only.length) {
        let atc = this.articles.only[0]
        // 标题 | 标签 | 前言
        if (this.$route.path !== "/admin/publish") {
          let _original = atc.original === true ? "true" : "false"
          this.articleInfo = {
            original: _original,
            title: atc.title,
            tags: atc.tag,
            abstract: atc.abstract,
            content: atc.content
          }
        }
        // 技术文章 | 生活感悟
        if (this.articleInfo.tags[0] === "life") {
          this.$refs.typeOfLife.checked = true
        }
      }
    }
  },
  mounted() {
    this.initUeditor()
    this.initUeditorContent()
    // document.addEventListener("click", (e) => {
    //   if (!this.$el.contains(e.target)) {
    //     this.show = false //这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
    //   }
    // })
  },
  destroyed() {
    console.log("离开页面，销毁")
    console.log(this.editor)
    if (this.editor !== null) {
      this.editor.destroy()
    }

    this.articleInfo = {
      title: "",
      tags: [],
      abstract: "",
      content: ""
    }
    this.$store.commit("admin/ClearOnly")
  }
}
</script>

<style lang="scss">
.my-ue {
  color: #000;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .back {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ccc;
    border-bottom: 1px solid #ccc;
    .fa {
      font-size: 26px;
      cursor: pointer;
    }
  }

  .article-details {
    color: #fff;
    padding: 15px;
    .article-details-item {
      display: flex;
      align-items: center;
      text-align: start;
      padding: 5px;
      .item-title {
        width: 70px;
        font-weight: 600;
      }
      .item-content {
        width: 100%;
        border-radius: 5px;
        background: #ffffff;
        display: flex;
        align-items: center;
        padding: 2px;
        height: 28px;
        .item-input {
          box-sizing: border-box;
          font-size: 16px;
          flex: 1 1 auto;
          border: none;
          outline: none;
        }
      }
    }

    .article-details-type {
      @extend .article-details-item;
      .item-content {
        // color: black;
        font-size: 16px;
        background-color: inherit;
        #original {
          margin-right: 5px;
        }
        #reprint {
          margin: 0 5px 0 20px;
        }
        .itme-label {
          cursor: pointer;
          @include can-not-select;
        }
      }
    }

    .article-details-tags {
      @extend .article-details-item;
      .item-content {
        cursor: text;
        // border: solid red 1px;
      }

      .has-chosed {
        display: inline-block;
        .first-floor-span {
          display: inline-block;
          padding: 6px;
          margin-right: 2px;
          border-radius: 4px;
          background: #94d1f5;
          .remove {
            padding: 6px 0 6px 4px;
            cursor: pointer;
          }
        }
      }

      .input-box-move {
        display: inline-block;
        position: relative;
        input:disabled {
          background: #ccc;
        }
        .tag-chart,
        .diy-tag {
          position: absolute;
          top: 28px;
          width: 500px;
          z-index: 1000;
          color: #017e66;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          padding: 15px;
          border-radius: 5px;
          li {
            list-style: none;
          }

          .tag-nav {
            display: flex;
            flex-wrap: wrap;
            span {
              cursor: pointer;
              padding: 5px;
              border-radius: 5px;
            }
            .nav-bg {
              background: #009a61;
              color: #ffffff;
            }
          }
          .tag-content {
            // li {
            display: flex;
            flex-wrap: wrap;
            span {
              cursor: pointer;
              background: #94d1f5;
              padding: 5px;
              margin: 3px;
              border-radius: 2px;
            }
            // }
          }
        }
        .diy-tag li {
          margin-top: 2px;
          cursor: pointer;
        }
      }
    }
  }

  .editor-container {
    flex: 1 1 auto;
    margin: 0 20px;
    overflow-y: scroll;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    border: solid red 1px;

    ::v-deep .editor-write {
      overflow-y: scroll;
      border: solid red 1px;
      .edui-default .edui-editor-toolbarboxouter {
        border: solid red 1px;
      }
    }

    .preview {
      width: 49%;
      padding: 5px;
      text-align: start;
      font-size: 14px;
      border-radius: 2px;
      line-height: 1.5;
      overflow-y: scroll;
      background-color: #fff;
      border: solid red 1px;

      // li {
      //   margin-left: 15px;
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

  .article-handle {
    margin: 0 20px;
    button {
      border: 1px solid #409eff;
      border-radius: 5px;
      padding: 5px 10px;
      margin-right: 10px;
      background: #409eff;
      cursor: pointer;
      color: #ffffff;
    }
    button:hover {
      opacity: 0.9;
    }
    button[disabled] {
      cursor: wait;
    }
    .publish {
      padding: 10px 0;
      text-align: right;
    }
  }

  .publish-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .mask-box {
      background: #ffffff;
      border-radius: 5px;
      margin: 150px auto;
      width: 30%;
      text-align: center;
      overflow: hidden; /*消除对父元素的margin-top绑架*/
      h3 {
        margin-top: 50px;
        color: #e6a23c;
      }
      button {
        padding: 5px 10px;
        border: 1px solid #5bc0de;
        background: #5bc0de;
        margin: 50px 0 20px;
        color: #ffffff;
        border-radius: 5px;
        cursor: pointer;
      }
      button:hover {
        opacity: 0.9;
      }
    }
  }
}

.publish-enter-active,
.publish-leave-active {
  transition: all ease 0.5s;
}
.publish-enter,
.publish-leave-to {
  opacity: 0;
}
.phone-greet {
  display: none;
}

@media screen and(max-width: 767px) {
  .phone-greet {
    display: inline-block;
  }
  .client-greet {
    display: none;
  }
  .mask-box {
    width: 80%;
  }
  .input-box-move {
    width: 100% !important;
  }
  .has-chosed {
    display: block;
  }
  .preview {
    display: none;
  }
  .editor-write {
    width: 100% !important;
  }
  .article-details-title label,
  .article-details-tag label,
  .article-details-abstract label {
    display: none;
  }
}
</style>
