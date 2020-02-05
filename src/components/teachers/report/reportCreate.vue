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
            <el-select v-model="currentRateLabel" placeholder="请选择评价类型" :disabled="disabledType">
              <el-option label="课程评价" value="1"></el-option>
              <el-option label="任务评价" value="2"></el-option>
            </el-select>
<!--            课程评价关联-->
            <el-select
              v-model="relatedClass.current.name"
              placeholder="请选择课程任务"
              v-show="isShowClassSelect"
              @change="handleRelatedClass"
              :disabled="relatedTasksdisabled"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in relatedClass.taskList"
                :key="item.id"
              ></el-option>
            </el-select>
<!--            任务评价关联-->
            <el-select
              v-model="relatedTasks.current.name"
              placeholder="请选择关联任务"
              v-show="isShowTaskSelect"
              @change="handleRelatedTasks"
              :disabled="relatedTasksdisabled"
            >
              <el-option
                v-for="item in relatedTasks.taskList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
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
              :on-preview="handleVideoCardPreview"
              :before-upload="handleVideoBeforeUpload"
              :on-success="handleSuccessUploadVideo"
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
          <!--          <span>报告已经编辑并且没有进行保存，请问确认要继续取消编辑吗？</span>-->
          <span>报告已经编辑，请问确认要继续取消编辑吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCancelStudent">确 定</el-button>
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
  </div>
