<template>
  <div class="bar">
    <h1 @click="onHandleClick">Bar</h1>
    <p>Component</p>
    <h2>异步Ajax数据：</h2>
    <span>{{ msg }}</span>
  </div>
</template>

<script>
export default {
  // 由于此函数会在组件实例化之前调用，所以它无法访问 this
  asyncData({ store }) {
    // 触发 action 后，会返回 Promise
    // return store.dispatch('fetchItem', route.params.id)
    return store.dispatch('fetchBar')
  },
  computed: {
    msg() {
      return this.$store.state.bar
    }
  },
  mounted() {
    // 因为服务端渲染只有 beforeCreate 和 created 两个生命周期，不会走这里
    // 所以把调用 Ajax 初始化数据也写在这里，是为了供单独浏览器渲染使用
    this.$store.dispatch('fetchBar')
  },
  methods: {
    onHandleClick() {
      alert('bar')
    }
  }
}
</script>

<style>
.bar {
  background: bisque;
}
</style>
