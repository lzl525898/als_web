<template>
  <div>
    <div class="container">
      <div class="nav">
        <div class="containerRef">
          <div class="left">
            <img src="../../../static/images/base/newIndex/smallLogo.png" alt class="loginWidth">
            <p style="float: left;padding-left: 8px;line-height: 30px"><span
              style="font-size: 25px;color: #fff">{{$t(`message.index_base_title`)}}</span><b
              style="font-size: 20px;color: #fff;font-weight: normal">（AEP）</b></p>
            <div style="height:60px;display:flex;align-items:center;margin-left:5px">
              <img src="../../../static/images/base/newestIndex/international.png" alt="">
              <el-select v-model="currentSystemLang" size="mini" style="width:100px;margin-left:5px" @change="handleChangeLang">
                <el-option label="简体中文" value="zh"></el-option>
                <el-option label="English" value="en"></el-option>
              </el-select>
            </div>
          </div>
          <div class="right">
            <ul class="ulList">
              <li>
                <router-link to="/home" replace>{{$t(`message.index_base_banner_home`)}}</router-link>
              </li>
              <li>
                <router-link to="/discover" replace>{{$t(`message.index_base_banner_works`)}}</router-link>
              </li>
              <li>
                <router-link to="/login" replace>{{$t(`message.index_base_banner_teaching`)}}</router-link>
              </li>
              <li>
                <a href="http://www.alsedu.cn/support.html" target="_blank" style="display: block">{{$t(`message.index_base_banner_support`)}}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="banner" :style="{height:hei+'px',width:wid+'px'}">
        <div class="containerRef">
          <div class="contentBox">
            <div class="contentBoxLeft">
              <el-carousel :height="contentBoxHeight+'px'">
                <el-carousel-item v-for="item in loginIndexImgL" :key="item.id">
                  <img :src=item.url alt="" style="border-bottom-left-radius: 12px;border-top-left-radius: 12px;">
                </el-carousel-item>
              </el-carousel>
            </div>
            <div id="contentBoxRight">
              <div class="contentBoxRightBox">
                <h3>{{$t(`message.index_base_login_header_title`)}}</h3>
                <div class="boxTotal">
                  <div class="loginBox ">
                    <div v-show="loginDivStatus==3">
                      <p>{{$t(`message.index_base_login_update_password`)}}</p>
                      <el-form :model="pwdRuleForm" :rules="pwdRules" ref="pwdRuleForm" class="demo-ruleForm">
                        <el-form-item prop="password">
                          <el-input v-model="pwdRuleForm.password" :placeholder="$t(`message.index_base_login_form_input_password`)"
                                    @keydown.native.enter="updatePassword"
                                    type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="confirm">
                          <el-input v-model="pwdRuleForm.confirm" :placeholder="$t(`message.index_base_login_form_confirm_password`)"
                                    @keydown.native.enter="updatePassword"
                                    type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary" round class="login-btn" @click="updatePassword"
                                     :loading="isUpdateLoading">{{$t(`message.index_base_login_confirm`)}}
                          </el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div v-show="loginDivStatus==2">
                      <div style="margin-top: -22px">
                        <p style="text-align: center;font-size: 16px">{{$t(`message.index_base_login_forget_password`)}}</p>
                        <el-form :model="phoneRuleForm" :rules="phoneRules" ref="phoneRuleForm" class="demo-ruleForm">
                          <el-form-item prop="phone">
                            <el-input v-model="phoneRuleForm.phone" :placeholder="$t(`message.index_base_login_form_input_phone`)"
                                      suffix-icon="el-icon-mobile-phone"
                                      @keydown.native.enter="verifyCodeEnter"></el-input>
                          </el-form-item>
                          <el-form-item prop="code">
                            <el-input v-model="phoneRuleForm.code" :placeholder="$t(`message.index_base_login_form_input_code`)" style="width: 173px"
                                      @keydown.native.enter="verifyCodeEnter"></el-input>
                            <el-button type="primary" @click="getCode"
                                       style="width: 90px;padding:0;margin:0;height: 40px;"
                                       :disabled="isVerifyBtnAble">{{verifyBtnContent}}
                            </el-button>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="danger" round class="login-btn" @click="verifyCodeEnter"
                                       :loading="isSMSLoading">{{$t(`message.index_base_login_confirm`)}}
                            </el-button>
                          </el-form-item>
                        </el-form>
                        <el-link :underline="false" style="font-size: 12px;margin-top: 10px"
                                 @click="goBackLogin">{{$t(`message.index_base_login_from_return_login`)}}
                        </el-link>
                      </div>

                    </div>
                    <div v-show="loginDivStatus==1">
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                        <el-form-item prop="username">
                          <el-input
                            suffix-icon="el-icon-user"
                            v-model="ruleForm.username" :placeholder="$t(`message.index_base_login_input_account`)"
                            @keydown.native.enter="loginSubmit"
                          ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                          <el-input
                            suffix-icon="el-icon-lock"
                            v-model="ruleForm.password"
                            :placeholder="$t(`message.index_base_login_form_old_password`)"
                            type="password"
                            @keydown.native.enter="loginSubmit"
                          ></el-input>
                        </el-form-item>
                        <el-form-item prop="verificationCode" v-show="showVerifyCode">
                          <el-row>
                            <el-col :span="14">
                              <el-input
                                v-model="ruleForm.verificationCode"
                                :placeholder="$t(`message.index_base_login_form_input_code`)"
                                type="text"
                                @keydown.native.enter="loginSubmit"
                              ></el-input>
                            </el-col>
                            <el-col :span="8" :offset="2">
                              <img @click="changeVerificationCodeUrl" :src="verificationCodeUrl"
                                   style="display: block;margin-left: 10px"
                                   alt="">
                            </el-col>
                          </el-row>
                        </el-form-item>
                        <el-form-item style="margin-top:28px;">
                          <el-checkbox v-model="ruleForm.agree">{{$t(`message.index_base_login_agree`)}}
                            <el-link @click="onClickUserAgreement" style="margin-top:-1px"><span style="color:#409EFF">{{$t(`message.index_base_aep_protocol`)}}</span>
                            </el-link>
                          </el-checkbox>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary" round
                                     style="margin-top: 6px;text-align: center;display: inline-block;position: absolute;bottom: -30px;"
                                     class="login-btn" @click="loginSubmit"
                                     :disabled="!ruleForm.agree">{{$t(`message.index_base_login_btn`)}}
                          </el-button>
                        </el-form-item>
                        <div style="height: 40px"></div>
                      </el-form>
                      <el-link :underline="false" style="position: absolute;bottom: 122px;right: 0;font-size: 12px;"
                               @click="loginDivStatus=2">{{$t(`message.index_base_login_forget_pwd`)}}
                      </el-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <div style="margin-bottom:10px">{{$t(`message.index_base_login_explore`)}}</div>
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
  </div>
