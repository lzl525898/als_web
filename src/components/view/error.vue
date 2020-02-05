<template>
  <div class="home" :style="{height:hei+'px'}">
    <el-container>
      <!-- header部分 -->
      <el-header>
        <i class="myicon myicon-menu toggle-btn" @click="toggleCollapse"></i>
        <div class="system-title">奥松云课堂</div>
        <div>
          <!-- 下拉菜单 -->
          <el-dropdown @command="handleCommand" class="logoout">
            <span class="el-dropdown-link">
              <div style="width: 120px;height:100%;display: flex;align-items: center;">
                <div style="width: 40px;">
                  <img style="width: 36px;height: 36px;" :src="userBaseInfo.avatar">
                </div>
                <div
                  style="width: 80px;margin-left: 10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                >{{userBaseInfo.nick}}</div>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="persoinfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 个人信息弹出框 -->
      <el-dialog title="个人信息编辑" :visible.sync="dialogFormVisible" width="35%">
        <!-- table切换 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="个人资料" name="first">
            <!-- 个人资料表单 -->
            <el-form :model="gridData">
              <el-form-item label="账号:" :label-width="formLabelWidth">
                <el-input v-model="gridData.account" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="昵称:" :label-width="formLabelWidth">
                <el-input v-model="gridData.nick" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机:" :label-width="formLabelWidth">
                <el-input v-model="gridData.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="班级:" :label-width="formLabelWidth">
                <el-input v-model="gridData.classes.className" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="gridData.remark" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <!-- 修改密码页面 -->
            <el-row>
              <el-col :span="16" :offset="4">
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="当前手机号" prop="currentmp">
                    <el-input v-model="ruleForm.currentmp" placeholder="请输入当前手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="验证码" prop="yzm">
                    <el-input v-model="ruleForm.yzm" class="width" placeholder="请输入验证码"></el-input>
                    <el-button
                      type="primary"
                      :disabled="disabled"
                      v-show="show"
                      @click="getCode"
                    >获取验证码</el-button>
                    <el-button type="primary" v-show="!show" class="count">{{count}} s</el-button>
                  </el-form-item>
                  <el-form-item label="输入密码" prop="password">
                    <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="reptpassword">
                    <el-input v-model="ruleForm.reptpassword" placeholder="请确认密码" type="password"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- content部分 -->
      <div class="content">
        <div class="bgImg">
          <img src="../../../static/images/base/error/headset.png" alt class="headset">
          <img src="../../../static/images/base/error/compute.png" alt class="compute">
          <img src="../../../static/images/base/error/flower.png" alt class="flower">
          <img src="../../../static/images/base/error/light.png" alt class="light">
        </div>
        <div class="backButton">
          <p class="warning">
            <b>404</b> 警告
          </p>
          <p class="warningText">很不幸你探索了一个未知领域</p>
          <div class="btn">
            <div class="backIndex">
              <a :href="gotoUrl">返回首页</a>
            </div>
            <div class="clickBackIndex">
              <span>自动跳转{{count}}s</span>
            </div>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
  import promptUtil from "../../utils/promptUtil";
  import storageUtil from "../../utils/storageUtil";
  import verifyUtil from "../../utils/verifyUtil";
  import '../../api/restfulapi';
  import { qs, getTeacherInfoById } from "../../api/api";
  export default {
    data() {
      return {
        gotoUrl: "", //跳转路径
        count: "", //倒计时
        show: true,
        count: "",
        timer: null,
        disabled: true,
        // 弹出框 修改密码页面数据
        ruleForm: { currentmp: "", yzm: "", password: "", reptpassword: "" },
        // 弹出框 修改密码页面表单验证
        rules: {
          currentmp: [
            { required: true, message: "请输入当前手机号", trigger: "blur" }
          ],
          yzm: [{ required: true, message: "请输入验证码", trigger: "blur" }],
          password: [
            { required: true, message: "请输入新手机号", trigger: "blur" }
          ],
          reptpassword: [
            { required: true, message: "再次输入密码", trigger: "blur" }
          ]
        },
        userBaseInfo: {
          // 用户基本信息
          avatar: "",
          nick: ""
        },
        isCollapse: false,
        currentItemActive: "/",
        hei: "", //获取屏幕宽度
        activeName: "first", //table切换
        //个人信息弹出框
        dialogTableVisible: false,
        dialogFormVisible: false,
        // 弹出框中得数据
        gridData: {
          id: "",
          account: "",
          classes: { className: "", classOwn: [] },
          nick: "",
          phone: "",
          remark: ""
        },
        formLabelWidth: "120px"
      };
    },
    mounted() {
      this.initTopBaseInfo();
      if (storageUtil.getLoginStatus() == 1) {
        if (storageUtil.readUserRole() == 1 || storageUtil.readUserRole() == 3) {
          this.gotoUrl = "/user";
        } else if (storageUtil.readUserRole() == 2) {
          this.gotoUrl = "/student";
        }
      } else {
        gotoUrl = "/home";
      }
    },
    methods: {
      // 初始化基本信息
      initTopBaseInfo() {
        const baseInfo = storageUtil.readTeacherInfo();
        this.userBaseInfo.avatar = baseInfo.avatar;
        this.userBaseInfo.nick = baseInfo.real_name;
      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      // 退出触发方法
      logout() {
        const loading = promptUtil.loading(this);
        setTimeout(() => {
          loading.close();
          // 清除登录状态
          storageUtil.logout();
          // 跳转到登录页面
          this.$router.replace({ path: `/login` });
        }, 500);
      },
      // 下拉框处理
      handleCommand(command) {
        if (command === "logout") {
          this.logout();
        } else if (command === "persoinfo") {
          const loading = promptUtil.loading(this);
          //获取个人信息
          getTeacherInfoById(
            qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: storageUtil.readTeacherInfo().id
            })
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                if(res.data!='[]'){
                  this.gridData = res.data;
                  if (this.gridData.classes == "") {
                    this.gridData.classes = { className: "", classOwn: [] };
                  }
                }else{
                  promptUtil.wait(this);
                }
                this.dialogFormVisible = true;
              } else {
                promptUtil.wait(this);
              }
              loading.close();
            })
            .catch(err => {
              loading.close();
              promptUtil.timeout(this);
            });
        }
      },
      //table切换
      handleClick(tab, event) {
        if (tab.name == "second") {
          this.$refs.ruleForm.resetFields();
          this.ruleForm.currentmp = this.gridData.phone;
        }
      },
      getCode() {
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      },
      //3秒后进入跳转页面
      threeGo() {
        const TIME_COUNT = 5;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              //跳转的页面写在此处
              if (storageUtil.getLoginStatus() == 1) {
                if (
                  storageUtil.readUserRole() == 1 ||
                  storageUtil.readUserRole() == 3
                ) {
                  // 教师或管理员
                  this.$router.push({ path: "/user" });
                } else if (storageUtil.readUserRole() == 2) {
                  // 学生
                  this.$router.push({ path: "/student" });
                } else if (storageUtil.readUserRole() == 110) {
                  // 超级管理员
                  this.$router.push({ path: "/admin"});
                }
              } else {
                this.$router.push({ path: "/home" });
              }
            }
          }, 1000);
        }
      }
    },
    created() {
      this.hei =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      this.threeGo();
    },
    watch: {
      ruleForm: {
        handler(newVal, oldVal) {
          //当输入手机号时 验证码图标变换颜色
          if (verifyUtil.isPhone(newVal.currentmp)) {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        },
        deep: true
      }
    }
  };
