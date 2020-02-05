<template>
  <div>
    <div class="containerRef">
      <div class="navBox">
        <div class="navLogo">
          <a href="http://www.alsedu.cn/course.html" target="_blank">
            <img src="../../../static/images/base/newestIndex/logo.png" alt="">
          </a>
        </div>
        <div class="itemBox">
          <ul class="ulList">
            <li>
              <router-link to="/home" replace>首页</router-link>
            </li>
            <li>
              <router-link to="/discover" replace>作品中心</router-link>
            </li>
            <li>
              <router-link to="/login" replace>教师社区</router-link>
            </li>
            <li>
              <a href="http://www.alsedu.cn/support.html" target="_blank" style="display: block">合作支持</a>
            </li>
          </ul>
        </div>
        <div class="itemBoxRight">
          <div>
            <div v-if="loginStatus">
              <el-dropdown @command="handleCommand" class="logoout">
                <span class="el-dropdown-link">
                  <div style="width: 120px;height:100%;display: flex;align-items: center;">
                    <div style="width: 40px;">
                      <el-avatar style="width: 36px;height:36px;" :src="$store.state.userAvatar"></el-avatar>
                    </div>
                    <div style="width: 80px;margin-left: 10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;color:#1E1F1E;font-size:16px">{{$store.state.userName}}</div>
                  </div>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="persoinfo" style="padding:5px 10px 5px 10px;">个人中心</el-dropdown-item>
                  <el-dropdown-item command="community" style="padding:5px 10px 5px 10px;">学习系统</el-dropdown-item>
                  <el-dropdown-item command="logout" style="padding:5px 10px 5px 10px;">退出系统</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-link v-else :underline="false"><span class="index-login-btn" @click="onClickInter">登录</span></el-link>
          </div>
          <div class="create-btn" @click="onClickCreate">我要创作</div>
        </div>
      </div>
    </div>
    <als-login-dialog @userLoginStatus="changeLoginStatus($event)" ref="userLoginDialog"/>
  </div>
</template>

<script>
  import PubSub from "pubsub-js"
  import vuexUtil from '../../utils/vuexUtils'
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import loginDialog from './loginDialog'
  import '../../router/router'
  import '../../api/restfulapi'
  import {
    loginOut
  } from '../../api/api'
  export default {
    components:{'als-login-dialog':loginDialog},
    name: "alsHeader",
    data(){
      return{
        intervalId:null,
        loginStatus: false,// true登录 false未登录
      }
    },
    mounted(){
      this.listenLoginStatus()
      // 订阅弹出登录框的消息
      PubSub.subscribe("showUserLoginDialog", (msg, data) => {
        this.$refs.userLoginDialog.show()
      });
      // 订阅修改登录状态的消息
      PubSub.subscribe("changeUserLoginStatus", (msg, data) => {
        this.setUserBaseInfo()
      });
      if(storageUtil.getLoginStatus()==1){
        this.setUserBaseInfo()
      }
    },
    destroyed(){
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    methods:{
      setUserBaseInfo(){
        this.loginStatus = true
        vuexUtil.setUserNameWithState(this, storageUtil.readTeacherInfo().real_name)
        vuexUtil.setUserAvatarWithState(this, storageUtil.readTeacherInfo().avatar)
      },
      listenLoginStatus(){ // 监听是否为登录状态
        this.intervalId = setInterval(()=>{
          if(storageUtil.getLoginStatus()!=1){
            this.loginStatus = false
          }else{
            this.setUserBaseInfo()
          }
        },1000)
      },
      onClickInter(){
        this.$refs.userLoginDialog.show()
      },
      onClickCreate(){
        if(storageUtil.getLoginStatus()==1){ // 表示已经登录
          const {href} = this.$router.resolve({path: ROUTER_SCRATCH})
          window.open(href, '_blank')
        }else{
          this.$refs.userLoginDialog.show()
        }
      },
      changeLoginStatus(data){
        if(data==true){
          this.listenLoginStatus()
        }
        this.loginStatus = data
      },
      handleCommand(command){
        if (command === "logout") {
          this.logout()
        } else if (command === "persoinfo") {
          let {href} = this.$router.resolve({path: '/personCenter'})
          window.open(href, '_blank')
        } else if (command === 'community') {
          let {href} = this.$router.resolve({path: '/index'})
          window.open(href, '_blank')
        }
      },
      // 退出触发方法
      logout() {
        const loading = promptUtil.loading(this);
        loginOut().then(res => {
          if (res.code == SUCCESS_CODE) {
            loading.close();
            // 清除登录状态
            storageUtil.logout();
            this.loginStatus = false
            PubSub.publish("showUserLoginStatusMsg", false)
            if(this.$route.path.indexOf('personCenter')>=0){
              window.close()
            }else{
              promptUtil.success(this, res.msg);
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  ul li {
    list-style: none;
  }

  a {
    text-decoration: none;
    outline: none;
  }
  .containerRef {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }
  .navBox {
    width: 100%;
    height: 80px;
    margin: 0 auto;
  }

  .navLogo {
    float: left;
    cursor: pointer;
  }

  .navLogo {
    /*width: 100%;*/
    /*height: 100%;*/
    margin-top: 11px;
  }
  .itemBox {
    float: left;
  }
  .itemBoxRight {
    height:80px;
    justify-content:flex-end;
    display:flex;
    align-items:center;
  }
  .ulList {
    list-style: none;
    font-size: 16px;
  }
  .ulList li {
    float: left;
    line-height: 80px;
    margin-left: 80px;
    color: #333;
  }

  .ulList li a {
    text-decoration: none;
    color: #1E1F1E;
  }

  .ulList li a:hover {
    text-decoration: none;
    /*color: #31a4fa;*/
    color: #047FD8;
  }
  .create-btn{
    margin-left: 30px;
    background-color:#047FD8;
    line-height: 40px;
    border-radius:40px;
    font-size:16px;
    width: 120px;
    height: 40px;
    text-align: center;
    color: #fff;
  }
  .create-btn:hover{
    cursor: pointer;
    background-color: #00a2ff;
  }
  .index-login-btn{
    color:#1E1F1E;
    font-size:16px
  }
  .index-login-btn:hover{
    cursor: pointer;
    color: #047FD8;
  }
  .logoout {
    color: #fff;
  }

  /* 下拉菜单 */
  .el-dropdown-link {
    cursor: pointer;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
