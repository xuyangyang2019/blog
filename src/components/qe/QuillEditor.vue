<template>
  <div class="publish-article-content">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    ></quill-editor>
  </div>
</template>

<script>
// 调用富文本编辑器
import { quillEditor } from "vue-quill-editor"
// 富文本编辑器外部引用样式  三种样式三选一引入即可
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
// 调整图片大小
import Quill from "quill"
import ImageResize from "quill-image-resize-module"
Quill.register("modules/imageResize", ImageResize)

export default {
  data() {
    /*富文本编辑图片上传配置*/
    const uploadConfig = {
      action: "http://www.jjldkj.com:10089/fileUpload", // 必填参数 图片上传地址
      methods: "POST", // 必填参数 图片上传方式
      token: "", // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
      name: "myfile", // 必填参数 文件的参数名
      size: 1024 * 20, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
      accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon" // 可选 可上传的图片格式
    }
    const toolOptions = [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"]
    ]
    const handlers = {
      image: function image() {
        let self = this
        let fileInput = this.container.querySelector("input.ql-image[type=file]")
        if (fileInput === null) {
          fileInput = document.createElement("input")
          fileInput.setAttribute("type", "file")
          // 设置图片参数名
          // if (uploadConfig.name) {
          //   fileInput.setAttribute("name", uploadConfig.name)
          // }
          // 可设置上传图片的格式
          fileInput.setAttribute("accept", uploadConfig.accept)
          fileInput.classList.add("ql-image")
          // 监听选择文件
          fileInput.addEventListener("change", function() {
            // 创建formData
            let formData = new FormData()
            formData.append("myfile", fileInput.files[0])
            formData.append(uploadConfig.name, fileInput.files[0])
            // formData.append("object", "product")
            // 如果需要token且存在token
            if (uploadConfig.token) {
              formData.append("token", uploadConfig.token)
            }
            // 图片上传
            let xhr = new XMLHttpRequest()
            xhr.open(uploadConfig.methods, uploadConfig.action, true)
            // 上传数据成功，会触发
            xhr.onload = function(e) {
              if (xhr.status === 200) {
                // console.log("上传数据成功，会触发")
                var res = JSON.parse(xhr.responseText)
                // console.log(res)
                let length = self.quill.getSelection(true).index
                // 这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                self.quill.insertEmbed(length, "image", res.data.url)
                self.quill.setSelection(length + 1)
              }
              fileInput.value = ""
            }
            // 开始上传数据
            xhr.upload.onloadstart = function(e) {
              // console.log("开始上传数据")
              fileInput.value = ""
            }
            // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
            xhr.upload.onerror = function(e) {
              // console.log("当发生网络异常的时候会触发，如果上传数据的过程还未结束")
              alert("上传文件失败")
            }
            // 上传数据完成（成功或者失败）时会触发
            xhr.upload.onloadend = function(e) {
              // console.log("上传结束")
            }
            xhr.send(formData)
          })
          this.container.appendChild(fileInput)
        }
        fileInput.click()
      }
    }
    return {
      editor: null,
      content: "",
      editorOption: {
        placeholder: "输入内容",
        theme: "snow", // 主题
        modules: {
          toolbar: {
            container: toolOptions, // 工具栏选项
            handlers: handlers // 事件重写
          },
          // 调整图片大小
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          }
        }
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    // 富文本编辑器 失去焦点事件
    onEditorBlur(quill) {
      console.log("editor blur!", quill)
      console.log(this.content)
    },
    // 富文本编辑器 获得焦点事件
    onEditorFocus(quill) {
      console.log("editor focus!", quill)
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log("editor ready!", quill)
    },
    // 富文本编辑器 内容改变事件
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text)
      this.content = html
    },
    publishArticle() {
      console.log(this.content)
    }
  },
  mounted() {
    this.editor = this.$refs.myQuillEditor.quill
    // console.log("this is current quill instance object", this.editor)
  },
  beforeDestroy() {
    this.editor = null
    delete this.editor
  }
  // beforeRouteEnter(to, from, next) {
  //   document.title = "后台管理 -账户设置"
  //   next()
  // }
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
