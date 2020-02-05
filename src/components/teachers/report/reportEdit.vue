<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="reportForm" :model="reportForm" label-width="80px">
          <el-form-item label="报告名称" style="width: 50%;">
            <el-input v-model="reportForm.name" placeholder="请输入报告名称"></el-input>
          </el-form-item>
          <el-form-item label="评价类型">
            <el-select v-model="reportForm.typeLabel" placeholder="请选择评价类型" :disabled="true"></el-select>
            <el-select
              v-model="reportForm.course.name"
              placeholder="请选择关联课程"
              v-show="reportForm.type==1"
              :disabled="true"
            ></el-select>
            <el-select
              v-model="reportForm.task.name"
              placeholder="请选择关联任务"
              v-show="reportForm.type==2"
              :disabled="true"
            ></el-select>
          </el-form-item>
          <el-form-item label="详细点评" style="width: 50%;">
            <el-input
              type="textarea"
              v-model="reportForm.comment"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入详细点评"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传视频">
            <el-upload
              :action="uploadVideoAction"
              list-type="picture-card"
              :limit="1"
              :on-remove="handleVideoRemove"
              :file-list="reportForm.videoList"
              :on-preview="handleVideoCardPreview"
              :before-upload="handleVideoBeforeUpload"
              :on-success="handleSuccessUploadVideo"
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
              :file-list="reportForm.pictureList"
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
          <el-form-item label="核心潜能">
            <div style="width: 700px;">
              <el-row>
                <el-col :span="8">
                  思考力
                  <el-rate
                    v-model="reportForm.dimensionValues.reflect"
                    show-text
                    text-color="#ff9900"
                  ></el-rate>
                </el-col>
                <el-col :span="8">
                  创造力
                  <el-rate
                    v-model="reportForm.dimensionValues.create"
                    show-text
                    text-color="#ff9900"
                  ></el-rate>
                </el-col>
                <el-col :span="8">
                  创新力
                  <el-rate
                    v-model="reportForm.dimensionValues.innovate"
                    show-text
                    text-color="#ff9900"
                  ></el-rate>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  逻辑思维
                  <el-rate
                    v-model="reportForm.dimensionValues.logical"
                    show-text
                    text-color="#ff9900"
                  ></el-rate>
                </el-col>
                <el-col :span="8">
                  沟通力
                  <el-rate
                    v-model="reportForm.dimensionValues.communicate"
                    show-text
                    text-color="#ff9900"
                  ></el-rate>
                </el-col>
                <el-col :span="8">
                  专注力
                  <el-rate
                    v-model="reportForm.dimensionValues.absorbed"
                    show-text
                    text-color="#ff9900"
                  ></el-rate>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div
            style="border: none;background:#eeeeee;height: 1px;margin-top: 10px;margin-bottom: 20px;"
          ></div>
          <el-form-item>
            <el-button type="primary" @click="onReleaseReport" :disabled="onReleaseReportDisabled">发布</el-button>
            <el-button @click="onSaveReport" :disabled="onSaveReportDisabled">保存</el-button>
            <el-button @click="onSaveAndPreviewReport" :disabled="saveSeeShowDisabled">保存并预览</el-button>
            <el-button @click="onCancelReport">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <report-dialog ref="reportdialog"></report-dialog>
    <el-dialog title="提示" :visible.sync="cancelDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>报告已经编辑并且没有进行保存，请进行保存操作</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">取 消</el-button>
        <!--        <el-button type="primary" @click="handleCancelStudent">确 定</el-button>-->
        <el-button type="primary" @click="cancelDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="releaseDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <!--          <span>报告已经编辑并且没有进行保存，请问确认要继续取消编辑吗？</span>-->
          <span> 发布报告后不可编辑，是否继续发布?</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="releaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReleaseStudent">确 定</el-button>
      </span>
    </el-dialog>
    <!--<el-dialog title="预览" :visible.sync="reportDetailVisible" width="30%" @opened="reportDialogOpened">-->
    <!--<div style="height: 600px;overflow-y:scroll;margin-top:-20px;">-->
    <!--<div style="height: 240px;background: #409EFF;">-->
    <!--<el-row>-->
    <!--<el-col :span="12" :offset="6">-->
    <!--<el-tooltip class="item" effect="dark" :content="reportDetailInfo.reportName" placement="top">-->
    <!--<div class="div-report-title">{{reportDetailInfo.reportName}}</div>-->
    <!--</el-tooltip>-->
    <!--<div style="display: flex;justify-content: center;align-items: center;margin-top: 20px;">-->
    <!--<img :src="reportDetailInfo.studentInfo.avatar" width="80px;" height="80px;"/>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row><el-col :span="4" :offset="10">-->
    <!--<el-tooltip class="item" effect="dark" :content="reportDetailInfo.studentInfo.name" placement="top">-->
    <!--<div class="div-report-name">{{reportDetailInfo.studentInfo.name}}</div>-->
    <!--</el-tooltip>-->
    <!--</el-col></el-row>-->
    <!--</div>-->
    <!--<el-card class="box-card" style="margin-top: -30px;margin-left: 20px;margin-right: 20px;">-->
    <!--<el-row>-->
    <!--<el-col :span="4"><span style="font-weight: bold">任务说明:</span></el-col>-->
    <!--<el-col :span="18" :offset="1">-->
    <!--<el-tooltip class="item" effect="dark" :content="reportDetailInfo.taskspec" placement="top">-->
    <!--<div class="div-task-info">{{reportDetailInfo.taskspec}}</div>-->
    <!--</el-tooltip>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-carousel :interval="5000" arrow="always" height="300px">-->
    <!--<el-carousel-item v-for="(item, index) in reportDetailInfo.pictures" :key="index">-->
    <!--<img :src="item" style="width: 100%;height: 100%;"/>-->
    <!--</el-carousel-item>-->
    <!--</el-carousel>-->
    <!--</el-card>-->
    <!--<el-card class="box-card" style="margin-top: 10px;margin-left: 20px;margin-right: 20px;">-->
    <!--<video style="width:100%;height: 100%" controls="controls" :src="reportDetailInfo.video"></video>-->
    <!--</el-card>-->
    <!--<el-row style="margin-top: 10px;">-->
    <!--<el-col :span="22" :offset="1">-->
    <!--<div style="float:left;border: none;height:25px;width:3px;background:#409EFF"></div>-->
    <!--<span style="font-size: 18px;font-weight: bold;margin-left:5px;">教师评语</span>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row style="margin-top: -12px;">-->
    <!--<el-col :span="22" :offset="1">-->
    <!--{{reportDetailInfo.evaluation}}-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row style="margin-top: -10px;">-->
    <!--<el-col :span="22" :offset="1">-->
    <!--<el-card class="box-card" style="margin: 0;padding: 0;">-->
    <!--<el-row>-->
    <!--<el-col :span="2">-->
    <!--<div style="display: flex;justify-content: center;align-items: center">-->
    <!--<img :src="reportDetailInfo.teacherInfo.avatar" style="width: 35px;height: 35px;"/>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :span="16" :offset="1">-->
    <!--<div>任课教师:<span>{{reportDetailInfo.teacherInfo.nick}}</span></div>-->
    <!--<div>所在班级:<span>{{reportDetailInfo.teacherInfo.class}}</span></div>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</el-card>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="22" :offset="1">-->
    <!--<div style="float:left;border: none;height:25px;width:3px;background:#409EFF"></div>-->
    <!--<span style="font-size: 18px;font-weight: bold;margin-left:5px;">六大潜力</span>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<div id="echart-main" style="width:300px;height: 300px;margin: auto;"></div>-->
    <!--</el-row>-->
    <!--<div style="font-size: 20px;color:#666666;font-weight:bold;text-align: center;">分享至朋友圈</div>-->
    <!--<el-row>-->
    <!--<div style="width:100%;height: 300px;display: flex;justify-content: center;align-items: center;">-->
    <!--<vue-qr :text="reportDetailInfo.qrData.url" :logoSrc="reportDetailInfo.qrData.icon" colorDark="#FFBA02" colorLight="#fff" :margin="0" :logoScale="0.4" :size="200"></vue-qr>-->
    <!--</div>-->
    <!--</el-row>-->
    <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>
