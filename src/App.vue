<template>
  <div id="app">
    <Layout>
      <router-view name="layOut" />
    </Layout>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>

<script>
import Layout from "@/layouts"
export default {
  name: "App",
  components: {
    Layout
  }
}
</script>

<style lang="scss">
@import "./styles/reset.scss";
@import "./styles/common.scss";
@import "./styles/normalize.css";
@import "~@/assets/font-awesome/css/font-awesome.css";
// @import "~@/assets/iconfont/iconfont.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  height: 100%;
  overflow: hidden;
}
</style>
