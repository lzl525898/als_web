<template>
  <div class="examinee">
    <div style="display:flex;justify-content:center;align-items:center;margin-top:5px;">
      <span class="examinee-underline"></span>
      <span style="margin-left:10px;margin-right:10px">排行榜</span>
      <span class="examinee-underline"></span>
    </div>
    <el-row type="flex" align="center" class="examinee-label">
      <el-col :span="2">名次</el-col>
      <el-col :span="12">用户名</el-col>
      <el-col :span="7">账号</el-col>
      <el-col :span="3">分数</el-col>
    </el-row>
    <el-row type="flex" align="center" style="color:rgb(26, 140, 254);display:flex;align-items:center;margin-top:10px;" v-for="(item,index) in stuList" :key="index">
      <el-col :span="2"><img src="../../../static/images/base/exam/p_icon_first.svg"/></el-col>
      <el-col :span="12">{{item.name}}</el-col>
      <el-tooltip class="item" effect="dark" :content="item.phone" placement="top-start">
      <el-col :span="7" style="cursor: pointer">
        {{getPhoneChar(item.phone)}}
      </el-col></el-tooltip>
      <el-col :span="3">{{(item.score*1).toFixed(1)}}</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "examRankList",
    data(){
      return{
        stuList:[],
      }
    },
    methods:{
      students(stuArr){
        this.stuList = stuArr
      },
      getPhoneChar(phone){
        return phone.substr(0,3) + "****" + phone.substr(7)
      },
    }
  }
</script>

<style scoped>
  .examinee{
    margin-top: 20px;
    padding: 10px;
    border: 1px dashed rgb(222, 222, 222);
  }
  .examinee-underline{
    width: 40px;
    height: 1px;
    background: #DEDEDE;
    display: inline-block;
    vertical-align: middle;
  }
  .examinee-label{
    background:#F7F8FA;
    border-radius:5px;
    padding:3px;
    margin-top:10px;
    color: #B4B6BD;
  }
</style>
