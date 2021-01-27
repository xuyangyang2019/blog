<template>
  <div class="foot">
    <!-- <div class="police">
      <img src="/img/beian.png" />
      <p>鲁公网安备 37012502000331号</p>
    </div> -->
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
  </div>
</template>

<script></script>

<style lang = "scss">
.foot {
  color: #ccc;
  background: #2e3033;
  /* height: 50px; */
  /* display: flex; */
  /* border: solid red 1px; */
  padding: 10px 0;

  /* a {
    color: #ccc;
  }
  a:hover {
    color: #ffffff;
    text-decoration: underline;
  } */
  /* .police {
    display: flex;
    justify-content: center;
    padding: 20px;
  } */
  .copyright {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-family: HeiTi;
    /* border: solid yellow 1px; */
  }
}

@media screen and(max-width: 767px) {
  .foot {
    font-size: 14px;
    /* .police {
      padding: 15px;
    } */
    .copyright span {
      display: none;
    }
  }
}
</style>