</script>

<style scoped>
  .home {
    background-color: #303f4f;
  }
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-container {
    height: 100%;
  }

  .el-menu-item {
    font-size: 16px;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    text-align: center;
    line-height: 10px;
  }
  .tx {
    height: 50px;
    background-color: #595963;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .toggle-btn {
    font-size: 36px;
    color: #989898;
    cursor: pointer;
    line-height: 60px;
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
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
  .width {
    width: 50% !important;
  }
  .el-menu {
    border-right: none;
  }
  .content {
    overflow: hidden;
    width: 90%;
    height: 729px;
    /* background-color: red; */
    position: absolute;
    top: 20%;
    right: 0;
  }
  .erro {
    background: url("../../../static/images/base/error/404.png") no-repeat;
    width: 100%;
    height: 240px;
    margin-left: 200px;
    margin-top: 260px;
  }
  .back span {
    margin-left: 45px;
    color: #f08001;
  }
  .marl_210 {
    margin-left: 210px;
  }
  .marl_300 {
    margin-left: 240px;
    height: 40px;
    line-height: 40px;
  }
  .bgImg {
    overflow: hidden;
  }
  .headset {
    float: left;
    margin-top: 8%;
    margin-left: 7%;
    z-index: 1;
    height: 500px;
  }

  .light {
    position: absolute;
    left: 13%;
    top: 0;
    z-index: 33;
  }
  .flower {
    float: right;
    margin-top: 5%;
    z-index: 1;
  }
  .compute {
    float: left;
    margin-top: 4%;
    z-index: 1;
    margin-left: 20%;
  }
  .backButton {
    width: 714px;
    height: 340px;

    position: absolute;
    top: 36%;
    left: 31%;
    z-index: 444;
  }
  .warning {
    font-size: 70px;
    line-height: 8px;
    color: #000;
    text-align: center;
    padding-left: 25%;
  }
  .backButton b {
    color: #fff;
    font-size: 70px;
    line-height: 10px;
  }
  .warningText {
    font-size: 40px;
    line-height: 50px;
    color: #000;
    text-align: center;
  }
  .btn {
    width: 539px;
    height: 80px;
  }
  .backIndex,
  .clickBackIndex {
    width: 200px;
    height: 80px;
    background-color: #434343;
    border-radius: 10px;
    float: left;
  }
  .backIndex a {
    height: 80px;
    color: #fff;
    line-height: 80px;
    display: block;
    text-align: center;
    font-size: 26px;
    text-decoration: none;
  }
  .backIndex a:hover {
    height: 80px;
    color: #a99158;
    line-height: 80px;
    display: block;
    text-align: center;
    font-size: 26px;
    text-decoration: none;
  }
  .clickBackIndex {
    float: right;
  }
  .clickBackIndex span {
    height: 80px;
    color: #fff;
    line-height: 80px;
    display: block;
    text-align: center;
    font-size: 26px;
  }
</style>
