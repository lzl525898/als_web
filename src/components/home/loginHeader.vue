<template>
  <div>
    <!--    <div v-if="userRole==1">-->
    <!--      &lt;!&ndash; 头部组件 &ndash;&gt;-->
    <!--      <el-header class="header">-->
    <!--        <span suffix-icon="el-icon-s-operation" v-if="none"></span>-->
    <!--        <i class="el-icon-menu" @click="toggleCollapse" v-if="elIcon"></i>-->
    <!--        <div class="system-title" v-if="asIntelligence">{{$store.state.schoolName}}</div>-->
    <!--        <div class="dropmenu-avatar">-->
    <!--          <div style="position: absolute;left:-200px;">-->
    <!--            <el-dropdown>-->
    <!--              <div v-if="explain" class="help">-->
    <!--                <a href="javascript:void(0)">-->
    <!--                  <i class="el-icon-s-grid"></i>-->
    <!--                  <span>家长端</span>-->
    <!--                </a>-->
    <!--              </div>-->
    <!--              <el-dropdown-menu slot="dropdown">-->
    <!--                <div style="margin:0 5px 5px 5px">-->
    <!--                  <div style="margin-left:5px;margin-right:5px">-->
    <!--                    <img style="width: 100px; height: 100px" :src="qrCodeMobileImg"/>-->
    <!--                  </div>-->
    <!--                  <div style="font-size: 14px;color:#333;text-align: center;margin-top:5px;">微信扫一扫</div>-->
    <!--                  <div style="font-size: 10px;color:#888;text-align: center;margin-top:5px;">进入家长端</div>-->
    <!--                </div>-->
    <!--              </el-dropdown-menu>-->
    <!--            </el-dropdown>-->
    <!--          </div>-->
    <!--          <div style="position: absolute;left:-100px;">-->
    <!--            <div class="help" @click="contact">-->
    <!--              <a href="javascript:void(0)">-->
    <!--                <i class="el-icon-phone"></i>-->
    <!--                <span>联系我们</span>-->
    <!--              </a>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--&lt;!&ndash;          <div style="position: absolute;left:-200px;">&ndash;&gt;-->
    <!--&lt;!&ndash;            <div v-if="organizationInfoTogg" class="help" @click="organizationInfo">&ndash;&gt;-->
    <!--&lt;!&ndash;              <a href="javascript:void(0)">&ndash;&gt;-->
    <!--&lt;!&ndash;                <i class="el-icon-success"></i>&ndash;&gt;-->
    <!--&lt;!&ndash;                <span>机构信息</span>&ndash;&gt;-->
    <!--&lt;!&ndash;              </a>&ndash;&gt;-->
    <!--&lt;!&ndash;            </div>&ndash;&gt;-->
    <!--&lt;!&ndash;          </div>&ndash;&gt;-->
    <!--          &lt;!&ndash; 下拉菜单 &ndash;&gt;-->
    <!--          <el-dropdown @command="handleCommand" class="logoout">-->
    <!--            <span class="el-dropdown-link">-->
    <!--              <div style="width: 120px;height:100%;display: flex;align-items: center;">-->
    <!--                <div style="width: 40px;">-->
    <!--                  <el-avatar style="width: 36px;height:36px;" :src="$store.state.userAvatar"></el-avatar>-->
    <!--                </div>-->
    <!--                <div class="userName"-->
    <!--                     style="width: 80px;margin-left: 10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"-->
    <!--                >{{$store.state.userName}}</div>-->
    <!--              </div>-->
    <!--            </span>-->
    <!--            <el-dropdown-menu slot="dropdown">-->
    <!--              <el-dropdown-item command="persoinfo">个人信息</el-dropdown-item>-->
    <!--&lt;!&ndash;              <el-dropdown-item command="originInformation" >机构信息</el-dropdown-item>&ndash;&gt;-->
    <!--              <el-dropdown-item command="logout">退出</el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--          </el-dropdown>-->
    <!--        </div>-->
    <!--      </el-header>-->
    <!--    </div>-->
    <div>
      <!-- 头部组件 -->
      <el-header class="header">
        <span suffix-icon="el-icon-s-operation" v-if="none"></span>
        <i class="el-icon-menu" @click="toggleCollapse" v-if="elIcon"></i>
        <div v-if="asIntelligence" style="display:flex;align-items:baseline;justify-content:center;">
          <router-link to="/index" class="system-title">{{$store.state.schoolName}}</router-link>
          <div style="margin-left:10px;">
            <!--            <div style="color:#fff;font-size:10px;font-weight:500;background-color:#126fe0;text-align:center;border-radius:1px;">{{schoolType.type}}</div>-->
            <div style="color:#fff;font-size:14px;font-weight:bold;">{{schoolType.label}}</div>
          </div>
        </div>
        <div class="dropmenu-avatar" style="display:flex">
