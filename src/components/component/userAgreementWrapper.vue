<template>
<div>
  <div>
    <div style="line-height:27px;font-size:20px;color:#333;text-align:center;letter-spacing:2px;font-weight:bold">奥松云课堂(AEP)用户服务协议</div>
    <div style="display:flex;justify-content:center">
      <div style="width:618px;height:450px;margin-top:20px;margin-bottom:50px">
        <als-user-agreement/>
      </div>
    </div>
    <div style="display:flex;justify-content:center;margin-bottom:15px;">
      <div class="dialog-btn" style="background-color:#409EFF;box-shadow:0 2px 3px #00a2ff;color:#fff" @click="onClickAgreeState(1)">同意协议</div>
      <div class="dialog-btn" style="margin-left:10px;border:1px solid #409EFF;background-color:#EBEEF5;color:#409EFF" @click="onClickAgreeState(0)">不同意</div>
    </div>
  </div>
</div>
</template>

<script>
    import userAgreement from "./userAgreement";

    export default {
      components:{'als-user-agreement':userAgreement},
      name: "userAgreementWrapper",
      methods:{
        onClickAgreeState(type){
          this.$emit('changeDialogStatus',type)
        },
      }
    }
</script>

<style scoped>
  .dialog-btn{
    width:150px;
    height:46px;
    border-radius:4px;
    text-align:center;
    font-size:18px;
    line-height:46px;
  }
  .dialog-btn:hover{
    cursor:pointer;
  }
</style>