<script>
    const echarts = require("echarts");
    import reportDialog from "./reportDialog.vue";
    import vueQr from "vue-qr";
    import promptUtil from "../../../utils/promptUtil";
    import storageUtil from "../../../utils/storageUtil";
    import '../../../api/restfulapi';
    import '../../../router/router';


    import {
        qs,
        uploadFileUrl,
        delUploadFileByUrl,
        getStudentReportWithEdit,
        saveCourseReport,
        releaseEditCourseReport,
        getStudentReportDetail
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'
    export default {
      components: {"vueQr":vueQr, "reportDialog":reportDialog,"als-child-header": childHeader},
      data() {
            return {
                routerConfig: [{name:'学情报告',to:'/report'},{name:this.$store.state.currentStudentName + '的学情报告',to:ROUTER_REPORT_INFO + this.$route.params.id},{name:'编辑报告',to:''}],
                onReleaseReportDisabled: false,//图片未上传成功disabled发布按钮
                onSaveReportDisabled: false,//图片未上传成功disabled保存按钮
                uploadVideoAction: uploadFileUrl, // 上传视频action地址
                uploadPictureAction: uploadFileUrl, // 上传图片action地址
                reportRouterUrl: "", // 学情报告路由地址
                rawData: {}, // 服务器请求数据
                requestTimeout: 2000, // 请求服务器超时时间
                getTableContentTimeoutId: null, // 模拟异步请求定时id
                dialogImageUrl: "", // 上传图片组件中图片地址
                dialogImageVisible: false, // 是否显示图片组件对话框
                cancelDialogVisible: false, // 确认取消编辑对话框显示状态
                reportDetailVisible: false, // 是否显示当前报告详情
                uploadPictureArray: [], // 上传图片由服务器返回的图片地址
                basePictureArray: [], // 本地原始图片地址数据，未进行编辑操作
                uploadVideoUrl: "", // 上传视频由服务器返回的视频地址
                baseVideoUrl: "", // 本地原始视频地址数据，未进行编辑操作
                reportForm: {
                    // 创建报告内容信息
                    name: "", // 报告名称
                    type: "", // 评价类型
                    task: {id: 0, name: ""}, //任务信息
                    course:{id: 0, name: ""},
                    comment: "", // 详细点评
                    dimensionValues: {
                        reflect: 3,
                        create: 3,
                        innovate: 3,
                        logical: 3,
                        communicate: 3,
                        absorbed: 3
                    }, // 核心能力
                    videoList: [], // 上传视频信息
                    pictureList: [],// 上传图片信息
                },
                releaseDialogVisible: false,//是否显示发布dialog
                saveSeeShowDisabled: false,
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.reportRouterUrl = {
                path: ROUTER_REPORT_INFO + this.$route.params.id
            };
            const loading = promptUtil.loading(this);
            // 1.初始化
            getStudentReportWithEdit(
                qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    report_id: this.$route.params.report
                })
            )
                .then(res => {
                    loading.close();
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.reportForm = this.anysisDataFromServer(res.data);
                            this.analysisMediaFromFormData();
                            this.rawData = this.clone(this.reportForm);
                            this.basePictureArray = JSON.parse(JSON.stringify(this.uploadPictureArray))
                            this.baseVideoUrl = this.uploadVideoUrl
                        } else {
                            this.rawData = []
                            this.basePictureArray = []
                            this.baseVideoUrl = ""
                        }
                    } else {
                        promptUtil.wait(this);
                    }
                })
                .catch(err => {
                    loading.close();
                    promptUtil.LOG("getStudentReportWithEdit-err", err);
                });
        },
        methods: {
            //  保存报告处理方法
            onSaveReport() {
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                const loading = promptUtil.loading(this);
                const formData = this.genFormData(this.reportForm, this.reportForm.type);
                saveCourseReport(qs.stringify(formData))
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            this.$router.replace({
                                path: ROUTER_REPORT_INFO + this.$route.params.id
                            });
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("saveCourseReport-err", err);
                    });
            },
            // 发布报告处理方法
            onReleaseReport() {
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                this.releaseDialogVisible=true
            },
            //发布dialog中的确定按钮
            handleReleaseStudent(){
                const loading = promptUtil.loading(this);
                const formData = this.genFormData(this.reportForm, this.reportForm.type);
                releaseEditCourseReport(qs.stringify(formData))
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            this.$router.replace({
                                path: ROUTER_REPORT_INFO + this.$route.params.id
                            });
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.wait(this);
                    });
            },
            // 保存并预览报告方法
            onSaveAndPreviewReport() {
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                const loading = promptUtil.loading(this);
                const formData = this.genFormData(this.reportForm, this.reportForm.type);
                saveCourseReport(qs.stringify(formData))
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            // console.log("res99", res)
                            getStudentReportDetail(
                                qs.stringify({
                                    school_id: storageUtil.readTeacherInfo().school_id,
                                    task_id: this.$route.params.report
                                })
                            )
                                .then(res => {
                                    loading.close();
                                    if (res.code == SUCCESS_CODE) {
                                        if (res.data && res.data == '[]') {
                                            promptUtil.wait(this);
                                            return
                                        }
                                        this.reportDetailInfo = res.data;

                                        this.$refs.reportdialog.start(this.reportDetailInfo);
                                    } else {
                                        promptUtil.wait(this);
                                    }
                                })
                                .catch(err => {
                                    loading.close();
                                    promptUtil.LOG("getStudentReportDetail-err", err);
                                });
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("saveCourseReport-err", err);
                    });


                // console.log(this.reportForm)
                // const loading = promptUtil.loading(this)
                // setTimeout(()=>{ // 模拟异步请求
                //   loading.close()
                //   this.reportDetailVisible=true
                // },500)
            },
            // 打开报告详情对话框回调
            reportDialogOpened() {
                echarts.init(document.getElementById('echart-main')).setOption(this.genECharts(this.reportDetailInfo.dimension))
            },
            // 比较数组内容是否一致
            arrayCompare(src, des) {
                if (src.length != des.length) {
                    return false
                }
                for (var i = 0; i < src.length; i++) {
                    if (src[i].url != des[i].url) {
                        return false
                    }
                }
                return true
            },
            // 报告取消按钮响应事件
            onCancelReport() {
                if (
                    this.reportForm.name == this.rawData.name &&
                    this.reportForm.comment == this.rawData.comment &&
                    this.reportForm.type == this.rawData.type &&
                    this.reportForm.dimensionValues.reflect == this.rawData.dimensionValues.reflect &&
                    this.reportForm.dimensionValues.create == this.rawData.dimensionValues.create &&
                    this.reportForm.dimensionValues.innovate == this.rawData.dimensionValues.innovate &&
                    this.reportForm.dimensionValues.logical == this.rawData.dimensionValues.logical &&
                    this.reportForm.dimensionValues.communicate == this.rawData.dimensionValues.communicate &&
                    this.reportForm.dimensionValues.absorbed == this.rawData.dimensionValues.absorbed &&
                    this.uploadVideoUrl == this.baseVideoUrl && this.arrayCompare(this.uploadPictureArray, this.basePictureArray)
                ) {
                    this.$router.push({
                        path: ROUTER_REPORT_INFO + this.$route.params.id
                    });
                } else {
                    this.cancelDialogVisible = true;
                }
            },
            // 报告确认取消按钮响应事件
            handleCancelStudent() {
                this.$router.push({path: ROUTER_REPORT_INFO + this.$route.params.id});
            },
            // 上传视频文件成功回调
            handleSuccessUploadVideo(response, file, fileList) {
                this.uploadVideoUrl = response;
            },
            // 删除上传的图片监听
            handlePictureRemove(file, fileList) {
                //console.log("file",file.response.substring(55)) //获取oss路径
                delUploadFileByUrl(qs.stringify({url: file.url.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.uploadPictureArray.splice(
                                this.uploadPictureArray.findIndex(item => item === file.url),
                                1
                            );
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        promptUtil.LOG("delUploadFileByUrl-err", err);
                    });
            },
            //上传文件时回调
            handleRrogress(event, file, fileList) {
                this.onReleaseReportDisabled = true
                this.onSaveReportDisabled = true
                this.saveSeeShowDisabled=true

            },
            //上传文件失败回调
            handleErrorUpload(err, file, fileList) {
                promptUtil.err(this, '上传文件失败');
                console.log("err", err)
                console.log("file", file)
            },
            // 上传图片成功回调
            handleSuccessUploadImage(response, file, fileList) {
                this.onReleaseReportDisabled = false
                this.onSaveReportDisabled = false
                this.saveSeeShowDisabled=false
                this.uploadPictureArray.push(response);
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
            // 删除上传的视频监听
            handleVideoRemove(file, fileList) {
                delUploadFileByUrl(qs.stringify({url: file.url.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.uploadVideoUrl = "";
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        promptUtil.LOG("delUploadFileByUrl-err", err);
                    });
            },
            // 预览选中上传的视频
            handleVideoCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImageVisible = true;
            },
            // 上传视频监听函数
            handleVideoBeforeUpload(file) {
                const isMP4 = file.type === "video/mp4";
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message({
                        message: "文件视频超过10MB，请重新选择文件",
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
                    console.log("处理上传视频操作");
                }
                return isMP4 && isLt2M;
            },
            // 将编辑的数据处理成保存可以使用的数据
            analysisMediaFromFormData() {
                if (this.reportForm.videoList.length > 0) {
                    this.uploadVideoUrl = this.reportForm.videoList[0].url;
                }
                if (this.reportForm.pictureList.length > 0) {
                    this.reportForm.pictureList.forEach(item => {
                        this.uploadPictureArray.push(item.url);
                    });
                }
            },
            // 处理从服务器返回的数据
            anysisDataFromServer(res) {
                if (res.type == 2) {
                    // 报告评价
                    res.typeLabel = "任务评价";
                } else {
                    // res.task = {id: 0, name: ""};
                    res.typeLabel = "课程评价";
                }
                if (res.video.length == 0) {
                    res.videoList = [];
                } else {
                    res.videoList = res.video;
                }
                if (res.pictureList.length == 0) {
                    res.pictureList = [];
                }
                return res;
            },
            // 生成formData表单内容
            genFormData(data, type) {
                const formData = {
                    school_id: storageUtil.readTeacherInfo().school_id,
                    teacher_id: storageUtil.readTeacherInfo().id,
                    report_id: this.$route.params.report,
                    task_id: 0,
                    student_id: this.$route.params.id,
                    user_id: storageUtil.readTeacherInfo().id,
                    name: data.name,
                    type: data.type,
                    comment: data.comment,
                    video: this.uploadVideoUrl,
                    picture:
                        this.uploadPictureArray.length == 0
                            ? ""
                            : JSON.stringify(this.uploadPictureArray),
                    dimensionValues: JSON.stringify(data.dimensionValues)
                };
                if (type != 1) {
                    // 任务报告
                    formData.task_id = data.task.id;
                    formData.task = data.task;
                }
                return formData;
            },
            // 六维图像配置信息
            genECharts(valueArr) {
                var option = {
                    radar: [
                        {
                            axisLine: {lineStyle: {color: "rgba(255, 255, 255, 0.5)"}},
                            splitLine: {lineStyle: {color: "rgba(255, 255, 255, 0.5)"}}
                        },
                        {
                            indicator: [
                                {text: "逻辑思维", max: 5, color: "rgba(0, 0, 0, 1)"},
                                {text: "专注力", max: 5, color: "rgba(0, 0, 0, 1)"},
                                {text: "思考力", max: 5, color: "rgba(0, 0, 0, 1)"},
                                {text: "沟通力", max: 5, color: "rgba(0, 0, 0, 1)"},
                                {text: "创造力", max: 5, color: "rgba(0, 0, 0, 1)"},
                                {text: "创新力", max: 5, color: "rgba(0, 0, 0, 1)"}
                            ],
                            center: ["50%", "50%"],
                            radius: 110
                        }
                    ],
                    series: [
                        {
                            type: "radar",
                            radarIndex: 1,
                            data: [
                                {
                                    value: valueArr,
                                    areaStyle: {
                                        normal: {
                                            opacity: 0.9,
                                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                                                {color: "#02a2ff", offset: 0},
                                                {color: "#fff", offset: 1}
                                            ])
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };
                return option;
            },
            clone(origin) {
                let originProto = Object.getPrototypeOf(origin);
                return Object.assign(Object.create(originProto), origin);
            }
        }
    };
</script>

<style scoped>
  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-row {
    margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #eee;
  }

  .bg-purple {
    background: #fff;
  }

  .bg-purple-light {
    background: #fff;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .grid1-content {
    border-radius: 4px;
    min-height: 46px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .fs {
    font-size: 18px;
    line-height: 2.5;
    color: #00a2ff;
    font-weight: bold;
  }

  h4 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    color: #00a2ff;
  }

  .ahref {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: #00a2ff;
    display: block;
  }

  .ml a {
    text-align: center;
  }
</style>