<!--          <div style="position: absolute;left:-200px;">-->
<!--            <el-dropdown placement="bottom-start">-->
<!--              <div class="help">-->
<!--                <a href="javascript:void(0)">-->
<!--                  <i class="el-icon-s-tools"></i>-->
<!--                  <span>{{localLang}}</span>-->
<!--                </a>-->
<!--              </div>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item @click.native="switchLang('zh')">简体中文</el-dropdown-item>-->
<!--                <el-dropdown-item @click.native="switchLang('cht')">繁体中文</el-dropdown-item>-->
<!--                <el-dropdown-item @click.native="switchLang('en')">English</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
<!--          </div>-->

          <el-dropdown>
            <div v-if="explain" class="help">
              <a href="javascript:void(0)">
                <i class="el-icon-s-grid"></i>
                <span>家长端</span>
              </a>
            </div>
            <el-dropdown-menu slot="dropdown">
              <div style="margin:0 5px 5px 5px">
                <div style="margin-left:5px;margin-right:5px">
                  <img style="width: 100px; height: 100px" :src="qrCodeMobileImg"/>
                </div>
                <div style="font-size: 14px;color:#333;text-align: center;margin-top:5px;">微信扫一扫</div>
                <div style="font-size: 10px;color:#888;text-align: center;margin-top:5px;">进入家长端</div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="badge-wrapper" @click="handleClickIntoNotice">
            <el-badge :value="$store.state.mailCount" class="item" :max="99" :hidden="$store.state.mailCount==0">
              <i class="el-icon-bell" style="color:#fff"/>
            </el-badge>
          </div>
          <!-- 下拉菜单 -->
          <el-dropdown @command="handleCommand" class="logoout">
          <span class="el-dropdown-link">
            <div style="height:60px;display:flex;align-items: center;">
              <div style="width: 40px;">
                <el-avatar style="width: 36px;height:36px;" :src="$store.state.userAvatar"></el-avatar>
              </div>
              <div class="userName" style="margin-left: 5px;">{{$store.state.userName}}</div>
            </div>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="personCenter">个人中心</el-dropdown-item>
              <el-dropdown-item command="personInfo">用户信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
