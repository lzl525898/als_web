<template>
  <div>
    <el-row>
      <div style="font-size: 20px;font-weight:bold">创作工具</div>
    </el-row>
    <el-card shadow="always" style="margin-top: 20px;padding:20px 20px 40px 20px">
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
    <el-row style="margin-top:20px;">
      <div style="font-size: 20px;font-weight:bold">信息栏</div>
      <el-card shadow="always" style="margin-top: 20px;padding:20px 20px 20px 20px">
        <div style="display:flex;justify-content:flex-start;align-items:center">

          <el-card shadow="hover" style="width:260px;padding:10px;">
            <div class="div-wrapper" @click="goToLiving">
              <div style="text-align: center">直播课</div>
              <div style="text-align: center;font-size:24px;font-weight:bold;margin-top:10px;">{{statistics.live}}</div>
            </div>
          </el-card>
          <el-card shadow="hover" style="width:260px;margin-left:20px;padding:10px;">
            <div class="div-wrapper" @click="goToTask">
              <div style="text-align: center">作品数</div>
              <div style="text-align: center;font-size:24px;font-weight:bold;margin-top:10px;">{{statistics.works}}</div>
            </div>
          </el-card>
          <el-card shadow="hover" style="width:260px;margin-left:20px;padding:10px;">
            <div class="div-wrapper" @click="goToTask">
              <div style="text-align: center">考试及格率</div>
              <div style="text-align: center;font-size:24px;font-weight:bold;margin-top:10px;">{{statistics.passRate}}</div>
            </div>
          </el-card>
          <el-card shadow="hover" style="width:260px;margin-left:20px;padding:10px;">
            <div style="text-align: center">作品平均分</div>
            <div style="text-align: center;font-size:24px;font-weight:bold;margin-top:10px;">
              <el-rate disabled v-model="statistics.average" :colors="colors"></el-rate>
            </div>
          </el-card>
          <el-card shadow="hover" style="width:260px;margin-left:20px;padding:10px;">
            <div style="text-align: center">作品最高分</div>
            <div style="text-align: center;font-size:24px;font-weight:bold;margin-top:10px;">
              <el-rate disabled v-model="statistics.max" :colors="colors"></el-rate>
            </div>
          </el-card>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
    import PubSub from "pubsub-js"
    import storageUtil from '../../utils/storageUtil'
    import promptUtil from '../../utils/promptUtil'
    import '../../router/router'
    import '../../api/restfulapi'
    import {
        qs,
        getTools,
        checkStudentPwd,
        getStudentStatistics
    } from "../../api/api";
    export default {
        name: "dashboard",
        data(){
            return{
                tools:[],
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                statistics:{works:'',passRate:'',average:0,max:0,live:0}
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", ROUTER_STUDENT_INDEX)
            this.initData()
        },
        methods:{
            checkPassword(){
                checkStudentPwd(qs.stringify({user_id:storageUtil.readTeacherInfo().id})).then(res=>{
                    if(res.code!=SUCCESS_CODE){
                        setTimeout(()=>{
                            this.$notify({
                                title: '警告',
                                message: '为了您账户的安全考虑，建议您在【用户信息】中尽快修改初始密码,谨防被盗',
                                offset: 50,
                                type: 'warning'
                            });
                        },1000)
                    }
                }).catch(err=>promptUtil.LOG('checkStudentPwd-err',err))
            },
            initData(){
                this.checkPassword()
                getStudentStatistics(qs.stringify({user_id:storageUtil.readTeacherInfo().id})).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        this.statistics = {works:res.data.works,passRate:res.data.passRate,average:res.data.average*1,max:res.data.max*1,live:res.data.live*1}
                    }
                }).catch(err=>promptUtil.LOG('getStudentStatistics-err',err))
                getTools().then(res=>{
                    if(res.code==SUCCESS_CODE){
                        if(res.data && res.data.tools && res.data.tools!='[]'){
                            this.tools = res.data.tools
                        }
                    }
                }).catch(err=>{
                    promptUtil.LOG("getTools-err",err)
                })
            },
            goToLiving(){
                this.$router.push({path:'/onlineEducation'})
            },
            goToTask(){
                this.$router.push({path:'/student'})
            },
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
  .div-wrapper:hover{
    cursor: pointer;
  }
</style>
