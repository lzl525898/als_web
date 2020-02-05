<template>
  <div>
    <div v-if="valId==1" class="home" :style="{height:hei+'px'}">
      <el-container>
        <div class="close" v-show="closeShow">
          <el-tooltip class="item" effect="light" content="显示顶部" placement="bottom">
            <i class="el-icon-arrow-down closeIcon" @click="closeIcon"></i>
          </el-tooltip>
        </div>
        <!-- header部分 -->
        <el-header v-if="toggElHeader">
          <!--          scratch3.0-->
          <div style="display:flex;align-items:center">
            <div style="flex:1;display:flex;justify-items:flex-start">
              <div class="goBack line_height">
                <router-link to="/student">返回</router-link>
              </div>
              <div v-if="$store.state.studentTaskId.complete==0" style="margin-left:30px;">
                <el-button type="primary" round @click="release" :disabled="isPublish"
                           style="margin-top: 16px; background-color: #fff;border-color: #fff;color: #9966ff;">发布
                </el-button>
              </div>
              <div v-if="$store.state.studentTaskId.complete==0" style="margin-left:30px;" >
                <el-button type="primary" round @click="workRequirement"
                           style="margin-top: 16px; background-color: #fff;border-color: #fff;color: #9966ff;">作品要求
                </el-button>
              </div>
            </div>
            <div style="flex:1;text-align:center">
              <div class="system-title">
                <div v-if="$store.state.studentTaskId.complete==1">恭喜你完成任务！！</div>
                <div v-else>未完成任务，加油！！</div>
              </div>
            </div>
            <div style="flex:1;display:flex;justify-content:flex-end;">
              <div style="position:relative">
                <div class="open" v-show="openShow">
                  <el-tooltip class="item" effect="light" content="隐藏顶部" placement="bottom">
                    <i class="el-icon-arrow-up openIcon" @click="openIcon"></i>
                  </el-tooltip>
                </div>
                <login-header style="margin-right:-20px;"></login-header>
              </div>
            </div>
          </div>
        </el-header>
        <!-- el-main部分 -->
        <el-main style="height: 100%">
          <div style="background-color: #00a2ff;height: 100%" v-loading="stratchloading">
            <iframe id="studentInfoIframe" :src=scratchUrl width="100%" height="100%" scrolling="yes" frameborder="0"
                    align="center"></iframe>
          </div>
        </el-main>
      </el-container>
      <el-dialog title="发布作品" :visible.sync="publishDialogVisible" width="40%">
        <el-form :model="scratchRuleForm" :rules="scratchrules" ref="scratchRuleForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="作品名称:">
            <el-input v-model="scratchRuleForm.name" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="作品介绍:">
            <el-input type="textarea" v-model="scratchRuleForm.produce"></el-input>
          </el-form-item>
          <el-form-item label="操作说明:">
            <el-input type="textarea" v-model="scratchRuleForm.explain"></el-input>
          </el-form-item>
          <el-form-item label="标签:" prop="tag">
            <template>
              <div>
                <el-checkbox-group v-model="scratchRuleForm.tag" @change="scratchHandeChange">
                  <el-checkbox-button
                    v-for="city in scratchRuleForm.cities"
                    :label="city.key"
                    :key="city.key"
                  >{{city.label}}
                  </el-checkbox-button>
                </el-checkbox-group>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="作品封面图:">
            <template>
              <el-popover
                placement="top"
                width="150"
                trigger="hover"
              >
                <div
                  style="width:100%;height: 120px;display: flex;justify-content: center;align-items: center;margin-top: 10px">
                  <vue-qr
                    :text="scratchRuleForm.qrData.url"
                    :logoSrc="require('../../../../static/images/base/logo.jpg')"
                    colorDark="#00a2ff"
                    colorLight="#fff"
                    :margin="0"
                    :logoScale="0.4"
                    :size="130"
                  ></vue-qr>
                </div>
                <div style="margin-top: 30px">手机扫码试玩需要你自己的帐号登录</div>
                <el-button slot="reference" style="float: right;border: none;color: #00a2ff;">手机试玩</el-button>
              </el-popover>
            </template>
            <el-upload
              :action="uploadPictureAction"
              list-type="picture-card"
              :limit="1"
              :on-remove="handlePictureRemove"
              :on-preview="handlePictureCardPreview"
              :before-upload="handlePictureBeforeUpload"
              :on-success="handleSuccessUploadImage"
              :on-error="handleErrorUpload"
              :on-progress="handleRrogress"
              :file-list="scratchRuleForm.pictureList"
            >
              <div slot="trigger">
                <span style="color:#888888">添加图片</span>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>
            </el-upload>
            <el-dialog :visible.sync="stickerPrintDialogImageVisible" :fullscreen="true">
              <img width="100%;" height="100%;" :src="stickerPrintDialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="类型:">
            <span v-if="valId==1">scratch3.0</span>
            <span v-if="valId==2">电子贴纸</span>
            <span v-if="valId==3">3D打印</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
