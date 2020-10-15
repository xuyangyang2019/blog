<template>
  <div class="foot">
    <div class="police">
      <img src="../../../public/img/beian.png" />
      <p>鲁公网安备 37012502000331号</p>
    </div>
    <div class="copyright">
      <div>
        Copyright © 2020&nbsp
        <a href="http://www.xyy.ink">xyy.ink &nbsp</a>
      </div>
      <div>
        Powered by Vue
        <span>|</span>
      </div>
      <div>
        <a href="http://localhost:6180/login" target="_blank">&nbsp管理员</a>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang = "scss">
.foot {
  color: #ccc;
  background: #2e3033;
  /* display: flex; */
  a {
    color: #ccc;
  }
  a:hover {
    color: #ffffff;
    text-decoration: underline;
  }
  .police {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  .copyright {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-bottom: 25px;
    font-family: HeiTi;
  }
}

@media screen and(max-width: 767px) {
  .foot {
    font-size: 14px;
    .police {
      padding: 15px;
    }
    .copyright span {
      display: none;
    }
  }
}
</style>
