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
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="简要介绍" prop="desc">
            <el-input v-model="ruleForm.desc" style="width: 300px" type="textarea" :rows="2" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="教学工具" prop="desc">
            <el-input v-model="ruleForm.tool" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="课程类别" prop="category">
            <el-checkbox-group v-model="ruleForm.category" >
              <el-checkbox :label="item.id" name="category" v-for="item in categoryArray" :key="item.id">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="课程封面" prop="picture">
            <el-upload
              :headers="headers"
              class="avatar-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :on-success="handlePictureSuccess"
              :before-upload="beforePictureUpload">
              <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程排序" prop="sort">
            <el-slider v-model="ruleForm.sort" :min="0" :max="1000" style="width: 300px"></el-slider>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onCreateSubmit" :disabled="pictureUploadStatus==1">立即创建</el-button>
            <el-button @click="isCloseCustomShow=true">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-dialog title="提示" :visible.sync="isCloseCustomShow" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-question"></i>
          </el-col>
          <el-col :span="20">
            <span>取消后填写的数据将无法保存，确认要取消吗？</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isCloseCustomShow = false">取 消</el-button>
          <el-button type="primary" @click="closeCustomShow">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import {
    qs,
    uploadFileUrl,
    uploadFileFlow,
    addCustomSelf,
    getCustomCategorySelf
  } from '../../../api/api';
  import "../../../api/restfulapi";
  import stringUtil from "../../../utils/stringUtil";
  import storageUtil from "../../../utils/storageUtil";
  import promptUtil from "../../../utils/promptUtil";
  import staticUtil from '../../../utils/staticUtil';
  import childHeader from '../../component/childHeader';
  export default {
    components: {"als-child-header": childHeader},
    data(){
      return{
        headers:{},
        routerConfig: [{name: '自定义课程', to: '/custom'},{name: '添加自定义课程', to: ''}],
        uploadAction: uploadFileFlow,
        categoryArray: [],
        isCloseCustomShow: false,
        pictureUploadStatus: 0, // 0 未上传 1 上传中 2 完成上传
        ruleForm: {
          name: '', // 课程名称
          category: [], // 课程阶段
          age: [], //适合年龄
          picture: '', // 课程封面
          sort: 500, // 课程排序
          plan: "", // 教案文件 pdf
          desc: "", // 简要介绍
          tool: "", // 教学工具
          courseware: '', // 课件文件 ppt
          video: '', // 课程视频 mp4
        },
        rules:{
          name: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
            { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      this.uploadAction = this.uploadAction + "?school_id=" + storageUtil.readTeacherInfo().school_id + "&user_id=" + storageUtil.readTeacherInfo().id
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      this.initData()
    },
    methods:{
      initData(){
        this.headers = staticUtil.headers()
          getCustomCategorySelf(qs.stringify({school_id: storageUtil.readTeacherInfo().school_id})).then(res=>{
          if (res.code == SUCCESS_CODE) {
            this.ruleForm.category = [];
            if (res.data != '[]') {
              this.categoryArray = this.shuffleCategory(res.data)
            }
          } else {
            promptUtil.wait(this);
          }
        }).catch(err=>promptUtil.LOG("getCustomCategorySelf-ERR",err))
      },
      // 清洗类别
      shuffleCategory(data){
        let tmpArray = []
        data.map(category=>{
          category.category.map(item=>tmpArray.push(item))
        })
        return tmpArray
      },
      onCreateSubmit(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const ids = stringUtil.array2String(this.ruleForm.category,",")
            addCustomSelf(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              user_id: storageUtil.readTeacherInfo().id,
              category:ids,
              desc:this.ruleForm.desc,
              name: this.ruleForm.name,
              picture: this.ruleForm.picture,
              sort: this.ruleForm.sort,
              tool: this.ruleForm.tool,
              course_id: 0, // 添加 0 编辑 id
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                this.$router.push({path: ROUTER_CUSTOM})
              }else{
                promptUtil.warning(this,res.msg ? res.msg : '请稍后再试')
              }
            }).catch(err=>promptUtil.LOG("addCustomSelf-err",err))
          } else {
            promptUtil.warning(this,"请填写必要信息")
            return false;
          }
        });
      },
      closeCustomShow(){
        this.isCloseCustomShow = false
        this.$router.push({path: ROUTER_CUSTOM})
      },
      handlePictureSuccess(res, file) {
        if(res.code==0){ // 失败
            promptUtil.warning(this, res.msg)
            this.pictureUploadStatus = 0
        }else{
            // this.ruleForm.picture = file.response // oss地址
            this.ruleForm.picture = file.response;
            this.pictureUploadStatus = 2
        }
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
  .el-icon-question {
    margin-top: -10px;
  }
  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }
</style>
