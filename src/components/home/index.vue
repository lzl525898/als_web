<template>
  <div class="home" :style="{height:hei+'px'}" id="index_home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="auto">
        <div v-if="userRole==1 || userRole==2">
          <transition name="fade">
            <div class="logo" v-if="logo">
              <div class="loginBox">
                <div class="tx">
                  <!-- width: 50px; -->
                  <el-avatar style="width: 70px;height:70px;" :src="$store.state.userAvatar"></el-avatar>
                </div>
                <div style="display: flex;font-size:8px;color:#fff;margin-top: 10px;">
                  <div
                    style="width: 120px;text-align: right"
                  >{{$t(`message.index_user_nick`)}}&nbsp&nbsp:&nbsp
                  </div>
                  <el-tooltip :content="$store.state.userName" placement="bottom" effect="light">
                    <div
                      style="width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                    >&nbsp{{$store.state.userName}}
                    </div>
                  </el-tooltip>
                </div>
                <div style="display: flex;font-size:8px;color:#fff;margin-top: 5px;">
                  <div style="width: 120px;text-align: right">{{$t(`message.index_user_role`)}}&nbsp&nbsp:&nbsp</div>
                  <div style="width: 90px;">&nbsp{{topBaseInfo.role}}</div>
                </div>

              </div>

            </div>
          </transition>
        </div>
        <div v-if="userRole==3">
          <div class="logo" v-if="logo">
            <!--            <el-tooltip :content="$store.state.schoolName" placement="bottom" effect="light">-->
            <!--              <div class="institution">-->
            <!--                <p>{{$store.state.schoolName}}</p>-->
            <!--              </div>-->
            <!--            </el-tooltip>-->
            <div class="loginBox">
              <div class="tx">
                <el-avatar style="width: 70px;height:70px;" :src="$store.state.userAvatar"></el-avatar>
              </div>
              <div style="display: flex;font-size:8px;color:#fff;margin-top: 10px;">
                <div style="width: 120px;text-align: right">{{$t(`message.consult_conversion_student_name`)}}&nbsp&nbsp:&nbsp</div>
                <el-tooltip :content="$store.state.userName" placement="bottom" effect="light">
                  <div
                    style="width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                  >&nbsp{{$store.state.userName}}
                  </div>
                </el-tooltip>
              </div>
              <div style="display: flex;font-size:8px;color:#fff;margin-top: 5px;">
                <div style="width: 120px;text-align: right">{{$t(`message.student_management_studentEditDialogVisible_class`)}}&nbsp&nbsp:&nbsp</div>
                <el-tooltip :content="topBaseInfo.class" placement="bottom" effect="light">
                  <div
                    style="width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                  >&nbsp{{topBaseInfo.class}}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div v-if="userRole==4">
          <div class="logo" v-if="logo">
            <!--            <el-tooltip :content="$store.state.schoolName" placement="bottom" effect="light">-->
            <!--              <div class="institution">-->
            <!--                <p>{{$store.state.schoolName}}</p>-->
            <!--              </div>-->
            <!--            </el-tooltip>-->
            <div class="loginBox">
              <div class="tx">
                <img style="width: 70px;height:70px;" :src="$store.state.userAvatar">
              </div>
              <div style="display: flex;font-size:8px;color:#fff;margin-top: 10px;">
                <div style="width: 120px;text-align: right">{{$t(`message.teacher_dialog_nick`)}}&nbsp&nbsp:&nbsp</div>
                <el-tooltip :content="$store.state.userName" placement="bottom" effect="light">
                  <div
                    style="width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                  >&nbsp{{$store.state.userName}}
                  </div>
                </el-tooltip>
              </div>
              <div style="display: flex;font-size:8px;color:#fff;margin-top: 5px;">
                <div style="width: 120px;text-align: right">{{$t(`message.index_user_role`)}}&nbsp&nbsp:&nbsp</div>
                <el-tooltip :content="topBaseInfo.role" placement="bottom" effect="light">
                  <div
                    style="width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                  >&nbsp{{topBaseInfo.role}}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <el-menu
          :default-active="currentItemActive"
          :router="true"
          unique-opened
          class="el-menu-admin"
          background-color="#595963"
          text-color="#fff"
          active-text-color="#00a2ff"
          :collapse="isCollapse"
        >
          <div v-for="(item,index) in getMenuArray" :key="index">
            <el-submenu v-if="item.children && item.children.length && item.children.length>0" :index="'sub_'+index">
              <template slot="title">
                <i :class="'iconfont '+item.icon"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="'/'+childMenu.url" v-for="(childMenu,childIndex) in item.children" :key="childIndex">
