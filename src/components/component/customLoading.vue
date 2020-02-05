<template>
    <div class="loading_wrapper">
      <div style="display:flex;justify-content:center;align-items:center">
        <i class="el-icon-loading" style="color:#409EFF"></i><span style="color:#409EFF;margin-left:5px;">加载中...</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "customLoading"
    }
</script>

<style scoped>
  .loading_wrapper{
    z-index: 99999;
    position: absolute;
    left:50%;
    top:300px;
    transform: translate(-50%, 0);
  }
</style>
