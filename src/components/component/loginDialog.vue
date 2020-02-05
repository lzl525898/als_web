<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      top="36vh"
      width="400px"
      :before-close="handleClose"
      center>
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false"
        width="800px" :visible.sync="innerVisible" append-to-body>
        <als-user-agreement-wrapper @changeDialogStatus="changeParentDialogStatus($event)"/>
      </el-dialog>
      <div slot="title">
        <div>
          <span class="login-header-title">奥松</span>
          <span class="login-header-hover">云课堂</span>
          <span class="login-header-title">(AEP)</span>
        </div>
        <div style="margin-bottom: -20px;margin-top:5px;font-size:14px;color:#777778;">账号登录</div>
      </div>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入手机号或发放的校园账号" @keydown.native.enter="submitForm('ruleForm')" clearable>
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" @keydown.native.enter="submitForm('ruleForm')" clearable>
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="verificationCode" v-show="showVerifyCode">
            <el-row>
              <el-col :span="14">
                <el-input v-model="ruleForm.verificationCode" placeholder="请输入验证码" type="text"
                  @keydown.native.enter="submitForm('ruleForm')"></el-input>
              </el-col>
              <el-col :span="8" :offset="2">
                <img @click="verificationCode" :src="verificationCodeUrl"
                     style="display: block;margin-top:7px;margin-left: 10px"
                     alt="">
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item style="margin-top:-13px;margin-bottom:6px">
            <el-checkbox v-model="ruleForm.agree">同意<el-link @click="onClickUserAgreement" style="margin-top:-1px"><span style="color:#409EFF">《奥松云课堂(AEP)用户服务协议》</span></el-link></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm')" :loading="isLoading" :disabled="!ruleForm.agree">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-tooltip class="item" effect="dark" content="如果忘记密码，可联系老师进行密码重置" placement="bottom">
          <div class="forget-password">忘记密码?</div>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PubSub from "pubsub-js"
  import vuexUtil from '../../utils/vuexUtils'
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import userAgreementWrapper from './userAgreementWrapper'
  import '../../api/restfulapi'
  import {
    qs,
    userLogin,
    checkAccountExist,//验证账号是否存在
  } from '../../api/api'
  export default {
    components:{'als-user-agreement-wrapper':userAgreementWrapper,},
    name: "loginDialog",
    data(){
      const validateUserName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入校园账号'));
        } else {
          if(value.length>=5){
            checkAccountExist(qs.stringify({
              username: value,
            })).then(res=>{
              if (res.code==SUCCESS_CODE){
              } else if(res.code==ERROR_CODE){
                callback(new Error('账号不存在'));
              }else if(res.code==3011){//3011弹出验证码
                this.showVerifyCode=true
              }
              callback();
            }).catch(err=>{
              callback();
              promptUtil.LOG('checkAccountExist-err',err)
            })
          }else{
            callback(new Error('请输入正确格式账号'));
          }
        }
      }
      const validatePassWord = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.password.trim().length<6) {
            callback(new Error('请输入正确格式密码'));
          }
          callback();
        }
      }
      return{
        showVerifyCode:false,
        verificationCodeUrl:'',
        innerVisible:false,
        loginStatus:false,
        isLoading:false,
        centerDialogVisible: false,
        ruleForm:{username:'',password:'',agree:true,verificationCode:''},
        rules: {
          username: [
            { validator: validateUserName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassWord, trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.loginStatus = false
      this.isLoading = false
      this.ruleForm ={username:'',password:'',agree:true,verificationCode:''}
      this.verificationCode()
    },
    methods:{
      verificationCode(){
        let url = baseURL + '/page/yzm'
        this.verificationCodeUrl = url + '?abc=' + Math.random()
      },
      changeParentDialogStatus(type){
        if(type==1){
          this.ruleForm.agree = true
        }else{
          this.ruleForm.agree = false
        }
        this.innerVisible = false
      },
      onClickUserAgreement(){
        this.innerVisible = true
      },
      toChangeLoginStatus(){
        this.$emit('userLoginStatus',this.loginStatus)
      },
      handleClose(done){
        this.resetForm('ruleForm')
        done();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoading = true
            userLogin(qs.stringify(this.ruleForm)).then(res=>{
              if (res.code == SUCCESS_CODE) {
                //跳转后台
                this.resetForm('ruleForm')
                storageUtil.saveToken(res.data.token)
                storageUtil.saveTeacherInfo(res.data);
                storageUtil.setLoginStatus(res.data.role_id);
                // this.$router.push({ path: "/index" });
                storageUtil.saveOverdue(0)
                storageUtil.saveTempLogin(this.ruleForm.username)
                this.centerDialogVisible = false
                this.loginStatus = true
                vuexUtil.setUserNameWithState(this, storageUtil.readTeacherInfo().real_name)
                vuexUtil.setUserAvatarWithState(this, storageUtil.readTeacherInfo().avatar)
                PubSub.publish("showUserLoginStatusMsg", true)
                PubSub.publish("updateScratchWorksList")
                PubSub.publish("fetchCommentList")
                PubSub.publish("updateScratchWorksDetail")
              } else if(res.code==3011){ // 需要显示验证码
                this.showVerifyCode = true
              }else {
                this.verificationCode()
                this.loginStatus = false
                promptUtil.error(this, res.msg);
              }
              this.isLoading = false
              this.toChangeLoginStatus()
            }).catch(err=>{
              this.toChangeLoginStatus()
              promptUtil.LOG('userLogin-err',err)
            })
          } else {
            return false;
          }
        });
      },
      show(){
        this.ruleForm.agree = true
        this.centerDialogVisible = true
      },
    }
  }
</script>

<style scoped>

  .login-header-title{
    color: #777778;
    font-size: 24px;
    font-weight: bold;
  }
  .login-header-hover{
    color: rgb(49, 164, 250);
    font-size: 24px;
    font-weight: bold;
  }
  .forget-password{
    float:right;
    margin-top:-30px;
    font-size:12px
  }
  .forget-password:hover{
    cursor:pointer;
  }
</style>
