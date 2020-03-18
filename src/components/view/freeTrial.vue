<template>
  <div>
    <div class="container">
      <div class="nav">
        <div class="containerRef">
          <div class="left">
            <div @click="handleClickHome" style="cursor:pointer">
              <img src="../../../static/images/base/newIndex/smallLogo.png" alt class="loginWidth">
              <p style="float: left;padding-left: 8px;line-height: 30px"><span
                style="font-size: 25px;color: #fff">{{$t(`message.index_base_title`)}}</span><b
                style="font-size: 20px;color: #fff;font-weight: normal">（AEP）</b></p>
            </div>
          </div>
        </div>
      </div>
      <div class="banner" :style="{height:hei+'px',width:wid+'px'}">
        <div class="containerRef">
          <div class="contentBox">
            <div class="contentBoxLeft">
              <el-carousel height="450px">
                <el-carousel-item v-for="item in loginIndexImgL" :key="item.id">
                  <img :src=item.url alt="" style="border-bottom-left-radius: 12px;border-top-left-radius: 12px;">
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="contentBoxRight">
              <div class="contentBoxRightBox">
                <h3>免费注册</h3>
                <div class="boxTotal">
                  <div class="loginBox ">
                      <el-form :model="registerForm" :rules="registerFormRules" ref="registerForm" class="demo-ruleForm formItemStyle">
                           <el-form-item prop="schoolName" >
                            <div class="schoolNameBorder">
                            <el-input v-model="registerForm.schoolName" size="mini" class="borderBottomStyle" placeholder="请输入机构名称"></el-input>
                            </div>
                          </el-form-item>
                          <el-form-item prop="teacherName">
                            <div class="schoolNameBorder">
                            <el-input v-model="registerForm.teacherName" size="mini" class="borderBottomStyle"  placeholder="请输入教师名称"></el-input>
                            </div>
                          </el-form-item>
                          <el-form-item prop="phone">
                              <div  class="schoolNameBorder">
                                    <el-input v-model="registerForm.phone"  placeholder="请输入手机号"
                                           class="borderBottomStyle"  size="mini">
                                            </el-input>
                               </div>
                          </el-form-item>
                          <el-form-item prop="code">
                                <el-input v-model="registerForm.code" size="small" placeholder="请输入验证码" style="width: 173px"></el-input>
                                <el-button type="primary" @click="getCode" size="small"
                                        style="width: 90px;padding:0;margin:0;height:30px"
                                        :disabled="isVerifyBtnAble">{{verifyBtnContentFree}}
                                </el-button>
                          </el-form-item>
                          <el-form-item prop="password">
                            <el-input v-model="registerForm.password" size="small" show-password placeholder="请输入密码"></el-input>
                          </el-form-item>
                         <el-form-item>
                             <div style="margin-top:-7px">
                                   <el-checkbox v-model="registerForm.agree">{{$t(`message.index_base_login_agree`)}}
                            <el-link @click="onClickUserAgreement" style="margin-top:-1px"><span style="color:#409EFF">{{$t(`message.index_base_aep_protocol`)}}</span>
                            </el-link>
                          </el-checkbox>
                             </div>
                        </el-form-item>
                          <el-form-item >
                                <el-button type="primary" round
                                     style="text-align: center;display: inline-block;position: absolute;bottom: -36px;"
                                     class="login-btn" @click="loginFreeSubmit('registerForm')"
                                     :disabled="!registerForm.agree">注册
                                </el-button>
                            </el-form-item>
                       </el-form>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <div style="margin-bottom:3px">{{$t(`message.index_base_login_explore`)}}</div>
            <div>
            {{$t(`message.index_base_company_name`)}} ｜<el-link :underline="false" href="http://www.beian.miit.gov.cn" target="_blank" style="color:#666;font-size: 12px;margin-top: -4px">
              粤ICP备19107383号-1
            </el-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false"
      width="800px" :visible.sync="innerVisible" append-to-body>
      <als-user-agreement-wrapper @changeDialogStatus="changeParentDialogStatus($event)"/>
    </el-dialog>
    <el-dialog
     :close-on-click-modal="false"
     width="400px" :visible.sync="successShow"
     :before-close="closeSuccessShow" >
    <div style="display:flex;justify-content:center">
      <span style="color:green;font-size:38px;"><i class="el-icon-success" ></i></span>
      <span style="font-size:24px;display:inline-block;line-height:35px;">注册成功</span>
    </div>
     <p style="text-align:center"> <span style="color:#409EFF">({{threeMiniCount}}s)</span>跳转至登录页,请使用手机号进行登录</p>
    </el-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import {
  qs,
  freeTrialLogin,
  smsVerify, // 验证验证码
  smsFreeCode, // 获取验证码
  getBannerImage //获取轮播图
} from "../../api/api";
import storageUtil from "../../utils/storageUtil";
import promptUtil from "../../utils/promptUtil";
import verifyUtil from "../../utils/verifyUtil";
import "../../api/restfulapi";
import userAgreementWrapper from "../component/userAgreementWrapper";

