<template>
    <div class="mobile-header-wrapper">
      <div class="mobile-header-menu">
<!--        <i class="el-icon-menu"/>-->
      </div>
      <div class="mobile-header-logo">
        <a href="http://www.alsedu.cn">
          <img src="../../../../static/images/base/newestIndex/logo.png" alt="">
        </a>
      </div>
      <div class="mobile-header-right"></div>
    </div>
</template>

<script>
    export default {
        name: "mobileHeader"
    }
</script>

<style scoped>
  .mobile-header-wrapper{
    height: 60px;
    display: flex;
    align-items: center;
  }
  .mobile-header-menu{
    flex:1;
    display: flex;
    justify-content: center;
    font-size: 32px;
    color: #237DB8;
  }
  .mobile-header-logo{
    flex:5;
    display: flex;
    justify-content: center;
    height: 40px;
  }
  .mobile-header-logo img{
    height: 40px;
  }
  .mobile-header-right{
    flex:1;
    display: flex;
    justify-content: center;
  }
</style>
