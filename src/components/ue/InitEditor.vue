<template>
  <div class="ue-box">
    <UE :config="config" ref="ue"></UE>
  </div>
</template>

<script>
import UE from "./UEditor"
export default {
  components: {
    UE
  },
  data() {
    return {
      config: {
        initialFrameWidth: null, // ue默认宽
        initialFrameHeight: 300, // ue默认高
        // ue工具栏
        toolbars: [
          [
            "source",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "|",
            "forecolor",
            "backcolor",
            "selectall",
            "removeformat",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "lineheight",
            "insertorderedlist",
            "insertunorderedlist",
            "imagenone",
            "imageleft",
            "imageright",
            "imagecenter",
            "|",
            "simpleupload",
            "insertimage",
            "emotion",
            "customstyle",
            "paragraph",
            "fontfamily",
            "fontsize",
            "|",
            "link",
            "anchor",
            "|",
            "attachment",
            "insertcode",
            "horizontal",
            "spechars",
            "|",
            "searchreplace",
            "drafts"
          ]
        ]
      }
    }
  },
  created() {
    this.$store.dispatch("admin/ConfirmToken")
  }
}
</script>

<style lang="scss">
.ue-box {
  background: #195f88;
  height: 100%;
}
</style>