<!--          <div class="logout-btn" @click="onClickLogout">退出系统</div>-->
        </div>
      </el-header>
    </div>

    <!-- 用户信息弹出框 -->
    <el-dialog
      title="用户信息编辑"
      :visible.sync="dialogFormVisible"
      width="600px"
      :before-close="closeDialog"
    >
      <!-- table切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人资料" name="first">
          <!-- 个人资料表单 -->
          <el-form :model="gridData" :rules="firstRules" ref="gridData">
            <el-form-item label="头像:" :label-width="formLabelWidth">
              <el-avatar :src="currentAvatar"></el-avatar>
              <el-link :underline="false" type="primary" style="margin-top: -30px;" @click="avatarDialogVisible=true">
                更换头像
              </el-link>
            </el-form-item>
            <el-form-item label="账号:" :label-width="formLabelWidth">
              <el-input v-model="gridData.account" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称:" :label-width="formLabelWidth" prop="nick">
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
                <el-form-item label="输入旧密码" prop="oldpassword">
                  <el-input v-model="ruleForm.oldpassword" type="password" placeholder="请输入旧密" show-password></el-input>
                </el-form-item>
                <!-- <el-form-item label="验证码" prop="yzm">
                      <el-input v-model="ruleForm.yzm" class="width"  placeholder="请输入验证码"></el-input>
                      <el-button type="primary" :disabled="disabled" v-show="show" @click="getCode">获取验证码</el-button>
                      <el-button type="primary" v-show="!show" class="count">{{count}} s</el-button>
                </el-form-item>-->
                <el-form-item label="输入新密码" prop="password">
                  <el-input v-model="ruleForm.password" placeholder="请输入新密码" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="reptpassword">
                  <el-input v-model="ruleForm.reptpassword" placeholder="请确认新密码" type="password" show-password></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :visible.sync="avatarDialogVisible"
        append-to-body>
        <div class="cropper-content">
          <div class="cropper">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              @realTime="realTime"
              @imgLoad="imgLoad"></vueCropper>
          </div>
          <div class="show-preview"
               :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
        <div class="footer-btn">
          <div class="scope-btn">
            <label class="btn" for="uploads">选择图片</label>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                   accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
            <el-button size="mini" icon="el-icon-plus" @click="changeScale(1)"></el-button>
            <el-button size="mini" icon="el-icon-minus" @click="changeScale(-1)"></el-button>
            <el-button size="mini" style="font-weight: 600;" @click="rotateLeft">↺</el-button>
            <el-button size="mini" style="font-weight: 600;" @click="rotateRight">↻</el-button>
          </div>
          <div class="upload-btn">
            <el-button type="primary" style="margin-left: 46px;" size="mini" @click="down('base64')"
                       :loading="isUpdateAvatarLoading">上传头像
            </el-button>
          </div>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="cancelWithUserDialog"
          :dialogFormVisible="dialogFormVisible"
        >取 消
        </el-button>
        <el-button type="primary" @click="onClickWithUserDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import $ from "jquery";
    import {VueCropper} from 'vue-cropper';
    import PubSub from "pubsub-js";
    import storageUtil from "../../utils/storageUtil";
    import promptUtil from "../../utils/promptUtil";
    import vuexUtil from "../../utils/vuexUtils";
    import '../../api/restfulapi';
    import {
        qs,
        getTeacherInfoById,
        updateUserInfo,
        forgetPasswordBySMS,
        getStudentInfoById,
        updateUserPassword,
        uploadBase64,
        loginOut
    } from "../../api/api";
    import superBlockly from "../../utils/superBlockly";

    export default {
        components: {
            VueCropper,
        },
        name: "loginHeader",
        data() {
            return {
                localLang: this.getLangContent(),
                schoolType: {type: '', label: ''},
                qrCodeMobileImg: require('../../../static/images/base/moblie.png'),
                userRole: 0, // 0 未登录  1 管理员  2 教师  3 学生
                organizationInfoTogg: true,
                none: false,
                explain: true,
                asIntelligence: true,
                elIcon: true,
                //验证码
                // show: true,
                // disabled:true,
                // count: '',
                // timer: null,
                userRole: 0, // 0 未登录  1 管理员  2 教师  3 学生
                topBaseInfo: {
                    institution: "",
                    avatar: "",
                    nick: "",
                    role: "",
                    class: ""
                }, // 左上角基本信息
                // 弹出框 验证修改昵称只能输入汉字
                // gridData: {nick: ""},
                // 弹出框 修改密码页面数据
                //ruleForm: {currentmp:'', yzm:'', password:'', reptpassword:''},
                ruleForm: {oldpassword: "", password: "", reptpassword: ""},
                // 弹出框 修改密码页面表单验证
                rules: {
                    oldpassword: [
                        {required: true, message: "请输入旧密码", trigger: "blur"}
                    ],
                    // yzm:[
                    //   { required: true, message: '请输入验证码', trigger: 'blur' },
                    // ],
                    password: [
                        {required: true, message: "请输入新密码", trigger: "blur"},
                        {
                            min: 6,
                            max: 16,
                            message: "密码长度在 6 到 12 个字符",
                            trigger: "blur"
                        }
                    ],
                    reptpassword: [
                        {required: true, message: "再次输入密码", trigger: "blur"},
                        {
                            min: 6,
                            max: 16,
                            message: "密码长度在 6 到 12 个字符",
                            trigger: "blur"
                        }
                    ]
                },
                // 弹出框 修改昵称表单验证
                firstRules: {
                    nick: [{pattern: /^[\u2E80-\u9FFF]+$/, message: "只能输入汉字"}]
                },
                isCollapse: false,
                activeName: "first", //table切换
                //个人信息弹出框
                dialogTableVisible: false,
                dialogFormVisible: false, // 隐藏下拉弹出对话框
                // 弹出框中得数据
                gridData: {
                    id: "",
                    account: "",
                    classes: {className: "", classOwn: []},
                    nick: "",
                    phone: "",
                    remark: ""
                },
                formLabelWidth: "120px",
                previews: {},
                option: {
                    img: '',
                    size: 1,
                    full: false, // 输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 200,
                    autoCropHeight: 200,
                    fixedBox: true
                },
                avatarDialogVisible: false, // 是否显示头像对话框
                downImg: '#',
                currentAvatar: '', //当前头像
                isUpdateAvatarLoading: false, // 更新头像当前状态
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            // this.qrCodeMobileImg = "https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/moblie.png"
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
            this.initTopBaseInfo(this.userRole);
            this.judgeRouter();
        },
        methods: {
            switchLang(lang){
              this.$i18n.locale = lang;
              storageUtil.setLang(lang)
              this.localLang = this.getLangContent()
            },
            getLangContent(){
              let langLocal = ''
              const lang = storageUtil.getLang()
              if(lang=='zh'){
                langLocal = '简体中文'
              }else if(lang=='cht'){
                langLocal = '繁体中文'
              }else if(lang=='en'){
                langLocal = 'English'
              }
              return langLocal
            },
            handleClickIntoNotice(){
                this.$router.push({path:'/mail'})
            },
            down(type) {
                // event.preventDefault()
                if (type === 'blob') {
                    let aLink = document.createElement('a')
                    aLink.download = 'author-img'
                    this.$refs.cropper.getCropBlob(data => {
                        this.downImg = window.URL.createObjectURL(data)
                        //            aLink.download = this.downImg;
                        aLink.href = window.URL.createObjectURL(data)
                        aLink.click()
                    })
                } else { // base64
                    this.$refs.cropper.getCropData(data => {
                        this.downImg = data
                        this.isUpdateAvatarLoading = true
                        uploadBase64(qs.stringify({
                            file: this.downImg,
                            user_id: storageUtil.readTeacherInfo().id
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                                this.option.img = res.data.header_new
                                vuexUtil.setUserAvatarWithState(this, this.option.img)
                                promptUtil.success(this, '修改成功')
                                this.currentAvatar = this.option.img
                                const userObjInfo = storageUtil.readTeacherInfo()
                                userObjInfo.avatar = this.option.img
                                storageUtil.saveTeacherInfo(userObjInfo)
                            } else {
                                promptUtil.error(this, '修改失败')
                            }
                            this.isUpdateAvatarLoading = false
                            this.avatarDialogVisible = false
                        }).catch(err => {
                            this.isUpdateAvatarLoading = false
                            promptUtil.LOG("uploadBase64-err", err)
                        })
                        // aLink.href = data
                        // aLink.click()
                        // 将头像图片数据发送给后台
                    })
                }
            },
            uploadImg(e, num) {
                //上传图片
                // this.option.img
                let file = e.target.files[0]
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                    return false
                }
                const reader = new FileReader()
                reader.onload = e => {
                    let data
                    if (typeof e.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    } else {
                        data = e.target.result
                    }
                    if (num === 1) {
                        this.option.img = data
                    }
                }
                // 转化为base64
                reader.readAsDataURL(file)
                // 转化为blob
                // reader.readAsArrayBuffer(file)
            },
            // 实时预览函数
            realTime(data) {
                if (!this.option.img) {
                    this.option.img = this.$store.state.userAvatar
                }
                this.previews = data
            },
            imgLoad(msg) {
                promptUtil.LOG("imgLoad", msg)
                if (msg == 'error') {
                    this.avatarDialogVisible = false
                }
            },
            // 改变图片大小
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            // 向左旋转
            rotateLeft() {
                this.$refs.cropper.rotateLeft()
            },
            // 向右旋转
            rotateRight() {
                this.$refs.cropper.rotateRight()
            },
            // 弹出对话框确定按钮响应
            onClickWithUserDialog() {
                const loading = promptUtil.loading(this);
                if (this.activeName == "first") {
                    if(this.gridData.nick==""){
                        this.dialogFormVisible = true;
                        loading.close();
                        promptUtil.warning(this,"请输入昵称")
                        return
                    }
                    var mobile_mode=/^1[3456789]\d{9}$/;
                    if(!mobile_mode.test(this.gridData.phone)){
                        promptUtil.warning(this,"请输入正确的手机号")
                        this.dialogFormVisible = true;
                        loading.close();
                        return
                    }
                    // 修改个人信息
                    updateUserInfo(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            user_id: this.gridData.id,
                            user_nick: this.gridData.nick,
                            user_phone: this.gridData.phone,
                            user_remark: this.gridData.remark
                        })
                    )
                        .then(res => {
                            loading.close();
                            if (res.code == SUCCESS_CODE) {
                                this.$store.dispatch("updateUserName", this.gridData.nick); // 触发消息action调用
                                promptUtil.success(this, "修改个人信息成功");
                                superBlockly.updateAccount()
                                this.dialogFormVisible = false;
                            } else if (res.code == -2) { //
                                // 没做修改直接关闭
                                this.dialogFormVisible = false;
                            } else {
                                promptUtil.wait(this);
                            }
                        })
                        .catch(err => {
                            loading.close();
                            promptUtil.LOG('updateUserInfo-err', err);
                        });
                } else {
                    // 修改用户密码
                    if (this.ruleForm.oldpassword == this.ruleForm.password) {
                        promptUtil.warning(this, "新密码与旧密码一致");
                        this.dialogFormVisible = true;
                        loading.close();
                        return;
                    }
                    // var reg = /^[\w]{6,12}$/
                    let regg=/^[\da-z]{6,12}$/i
                    if (!regg.test(this.ruleForm.password)||!regg.test(this.ruleForm.password)) {
                        promptUtil.warning(this, "密码长度在 6 到 12 个字符");
                        this.dialogFormVisible = true;
                        loading.close();
                        return
                    }
                    updateUserPassword(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            user_id: this.gridData.id,
                            old_pass: this.ruleForm.oldpassword,
                            new_pass: this.ruleForm.password,
                            confirm_pass: this.ruleForm.reptpassword
                        })
                    )
                        .then(res => {
                            loading.close();
                            if (res.code == SUCCESS_CODE) {
                                promptUtil.success(this, res.msg);
                                this.dialogFormVisible = false;
                                this.$refs.ruleForm.resetFields();
                            } else {
                                promptUtil.error(this, res.msg);
                                this.dialogFormVisible = true;
                            }
                        })
                        .catch(err => {
                            loading.close();
                            promptUtil.LOG('updateUserPassword-err', err);
                        });
                    //结束
                }
            },
            // 跳转到首页
            gotoIndexPage() {
                this.$router.replace({path: "/home"});
            },
            //点击取消按钮清空验证
            cancelWithUserDialog() {
                this.dialogFormVisible = false;
                this.$refs.ruleForm.resetFields();
            },
            //关闭dialog对话框清空验证
            closeDialog() {
                this.dialogFormVisible = false;
                this.$refs.ruleForm.resetFields();
            },
            toggleCollapse(isCollapse) {
                this.isCollapse = !this.isCollapse;
                this.$emit('loginHeader')
            },

            // 初始化基本信息
            initTopBaseInfo(role) {
                const baseInfo = storageUtil.readTeacherInfo();
                this.schoolType.type = baseInfo.banben_en
                this.schoolType.label = baseInfo.banben
                vuexUtil.setUserNameWithState(this, baseInfo.real_name);
                vuexUtil.setUserAvatarWithState(this, baseInfo.avatar)
                this.currentAvatar = this.$store.state.userAvatar
                this.option.img = this.currentAvatar
                this.topBaseInfo.institution = baseInfo.school_name;
                if (role == 3) {
                    this.topBaseInfo.class = baseInfo.className;
                } else {
                    this.topBaseInfo.role = baseInfo.school_admin == 1 ? "校长" : "教师";
                }
            },
            // 退出触发方法
            logout() {
                const loading = promptUtil.loading(this);
                loginOut().then(res => {
                    if (res.code == SUCCESS_CODE) {
                        setTimeout(() => {
                            loading.close();
                            // 清除登录状态
                            storageUtil.logout();
                            // 跳转到登录页面
                            this.$router.replace({path: `/login`});
                            promptUtil.success(this, res.msg);
                        }, 200);
                    }
                })
            },
            originInformation() {

            },
            onClickLogout(){
              this.logout();
            },
            //初始化列表数据
            //下拉菜单  退出
            handleCommand(command) {
                if (command === "logout") {
                    this.logout();
                } else if (command === "personInfo") {
                    const loading = promptUtil.loading(this);
                    //获取个人信息
                    if (storageUtil.readTeacherInfo().role_id == 2) {
                        // 学生
                        getStudentInfoById(
                            qs.stringify({
                                school_id: storageUtil.readTeacherInfo().school_id,
                                student_id: storageUtil.readTeacherInfo().id
                            })
                        )
                            .then(res => {
                                // console.log(res);
                                if (res.code == SUCCESS_CODE) {
                                    this.gridData = res.data;
                                    if (this.gridData.classes == "") {
                                        this.gridData.classes = {className: "", classOwn: []};
                                    }
                                    this.dialogFormVisible = true;
                                } else {
                                    promptUtil.error(this, "网络异常，请稍后再试...");
                                }
                                loading.close();
                            })
                            .catch(err => {
                                loading.close();
                                promptUtil.timeout(this, err);
                            });
                    } else {
                        // 教师
                        getTeacherInfoById(
                            qs.stringify({
                                school_id: storageUtil.readTeacherInfo().school_id,
                                teacher_id: storageUtil.readTeacherInfo().id
                            })
                        )
                            .then(res => {
                                if (res.code == SUCCESS_CODE) {
                                    if (res.data && res.data != '[]') {
                                        this.gridData = res.data;
                                        if (this.gridData.classes == "") {
                                            this.gridData.classes = {className: "", classOwn: []};
                                        }
                                    } else {
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
                                promptUtil.timeout(this, err);
                            });
                    }
                } else if (command === "originInformation") {
                    this.$router.push({path: '/eduinfo'})
                } else if (command == "personCenter") {
                  this.$router.push({path:'/personCenter'})
                }
            },
            //table切换
            handleClick(tab, event) {
                if (tab.name == "second") {
                    this.$refs.ruleForm.resetFields();
                }
            },
            //验证码倒计时
            // getCode(){
            //   const TIME_COUNT = 60;
            //   if (!this.timer) {
            //     this.count = TIME_COUNT;
            //     this.show = false;
            //     this.timer = setInterval(() => {
            //       if (this.count > 0 && this.count <= TIME_COUNT) {
            //         this.count--;
            //       } else {
            //         this.show = true;
            //         clearInterval(this.timer);
            //         this.timer = null;
            //       }
            //     }, 1000)
            //   }
            // },
            //帮助
            help() {
                this.$router.push({path: "/help"});
            },
            organizationInfo() {
                this.$router.push({path: "/eduinfo"});
            },
            //联系我们
            contact() {
                this.$router.push({path: "/contactUs"});
            },
            //判断路由
            judgeRouter() {
                this.$store.dispatch("setHelpPageType", 1)
                if (this.$route.name === "taskDetail") {
                    this.elIcon = false
                    this.none = true
                    this.explain = false;
                    this.$store.dispatch("setHelpPageType", 1)
                    $(".header").css({"background-color": "#9966ff"});
                }
                if (this.$route.name === "students") {
                    this.explain = false;
                    this.$store.dispatch("setHelpPageType", 1)
                }
                if (this.$route.name === "studentInfo") {
                    this.explain = false;
                    this.asIntelligence = false
                    this.elIcon = false
                    this.$store.dispatch("setHelpPageType", 1)
                    $(".header").css({"background-color": " rgb(153, 102, 255)"});
                    $(".userName").css({"color": "#fff"})

                }
                if (this.$route.name === "liveManagement") {
                    this.$store.dispatch("setHelpPageType", 2)
                }
            }
        }

        // watch:{
        //   ruleForm:{
        //     handler(newVal, oldVal) {
        //       //当输入手机号时 验证码图标变换颜色
        //       if (verifyUtil.isPhone(newVal.currentmp)) {
        //         this.disabled=false
        //       }else {
        //         this.disabled=true
        //       }
        //     },
        //     deep: true
        //   }
        // gridData:{
        //   handler(newVal, oldVal) {
        //     //只能输入汉字
        //     if (verifyUtil.chineseValidate(newVal.nick)) {
        //       this.message= '请输入新手机号'
        //     }
        //   },
        //   deep: true
        // }
        //}
    };
