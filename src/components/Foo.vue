<template>
  <div class="foo">
    <h1 @click="onHandleClick">Foo</h1>
    <div>{{ fooCount }}</div>
    <p>Component</p>
  </div>
</template>

<script>
// 在这里导入模块，而不是在 `store/index.js` 中
import fooStoreModule from '../store/lazy-modules/foo'

export default {
  // 惰性注册模块
  asyncData({ store }) {
    store.registerModule('foo', fooStoreModule)
    return store.dispatch('foo/inc')
  },
  computed: {
    fooCount() {
      return this.$store.state.foo.count
    }
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    this.$store.unregisterModule('foo')
  },
  methods: {
    onHandleClick() {
      alert('foo')
    }
  }
}
</script>

<style>
.foo {
  background: yellowgreen;
}
</style>
