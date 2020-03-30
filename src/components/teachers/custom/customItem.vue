<template>
    <div>
      <!-- 面包屑 -->
      <el-row>
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card shadow="always" style="margin-top: 20px;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="课时名称" prop="name">
            <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="简要介绍" prop="desc">
            <el-input v-model="ruleForm.desc" style="width: 300px" type="textarea" :rows="2" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="教学工具" prop="desc">
            <el-input v-model="ruleForm.tool" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="课时排序" prop="sort">
            <el-slider v-model="ruleForm.sort" :min="0" :max="1000" style="width: 300px"></el-slider>
          </el-form-item>
          <el-form-item label="教案名称" prop="planName">
            <el-input v-model="ruleForm.planName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="教案上传" prop="plan">
            <el-upload
              :headers='headers'
              :file-list="ruleForm.planList"
              class="upload-demo"
              style="width: 300px"
              :limit="1"
              :action="uploadAction"
              :on-remove="handlePlanRemove"
              :on-success="handlePlanSuccess"
              :before-upload="beforePlanUpload">
              <el-button size="small" type="primary">点击上传教案</el-button>
              <div slot="tip" class="el-upload__tip">只能上传小于100M的PDF文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="课件名称" prop="coursewareName">
            <el-input v-model="ruleForm.coursewareName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="课件上传" prop="courseware">
            <el-upload
              :file-list="ruleForm.coursewareList"
              class="upload-demo"
              style="width: 300px"
              :limit="1"
              :action="uploadAction"
              :on-remove="handleCourseRemove"
              :on-success="handleCourseSuccess"
              :before-upload="beforeCourseUpload">
              <el-button size="small" type="primary">点击上传课件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传WORD、PPT、EXECL类Office小于200M的文件</div>
            </el-upload>
          </el-form-item>
<!--          <el-form-item label="视频名称" prop="videoName">-->
<!--            <el-input v-model="ruleForm.videoName" style="width: 300px"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="视频上传" prop="video">-->
<!--            <el-upload-->
<!--              :file-list="ruleForm.videoList"-->
<!--              class="upload-demo"-->
<!--              style="width: 300px"-->
<!--              :limit="1"-->
<!--              :action="uploadLocal"-->
<!--              :disabled="ruleForm.examine==0"-->
<!--              :before-remove="handleVideoBeforeRemove"-->
<!--              :on-remove="handleVideoRemove"-->
<!--              :on-success="handleVideoSuccess"-->
<!--              :before-upload="beforeVideoUpload">-->
<!--              <el-button size="small" type="primary" :disabled="ruleForm.examine==0">点击上传视频</el-button>-->
<!--              <label v-show="ruleForm.examine==0" style="color: orangered;margin-left: 10px">视频待审核</label>-->
<!--              <label v-show="ruleForm.examine==1" style="color: green;margin-left: 10px">已审核通过</label>-->
<!--              <label v-show="ruleForm.examine==2" style="color: darkred;margin-left: 10px">存在违规内容，请重新上传视频</label>-->
<!--              <div slot="tip" class="el-upload__tip">只能上传mp4格式</div>-->
<!--            </el-upload>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="视频封面" prop="picture">-->
<!--            <el-upload-->
<!--              class="avatar-uploader"-->
<!--              :action="uploadAction"-->
<!--              :show-file-list="false"-->
<!--              :on-remove="handlePictureRemove"-->
<!--              :on-success="handlePictureSuccess"-->
<!--              :before-upload="beforePictureUpload">-->
<!--              <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">-->
<!--              <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--            </el-upload>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button v-if="customStore.type=='add'" type="primary" @click="onCreateSubmit" :loading="isAddLoading" :disabled="pictureUploadStatus == 1 || planUploadStatus == 1 || coursewareUploadStatus == 1 || videoUploadStatus == 1">立即创建</el-button>
            <el-button v-if="customStore.type=='edit'" type="primary" @click="onEditSubmit" :loading="isEditLoading" :disabled="pictureUploadStatus == 1 || planUploadStatus == 1 || coursewareUploadStatus == 1 || videoUploadStatus == 1">立即保存</el-button>
            <el-button @click="cancelHandle">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>