export default {
  components: { "als-user-agreement-wrapper": userAgreementWrapper },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error(this.$t(`message.index_base_login_form_input_phone`))
        );
      } else if (!verifyUtil.isPhone(value)) {
        callback(
          new Error(this.$t(`message.index_base_login_form_input_phone_error`))
        );
      } else {
        if (this.registerForm.phone !== "") {
          this.$refs.registerForm.validateField("registerForm");
        }
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error(this.$t(`message.index_base_login_form_input_code`))
        );
      } else if (value != "" && value.length != 6) {
        callback(
          new Error(this.$t(`message.index_base_login_form_input_code_error`))
        );
      } else {
        if (this.registerForm.code !== "") {
          this.$refs.registerForm.validateField("registerForm");
        }
        callback();
      }
    };
    return {
      currentSystemLang: "",
      token: "",
      hei: "",
      wid: "",
      verifyBtnContentFree: "",
      timeWithVerifyFree: 0, // 默认验证码时间
      isVerifyBtnAble: false, // 是否可用
      isSMSLoading: false, // 验证code 是否可用
      // verificationCodeUrl: "",
      innerVisible: false,
      showVerifyCode: false,
      freeShow: true,
      freeCount: "",
      freeTimer: null,
      loginIndexImgL: [],
      // contentBoxHeight: '',
      registerForm: {
        schoolName: "",
        teacherName: "",
        phone: "",
        code: "",
        password: "",
        agree: true
      },
      registerFormRules: {
        schoolName: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ],
        teacherName: [
          { required: true, message: "请输入教师名称", trigger: "blur" }
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      successShow: false,
      threeMiniCount: "",
      threeTimer: null
    };
  },
  mounted() {
    let lang = storageUtil.getLang();
    this.currentSystemLang = lang;
    this.$i18n.locale = lang;
    this.getBannerImg();
    window.onresize = () => {
      this.setWindowStyle();
    };
    this.verifyBtnContentFree = "获取验证码";
    if (storageUtil.readOverdue() == 1) {
      // 证明已经过期，需要重新登录提示
      this.$notify({
        duration: 4000,
        title: this.$t(`message.index_base_login_account_warning`),
        dangerouslyUseHTMLString: true,
        message:
          '<div style="color:#F56C6C">' +
          this.$t(`message.index_base_login_warning_account`) +
          "</div>"
      });
    }
    if (localStorage.getItem("freeTimeDown")) {
      this.timeWithVerifyFree = localStorage.getItem("freeTimeDown");
      this.verifyBtnContentFree =
        this.timeWithVerifyFree + this.$t(`message.index_base_login_second`);
      this.freeTimeDown();
    }
    setTimeout(() => {
      storageUtil.saveOverdue(0);
    }, 1000); // 重置 登录过期提示
 },
  methods: {
    handleClickHome(){
        this.$router.push({path:'/index'})
    },
    //3秒后进入跳转页面
    threeGo() {
      const TIME_COUNT = 3;
      if (!this.threeTimer) {
        this.threeMiniCount = TIME_COUNT;
        this.threeTimer = setInterval(() => {
          if (this.threeMiniCount > 0 && this.threeMiniCount <= TIME_COUNT) {
            this.threeMiniCount--;
          } else {
            clearInterval(this.threeTimer);
            this.threeTimer = null;
            this.successShow = false;
            //跳转的页面写在此处
            // window.close()
            this.$router.replace({ path: "/login" });
          }
        }, 1000);
      }
    },
    //关闭dialoge清除定时器
    closeSuccessShow(done) {
      clearInterval(this.threeTimer);
      this.threeTimer = null;
      done();
    },
    handleChangeLang(val) {
      this.currentSystemLang = val;
      this.$i18n.locale = val;
      storageUtil.setLang(val);
    },
    onClickUserAgreement() {
      this.innerVisible = true;
    },
    getBannerImg() {
      getBannerImage(
        qs.stringify({
          settingType: "register_banner"
        })
      )
        .then(res => {
          this.loginIndexImgL = [];
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              res.data.forEach(item => {
                const obj = {
                  id: item.id,
                  url: item.pic
                };
                this.loginIndexImgL.push(obj);
              });
            }
          } else {
          }
        })
        .catch(err => {
          promptUtil.LOG("getBannerImage-err", err);
        });
    },
    changeParentDialogStatus(type) {
      if (type == 1) {
        this.registerForm.agree = true;
      } else {
        this.registerForm.agree = false;
      }
      this.innerVisible = false;
    },
    setWindowStyle() {
      let documentHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      this.hei = documentHeight - 63;
      this.wid =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    },
    // 获取验证码
    getCode() {
      if (
        this.registerForm.phone &&
        verifyUtil.isPhone(this.registerForm.phone)
      ) {
        smsFreeCode(
          qs.stringify({
            mobile: this.registerForm.phone
          })
        )
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(
                this,
                this.$t(`message.index_base_login_send_code`) //验证码已发送
              );
              this.freeTimeDown();
              // this.timeDownGetCode()
            } else if (res.code == USER_NOT_EXIST) {
              promptUtil.error(this, res.msg);
            } else {
              promptUtil.error(this, res.msg);
            }
          })
          .catch(err => promptUtil.LOG("smsFreeCode-err", err));
      } else {
        promptUtil.warning(
          this,
          this.$t(`message.index_base_login_rules_phone`)
        );
      }
    },
    // 倒计时
    freeTimeDown() {
      if (localStorage.getItem("freeTimeDown")) {
        this.timeWithVerifyFree = localStorage.getItem("freeTimeDown") * 1;
      } else {
        this.timeWithVerifyFree = 60;
      }
      this.isVerifyBtnAble = true;
      let result = setInterval(() => {
        this.verifyBtnContentFree = this.timeWithVerifyFree + "秒";
        --this.timeWithVerifyFree;
        localStorage.setItem("freeTimeDown", this.timeWithVerifyFree);
        if (this.timeWithVerifyFree < 0) {
          this.timeWithVerifyFree = 10;
          this.verifyBtnContentFree = this.$t(`message.index_base_login_code`);
          localStorage.removeItem("freeTimeDown");
          clearInterval(result);
          this.isVerifyBtnAble = false;
        }
      }, 1000);
    },
    loginFreeSubmit(formName) {
      const loading = promptUtil.loading(this);
      this.$refs[formName].validate(valid => {
        if (valid) {
          smsVerify(
              qs.stringify({
                  mobile: this.registerForm.phone,
                  code: this.registerForm.code
              })
          ).then(res => {
              if (res.code == SUCCESS_CODE) {
                  freeTrialLogin(
                      qs.stringify({
                          school_name: this.registerForm.schoolName,
                          teacher_name: this.registerForm.teacherName,
                          phone: this.registerForm.phone,
                          code: this.registerForm.code,
                          password: this.registerForm.password
                      })
                  ).then(res => {
                      loading.close();
                      if (res.code == SUCCESS_CODE) {
                          this.successShow = true;
                          localStorage.removeItem("freeTimeDown");
                          this.threeGo();
                      } else {
                          promptUtil.error(this, res.msg);
                      }
                  })
                  .catch(err => {
                      loading.close();
                      promptUtil.LOG("freeTrialLogin-err", err);
                  });
              } else {
                  loading.close();
                  promptUtil.error(this, res.msg);
              }
          })
          .catch(err => {
              loading.close();
              promptUtil.LOG("smsVerify-err", err);
          });
        } else {
          loading.close();
          return false;
        }
      });
    }
  },
  created() {
    this.setWindowStyle();
  }
};
</script>