</template>
<script>
    import $ from 'jquery'
    import {
        qs,
        userLogin,
        loginStatus,
        smsVerify, // 验证验证码
        smsCode, // 获取验证码
        forgetPasswordBySMS, // 修改
        checkAccountExist,//验证账号是否存在
        getBannerImage,//获取轮播图
    } from "../../api/api";
    import storageUtil from "../../utils/storageUtil";
    import promptUtil from "../../utils/promptUtil";
    import verifyUtil from '../../utils/verifyUtil';
    import '../../api/restfulapi';
    import userAgreementWrapper from '../component/userAgreementWrapper'

    export default {
        components: {'als-user-agreement-wrapper': userAgreementWrapper},
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t(`message.index_base_login_form_input_password`)));
                } else {
                    if (this.pwdRuleForm.password !== '') {
                        this.$refs.ruleForm.validateField('pwdRuleForm');
                    }
                    callback();
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t(`message.index_base_login_form_confirm_new_pwd`)));
                } else if (value !== this.pwdRuleForm.password) {
                    callback(new Error(this.$t(`message.index_base_login_password_same`)));
                } else {
                    callback();
                }
            }
            const validateUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t(`message.index_base_login_input_account`)));
                } else {
                    //验证账号是否存在
                    if (value.length <= 5) {
                        callback();
                    } else {
                        checkAccountExist(qs.stringify({
                            username: value.trim(),
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                            } else if (res.code == ERROR_CODE) {
                                callback(new Error(this.$t(`message.index_base_login_no_exist`)));
                            } else if (res.code == 3011) {//3011弹出验证码
                                this.showVerifyCode = true
                                this.contentBoxHeight = 391
                            }
                            callback();
                        }).catch(err => {
                            callback();
                            promptUtil.LOG('checkAccountExist-err', err)
                        })
                    }
                }
            }
            const validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t(`message.index_base_login_form_input_phone`)));
                } else if (!verifyUtil.isPhone(value)) {
                    callback(new Error(this.$t(`message.index_base_login_form_input_phone_error`)));
                } else {
                    if (this.phoneRuleForm.phone !== '') {
                        this.$refs.ruleForm.validateField('phoneRuleForm');
                    }
                    callback();
                }
            }
            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t(`message.index_base_login_form_input_code`)));
                } else if (value != '' && value.length != 6) {
                    callback(new Error(this.$t(`message.index_base_login_form_input_code_error`)));
                } else {
                    if (this.phoneRuleForm.code !== '') {
                        this.$refs.ruleForm.validateField('phoneRuleForm');
                    }
                    callback();
                }
            }
            return {
                currentSystemLang: '',
                isShowDrag: true, // 是否显示drag
                token: '',
                hei: "",
                wid: "",
                ruleForm: {username: "", password: "", verificationCode: '', agree: true},
                rules: {
                    username: [
                        {validator: validateUsername, trigger: 'blur'}
                    ],
                    password: [{required: true, message: "", trigger: "blur"},],
                },
                loginDivStatus: 1, // 1 登录 2 忘记密码
                phoneRuleForm: {phone: "", code: ""},
                phoneRules: {
                    phone: [{validator: validatePhone, trigger: 'blur'}],
                    code: [{validator: validateCode, trigger: 'blur'}]
                },
                pwdRuleForm: {password: "", confirm: ""},
                pwdRules: {
                    password: [{validator: validatePass, trigger: 'blur'}],
                    confirm: [{validator: validatePass2, trigger: 'blur'}]
                },
                verifyBtnContent: '',
                timeWithVerify: 0, // 默认验证码时间
                isVerifyBtnAble: false, // 是否可用
                isSMSLoading: false, // 验证code 是否可用
                isUpdateLoading: false, // 修改密码是否可用
                verificationCodeUrl: '',
                innerVisible: false,
                showVerifyCode: false,
                loginIndexImgL: [],
                contentBoxHeight: '',
            };
        },
        watch: {
            '$i18n.locale': function () {
                this.verifyBtnContent = this.$t(`message.index_base_login_code`)
                this.rules.password[0].message = this.$t(`message.index_base_login_form_old_password`)
            }
        },
        mounted() {
            let lang = storageUtil.getLang()
            this.currentSystemLang = lang
            this.$i18n.locale = lang;
            this.contentBoxHeight = document.getElementById("contentBoxRight").clientHeight
            this.getBannerImg()
            window.onresize = () => {
                this.setWindowStyle()
            }
            this.verifyBtnContent = this.$t(`message.index_base_login_code`)
            this.rules.password[0].message = this.$t(`message.index_base_login_form_old_password`)
            if (storageUtil.readOverdue() == 1) { // 证明已经过期，需要重新登录提示
                this.$notify({
                    duration: 4000,
                    title: this.$t(`message.index_base_login_account_warning`),
                    dangerouslyUseHTMLString: true,
                    message: '<div style="color:#F56C6C">'+this.$t(`message.index_base_login_warning_account`)+'</div>'
                });
            }
            if (localStorage.getItem('timeDown')) {
                this.timeWithVerify = localStorage.getItem('timeDown')
                this.verifyBtnContent = this.timeWithVerify + this.$t(`message.index_base_login_second`)
                this.timeDown()
            }
            setTimeout(() => {
                storageUtil.saveOverdue(0)
            }, 1000) // 重置 登录过期提示
            if (storageUtil.readTempLogin() && storageUtil.readTempLogin() != '') {
                this.ruleForm.username = storageUtil.readTempLogin()
            }
            // this.ruleForm.username
            // this.initLogin()
            this.verificationCode()
        },
        methods: {
            handleChangeLang(val) {
                this.currentSystemLang = val
                this.$i18n.locale = val;
                storageUtil.setLang(val)
            },
            onClickUserAgreement() {
                this.innerVisible = true
            },
            getBannerImg() {
                getBannerImage(qs.stringify({
                    settingType: 'login_banner'
                })).then(res => {
                    this.loginIndexImgL = []
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            res.data.forEach(item => {
                                const obj = {
                                    id: item.id,
                                    url: item.pic
                                }
                                this.loginIndexImgL.push(obj)
                            })
                        }
                    } else {
                    }
                }).catch(err => {
                    promptUtil.LOG('loginStatus-err', err)
                })

            },
            changeParentDialogStatus(type) {
                if (type == 1) {
                    this.ruleForm.agree = true
                } else {
                    this.ruleForm.agree = false
                }
                this.innerVisible = false
            },
            dragSuccess() {
                console.log("拖拽成功")
            },
            dragFail() {
                console.log("拖拽失败")
            },
            setWindowStyle() {
                let documentHeight =
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                this.hei = documentHeight - 63
                this.wid =
                    window.innerWidth ||
                    document.documentElement.clientWidth ||
                    document.body.clientWidth;
            },
            // 获取验证码
            getCode() {
                if (this.phoneRuleForm.phone && verifyUtil.isPhone(this.phoneRuleForm.phone)) {
                    smsCode(qs.stringify({
                        mobile: this.phoneRuleForm.phone
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, this.$t(`message.index_base_login_send_code`))
                            this.timeDown()
                        } else if (res.code == USER_NOT_EXIST) {
                            promptUtil.error(this, res.msg)
                        } else {
                            promptUtil.error(this, res.msg)
                        }
                    }).catch(err => promptUtil.LOG("smsCode-err", err))

                } else {
                    promptUtil.warning(this, this.$t(`message.index_base_login_rules_phone`))
                }
            },
            // 修改密码按钮触发
            updatePassword() {
                this.$refs['pwdRuleForm'].validate((valid) => {
                    if (valid) {
                        this.isUpdateLoading = true
                        forgetPasswordBySMS(qs.stringify({
                            new_pass: this.pwdRuleForm.password,
                            confirm_pass: this.pwdRuleForm.password,
                            mobile: this.phoneRuleForm.phone,
                            code: this.phoneRuleForm.code
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                                promptUtil.success(this, res.msg)
                                this.$refs['pwdRuleForm'].resetFields()
                                this.$refs['phoneRuleForm'].resetFields()
                                this.loginDivStatus = 1
                            } else {
                                let lang = storageUtil.getLang()
                                if(lang!='zh'){
                                    promptUtil.error(this, 'Try again in' + res.last_time + 'seconds')
                                }else{
                                    promptUtil.error(this, res.msg + '请' + res.last_time + '后重试')
                                }
                            }
                            this.isUpdateLoading = false
                        }).catch(err => {
                            this.isUpdateLoading = false
                            promptUtil.LOG('forgetPasswordBySMS-err', err)
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 验证码页面确认按钮触发
            verifyCodeEnter() {
                this.$refs['phoneRuleForm'].validate((valid) => {
                    if (valid) {
                        this.isSMSLoading = true
                        smsVerify(qs.stringify({
                            mobile: this.phoneRuleForm.phone,
                            code: this.phoneRuleForm.code
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                                this.loginDivStatus = 3
                            } else {
                                promptUtil.error(this, res.msg)
                            }
                            this.isSMSLoading = false
                        }).catch(err => {
                            this.isSMSLoading = false
                            promptUtil.LOG('smsVerify-err', err)
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 倒计时
            timeDown() {
                if (localStorage.getItem('timeDown')) {
                    this.timeWithVerify = localStorage.getItem('timeDown') * 1
                } else {
                    this.timeWithVerify = 60
                }
                this.isVerifyBtnAble = true
                let result = setInterval(() => {
                    this.verifyBtnContent = this.timeWithVerify + '秒'
                    --this.timeWithVerify;
                    localStorage.setItem('timeDown', this.timeWithVerify)
                    if (this.timeWithVerify < 0) {
                        this.timeWithVerify = 10
                        this.verifyBtnContent = this.$t(`message.index_base_login_code`)
                        localStorage.removeItem('timeDown')
                        clearInterval(result);
                        this.isVerifyBtnAble = false
                    }
                }, 1000);
            },
            // 返回登录页面触发
            goBackLogin() {
                this.loginDivStatus = 1;
                if (!this.isVerifyBtnAble) {
                    this.$refs['phoneRuleForm'].resetFields()
                }
            },
            initLogin() {
                loginStatus(qs.stringify({
                    token: this.token
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        // this.$router.push({ path: "/user" });
                        this.$router.push({path: "/index"});
                    } else {
                        this.$router.push({path: "/login"});
                    }
                }).catch(err => {
                    promptUtil.LOG('loginStatus-err', err)
                })

            },
            verificationCode() {
                let url = baseURL + '/page/yzm'
                this.verificationCodeUrl = url + '?abc=' + Math.random()
            },
            loginSubmit() {
                this.verificationCodeUrl = ''
                if (this.ruleForm.username) {
                    this.ruleForm.username = this.ruleForm.username.trim();
                }
                if (this.ruleForm.username.trim() == "") {
                    promptUtil.warning(this, this.$t(`message.index_base_login_input_account`));
                    return;
                }
                if (this.ruleForm.password.trim() == "") {
                    promptUtil.warning(this, this.$t(`message.index_base_login_form_old_password`));
                    return;
                }
                // if (this.ruleForm.verificationCode.trim() == "") {
                //   promptUtil.warning(this, "请输入验证码");
                //   this.verificationCode()
                //   return;
                // }
                const loading = promptUtil.loading(this);
                userLogin(qs.stringify(this.ruleForm))
                    .then(res => {
                        loading.close();
                        this.verificationCode()
                        if (res.code == SUCCESS_CODE) {
                            //跳转后台
                            storageUtil.saveToken(res.data.token)
                            storageUtil.saveTeacherInfo(res.data);
                            storageUtil.setLoginStatus(res.data.role_id);
                            // this.$router.push({ path: "/index" });
                            storageUtil.saveOverdue(0)
                            storageUtil.saveTempLogin(this.ruleForm.username)
                            this.$router.push({path: "/index"});
                            // this.$router.push({ path: "/user" });
                        } else if (res.code == 3011) { // 需要显示验证码
                            this.showVerifyCode = true
                            this.contentBoxHeight = 391
                        } else {
                            promptUtil.error(this, res.msg);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG('userLogin-err', err);
                    });
            },
            changeVerificationCodeUrl() {
                this.verificationCode()
            }

        },
        created() {
            this.setWindowStyle()
        },
    };
</script>

<style scoped>
  /** {*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*}*/

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
    background-color: #047FD8;
  }

  .loginWidth {
    width: 52px;
    height: 100%;
    margin-top: 3px;
  }

  .left {
    float: left;
    font-family: 'syRegular';
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
    /*height: 380px;*/
    border: 1px #eee solid;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    margin-top: -163px;
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
  #contentBoxRight {
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
    font-family: 'syRegular';
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%);
  }

  /*.loginBox {*/
  /*  width: 310px;*/
  /*  !*height: 320px;*!*/
  /*  background-color: #fff;*/
  /*  !* position: absolute;*/
  /*    left: 28%;*/
  /*    top:30%; *!*/
  /*  border-radius: 10px;*/
  /*  margin-top: 50px;*/
  /*}*/

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
</style>