<script>
  import {
    qs,
    uploadLocal,
    uploadFileUrl,
    uploadFileFlow,
    handleCustomItemSelf, // 添加、编辑课时
    getCourseItemById, // 根据id获取课时数据
  } from '../../../api/api'
  import '../../../api/restfulapi'
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import staticUtil from "../../../utils/staticUtil";
  import childHeader from '../../component/childHeader'
  import verifyUtil from "../../../utils/verifyUtil";
  export default {
    components:{"als-child-header": childHeader},
    data(){
      return{
        headers:staticUtil.headers(),
        routerConfig: [{name:'自定义课程',to:'/custom'},{name:'自定义课程课时',to:'/custom/see/'+this.$store.state.customCourseHandle.course}],
        pictureUploadStatus: 0, // 0 未上传 1 上传中 2 完成上传
        videoUploadStatus:0, // 0 未上传 1 上传中 2 完成上传
        coursewareUploadStatus:0, // 0 未上传 1 上传中 2 完成上传
        planUploadStatus:0, // 0 未上传 1 上传中 2 完成上传
        customStore: {type:'',course:''},
        uploadAction: uploadFileFlow,
        uploadLocal: uploadLocal,
        categoryArray: [],
        isAddLoading: false, // 创建loading状态
        isEditLoading: false, // 编辑loading状态
        ruleForm: {
          examine: -1, // 视频0 审核中 1 审核通过  2 审核失败  不显示-1
          id: '', // 课时id
          name: '', // 课程名称
          sort: 500, // 课程排序
          planName: "", // 教案名称
          plan: "", // 教案文件 pdf
          desc: "", // 简要介绍
          tool: "", // 教学工具
          picture: '',// 视频封面图地址
          coursewareName: '', // 课件名称
          courseware: '', // 课件文件 ppt
          videoName:'', // 课程视频名称
          video: '', // 课程视频 mp4
          coursewareList:[], // 编辑页中课件返回需要
          planList: [], // 编辑页中教案返回需要
          videoList: [], // 编辑页中视频返回需要
        },
        rules:{
          name: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
            { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
      this.uploadAction = this.uploadAction + "?school_id=" + storageUtil.readTeacherInfo().school_id + "&user_id=" + storageUtil.readTeacherInfo().id
      this.customStore = this.$store.state.customCourseHandle
      let routerPath = ''
      if(this.customStore.type && this.customStore.type=='add'){
        routerPath = '添加自定义课程课时'
      }else{
        routerPath = '编辑自定义课程课时'
      }
      this.routerConfig.push({name:routerPath,to:''})
      if(this.customStore.course && this.customStore.course!='' && this.customStore.course!=0){
        if(this.customStore.type && this.customStore.type=='add'){
          // promptUtil.success(this,'添加课时')
        } else if (this.customStore.type && this.customStore.type=='edit') {
          const loading = promptUtil.loading(this)
          getCourseItemById(qs.stringify({id:this.customStore.item})).then(res=>{
            if(res.code==SUCCESS_CODE){
              this.analysisEditDataFromServer(res.data)
            }
            loading.close()
          }).catch(err=>{
            promptUtil.LOG("getCourseItemById-err",err)
            loading.close()
          })
        }
      }else{
        if(this.$route.params.id){  // 跳转至 查看自定义课程
            this.$router.push({path: ROUTER_CUSTOM_SEE+"/"+this.$route.params.id})
        }else { // 跳转至 自定义课程
          this.$router.push({path: ROUTER_CUSTOM})
        }
      }
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
    },
    methods: {
      cancelHandle(){
        this.$confirm(`数据将无法保存，确定取消吗？`).then(res=>{
          if(res=='confirm'){
            this.$router.push({path: ROUTER_CUSTOM_SEE+"/"+this.$route.params.id})
          }
        }).catch(err=>promptUtil.LOG(err))
      },
      // 解析编辑数据
      analysisEditDataFromServer(data){
        this.ruleForm.id = data.id
        this.ruleForm.name = data.class_name
        this.ruleForm.sort = data.weight
        this.ruleForm.planName = (data.pdf_name && data.pdf_name!="") ? data.pdf_name : '未命名教案'
        this.ruleForm.plan = data.pdf_url
        this.ruleForm.desc = data.con
        this.ruleForm.tool = data.jiaoju
        this.ruleForm.picture = data.video_img_url
        this.ruleForm.coursewareName = (data.ppt_name && data.ppt_name!="") ? data.ppt_name : '未命名课件'
        this.ruleForm.courseware = data.ppt_url
        // this.ruleForm.videoList = JSON.parse(data.video_url)
        if(this.ruleForm.courseware && this.ruleForm.courseware!=''){
          this.ruleForm.coursewareList = [{name: this.ruleForm.coursewareName, url: this.ruleForm.courseware}]
        }
        if(this.ruleForm.plan && this.ruleForm.plan!=''){
          this.ruleForm.planList = [{name: this.ruleForm.planName, url: this.ruleForm.plan}]
        }
        // if(data.video_url && data.video_url!=""){
        //   this.ruleForm.videoName = this.ruleForm.videoList[0].name
        //   this.ruleForm.video = this.ruleForm.videoList[0].url
        //   // 0 审核中 1 审核通过  2 审核失败
        //   this.ruleForm.examine = this.ruleForm.videoList[0].sh
        // }
      },
      // 点击编辑时触发
      onEditSubmit(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.isEditLoading = true
            this.postDataWithAddOrEdit(this.ruleForm.id, promptUtil.loading(this))
          } else {
            promptUtil.warning(this,"请填写必要信息")
            return false;
          }
        })
      },
      // 点击创建时触发
      onCreateSubmit(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.isAddLoading = true
            this.postDataWithAddOrEdit(0, promptUtil.loading(this))
          } else {
            promptUtil.warning(this,"请填写必要信息")
            return false;
          }
        });
      },
      postDataWithAddOrEdit(type, loading){ // add->0 edit->id
        // const videoObj = {url: this.ruleForm.video, name: this.ruleForm.videoName}
        const videoArr = []
        // videoArr.push(videoObj)
        handleCustomItemSelf(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          course_id: this.$route.params.id,
          name: this.ruleForm.name,
          planName: this.ruleForm.planName,
          plan: this.ruleForm.plan,
          courseware: this.ruleForm.courseware,
          coursewareName: this.ruleForm.coursewareName,
          desc: this.ruleForm.desc,
          tool: this.ruleForm.tool,
          videoImg: this.ruleForm.picture,
          sort: this.ruleForm.sort,
          examine: this.ruleForm.examine,
          // video: JSON.stringify(videoArr),
          id:type // add->0 edit->id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(type==0){ // 表示添加
              promptUtil.success(this,'添加成功')
            } else { // 表示编辑
              promptUtil.success(this,'保存成功')
            }
            this.$router.push({path: ROUTER_CUSTOM_SEE+"/"+this.$route.params.id})
          } else {
            promptUtil.warning(this, res.msg)
          }
          this.isAddLoading = false
          this.isEditLoading = false
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("handleCustomItemSelf-err",err)
          this.isAddLoading = false
          loading.close()
        })
      },
      handlePlanRemove(){
        const loading = promptUtil.loading(this)
        setTimeout(()=>{
          this.planUploadStatus = 0
          // // 开始进行审核  0不显示  1审核中 2已通过
          // this.ruleForm.examine = -1
          loading.close()
        },1000)
      },
      handlePlanSuccess(res, file){
          if(res.code==0){ // 失败
            promptUtil.warning(this, res.msg)
              this.planUploadStatus = 0
              this.ruleForm.planList = []
          }else{
              this.ruleForm.plan = file.response;
              this.planUploadStatus = 2
          }
      },
      beforePlanUpload(file) {
        const isPDF = file.type === "application/pdf";
        const isLt50M = file.size / 1024 / 1024 < 100;
        if (!isPDF) {
          this.$message.error('上传文件只能是PDF格式!');
        }
        if (!isLt50M) {
          this.$message.error('上传头像图片大小不能超过 100MB!');
        }
        const status = isPDF && isLt50M
        if(status){
          this.planUploadStatus = 1
        }
        return status
      },
      handleCourseRemove(){
        const loading = promptUtil.loading(this)
        setTimeout(()=>{
          this.coursewareUploadStatus = 0
          // 开始进行审核  0不显示  1审核中 2已通过
          this.ruleForm.examine = -1
          loading.close()
        },1000)
      },
      handleCourseSuccess(res, file){
          if(res.code==0){ // 失败
              this.ruleForm.coursewareList = []
              this.coursewareUploadStatus = 0
              promptUtil.warning(this, res.msg)
          }else{
              this.ruleForm.courseware = file.response;
              this.coursewareUploadStatus = 2
          }
      },
      beforeCourseUpload(file) {
        const isPPT = verifyUtil.isOfficeSuffix(file.name);
        const isLt100M = file.size / 1024 / 1024 < 200;
        if (!isPPT) {
          this.$message.error('上传文件只能是office格式!');
        }
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 200MB!');
        }
        const status = isPPT && isLt100M
        if(status){
          this.coursewareUploadStatus = 1
        }
        return status
      },
      handleVideoSuccess(res, file){
        if(file && file.response && file.response.code==1){
          this.ruleForm.video = file.response.data
          // 开始进行审核  0不显示  1审核中 2已通过
          this.ruleForm.examine = 0
          this.videoUploadStatus = 2
        }else{
          promptUtil.warning(this,file.response.msg)
        }
      },
      beforeVideoUpload(file) {
        const isVIDEO = file.type==='video/mp4';
        const isLt150M = file.size / 1024 / 1024 < 150;
        if (!isVIDEO) {
          this.$message.error('上传文件只能是mp4格式!');
        }
        if (!isLt150M) {
          this.$message.error('上传头像图片大小不能超过150MB!');
        }
        const status = isVIDEO && isLt150M
        if(status){
          this.videoUploadStatus = 1
        }
        return status
      },
      handlePictureRemove(){
        const loading = promptUtil.loading(this)
        setTimeout(()=>{
          this.pictureUploadStatus = 0
          // 开始进行审核  0不显示  1审核中 2已通过
          this.ruleForm.examine = -1
          loading.close()
        },1000)
      },
      handlePictureSuccess(res, file) {
        // this.ruleForm.picture = file.response // oss地址
        this.ruleForm.picture = file.response;
        this.pictureUploadStatus = 2
      },
      beforePictureUpload(file) {
        const isJPG = file.type === "image/png" || file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是JPG/PNG格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        const status = isJPG && isLt2M
        if(status){
          this.pictureUploadStatus = 1
        }
        return status
      },
      handleVideoRemove(){
        const loading = promptUtil.loading(this)
        setTimeout(()=>{
          this.videoUploadStatus = 0
          // 开始进行审核  0不显示  1审核中 2已通过
          this.ruleForm.examine = -1
          loading.close()
        },1000)
      },
      handleVideoBeforeRemove(file, fileList){
        this.ruleForm.video = file.response
        return this.$confirm(`上传视频需要进行重新审核，确认要删除吗？`)
      },
    }
  }
</script>

<style scoped>
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
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .avatar-uploader {
    width: 162px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 162px;
    height: 162px;
    line-height: 162px;
    text-align: center;
  }
  .avatar {
    width: 162px;
    height: 162px;
    display: block;
  }
</style>
