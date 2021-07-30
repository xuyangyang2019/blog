<template>
  <footer class="page-footer">
    <ul class="copyright">
      <li class="copyright-item">
        <img class="bei-an-img" src="/img/beian.png" alt="beian" />
        <a href="http://www.beian.gov.cn/" target="_blank">浙公网安备33010402004522号</a>
      </li>
      <li class="copyright-item">
        <a href="http://beian.miit.gov.cn" target="_blank">浙ICP备2021004304号-1</a>
      </li>
      <li class="copyright-item">
        ©{{ currentYear }}&nbsp;
        <a href="http://www.xyy.life">xyy.life &nbsp;</a>
      </li>
      <li class="copyright-item">
        |
        <a href="http://xyy.life/admin" target="_blank">&nbsp;管理员</a>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style lang = "scss">
.page-footer {
  color: #ccc;
  background: #2e3033;
  padding: 5px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .copyright {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-family: HeiTi;
    .copyright-item {
      padding: 5px;
      display: flex;
      align-items: center;
      a {
        color: #ccc;
      }

      .bei-an-img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
}

@media screen and(max-width: 767px) {
  .page-footer {
    font-size: 14px;
  }
}
</style>
