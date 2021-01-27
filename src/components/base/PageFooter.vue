<template>
  <footer class="page-footer">
    <div class="copyright">
      <div>
        Copyright © 2020&nbsp;
        <a href="http://www.xyy.life">xyy.life &nbsp;</a>
      </div>
      <div>
        Powered by Vue
        <span>|</span>
      </div>
      <div>
        <a href="http://localhost:6180/login" target="_blank">&nbsp;管理员</a>
      </div>
    </div>
  </footer>
</template>

<script></script>

<style lang = "scss">
.page-footer {
  color: #ccc;
  background: #2e3033;
  padding: 10px 0;

  .copyright {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-family: HeiTi;
  }
}

@media screen and(max-width: 767px) {
  .page-footer {
    font-size: 14px;
    .copyright span {
      display: none;
    }
  }
}
</style>
