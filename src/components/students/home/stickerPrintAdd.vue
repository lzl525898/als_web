<template>
  <div>


    <!--        <el-form-item label="活动名称" prop="name">-->
    <!--          <el-input v-model="ruleForm.name"></el-input>-->
    <!--        </el-form-item>-->
    <!--        ALS1138782512-->


    <el-row>
      <el-col :span="24">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="任务名称" style="width: 50%;">
            <el-input v-model="ruleForm.taskName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="班级" style="width: 50%;">
            <el-input v-model="ruleForm.class" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="名称" style="width: 50%;" prop="studentTaskName">
            <el-input v-model="ruleForm.studentTaskName" placeholder="请输入报告名称"></el-input>
          </el-form-item>
          <!--          <el-form-item label="上传视频">-->
          <!--            <el-upload-->
          <!--              :action="uploadVideoAction"-->
          <!--              list-type="picture-card"-->
          <!--              :limit="1"-->
          <!--              :on-remove="handleVideoRemove"-->
          <!--              :on-preview="handleVideoCardPreview"-->
          <!--              :before-upload="handleVideoBeforeUpload"-->
          <!--              :on-success="handleSuccessUploadVideo"-->
          <!--              name="file"-->
          <!--            >-->
          <!--              <div slot="trigger">-->
          <!--                <span style="color:#888888">添加视频</span>-->
          <!--              </div>-->
          <!--              <div slot="tip" class="el-upload__tip">只能上传video/mp4文件，且不超过10MB，建议小于60秒</div>-->
          <!--            </el-upload>-->
          <!--            <el-dialog :visible.sync="dialogImageVisible" :fullscreen="true">-->
          <!--              <video controls="controls" autoplay="autoplay">-->
          <!--                <source :src="dialogImageUrl" type="video/mp4">-->
          <!--                Your browser does not support the video tag.-->
          <!--              </video>-->
          <!--            </el-dialog>-->
          <!--          </el-form-item>-->


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
          <!--          <el-form-item label="上传照片" prop="pictureList">-->
          <!--            <el-upload-->
          <!--              :action="uploadPictureAction"-->
          <!--              list-type="picture-card"-->
          <!--              :limit="9"-->
          <!--              :on-remove="handlePictureRemove"-->
          <!--              :on-preview="handlePictureCardPreview"-->
          <!--              :before-upload="handlePictureBeforeUpload"-->
          <!--              :on-success="handleSuccessUploadImage"-->
          <!--              :on-error="handleErrorUpload"-->
          <!--              :on-progress="handleRrogress"-->
          <!--              :file-list="ruleForm.pictureList"-->

          <!--            >-->
          <!--              &lt;!&ndash;              :file-list="ruleForm.pictureList"&ndash;&gt;-->
          <!--              <div slot="trigger">-->
          <!--                <span style="color:#888888">添加图片</span>-->
          <!--              </div>-->
          <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多9张</div>-->
          <!--            </el-upload>-->
          <!--            <el-dialog :visible.sync="dialogImageVisible" :fullscreen="true">-->
          <!--              <img width="100%;" height="100%;" :src="dialogImageUrl" alt>-->
          <!--            </el-dialog>-->
          <!--          </el-form-item>-->
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
    </el-row>
  </div>
</template>

<script>
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import '../../../api/restfulapi';
  import {
    qs,
    uploadFileUrl,
    delUploadFileByUrl,
    saveStudentTypeInformation,
    saveSeedDtailsInformation
  } from "../../../api/api";

  export default {
    data() {
      return {
        disabled: true,
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
          name: '',
          taskName: '',
          class: '',
          video: '',
          studentTaskName: '',
          picture: [],// 上传图片信息
          pictureList: [],
          videoList: []
        },
        rules: {
          studentTaskName: [{required: true, message: '请输入名称', trigger: 'blur'}],
          pictureList: [{required: true, message: '请选择图片', trigger: 'blur'}]

        }
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      // console.log("this.$store.state.studentTaskId.taskName",this.$store.state.studentTaskId)
      // console.log("student_id",storageUtil.readTeacherInfo().id)
      this.ruleForm.taskName = this.$store.state.studentTaskId.taskName
      this.ruleForm.class = this.$store.state.studentTaskId.className
      // //进入查看信息页面回显示

      saveSeedDtailsInformation(qs.stringify({
        task_id: this.$store.state.studentTaskId.taskId,
        user_id: storageUtil.readTeacherInfo().id
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.ruleForm.video = ""
            this.ruleForm.videoList = []
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
          }
        } else if (res.code == ERROR_CODE) {
          promptUtil.error(this, res.msg)
        } else {
          promptUtil.wait(this)
        }
      }).catch(err => {
        promptUtil.LOG("saveSeedDtailsInformation-err", err)
      })


    },
    methods: {
      //发布
      onReleaseType() {
        saveStudentTypeInformation(qs.stringify({
          task_id: this.$store.state.studentTaskId.taskId,
          student_id: storageUtil.readTeacherInfo().id,
          pic: JSON.stringify(this.uploadPictureArray),
          video: this.ruleForm.video,
          title: this.ruleForm.studentTaskName,
          is_submit: 1,
          con: ""
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
        if (this.ruleForm.studentTaskName == "") {
          promptUtil.warning(this, "请输入相关信息")
          return
        }
        if (this.uploadPictureArray.length == 0) {
          promptUtil.warning(this, "请上传图片信息")
          return
        }
        saveStudentTypeInformation(qs.stringify({
          task_id: this.$store.state.studentTaskId.taskId,
          student_id: storageUtil.readTeacherInfo().id,
          pic: JSON.stringify(this.uploadPictureArray),
          video: this.ruleForm.video,
          title: this.ruleForm.studentTaskName,
          is_submit: 0,
          con: ""
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
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
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

    }
  }
</script>

<style scoped>

</style>