</template>
<script>
    const echarts = require("echarts");
    import reportDialog from "./reportDialog.vue";
    import vueQr from "vue-qr";
    import promptUtil from "../../../utils/promptUtil";
    import storageUtil from "../../../utils/storageUtil";
    import '../../../api/restfulapi';
    import '../../../router/router'
    import {
        qs,
        uploadFileUrl,
        delUploadFileByUrl,
        createCourseReport,
        releaseCreateCourseReport,
        getStudentReportListWithNoCreat,
        getStudentReportDetail,
        getStudentReportListWithNoCreatCourse
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'
    export default {
        components: {"vueQr":vueQr, "reportDialog": reportDialog, "als-child-header": childHeader},
        data() {
            return {
              routerConfig: [{name:'学情报告',to:'/report'},{name:this.$store.state.currentStudentName + '的学情报告',to:ROUTER_REPORT_INFO + this.$route.params.id},{name:'创建报告',to:''}],
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
                uploadPictureArray: [], // 上传图片由服务器返回的图片地址
                uploadVideoUrl: "", // 上传视频由服务器返回的视频地址
                isShowTaskSelect: false, // 是否显示任务关联select
                isShowClassSelect:false,// 是否显示课程关联select
                currentRateLabel: "", // 当前评价类型{课程评价，任务评价}
                disabledType: false,
                saveSeeShowDisabled: false,
                relatedTasksdisabled:false,
                saveSeeShow: false,
                reportForm: {
                    // 创建报告内容信息
                    name: "", // 报告名称
                    type: "", // 评价类型
                    task: {
                        current: {id: 1, name: ""},
                        taskList: [
                            {id: 1, name: ""}
                        ]
                    }, // 任务id
                    comment: "", // 详细点评
                    dimensionValues: {
                        reflect: 3,
                        create: 3,
                        innovate: 3,
                        logical: 3,
                        communicate: 3,
                        absorbed: 3
                    }, // 核心能力
                    video: "",
                    picture: [] // 上传图片信息
                },
                relatedTasks: {current: {id: "", name: ""}, taskList: []}, // 关联任务相关属性
                relatedClass: {current: {id: "", name: ""}, taskList: []}, // 关联课程相关属性
                sendrelatedClassIdTable:{id:"",table:""},
                saveSeeId: '',
                reportDetailInfo: [],
                releaseDialogVisible:false,//是否显示发布dialog
            };

        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            if (this.$store.state.createRate.status == 1) {
                // this.disabledType = true;
                this.relatedTasksdisabled = true;
                // 表示从任务管理进入创建报告
                if( this.currentRateLabel = "任务评价"){
                    this.relatedTasks.current.name = this.$store.state.createRate.taskName;
                    // coding...
                    // 获取store中的数据
                    // this.taskName=this.$store.state.createRate.taskName
                    this.isShowTaskSelect = true;
                }else{
                    this.isShowClassSelect=true
                }
            }
            this.reportRouterUrl = {
                path: ROUTER_REPORT_INFO + this.$route.params.id
            };
            // const loading = promptUtil.loading(this)
            // 1.初始化
        },
        methods: {
            // 响应关联任务select事件
            handleRelatedTasks(val) {
                // console.log("==================")
                // console.log(val)
            },
            handleRelatedClass(val){
                this.sendrelatedClassIdTable.id=val
                if(this.relatedClass.taskList.length>0){
                    this.relatedClass.taskList.forEach(item=>{
                        if(item.id==val){
                            this.sendrelatedClassIdTable.table=item.table
                        }
                    })
                }
            },
            //  保存报告处理方法
            onSaveReport() {
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                if (
                    this.reportForm.comment == null ||
                    this.reportForm.comment.trim() == ""
                ) {
                    promptUtil.warning(this, "请填写详细点评");
                    return;
                }
                if(this.currentRateLabel==""){
                    promptUtil.warning(this, "请选择任务评价");
                    return;
                }
                if (this.reportForm.type == 1 && this.relatedClass.current.name == "") {
                    promptUtil.warning(this, "请选择关联课程");
                    return;
                }else if((this.reportForm.type == 2 && this.relatedTasks.current.name == "")){
                    promptUtil.warning(this, "请选择关联任务程");
                    return;
                }
                const loading = promptUtil.loading(this);
                const formData = this.genFormData(
                    this.reportForm,
                    this.reportForm.type,
                    this.relatedTasks.current.name
                );
                // console.log("formData",formData)
                // return
                createCourseReport(qs.stringify(formData)).then(res => {
                    loading.close()
                    if (res.code == SUCCESS_CODE) {
                        // console.log(res.data)
                        promptUtil.success(this, res.msg)
                        this.$router.replace({path: ROUTER_REPORT_INFO + this.$route.params.id})
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.warning(this, res.msg)
                    } else if (res.code == ERROR_CODE_) {
                        promptUtil.warning(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG("createCourseReport-err", err)
                })
            },
            // 发布报告处理方法
            onReleaseReport() {
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                if (
                    this.reportForm.comment == null ||
                    this.reportForm.comment.trim() == ""
                ) {
                    promptUtil.warning(this, "请填写详细点评");
                    return;
                }
                if(this.currentRateLabel==""){
                    promptUtil.warning(this, "请选择任务评价");
                    return;
                }
                if (this.reportForm.type == 1 && this.relatedClass.current.name == "") {
                    promptUtil.warning(this, "请选择关联课程");
                    return;
                }else if((this.reportForm.type == 2 && this.relatedTasks.current.name == "")){
                    promptUtil.warning(this, "请选择关联任务程");
                    return;
                }
                this.releaseDialogVisible=true
            },
            //发布dialog中的确定按钮
            handleReleaseStudent(){
                const loading = promptUtil.loading(this);
                const formData = this.genFormData(
                    this.reportForm,
                    this.reportForm.type,
                    this.relatedTasks.current.name
                );
                releaseCreateCourseReport(qs.stringify(formData))
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            this.$router.replace({
                                path: ROUTER_REPORT_INFO + this.$route.params.id
                            });
                        } else {
                            loading.close();
                            promptUtil.warning(this, res.msg)
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.wait(this)
                    });
            },
            // 保存并预览报告方法
            onSaveAndPreviewReport() {
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                if (
                    this.reportForm.comment == null ||
                    this.reportForm.comment.trim() == ""
                ) {
                    promptUtil.warning(this, "请填写详细点评");
                    return;
                }
                if(this.currentRateLabel==""){
                    promptUtil.warning(this, "请选择任务评价");
                    return;
                }
                if (this.reportForm.type == 1 && this.relatedClass.current.name == "") {
                    promptUtil.warning(this, "请选择关联课程");
                    return;
                }else if((this.reportForm.type == 2 && this.relatedTasks.current.name == "")){
                    promptUtil.warning(this, "请选择关联任务程");
                    return;
                }
                //保存拿到taskId
                //
                const loading = promptUtil.loading(this);
                const formData = this.genFormData(
                    this.reportForm,
                    this.reportForm.type,
                    this.relatedTasks.current.name
                );
                createCourseReport(qs.stringify(formData)).then(res => {
                    loading.close()
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, res.msg)
                        this.saveSeeId = res.data[0].id
                        getStudentReportDetail(
                            qs.stringify({
                                school_id: storageUtil.readTeacherInfo().school_id,
                                task_id: this.saveSeeId
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
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.warning(this, res.msg)
                    } else if (res.code == ERROR_CODE_) {
                        promptUtil.warning(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG("createCourseReport-err", err)
                })
            },
            // 打开报告详情对话框回调
            reportDialogOpened() {
                echarts
                    .init(document.getElementById("echart-main"))
                    .setOption(
                        staticUtil.genECharts(this.reportDetailInfo.dimension, echarts)
                    );
            },
            //校验表单
            validateForm(){
                if (this.reportForm.name == null || this.reportForm.name.trim() == "") {
                    promptUtil.warning(this, "请填写报告名称");
                    return;
                }
                if (
                    this.reportForm.comment == null ||
                    this.reportForm.comment.trim() == ""
                ) {
                    promptUtil.warning(this, "请填写详细点评");
                    return;
                }
                if(this.currentRateLabel==""){
                    promptUtil.warning(this, "请选择任务评价");
                    return;
                }
                if (this.reportForm.type == 1 && this.relatedClass.current.name == "") {
                    promptUtil.warning(this, "请选择关联课程");
                    return;
                }else if((this.reportForm.type == 2 && this.relatedTasks.current.name == "")){
                    promptUtil.warning(this, "请选择关联任务程");
                    return;
                }
                return
            },
            // 报告取消按钮响应事件
            onCancelReport() {
                if (
                    this.reportForm.name === "" &&
                    this.reportForm.type === "" &&
                    this.reportForm.comment === "" &&
                    this.reportForm.video === "" &&
                    this.reportForm.picture.length === 0 &&
                    this.reportForm.dimensionValues.reflect === 3 &&
                    this.reportForm.dimensionValues.create === 3 &&
                    this.reportForm.dimensionValues.innovate === 3 &&
                    this.reportForm.dimensionValues.logical === 3 &&
                    this.reportForm.dimensionValues.communicate === 3 &&
                    this.reportForm.dimensionValues.absorbed === 3
                ) {
                    this.$router.push({
                        path: ROUTER_REPORT_INFO + this.$route.params.id
                    });
                } else {
                    this.cancelDialogVisible = true;
                }
            },
            // 上传视频文件成功回调
            handleSuccessUploadVideo(response, file, fileList) {
                this.uploadVideoUrl = response;
                this.reportForm.video = this.uploadVideoUrl;
            },
            //上传文件失败回调
            handleErrorUpload(err, file, fileList) {
                promptUtil.wait(this);
            },
            //正在上传时文件失败回调
            handleRrogress(event, file, fileList) {
                this.onReleaseReportDisabled = true
                this.onSaveReportDisabled = true
                this.saveSeeShowDisabled=true
            },
            // 上传图片成功回调
            handleSuccessUploadImage(response, file, fileList) {
                this.onReleaseReportDisabled = false
                this.onSaveReportDisabled = false
                this.saveSeeShowDisabled=false
                this.uploadPictureArray.push(response);
                this.reportForm.pictureList = this.uploadPictureArray;
            },
            // 报告确认取消按钮响应事件
            handleCancelStudent() {
                this.$router.push({path: ROUTER_REPORT_INFO + this.$route.params.id});
            },
            // 删除上传的图片监听
            handlePictureRemove(file, fileList) {
                delUploadFileByUrl(qs.stringify({url: file.response.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.uploadPictureArray.splice(
                                this.uploadPictureArray.findIndex(item => item === file.response),
                                1
                            );
                            this.reportForm.pictureList = this.uploadPictureArray;
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        promptUtil.LOG("delUploadFileByUrl-err", err);
                    });
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
                    this.reportForm.picture.push(file.uid);
                }
                return isJPG && isLt2M;
            },
            // 删除上传的视频监听
            handleVideoRemove(file, fileList) {
                if (!file.response) {
                    return
                }
                delUploadFileByUrl(qs.stringify({url: file.response.substring(55)}))
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.reportForm.video = "";
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
                    this.reportForm.video = file.uid;
                }
                return isMP4 && isLt2M;
            },
            // 生成formData表单内容
            genFormData(data, type, task) {
                //console.log('data', data)
                if (this.$store.state.createRate.status == 1) {
                    // 从任务管理进入到创建报告
                    data.type = 2;
                    task = parseInt(this.$store.state.createRate.taskId);
                }
                const formData = {
                    school_id: storageUtil.readTeacherInfo().school_id,
                    teacher_id: storageUtil.readTeacherInfo().id,
                    user_id: storageUtil.readTeacherInfo().id,
                    task_id: 0,
                    student_id: this.$route.params.id,
                    name: data.name,
                    type: data.type,
                    comment: data.comment,
                    video: data.video,
                    picture: JSON.stringify(data.pictureList),
                    dimensionValues: JSON.stringify(data.dimensionValues),
                    course_id:this.sendrelatedClassIdTable.id,
                    course_table:this.sendrelatedClassIdTable.table
                };
                if (type != 1) {
                    // 任务报告
                    formData.task = data.task;
                    formData.task_id = task;
                }
                return formData;
            }
        },
        watch: {
            currentRateLabel: {
                handler(newVal) {
                    if (this.$store.state.createRate.status == 1) {
                        return;
                    }
                    this.reportForm.type = newVal;
                    // if (newVal == 2) {
                        const loading = promptUtil.loading(this);
                        getStudentReportListWithNoCreatCourse(
                            qs.stringify({
                                school_id: storageUtil.readTeacherInfo().school_id,
                                student_id: this.$route.params.id,
                                report_type:this.currentRateLabel==1?'course':'task'
                            })
                        )
                            .then(res => {
                                loading.close();
                                if (res.code == SUCCESS_CODE) {
                                    if(newVal == 2){
                                        this.relatedClass.current.name=""
                                        this.isShowClassSelect=false
                                        if (res.data == '[]') {
                                            promptUtil.warning(this, res.msg)
                                        } else {
                                            this.isShowClassSelect=false
                                            this.isShowTaskSelect = true;
                                            this.relatedTasks.taskList = res.data.list;
                                        }
                                    }else{
                                        if (res.data == '[]') {
                                            promptUtil.warning(this, res.msg)
                                        }else{
                                            this.relatedTasks.current.name=""
                                            this.isShowTaskSelect = false;
                                            //课程评价显示关联框
                                            this.isShowClassSelect=true
                                            this.relatedClass.taskList = res.data.list;
                                            //  this.relatedClass.taskList.push({task_name: "例子：任务名称"})
                                        }
                                    }
                                } else {
                                    promptUtil.wait(this);
                                    this.$router.replace({
                                        path: ROUTER_REPORT_INFO + this.$route.params.id
                                    });
                                }
                            })
                            .catch(err => {
                                loading.close();
                                this.$router.replace({
                                    path: ROUTER_REPORT_INFO + this.$route.params.id
                                });
                                promptUtil.LOG("getStudentReportListWithNoCreat-err", err);
                            });
                    // } else {
                    //     this.isShowTaskSelect = false;
                    //     //课程评价显示关联框
                    //     this.isShowClassSelect=true
                    //     this.relatedClass.taskList.push({task_name: "例子：任务名称"})
                    // }
                }
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
