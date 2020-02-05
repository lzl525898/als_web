<template>
  <div>
    <el-card shadow="always" style="width:230px">
      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-avatar :src="$store.state.userAvatar" :size="80"></el-avatar>
      </div>
      <div style="margin-top: 20px;">
        <div v-if="userRole==1 || userRole==2">
          <div style="display: flex;font-size:8px;color:#1E1F1E;margin-top: 10px;">
            <div style="width: 120px;text-align: right">昵&nbsp&nbsp&nbsp&nbsp称&nbsp&nbsp:&nbsp</div>
            <el-tooltip :content="$store.state.userName" placement="bottom" effect="light">
              <div style="width:90px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">&nbsp{{$store.state.userName}}</div>
            </el-tooltip>
          </div>
          <div style="display: flex;font-size:8px;color:#1E1F1E;margin-top: 5px;">
            <div style="width: 120px;text-align: right">用户角色&nbsp&nbsp:&nbsp</div>
            <div style="width: 90px;">&nbsp{{topBaseInfo.role}}</div>
          </div>
        </div>
        <div v-if="userRole==3">
          <div style="display: flex;font-size:8px;color:#1E1F1E;margin-top: 10px;">
            <div style="width: 120px;text-align: right">学生姓名&nbsp&nbsp:&nbsp</div>
            <el-tooltip :content="$store.state.userName" placement="bottom" effect="light">
              <div style="width:90px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">&nbsp{{$store.state.userName}}</div>
            </el-tooltip>
          </div>
          <div style="display: flex;font-size:8px;color:#1E1F1E;margin-top: 5px;">
            <div style="width: 120px;text-align: right">所在班级&nbsp&nbsp:&nbsp</div>
            <el-tooltip :content="topBaseInfo.class" placement="bottom" effect="light">
              <div style="width:90px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">&nbsp{{topBaseInfo.class}}</div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div style="display:flex;justify-content:center;align-items:center;flex-direction:column">
        <div id="menu_create" @click="onClickMenuActive(1)">
          <i class="el-icon-edit-outline"></i>
          <span>我的创作</span>
        </div>
        <div id="menu_setting" @click="onClickMenuActive(2)">
          <i class="el-icon-setting"></i>
          <span>账号设置</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from 'jquery'
  import vuexUtil from '../../../utils/vuexUtils'
  import storageUtil from '../../../utils/storageUtil'
  export default {
    name: "userPanel",
    data(){
      return{
        targetMenu:'1', // 1 我的创作  2 账号设置
        userRole: 0, // 0 未登录  1 管理员  2 教师  3 学生
        topBaseInfo: {institution: "", nick: "", role: "", class: ""}
      }
    },
    mounted() {
      $("#menu_create").addClass("als-click-active")
      $("#menu_setting").addClass("als-click")
      this.userRole = storageUtil.readUserRole()
      if (this.userRole == 0) {
        // 未登录
        this.$router.replace({path: `/home`});
        return;
      }
      const baseInfo = storageUtil.readTeacherInfo()
      if (this.userRole == 3) {
        this.topBaseInfo.class = baseInfo.className
      } else {
        this.topBaseInfo.role = baseInfo.school_admin == 1 ? "校长" : "教师"
      }
      vuexUtil.setUserNameWithState(this, storageUtil.readTeacherInfo().real_name)
      vuexUtil.setUserAvatarWithState(this, storageUtil.readTeacherInfo().avatar)
    },
    methods:{
      updateTargetMenu(index){
        this.$emit('target',index)
      },
      onClickMenuActive(index){
        $("#menu_create").removeClass('als-click-active').removeClass('als-click')
        $("#menu_setting").removeClass('als-click-active').removeClass('als-click')
        if(index==1){
          $("#menu_create").addClass("als-click-active")
          $("#menu_setting").addClass("als-click")
        }else if(index==2){
          $("#menu_setting").addClass("als-click-active")
          $("#menu_create").addClass("als-click")
        }
        this.updateTargetMenu(index)
      }
    }
  }
</script>

<style scoped>
  .als-click{
    height: 50px;
    width: 184px;
    margin-bottom: 5px;
    border-radius: 90px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .als-click:hover{
    cursor: pointer;
    color: #409EFF;
  }
  .als-click span{
    margin-left: 20px;
  }
  .als-click-active{
    background-color: #047FD8;
    height: 50px;
    width: 184px;
    margin-bottom: 5px;
    border-radius: 90px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .als-click-active:hover{
    cursor: pointer;
    background-color: #409EFF;
  }
  .als-click-active i{
    color:#fff;
  }
  .als-click-active span{
    margin-left: 20px;
    color:#fff;
  }
</style>