<style>
.schoolNameBorder .el-input__inner {
  border: none !important;
  font-size: 12px !important;
}
.formItemStyle .el-form-item {
  margin-bottom: 13px;
  /* line-height: 30px; */
}
</style>

<style scoped>
.borderBottomStyle {
  border: none;
  border-bottom: 1px #dcdfe6 solid;
  border-radius: 0px !important;
  padding-bottom: -5px;
}
ul li {
  list-style: none;
}

.boxTotal {
  position: relative;
}

.container {
  width: 100%;
  height: 100%;
}

.containerRef {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.banner {
  background: url("../../../static/images/base/index/newLoginBg.png") no-repeat;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  /* margin-top: 0px; */
  background-size: 100% 100%;
  /* position: relative;
      overflow: hidden; */
  /* background-size:cover;
      background-size:100%; */
  /* background-attachment:fixed;
      min-height: 100vh; */
  position: relative;
}

.nav {
  height: 60px;
  /* border-bottom: 2px #008ccf solid; */
  /*border-bottom: 2px #fff solid;*/
  overflow: hidden;
  background-color: #047fd8;
}

.loginWidth {
  width: 52px;
  height: 100%;
  margin-top: 3px;
}

.left {
  float: left;
  font-family: "syRegular";
  /*padding-top: 5px;*/
}

.left img {
  float: left;
  /*display: block;*/
}

.lastleft {
  float: left;
  margin-top: 10px;
}

.lastleft img {
  float: left;
  /*margin-top: 10px;*/
  display: block;
}

.right {
  float: right;
}

.f-l {
  float: left;
  line-height: 80px;
  font-size: 30px;
  display: block;
  color: #008ccf;
  padding-left: 8px;
  overflow: hidden;
}

.ulList {
  list-style: none;
  font-size: 20px;
  height: 60px;
  margin: 0;
  overflow: hidden;
}

.ulList li {
  float: left;
  line-height: 58px;
  margin-left: 40px;
  font-family: SimHei;
  /* color: #008ccf; */
  color: #fff;
}

.ulList a,
.contentLeft a {
  text-decoration: none;
  /* color: #008ccf; */
  color: #fff;
}

.ulList li:hover {
  border-bottom: 30px;
  border-bottom: 2px #fff solid;
}

.ulList a:hover {
  /*color: #008ccf;*/
  color: #00cfff;
  /*color: #fff;*/
}

.contentBox {
  width: 720px;
  height: 450px;
  border: 1px #eee solid;
  border-radius: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
  margin-top: -225px;
  box-shadow: 0 0 1rem rgb(0, 0, 0, 0.1);
}

.contentBoxLeft {
  width: 360px;
  /*height: 360px;*/
  float: left;
  background-color: #fff;
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
}

.contentBoxLeft img {
  width: 100%;
  height: 100%;
}

/*.el-carousel__container{*/
/*  height: 360px !important;*/
/*}*/
.contentBoxRight {
  width: 360px;
  height: 100%;
  float: left;
  background-color: #fff;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
}

.contentBoxRightBox {
  width: 270px;
  /*background-color: blue;*/
  margin: 0 auto;
  margin-top: 35px;
}

.contentBoxRightBox > h3 {
  color: #707070;
  text-align: center;
  font-weight: bold;
}

.footer {
  font-size: 12px;
  color: #666;
  text-align: center;
  /*font-family: SimHei;*/
  font-family: "syRegular";
  position: absolute;
  left: 50%;
  bottom: 5px;
  transform: translate(-50%);
}

.loginBox p {
  font-family: SimHei;
  font-size: 20px;
  color: #666;
  padding-top: 20px;
  /*line-height: 30px;*/
  /*padding-left: 20px;*/
  /*border-bottom: 1px #eee solid;*/
}

/*.el-input {*/
/*  padding-top: 25px;*/
/*}*/

.login-btn {
  width: 100%;
  /*margin-top: 25px;*/
  text-align: center;
  font-family: SimHei;
}

/*.el-form-item {*/
/*  margin-bottom: 0px !important;*/
/*}*/

/*.box {*/
/*  width: 1052px;*/
/*  height: 495px;*/
/*  position: absolute;*/
/*  top: 50%;*/
/*  left: 50%;*/
/*  margin-top: -214px;*/
/*  margin-left: -526px;*/
/*}*/

.el-input__inner {
  border: none !important;
}
</style>