<!--                <i :class="'iconfont '+childMenu.icon"></i>-->
                <span slot="title" style="margin-left:30px">{{childMenu.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="'/'+item.url" >
              <i :class="'iconfont '+item.icon"></i>
              <span slot="title" style="font-weight: 700;font-size:16px">{{item.name}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container class="el_container">
        <!-- header部分 -->
        <el-header>
          <login-header ref="loginHeader" @loginHeader="loginHeader"></login-header>
        </el-header>
        <!-- 中间内容部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!--      title="系统过期提示"-->
    <el-dialog
      custom-class="overdue-dialog"
      :visible.sync="$store.state.isOverdue"
      :show-close="false"
      @open="overdueBeforeOpen"
      :before-close="beforeCloseEvent"
      center>
        <div style="font-size: 1.5rem;color:#333;font-weight: bold;text-align: center;line-height: 1px">{{$t(`message.system_expired_reminder`)}}</div>
        <div style="font-size: 0.9rem;color:#333;font-weight: bold;margin-left: 40px;margin-top: 14px;width: 320px;padding-top: 13px;line-height: 20px">{{$t(`message.system_expired_title`)}}
         <br />{{$t(`message.index_call_phone`)}}<span style="color:#409EFF">{{overDlg.phone}}</span>{{$t(`message.index_call_user_click`)}}
          <el-link :underline="false" type="primary" style="font-size: 1.1rem;font-weight: bold;margin-top: -3px;" :href="overDlg.link">{{$t(`message.string_label_refresh_button`)}}</el-link>
        </div>
        <div style="float:right;margin-top: -107px;margin-right:40px">
          <el-image style="width: 110px; height: 110px;" fit="fill" :src="overDlg.qrcode"></el-image>
<!--          <el-tooltip class="item" effect="dark" :content="overDlg.phone" placement="bottom">-->
<!--            <div style="clear: both;width:110px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin-top:5px;">-->
<!--                <i class="el-icon-phone"></i>{{overDlg.phone}}-->
<!--            </div>-->
<!--          </el-tooltip>-->
        </div>
    </el-dialog>
 </div>

</template>
<script>
  import PubSub from "pubsub-js";
  import $ from "jquery";
  import storageUtil from "../../utils/storageUtil";
  import promptUtil from "../../utils/promptUtil";
  import vuexUtil from "../../utils/vuexUtils";
  import loginHeader from "./loginHeader.vue";
  import '../../api/restfulapi';
  import {
    qs,
    getTeacherInfoById,
    getStudentInfoById,
    getmenu,
    getSchoolDueInfo
  } from "../../api/api";

  export default {
    name: "loginIndex",
    components: {
      loginHeader
    },
    data() {
      return {
        overDlg: {qrcode: '', phone:'', link: 'https://www.alsrobot.vip'},
        userRole: 0, // 0 未登录  1 管理员  2 教师  3 学生
        isCollapse: false,
        getMenuArray: [],
        logo: true,
        topBaseInfo: {
          institution: "",
          nick: "",
          role: "",
          class: "",
        }
        , // 左上角基本信息
        currentItemActive: "/", // index
        hei:
          "", //获取屏幕宽度
        activeName:
          "first", //table切换
        dialogFormVisible:
          false, // 隐藏下拉弹出对话框
        // 弹出框中得数据
        // 弹出框中得数据
        gridData:
          {
            id: "",
            account:
              "",
            classes:
              {
                className: "", classOwn:
                  []
              }
            ,
            nick: "",
            phone:
              "",
            remark:
              ""
          },
        baseInfo: {}
      };
    },
    mounted() {
      window.onresize = () => {
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        $('#index_home').height(height)
      }
      $(".overdue-dialog").css("background","url(https://www.alsrobot.vip/als_classroom/public/zh/images/waring.png) no-repeat").css("width","580px").css("background-size","100%").css("box-shadow","none")
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      this.baseInfo = storageUtil.readTeacherInfo();
      this.userRole = storageUtil.readUserRole();
      if (this.userRole == 0) {
        // 未登录
        this.$router.replace({path: `/login`});
        return;
      }
      // 订阅选中当前菜单项的消息
      PubSub.subscribe("currentMenuIndex", (msg, data) => {
        this.currentItemActive = data;
      });
      const loading = promptUtil.loading(this)
      //获取menu菜单
      this.initTopBaseInfo(this.userRole)
      getmenu(qs.stringify({
        user_id: storageUtil.readTeacherInfo().id
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.getMenuArray = res.data
            storageUtil.saveMenu(res.data)
            vuexUtil.setSystemMenuState(this, res.data)
            // 显示今日课程
            this.$store.dispatch("setTodayScheduleStatus", vuexUtil.checkMenuExist(this, 'calendar').exist)
          }
        } else if (res.code == ERROR_CODE_) {
          promptUtil.error(this, res.msg)
        } else {
          promptUtil.wait(this, res.msg)
        }
        loading.close()
      }).catch(err => {
        loading.close()
        promptUtil.LOG("getmenu-err",err)
      })
    },
    methods: {
      setMenuStyle(){
        setTimeout(()=>{
          $(".el-submenu").css("fontSize","16px")
          $(".el-icon-location").css("fontSize","26px")
          $(".el-submenu__title").css("fontSize","16px")
          $(".el-submenu__title span").css("marginLeft","5px")
        },200)
      },
      overdueBeforeOpen(){
        getSchoolDueInfo(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id:storageUtil.readTeacherInfo().id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            const {qrcode, tel} = res.data
            this.overDlg = {qrcode: qrcode, phone:tel, link: 'https://www.alsrobot.vip'}
          }
        }).catch(err=> promptUtil.LOG("getSchoolDueInfo-err",err))
      },
      beforeCloseEvent(done){
        promptUtil.LOG("beforeCloseEvent",done)
      },
      // 初始化基本信息
      initTopBaseInfo(role) {
        const baseInfo = storageUtil.readTeacherInfo();
        vuexUtil.setUserNameWithState(this, baseInfo.real_name);
        vuexUtil.setSchoolNameWithState(this, baseInfo.school_name);
        if (role == 3) {
          this.topBaseInfo.class = baseInfo.className;
        } else if (role == 4) {
          this.topBaseInfo.role = this.$t(`message.string_label_live_teacher`);
        } else {
          this.topBaseInfo.role = baseInfo.school_admin == 1 ? this.$t(`message.string_label_principal`) : this.$t(`message.string_label_teacher`);
        }
      },
      //初始化列表数据
      //下拉菜单  退出
      // handleCommand(command) {
      //   if (command === "logout") {
      //     this.logout();
      //   } else if (command === "persoinfo") {
      //     const loading = promptUtil.loading(this);
      //     //获取个人信息
      //     if (storageUtil.readTeacherInfo().role_id == 2) {
      //       // 学生
      //       getStudentInfoById(
      //         qs.stringify({
      //           school_id: storageUtil.readTeacherInfo().school_id,
      //           student_id: storageUtil.readTeacherInfo().id
      //         })
      //       )
      //         .then(res => {
      //           if (res.code == SUCCESS_CODE) {
      //             this.gridData = res.data;
      //             if (this.gridData.classes == "") {
      //               this.gridData.classes = {className: "", classOwn: []};
      //             }
      //             this.dialogFormVisible = true;
      //           } else {
      //             promptUtil.error(this, this.$t(`message.system_error_network`));
      //           }
      //           loading.close();
      //         })
      //         .catch(err => {
      //           loading.close();
      //           promptUtil.timeout(this, err);
      //         });
      //     } else {
      //       // 教师
      //       getTeacherInfoById(
      //         qs.stringify({
      //           school_id: storageUtil.readTeacherInfo().school_id,
      //           teacher_id: storageUtil.readTeacherInfo().id
      //         })
      //       )
      //         .then(res => {
      //           if (res.code == SUCCESS_CODE) {
      //             if (res.data && res.data != '[]') {
      //               this.gridData = res.data;
      //               if (this.gridData.classes == "") {
      //                 this.gridData.classes = {className: "", classOwn: []};
      //               }
      //             } else {
      //               promptUtil.wait(this);
      //             }
      //             this.dialogFormVisible = true;
      //           } else {
      //             promptUtil.wait(this);
      //           }
      //           loading.close();
      //         })
      //         .catch(err => {
      //           loading.close();
      //           promptUtil.timeout(this, err);
      //         });
      //     }
      //   } else {
      //     // 教师
      //     getTeacherInfoById(
      //       qs.stringify({
      //         school_id: storageUtil.readTeacherInfo().school_id,
      //         teacher_id: storageUtil.readTeacherInfo().id
      //       })
      //     )
      //       .then(res => {
      //         if (res.code == SUCCESS_CODE) {
      //           if (res.data && res.data != '[]') {
      //             this.gridData = res.data;
      //             if (this.gridData.classes == "") {
      //               this.gridData.classes = {className: "", classOwn: []};
      //             }
      //           } else {
      //             promptUtil.wait(this);
      //           }
      //           this.dialogFormVisible = true;
      //         } else {
      //           promptUtil.wait(this);
      //         }
      //         loading.close();
      //       })
      //       .catch(err => {
      //         loading.close();
      //         promptUtil.timeout(this, err);
      //       });
      //   }
      // },
      // //table切换
      // handleClick(tab, event) {
      //   if (tab.name == "second") {
      //     this.currentSelectTabName = tab.name;
      //     this.$refs.ruleForm.resetFields();
      //     // this.ruleForm.currentmp=this.gridData.phone
      //   }
      // },
      loginHeader() {
        this.isCollapse = !this.isCollapse
        if (this.isCollapse) {
          this.logo = false
        } else {
          this.logo = true
        }
        // console.log( '99',$(".logo"))
      }
    },
    created() {
      this.hei =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    }
  }