<!--        <el-button @click="publishDialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="handlePublishWorks" :loading="isLoadingWithPublish"
                   :disabled="isPublishReport">发布报告</el-button>
      </span>
      </el-dialog>
    </div>
    <div v-else-if="((valId == 2 || valId == 3) && completeId == 1)">
      <el-header v-if="toggElHeader" style="display: flex !important;justify-content: space-between !important;align-items: center !important;
          background-color: rgb(153, 102, 255);"
      >
        <div class="goBack">
          <router-link to="/student">返回</router-link>
        </div>
        <login-header></login-header>
      </el-header>
      <div style="width: 100%;display:flex;justify-content:center;background-color:#eee;min-height: 860px;">
        <el-card shadow="always"
                 style="min-width: 800px;width:80%;min-height:600px;margin-top:50px;margin-bottom:50px;">
          <el-row>
            <el-col :span="16" style="background-color: #eee;">
              <el-carousel :interval="3000" arrow="always" height="400px" indicator-position="outside"
                           style="padding: 30px">
                <el-carousel-item v-for="item in stickerPrint.picture" :key="item">
                  <el-image
                    style="width: 100%; height: 100%;"
                    :src="item"
                    fit="fill"></el-image>
                </el-carousel-item>
              </el-carousel>

              <div style="padding: 30px;margin-top:-50px" v-if="stickerPrint.videoUrl!==''">
                <video id="helpMovie" controls="controls"
                       style="width: 100%;border:3px solid #409EFF;border-radius:3px;padding:-3px;"
                       :src="stickerPrint.videoUrl"></video>
              </div>

            </el-col>
            <el-col :span="8">
              <div style="margin-left: 20px">
                <el-tooltip class="item" effect="dark" :content="stickerPrint.taskName" placement="top">
                  <div style="width:380px;font-size:26px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                    {{stickerPrint.taskName}}
                  </div>
                </el-tooltip>
                <el-row style="margin-top: 30px;">
                  <el-col :span="5">作品要求</el-col>
                  <el-col :span="1"><span style="font-weight: bold">:</span></el-col>
                  <div v-if="stickerPrint.workeRequire!=''">
                    <el-col :span="18">
                      <el-button type="text" @click="dialogVisible = true" style="margin-top: -10px">点击查看作品要求
                      </el-button>
                    </el-col>
                  </div>
                  <div v-else></div>
                </el-row>
                <div style="height: 1px;background-color:#e6e6e6;margin-top: 30px;"></div>
                <el-row style="margin-top: 30px;">
                  <el-col :span="5">当前班级</el-col>
                  <el-col :span="1"><span style="font-weight: bold">:</span></el-col>
                  <el-col :span="18">{{stickerPrint.className}}</el-col>
                </el-row>
                <el-row style="margin-top: 10px;">
                  <el-col :span="5">作品类型</el-col>
                  <el-col :span="1"><span style="font-weight: bold">:</span></el-col>
                  <el-col :span="18">{{stickerPrint.taskMission}}</el-col>
                </el-row>
                <el-row style="margin-top: 10px;">
                  <el-col :span="5">作品状态</el-col>
                  <el-col :span="1"><span style="font-weight: bold">:</span></el-col>
                  <el-col :span="18">{{stickerPrint.status}}</el-col>
                </el-row>
                <div style="height: 1px;background-color:#e6e6e6;margin-top: 30px;"></div>
                <div style="display: flex;margin-top: 20px;">
                  <div>{{stickerPrint.stuName}}</div>
                  <div style="margin-left: 20px;"><i class="el-icon-timer"><span style="margin-left: 10px;">{{stickerPrint.releaseTime}}</span></i>
                  </div>
                </div>
                <el-row style="margin-top: 10px;">
                  <el-col :span="5">作品描述</el-col>
                  <el-col :span="1"><span style="font-weight: bold">:</span></el-col>
                  <el-col :span="18">{{stickerPrint.desc}}</el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <div v-else>
      <el-header v-if="toggElHeader" style="display: flex !important;justify-content: space-between !important;align-items: center !important;
          background-color: rgb(153, 102, 255);"
      >
        <div class="goBack">
          <router-link to="/student">返回</router-link>
        </div>
        <div style="position: absolute;top: 15px;left: 100px">
          <el-button type="primary" round @click="workRequirement"
                     style="background-color: #fff;border-color: #fff;color: #9966ff;">作品要求
          </el-button>
        </div>
        <login-header></login-header>
      </el-header>
      <!--      <div style="background-color: #eee;width: 100%;height: 100%;">-->
      <el-row style="width: 50%;margin: 0 auto;">
        <el-card class="box-card" style="margin-top: 3%">
          <el-col :span="24">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
              <el-form-item label="任务名称" style="width: 100%;">
                <el-input v-model="ruleForm.taskName" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="班级" style="width: 100%;">
                <el-input v-model="ruleForm.class" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="作品名称" style="width: 100%;" prop="workName">
                <el-input v-model="ruleForm.workName" placeholder="请输入作品名称"></el-input>
              </el-form-item>
              <el-form-item label="作品描述" style="width: 100%;" prop="studentTaskName">
                <el-input type="textarea" v-model="ruleForm.studentTaskName" placeholder="请输入作品描述"></el-input>
              </el-form-item>
              <el-form-item label="上传视频">
                <el-upload
                  :action="uploadVideoAction"
                  list-type="picture-card"
                  :limit="1"
                  :on-remove="handleVideoRemove"
                  :on-preview="handleVideoCardPreview"
                  :before-upload="handleVideoBeforeUpload"
                  :on-success="handleSuccessUploadVideo"
                  :on-progress="handleVideoRrogress"
                  :file-list="ruleForm.videoList"
                  name="file"
                >
                  <div slot="trigger">
                    <span style="color:#888888">添加视频</span>
                  </div>
                  <div slot="tip" class="el-upload__tip">只能上传video/mp4文件，且不超过10MB，建议小于60秒</div>
                </el-upload>
                <el-dialog :visible.sync="dialogImageVisible" :fullscreen="true">
                  <video controls="controls" autoplay="autoplay">
                    <source :src="dialogImageUrl" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                </el-dialog>
              </el-form-item>
              <el-form-item label="上传照片">
                <el-upload
                  :action="uploadPictureAction"
                  list-type="picture-card"
                  :limit="9"
                  :on-remove="handlePictureRemove"
                  :on-preview="handlePictureCardPreview"
                  :before-upload="handlePictureBeforeUpload"
                  :on-success="handleSuccessUploadImage"
                  :on-error="handleErrorUpload"
                  :on-progress="handleRrogress"
                  :file-list="ruleForm.pictureList"
                >
                  <div slot="trigger">
                    <span style="color:#888888">添加图片</span>
                  </div>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多9张</div>
                </el-upload>
                <el-dialog :visible.sync="dialogImageVisible" :fullscreen="true">
                  <img width="100%;" height="100%;" :src="dialogImageUrl" alt>
                </el-dialog>
              </el-form-item>
              <!--   开始-->
              <el-form-item label="封面图">
                <el-upload
                  :action="uploadPictureAction"
                  list-type="picture-card"
                  :limit="1"
                  :on-remove="handlePrientPictureRemove"
                  :on-preview="handlePrientPictureCardPreview"
                  :before-upload="handlePrientPictureBeforeUpload"
                  :on-success="handlePrientSuccessUploadImage"
                  :on-error="handlePrientErrorUpload"
                  :on-progress="handlePrientRrogress"
                  :file-list="ruleForm.stickerPrintPictureList"
                >
                  <div slot="trigger">
                    <span style="color:#888888">添加图片</span>
                  </div>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>
                </el-upload>
                <el-dialog :visible.sync="coverImageDialogImageVisible" :fullscreen="true">
                  <img width="100%;" height="100%;" :src="coverImageDialogImageUrl" alt>
                </el-dialog>
              </el-form-item>
              <el-form-item label="标签:" prop="tag">
                <template>
                  <div>
                    <el-checkbox-group v-model="ruleForm.tag" @change="prientHandeChange">
                      <el-checkbox-button
                        v-for="city in ruleForm.cities"
                        :label="city.label"
                        :key="city.key"
                      >{{city.label}}
                      </el-checkbox-button>
                    </el-checkbox-group>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="类型:">
                <span v-if="valId==1">scratch3.0</span>
                <span v-if="valId==2">电子贴纸</span>
                <span v-if="valId==3">3D打印</span>
              </el-form-item>
              <!--              结束-->
              <div
                style="border: none;background:#eeeeee;height: 1px;margin-top: 10px;margin-bottom: 20px;"
              ></div>
              <el-form-item>
                <el-button type="primary" @click="onReleaseType" :disabled="onReleaseTypeDisabled">发布</el-button>
                <el-button @click="onSaveType('ruleForm')" :disabled="onSaveTypeDisabled">保存</el-button>
                <el-button @click="onCancelType">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-row>
    </div>
    <el-dialog
      title="作品要求"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <div style="width: 100%;height: 500px;overflow-y: auto">
        <div v-html="stickerPrint.workeRequire" style="width: 100% !important;">{{stickerPrint.workeRequire}}</div>
      </div>
    </el-dialog>
  </div>
  <!--  </div>-->
