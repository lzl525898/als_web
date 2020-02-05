<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <div v-if="isShow==0" style="font-size: 46px;color:#ccc;font-weight:bold;margin:auto;text-align:center;line-height:500px;"></div>
    <el-card v-if="isShow==1" shadow="always" style="margin-top: 20px;padding:20px 20px 40px 20px">
      <div style="display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;margin-bottom:40px;margin-top:-80px;">
        <div class="scale-image-wrapper" @click="onClickTool(tool)" v-for="(tool,index) in tools" :key="index">
          <el-image :src="tool.url" fit="fill" class="scale-image"></el-image>
          <div style="position:absolute;top:200px;width:200px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
            <div style="margin-top:10px">{{tool.title}}</div>
            <div style="margin-top:10px;color:#ccc">（{{tool.type}}）</div>
          </div>
        </div>
      </div>
    </el-card>
    <div v-if="isShow==2" style="font-size: 46px;color:#ccc;font-weight:bold;margin:auto;text-align:center;line-height:500px;">暂无数据</div>
  </div>
</template>

<script>
  import PubSub from "pubsub-js";
  import vuexUtils from '../../utils/vuexUtils'
  import storageUtil from '../../utils/storageUtil'
  import promptUtil from '../../utils/promptUtil'
  import childHeader from '../component/childHeader'
  import '../../router/router'
  import '../../api/restfulapi'
  import {
    qs,
    getTools
  } from '../../api/api'
  export default {
    components: {"als-child-header": childHeader},
    name: "tool",
    data(){
      return{
        routerConfig: [{name: vuexUtils.checkMenuExist(this,'tool').target.name, to: ''}],
        tools:[],
        isShow:0,
      }
    },
    mounted(){
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_TOOL);
      const loading = promptUtil.loading(this)
      this.isShow = 0
      getTools().then(res=>{
        if(res.code==SUCCESS_CODE){
          if(res.data && res.data.tools && res.data.tools!='[]'){
            this.tools = res.data.tools
            this.isShow = 1
          }else{
            this.isShow = 2
          }
        }else{
          this.isShow = 2
        }
        loading.close()
      }).catch(err=>{
        this.isShow = 2
        loading.close()
        promptUtil.LOG("getTools-err",err)
      })
    },
    methods:{
      onClickTool(obj){
        window.open(obj.path)
      }
    }
  }
</script>

<style scoped>
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 5px 12px 0 #00a2ff30;
  }
  .scale-image-wrapper{
    margin-right: 80px;
    margin-top: 80px;
    position: relative;
    cursor: pointer;
  }
  .scale-image{
    width: 200px;
    height: 200px;
    transition: all 0.3s ease-out 0.15s;
  }
  .scale-image:hover{
    transform: scale(1.05)
  }
</style>