</script>
<style scoped>
  .home {
    height: 100%;
  }

  .el-menu-admin:not(.el-menu--collapse) {
    width: 220px;
  }

  .el-container {
    height: 100%;
  }

  .el-aside {
    /* background-color: #abc4dc; */
    background-color: #595963;
    height: 100%;
  }
  .el-menu {
    font-size: 16px;
    border-right: none !important;;
    background-color: #abc4dc;
  }
  .el-submenu__title{
    /*font-size: 16px !important;*/
  }
  .el-menu-item {
    /*font-size: 16px !important;*/
  }
  .el-submenu__title span {
    margin-left: 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .el-menu-item span {
    margin-left: 15px;
  }
  .el-header {
    /* display: flex;
      justify-content: space-between;
      align-items: center; */
    background-color: #00a2ff;
  }

  .logo {
    height: 150px;
    background-color: #595963;
    overflow: hidden;
    border-bottom: 0.5px solid #fff;
  }

  .institution {
    margin: auto;
    width: 150px;
    display: flex;
    justify-content: start;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    text-align: center;
    line-height: 10px;
  }

  .tx {
    height: 70px;
    background-color: #595963;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loginBox {
    margin-top: 15px;

  }

  .elTooltipTop {
    margin: 0 auto;
    text-align: center;
  }

  .elTooltipTop p {

    text-align: center;
  }

  .el-icon-date {
    font-size: 23px;
    font-weight: bold;
  }

  .icon-renwuguanli {
    font-size: 26px !important;
  }

  .route-link-active {
    background-color: red;
  }

</style>