</template>
<script>

    import promptUtil from "../../../utils/promptUtil";
    import staticUtil from "../../../utils/staticUtil";
    import storageUtil from "../../../utils/storageUtil";
    import vueQr from "vue-qr";
    import verifyUtil from "../../../utils/verifyUtil";
    import $ from "jquery";
    import loginHeader from "../../home/loginHeader.vue";
    import '../../../api/restfulapi';
    import {
        qs,
        getTeacherInfoById,
        uploadFileUrl,
        publishWorksByStudent,
        delUploadFileByUrl,
        saveSeedDtailsInformation,
        saveStudentTypeInformation,
        getTaskTypeInformation,
        publishingWorks
    } from "../../../api/api";

    export default {
        components: {
            loginHeader,
            vueQr
        },

        data() {
            return {
                toggElHeader: true,
                studentInfo: "",
                show: true,
                closeShow: false,
                openShow: true,
                count: "",
                timer: null,
                disabled: true,
                stratchloading: true,
                isPublish: false, // 默认可以点击发布
                scratchUrl: "", // scratch加载地址
                publishDialogVisible: false, // 发布确认对话框显示状态
                isLoadingWithPublish: false, // 发布对话框中确认按钮加载状态
                isPublishReport: true, // 是否可以点击
                // publishDialogContent: '确认要发布该作品吗？',
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
                    classes: {className: "", classOwn: []},
                    nick: "",
                    phone: "",
                    remark: ""
                },
                formLabelWidth: "120px",
                //3D贴纸 电子打印

                uploadVideoAction: uploadFileUrl, // 上传视频action地址
                uploadPictureAction: uploadFileUrl, // 上传图片action地址
                onReleaseTypeDisabled: false,//图片未上传成功disabled发布按钮
                onSaveTypeDisabled: false,//图片未上传成功disabled保存按钮
                dialogImageVisible: false, // 是否显示图片组件对话框
                cancelDialogVisible: false, // 确认取消编辑对话框显示状态
                uploadPictureArray: [], // 上传图片由服务器返回的图片地址
                originImgUrlfArray: [],
                savePictureArray: [],
                uploadVideoUrl: "", // 上传视频由服务器返回的视频地址
                dialogImageUrl: "", // 上传图片组件中图片地址
                ruleForm: {
                    workName: '',
                    name: '',
                    taskName: '',
                    class: '',
                    video: '',
                    studentTaskName: '',
                    picture: [],// 上传图片信息
                    pictureList: [],
                    videoList: [],
                    tag: [],
                    cities: [],
                    stickerPrintPictureList: []
                },
                rules: {
                    workName: [{required: true, message: '请输请输入作品名称', trigger: 'blur'}],
                    studentTaskName: [{required: true, message: '请输请输入作品描述', trigger: 'blur'}],
                    pictureList: [{required: true, message: '请选择图片', trigger: 'blur'}],
                    tag: [{required: true, message: '请选择标签', trigger: 'blur'}]

                },
                valId: '',//类型id scratch3.0 1
                completeId: '',//已完成1 未完成0

                //获取3D贴纸与电子打印页面
                //任务详情信息
                stickerPrint: {
                    taskName: "",
                    stuName: "",
                    releaseTime: "",
                    className: "",
                    status: "",
                    desc: '',
                    require: '',
                    picture: [],
                    videoUrl: '',
                },
                //发布dialog上传图片
                scratchRuleForm: {
                    name: '',
                    produce: '',
                    explain: '',
                    tag: [],
                    keyboard: '',
                    type: '',
                    picture: [],// 上传图片信息
                    pictureList: [],
                    cities: [],
                    // img:'http://www.alsrobot.cn/themes/aosong1/images/ewm2.png',
                    qrData: {url: ""}
                },
                scratchrules: {
                    tag: [
                        {required: true, message: '请输选择类型', trigger: 'blur'},
                    ]
                },
                scratchDialogImageUrl: '',
                scratchDialogImageVisible: false,
                uploadDialogPictureArray: [], // 发布dialog上传图片由服务器返回的图片地址
                scratchDialogImageVisible: false,
                curttonTag: [],//scratch3.0 类型选择
                prientcurttonTag: [],//3d打印 电子贴纸 类型选择
                stickerPrintDialogImageUrl: '',
                stickerPrintDialogImageVisible: false,
                stickerPrintPictureArray: [], // 上传图片由服务器返回的图片地址
                coverImageDialogImageVisible: false,//电子贴纸3D打印上传封面
                coverImageDialogImageUrl: '',//电子贴纸3D打印上传封面地址
                dialogVisible: false,
                tagArray: [],
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.valId = storageUtil.readWorksDetail().valId
            this.completeId = storageUtil.readWorksDetail().complete
            if (!this.$store.state.studentTaskId.taskId) {
                this.$router.push({path: "/student"})
                return
            }
            if ((this.valId == 2 || this.valId == 3) && this.completeId == 1) {
                //获取3D打印 电子贴纸的信息
                getTaskTypeInformation(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    task_id: this.$store.state.studentTaskId.taskId,
                    student_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.assignmentData(res.data)
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG("getTaskTypeInformation-err", err)
                })
            } else {
                //3D贴纸 电子打印
                this.ruleForm.taskName = this.$store.state.studentTaskId.taskName
                this.ruleForm.class = this.$store.state.studentTaskId.className
                // //进入查看信息页面回显示
                saveSeedDtailsInformation(qs.stringify({
                    task_id: this.$store.state.studentTaskId.taskId,
                    user_id: storageUtil.readTeacherInfo().id,
                    mission_id: this.valId,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.ruleForm.name = res.data.task_name
                            this.ruleForm.class = res.data.class
                            this.ruleForm.workName = res.data.work_name
                            this.ruleForm.video = ""
                            this.ruleForm.videoList = []
                            if (res.data.cover_img != "" && res.data.cover_img != null) {
                                this.ruleForm.stickerPrintPictureList = []
                                const obj = {name: 0, url: res.data.cover_img}
                                this.ruleForm.stickerPrintPictureList.push(obj)
                                this.stickerPrintPictureArray.push(obj.url)
                            }
                            if (res.data.pic && res.data.pic.length > 0) {
                                res.data.pic.forEach(item => {
                                    this.ruleForm.pictureList.push(item)
                                    this.uploadPictureArray.push(item.url);
                                })
                            }
                            this.ruleForm.studentTaskName = res.data.title
                            if (res.data.video && res.data.video.length > 0) {
                                this.ruleForm.videoList = res.data.video
                                this.ruleForm.video = res.data.video[0].url
                            }
                            if (res.data.bq_all && res.data.bq_all.length && res.data.bq_all.length > 0) {
                                res.data.bq_all.forEach(item => {
                                    const classObj = {key: item.id, label: item.category_name};
                                    const classTag = {value: item.id, label: item.category_name};
                                    this.ruleForm.cities.push(classObj);
                                    this.tagArray.push(classTag)
                                });
                            }
                            if (res.data.bq && res.data.bq.length && res.data.bq.length > 0) {
                                res.data.bq.forEach(item => {
                                    let tagName=staticUtil.findLabelFromArray(item,this.tagArray)
                                    this.ruleForm.tag.push(tagName)
                                    this.prientcurttonTag.push(parseInt(item))
                                })
                            }
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG("saveSeedDtailsInformation-err", err)
                })

            }
        },
        updated() {
            // ALS1222965557
            var $dom = document.getElementById("studentInfoIframe");
            var that = this
            if ($dom) {
                if ($dom.attachEvent) {
                    $dom.attachEvent("onload", function () {
                        that.stratchloading = false
                    });
                } else {
                    $dom.onload = function () {
                        that.stratchloading = false
                    };
                }
                if (!this.$store.state.studentTaskId) {
                    promptUtil.error(this, "请点击【返回】");
                    this.isPublish = true
                    return;
                }
                this.currentTaskId = this.$store.state.studentTaskId.taskId
                this.scratchUrl = this.$store.state.studentTaskId.worksUrl || "http://www.alsrobot.vip/scratch/index.html"

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
                    this.$router.replace({path: `/login`});
                }, 500);
            },

            //table切换
            handleClick(tab, event) {
                if (tab.name == "second") {
                    this.$refs.ruleForm.resetFields();
                    this.ruleForm.currentmp = this.gridData.phone;
                }
            },
            // 作品介绍
            workRequirement() {
                const msg = this.$store.state.studentTaskId.taskDesc && this.$store.state.studentTaskId.taskDesc != '' ? this.$store.state.studentTaskId.taskDesc : '暂无作品要求'
                this.$notify.info({
                    title: '作品要求',
                    message: msg,
                    dangerouslyUseHTMLString: true,
                    duration: 0,
                    offset: 60
                });
                $(".el-notification").css({"width": "auto", "height": "800px"})
                $(".el-notification__group").css({"overflow-y": "auto"})
            },
            // 学生发布任务
            release() {
                this.publishDialogVisible = true
                this.releaseButton()
            },
            // 确认发布出发事件
            handlePublishWorks() {
                if (this.curttonTag.length == 0) {
                    promptUtil.warning(this, "请选择类型")
                    return
                }
                this.isLoadingWithPublish = true
                const loading = promptUtil.loading(this)
                publishWorksByStudent(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    task_id: this.currentTaskId,
                    student_id: storageUtil.readTeacherInfo().id,
                    jieshao: this.scratchRuleForm.produce,
                    con: this.scratchRuleForm.explain,
                    bq: JSON.stringify(this.curttonTag),
                    cover_img: this.uploadDialogPictureArray.length == 0 ? "" : this.uploadDialogPictureArray[0],
                })).then(res => {
                    this.publishDialogVisible = false
                    this.isLoadingWithPublish = false
                    loading.close()
                    if (res.code == SUCCESS_CODE) {
                        if (res.data == '[]') {
                            promptUtil.error(this, "请先保存当前作品")
                            return
                        }
                        this.$store.dispatch("saveStudentTaskId", {
                            taskId: this.$store.state.studentTaskId.taskId,
                            complete: 1,
                            worksUrl: this.scratchUrl
                        });
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    this.publishDialogVisible = false
                    this.isLoadingWithPublish = false
                    loading.close()
                    promptUtil.LOG('publishWorksByStudent-err', err)
                })
            },
            closeIcon() {
                this.toggElHeader = true
                // $(".closeIcon").hide();
                // $(".openIcon").show();
                this.closeShow = false
                this.openShow = true

            },
            openIcon() {
                this.toggElHeader = false
                // $(".closeIcon").show();
                // $(".openIcon").hide();
                this.closeShow = true
                this.openShow = false
            },
            //3D打印 电子贴纸

            //发布
            onReleaseType() {
                if (this.ruleForm.studentTaskName == undefined || this.ruleForm.workName == undefined) {
                    promptUtil.warning(this, "请输入相关信息")
                    return
                }
                if (this.uploadPictureArray.length == 0) {
                    promptUtil.warning(this, "请上传图片信息")
                    return
                }
                if (this.prientcurttonTag.length == 0) {
                    promptUtil.warning(this, "请选择类型")
                    return
                }
                let senTagName=[]
                if(this.ruleForm.tag&&this.ruleForm.tag.length>0){
                    this.ruleForm.tag.forEach(item=>{
                        senTagName.push(staticUtil.findValueFromArray(item,this.tagArray))
                    })
                }
                saveStudentTypeInformation(qs.stringify({
                    task_id: this.$store.state.studentTaskId.taskId,
                    student_id: storageUtil.readTeacherInfo().id,
                    pic: JSON.stringify(this.uploadPictureArray),
                    video: this.ruleForm.video,
                    title: this.ruleForm.studentTaskName,
                    work_name: this.ruleForm.workName,
                    is_submit: 1,
                    con: "",
                    bq: JSON.stringify(senTagName),
                    cover_img: this.stickerPrintPictureArray.length == 0 ? "" : this.stickerPrintPictureArray[0],
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, res.msg);
                        this.$router.replace({
                            path: "/student"
                        });
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.timeout(this)
                })
            },
            //保存
            onSaveType(formName) {
                if (this.ruleForm.studentTaskName == undefined || this.ruleForm.workName == undefined) {
                    promptUtil.warning(this, "请输入相关信息")
                    return
                }
                if (this.uploadPictureArray.length == 0) {
                    promptUtil.warning(this, "请上传图片信息")
                    return
                }
                if (this.prientcurttonTag.length == 0) {
                    promptUtil.warning(this, "请选择类型")
                    return
                }
                let senTagName=[]
                if(this.ruleForm.tag&&this.ruleForm.tag.length>0){
                    this.ruleForm.tag.forEach(item=>{
                        senTagName.push(staticUtil.findValueFromArray(item,this.tagArray))
                    })
                }
                saveStudentTypeInformation(qs.stringify({
                    task_id: this.$store.state.studentTaskId.taskId,
                    student_id: storageUtil.readTeacherInfo().id,
                    pic: JSON.stringify(this.uploadPictureArray),
                    video: this.ruleForm.video,
                    title: this.ruleForm.studentTaskName,
                    work_name: this.ruleForm.workName,
                    is_submit: 0,
                    con: "",
                    bq: JSON.stringify(senTagName),
                    cover_img: this.stickerPrintPictureArray.length == 0 ? "" : this.stickerPrintPictureArray[0],
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, "保存成功")
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.timeout(this)
                })
            },
            //取消
            onCancelType() {
                this.$router.push({
                    path: "/student"
                });

            },
            //视频
            //上传视频时回调
            handleVideoRrogress() {
                this.onReleaseTypeDisabled = true
                this.onSaveTypeDisabled = true
            },

            // 上传视频文件成功回调
            handleSuccessUploadVideo(response, file, fileList) {
                this.onReleaseTypeDisabled = false
                this.onSaveTypeDisabled = false
                this.uploadVideoUrl = response;
                this.ruleForm.video = this.uploadVideoUrl;
            },
            // 上传视频监听函数
            handleVideoBeforeUpload(file) {
                const isMP4 = file.type === "video/mp4";
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message({
                        message: "文件视频超过5MB，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (!isMP4) {
                    this.$message({
                        message: "只能上传mp4文件，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (isMP4 && isLt2M) {
                    this.ruleForm.video = file.uid;
                }
                return isMP4 && isLt2M;
            },
            // 删除上传的视频监听
            handleVideoRemove(file, fileList) {
                if (!file.response) {
                    return
                }
                delUploadFileByUrl(qs.stringify({url: file.response.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.ruleForm.video = "";
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        promptUtil.timeout(this);
                    });
            },
            // 预览选中上传的视频
            handleVideoCardPreview(file) {
                if (this.valId == 1) {
                    this.scratchDialogImageUrl = file.url;
                    this.scratchDialogImageVisible = true;
                } else {
                    this.dialogImageUrl = file.url;
                    this.dialogImageVisible = true;

                }

            },
            // 删除上传的图片监听
            handlePictureRemove(file, fileList) {
                //console.log("file",file.response.substring(55)) //获取oss路径
                delUploadFileByUrl(qs.stringify({url: file.url.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            if (this.valId == 1) {
                                this.uploadDialogPictureArray.splice(
                                    this.uploadDialogPictureArray.findIndex(item => item === file.url),
                                    1
                                );
                            } else {
                                this.uploadPictureArray.splice(
                                    this.uploadPictureArray.findIndex(item => item === file.url),
                                    1
                                );
                            }

                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        promptUtil.timeout(this);
                    });
            },
            //上传文件时回调
            handleRrogress(event, file, fileList) {
                this.onReleaseTypeDisabled = true
                this.onSaveTypeDisabled = true

            },

            //上传文件失败回调
            handleErrorUpload(err, file, fileList) {
                promptUtil.err(this, '上传文件失败');
            },
            // 上传图片成功回调
            handleSuccessUploadImage(response, file, fileList) {
                this.onReleaseTypeDisabled = false
                this.onSaveTypeDisabled = false
                if (this.valId == 1) {
                    this.uploadDialogPictureArray = []
                    this.uploadDialogPictureArray.push(response)
                } else {
                    this.uploadPictureArray = []
                    this.uploadPictureArray.push(response);
                }
            },
            // 预览选中上传的图片
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImageVisible = true;
            },
            // 上传图片监听函数
            handlePictureBeforeUpload(file) {
                const isJPG = file.type === "image/png" || file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message({
                        message: "文件图片超过2MB，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (!isJPG) {
                    this.$message({
                        message: "只能上传jpg/png文件，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (isJPG && isLt2M) {
                    console.log("处理上传图片操作");
                }
                return isJPG && isLt2M;
            },
            //获取3D打印与电子贴纸信息页面
            assignmentData(data) {
                this.stickerPrint.taskName = data.task_name,
                    this.stickerPrint.stuName = data.student_name,
                    this.stickerPrint.releaseTime = data.endtime,
                    this.stickerPrint.className = data.class_name,
                    this.stickerPrint.taskMission = data.task_mission,
                    this.stickerPrint.status = data.is_submit == 1 ? "已发布" : "未发布",
                    this.stickerPrint.workeRequire = data.task_des,
                    this.stickerPrint.require = data.mission_id == 2 ? "电子贴纸" : "3D打印",
                    this.stickerPrint.picture = data.pic,
                    this.stickerPrint.videoUrl = data.video,
                    this.stickerPrint.desc = data.title
            },

            scratchHandeChange(val) {
                this.curttonTag = val
            },
            prientHandeChange(val) {
                this.prientcurttonTag = val
            },
            releaseButton() {
                publishingWorks(qs.stringify({
                    task_id: this.$store.state.studentTaskId.taskId,
                    student_id: storageUtil.readTeacherInfo().id,
                    mission_id: this.valId,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.scratchRuleForm.cities.length = 0
                            res.data.bq.forEach(item => {
                                const classObj = {key: item.id, label: item.category_name};
                                this.scratchRuleForm.cities.push(classObj);

                            });
                            this.scratchRuleForm.name = res.data.work_name
                            this.scratchRuleForm.qrData.url = res.data.mobile_url
                        }
                        this.isPublishReport = false
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('publishingEorks-err', err)
                })
            },

            //上传封面图片的回调


            // 删除上传的图片监听
            handlePrientPictureRemove(file, fileList) {
                //console.log("file",file.response.substring(55)) //获取oss路径
                delUploadFileByUrl(qs.stringify({url: file.url.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.stickerPrintPictureArray.splice(
                                this.stickerPrintPictureArray.findIndex(item => item === file.url),
                                1
                            );
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        promptUtil.timeout(this);
                    });
            },
            //上传文件时回调
            handlePrientRrogress(event, file, fileList) {
                this.onReleaseTypeDisabled = true
                this.onSaveTypeDisabled = true

            },

            //上传文件失败回调
            handlePrientErrorUpload(err, file, fileList) {
                promptUtil.err(this, '上传文件失败');
            },
            // 上传图片成功回调
            handlePrientSuccessUploadImage(response, file, fileList) {
                this.stickerPrintPictureArray = []
                this.stickerPrintPictureArray.push(response)
                this.onReleaseTypeDisabled = false
                this.onSaveTypeDisabled = false
            },
            // 预览选中上传的图片
            handlePrientPictureCardPreview(file) {
                this.coverImageDialogImageUrl = file.url;
                this.coverImageDialogImageVisible = true;
            },
            // 上传图片监听函数
            handlePrientPictureBeforeUpload(file) {
                const isJPG = file.type === "image/png" || file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message({
                        message: "文件图片超过2MB，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (!isJPG) {
                    this.$message({
                        message: "只能上传jpg/png文件，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (isJPG && isLt2M) {
                    console.log("处理上传图片操作");
                }
                return isJPG && isLt2M;
            },
            changeName() {

            },
            handleClose(done) {
                done();
            }

        },
        created() {
            this.hei =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
        },


    }


</script>
<style>
  .el-notification__closeBtn {
    position: absolute !important;
    right: 56px !important;
  }
</style>
<style scoped>
  .el-icon-warning {
    margin-top: -10px;
  }

  .el-icon-warning:before {
    font-size: 36px;
    color: #ffba42;
  }

  .home {
    background-color: #fff;
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
    background-color: rgb(153, 102, 255);
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
    font-size: 20px;
    color: #fff;
    font-weight: bold;
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
    height: 100%;
    background-color: red;
  }

  .el-main {
    padding: 0px 0px 0px 0px;
  }

  .goBack {
    font-size: 20px;
    padding-left: 20px;
  }

  .goBack a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;

  }

  .goBack a:hover {
    color: #a99158;
    text-decoration: none;
  }

  .nick {
    color: #9966ff;
    font-weight: bold;
  }

  .el-button {
    height: 30px;
    line-height: 0px;
  }

  .el-container {
    position: relative;
  }

  .close {
    position: absolute;
    right: 5%;
    top: 12px;
    z-index: 999;
  }

  .closeIcon {
    font-weight: bold;
    font-size: 25px;
    /*width: 60px;*/
    /*height: 30px;*/
    color: #fff;
    border-radius: 50px;
    width: 26px;
    height: 26px;
    /*border-radius: 0 0 60px 60px;*/
    /*color: #fff;*/
    border-radius: 50%;
    /*color: #1890ff;*/
    color: #4047df;
    /*background-color: rgb(153, 102, 255);*/
    background-color: #fff;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }

  .open {
    position: absolute;
    top: 13px;
    left: -30px;
    z-index: 999;
  }

  .openIcon {
    font-size: 24px;
    width: 34px;
    height: 34px;
    /*width: 40px;*/
    /*height: 20px;*/
    color: #9966ff;
    border-radius: 50%;
    /*border-radius: 50px;*/
    /*border-radius: 0 0 40px 40px;*/
    /*color: #fff;*/
    /*background-color: rgb(153, 102, 255);*/
    background-color: #fff;
    line-height: 34px;
    text-align: center;
    cursor: pointer;
  }

  .line_height {
    line-height: 60px;
  }

  .el-notification__closeBtn {
    position: absolute !important;
    right: 56px !important;
  }
</style>