</script>
<style scoped>
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .header {
    /* background-color: #00a2ff; */
    background-color: #00a2ff;
  }

  .logo {
    height: 150px;
    background-color: #595963;
    overflow: hidden;
    border-bottom: 0.5px solid #fff;
  }

  .system-title {
    font-size: 30px;
    color: white;
    text-decoration: none;
  }

  .system-title:hover {
    cursor: pointer;
    text-decoration: none;
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

  /* //ss */
  .dropmenu-avatar {
    position: relative;
  }

  /* //ss */
  .help {
    line-height: 60px;
    color: #fff;
    margin-right:20px;
    font-size: 14px;
  }

  .help a {
    color: #fff;
    text-decoration: none;
  }

  .help a:hover {
    color: #eee;
    text-decoration: none;
  }

  .help span {
    /*padding-left: 5px;*/
  }

  .el-icon-menu {
    cursor: pointer;
    font-size: 25px;
    color: #fff;
    /* background-color: red; */
  }

  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }

  .cropper {
    width: 350px;
    height: 300px;
  }

  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .preview {
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid #cccccc;
    background: #cccccc;
    margin-left: 40px;
  }

  .footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }

  .scope-btn {
    width: 350px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
  }

  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 10px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
  .logout-btn{
    height:60px;
    display:flex;
    align-items:center;
    color:#fff;
    font-size:14px;
  }
  .logout-btn:hover{
    cursor: pointer;
  }
  .badge-wrapper {
    height:60px;
    display:flex;
    align-items: center;
    margin-right:30px;
    margin-left:10px;
    cursor: pointer;
  }
  .badge-wrapper .item:hover{
    -webkit-animation: tada 1s .2s ease both;
    -moz-animation: tada 1s .2s ease both;
    font-weight: bold;
  }
  @-webkit-keyframes tada{0%{-webkit-transform:scale(1);}

    10%, 20%{-webkit-transform:scale(0.9) rotate(-3deg);}

    30%, 50%, 70%, 90%{-webkit-transform:scale(1.1) rotate(3deg);}

    40%, 60%, 80%{-webkit-transform:scale(1.1) rotate(-3deg);}

    100%{-webkit-transform:scale(1) rotate(0);}}

  @-moz-keyframes tada{0%{-moz-transform:scale(1);}

    10%, 20%{-moz-transform:scale(0.9) rotate(-3deg);}

    30%, 50%, 70%, 90%{-moz-transform:scale(1.1) rotate(3deg);}

    40%, 60%, 80%{-moz-transform:scale(1.1) rotate(-3deg);}

    100%{-moz-transform:scale(1) rotate(0);}}

  @-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);

    opacity:0;}

    40%{-webkit-transform:perspective(400px) rotateY(-10deg);}

    70%{-webkit-transform:perspective(400px) rotateY(10deg);}

    100%{-webkit-transform:perspective(400px) rotateY(0deg);

      opacity:1;}}

  @-moz-keyframes flipInY{0%{-moz-transform:perspective(400px) rotateY(90deg);

    opacity:0;}

    40%{-moz-transform:perspective(400px) rotateY(-10deg);}

    70%{-moz-transform:perspective(400px) rotateY(10deg);}

    100%{-moz-transform:perspective(400px) rotateY(0deg);

      opacity:1;}}
</style>


