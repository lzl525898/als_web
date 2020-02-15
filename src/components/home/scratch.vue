<template>
  <div :style="{height:height+'px'}">
    <div style="height: 100%;position: relative">
      <div v-if="scratchLoading" style="top:45%;left:15%;width:70%;position: absolute;z-index:100;">
        <el-progress :text-inside="true" :stroke-width="40" :percentage="percentage"></el-progress>
      </div>
      <iframe v-show="showFrame" id="scratchIframe" :src=scratchUrl width="100%" height="100%" scrolling="yes" frameborder="0" align="center" style="z-index:50"></iframe>
    </div>
  </div>
</template>

<script>
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import '../../router/router'
  import '../../api/restfulapi'
  import {
    qs,
    checkWorksExist,
  } from '../../api/api'
  export default {
    name: "scratch",
    data(){
      return{
        showFrame:false,
        intervalId:'',
        width:0,
        height:0,
        percentage:0,
        scratchLoading: true,
        scratchUrl: ROUTER_SCRATCH_CREATE,
      }
    },
    created(){
      this.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      // if(global.DEBUG){
      //   this.scratchUrl =  global.DEBUG ? "http://192.168.1.177:9527/scratch/index.html" : ROUTER_SCRATCH_CREATE
      // }
      this.scratchUrl =  ROUTER_SCRATCH_CREATE
    },
    mounted() {
        this.listenLoginStatus()
        let query = decodeURI(window.location.search.substring(1))
        let vars = query.split("=")
        for(let i=0;i<100;i++){
          setTimeout(()=>{
            this.percentage = this.percentage + 1
          },10*i)
        }
              // ?user_id=用户id&id=任务id&type=1&role=2&device=1
        if(vars.length && vars.length==6){ // 进行查询
            const webParams = {userId: 0, type: 0, id: 0, role: 2, terminal:0}
            webParams.userId = vars[1].split("&")[0]; // 用户id
            webParams.type = vars[3].split("&")[0]; // 类型  1、作品   2、任务
            webParams.id =  vars[2].split("&")[0]; // 任务id 或 作品id
            webParams.role = vars[4].split("&")[0]; //1老师 2学生
            webParams.terminal = vars[5]; // 0 pc 1 mobile 2 tablet
            if(webParams.type!=1){
                this.showFrame = true
                this.listenScratchLoading()
                return
            }
            // ?user_id='+this.data.student_id+'&id='+this.data.worksId+'&type=1&role='+roleId+'&device=1'
            this.scratchUrl = this.scratchUrl + "?user_id=" + webParams.userId + "&id="+webParams.id+'&type=1&role='+webParams.role+'&device=1'
            console.log("scratchUrl==>",this.scratchUrl)
            this.showFrame = true
            this.listenScratchLoading()
            // checkWorksExist(qs.stringify({worksUrl:vars[1]})).then(res=>{
            //   if(res.code==SUCCESS_CODE){ // 能够查到作品
            //     if(res.data && res.data.id==storageUtil.readTeacherInfo().id){ // 作品时当前学生的
            //       console.log("作品时当前学生的")
            //
            //     }else{ // 作品是其他学生的
            //       console.log("作品是其他学生的")
            //       this.scratchUrl
            //     }
            //   }
            //   this.showFrame = true
            //   this.listenScratchLoading()
            // }).catch(err=>{
            //   promptUtil.LOG('checkWorksExist-err',err)
            //   this.showFrame = true
            //   this.listenScratchLoading()
            // })
      }else{ // 无法查询到作品id
          console.log("参数不合法，直接进入创作页")
          this.showFrame = true
          this.listenScratchLoading()
      }
    },
    methods:{
      listenLoginStatus(){ // 监听是否为登录状态
        this.intervalId = setInterval(()=>{
          if(storageUtil.getLoginStatus()!=1){
            clearInterval(this.intervalId)
            this.intervalId = null
          }
        },1000)
      },
      listenScratchLoading(){
        let $dom = document.getElementById("scratchIframe")
        let that = this
        if ($dom) {
          if ($dom.attachEvent) {
            $dom.attachEvent("onload", function () {
              that.scratchLoading = false
            });
          } else {
            $dom.onload = function () {
              that.scratchLoading = false
            };
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
