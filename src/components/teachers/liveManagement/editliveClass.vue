<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/liveManagement' }">直播管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>

    <!--      表单-->
    <div class="theRecycleBinBox">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="直播课堂标题：" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入直播课堂标题"></el-input>
        </el-form-item>
        <!--          <el-form-item label="直播课堂分类：" prop="classification">-->
        <!--            <el-input v-model="ruleForm.classification" placeholder="请输入直播课堂分类"></el-input>-->
        <!--          </el-form-item>-->
        <!--            <el-form-item label="主讲人：" prop="create">-->
        <!--              <el-input v-model="ruleForm.create" placeholder="请输入主讲人"></el-input>-->
        <!--            </el-form-item>-->
        <!--          <el-form-item label="主讲人：" prop="create">-->
        <!--            <el-select v-model="currentSelectId" clearable placeholder="请选择"  @change="selectChange">-->
        <!--              <el-option-->
        <!--                v-for="item in getAllTeacher"-->
        <!--                :key="item.teacherId"-->
        <!--                :label="item.teacherName"-->
        <!--                :value="item.teacherId"-->
        <!--              >-->
        <!--              </el-option>-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--                    <el-form-item label="选择学校：" :required="true">-->
        <!--                      <el-checkbox-group v-model="currentCheckBox">-->
        <!--                        <el-checkbox-->
        <!--                          v-for="item in allSchool"-->
        <!--                          :key="item.addSchoolId"-->
        <!--                          :label="item.addSchoolId"-->
        <!--                          :value="item.addSchoolId"-->
        <!--                        >{{item.addSchoolName}}</el-checkbox>-->
        <!--                      </el-checkbox-group>-->
        <!--                    </el-form-item>-->


        <el-form-item label="选择学校：" :required="true">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="currentCheckBox" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="item in allSchool"
              :key="item.addSchoolId"
              :label="item.addSchoolName"
              :value="item.addSchoolId"
            >{{item.addSchoolName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <!--        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">-->
        <!--          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>-->
        <!--        </el-checkbox-group>-->

        <!-- 封面-->
        <!--        <el-form-item label="封面：" :required="true">-->
        <!--          <el-upload-->
        <!--            :action="uploadPictureAction"-->
        <!--            list-type="picture-card"-->
        <!--            :limit="1"-->
        <!--            :on-remove="handlePictureRemove"-->
        <!--            :on-preview="handlePictureCardPreview"-->
        <!--            :before-upload="handlePictureBeforeUpload"-->
        <!--            :on-success="handleSuccessUploadImage"-->
        <!--            :on-error="handleErrorUpload"-->
        <!--            :on-progress="handleRrogress"-->
        <!--            :file-list="ruleForm.pictureList"-->
        <!--            ref="delClassUpload"-->

        <!--          >-->
        <!--            <div slot="trigger">-->
        <!--              <span style="color:#888888">添加图片【必填】</span>-->
        <!--            </div>-->
        <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>-->
        <!--          </el-upload>-->
        <!--          <el-dialog :visible.sync="dialogImageVisibleAdd" size="tiny">-->
        <!--            <img width="100%" :src="dialogImageUrl" alt="">-->
        <!--          </el-dialog>-->
        <!--        </el-form-item>-->

        <el-form-item label="直播简介：" prop="liveDescribed">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入信息"
            v-model="ruleForm.liveDescribed">
          </el-input>
        </el-form-item>
        <!--          <el-form-item label="开播时间" prop="shelfUnderTimeData" :required="true">-->
        <!--            <el-date-picker-->
        <!--              v-model="ruleForm.shelfUnderTimeData"-->
        <!--              type="datetimerange"-->
        <!--              @change="liveTimeChange"-->
        <!--              range-separator="至"-->
        <!--              start-placeholder="开始日期"-->
        <!--              end-placeholder="结束日期">-->
        <!--            </el-date-picker>-->
        <!--          </el-form-item>-->
        <el-form-item>
          <span style="font-size: 12px;color: #606266">结束时间与开始时间间隔需大于15分钟并小于24小时</span>
        </el-form-item>
        <el-form-item label="最大并发量：" prop="maxAmount">
          <!--              <el-input v-model="ruleForm.maxAmount" placeholder="请输入最大并发量"></el-input>-->
          <el-slider v-model="ruleForm.maxAmount" :max="10" :min="1"></el-slider>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveAddLiveInformation" :disabled="saveAddInfoDisabled">保存</el-button>
          <!--<el-button type="primary" @click="editAgencyInfo" v-if="editAgencyInfoBtn">编辑</el-button>-->
        </el-form-item>
      </el-form>
    </div>


  </div>
</template>

<script>
    import '../../../api/restfulapi';
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import staticUtil from "../../../utils/staticUtil";
    import {
        qs,
        uploadFileUrl,
        getTeacherList,
        getLiveManagementList,
        saveAddInformation,
        getAllSchool,
        searchLiveList,
        disableAddRecycleBin,
        removeDisable,
        deleteTableListCourseInformation,
        editInformation,
        editSaveAddInformation

    } from "@/api/api.js";

    export default {
        data() {
            return {
                allSchoolLable: [],
                isIndeterminate: true,
                checkAll: false,
                currentCheckBox: [],
                currentSelectId: '',//教师id赋值
                saveSchoolIdArray: [],
                sendSchoolArray: [],//发送给后台的schoolArrayId
                uploadPictureAction: uploadFileUrl, // 上传图片action地址
                dialogImageVisibleAdd: false,//显示添加图片组件对话框
                saveAddInfoDisabled: false,//图片未上传成功disabled保存机构信息按钮
                dialogImageUrl: "", // 上传图片组件中图片地址
                liveUsPictureList: [],//添加信息图片地址
                currentSelectTeacher: '',//当前选中的教师
                getAllTeacher: [],
                allSchool: [],//所有学校
                ruleForm: {
                    title: '',
                    // classification: '',
                    create: '',
                    maxAmount: 1,
                    picture: [], // 上传图片信息
                    liveDescribed: '',//直播简介
                    shelfTime: '',
                    underTime: '',
                    shelfUnderTimeData: [],
                    searchShelUnderTime: [],
                    pictureList: [], // 上传图片信息
                    selectSchool: [],//获取所有学校
                },
                //验证规则
                rules: {
                    title: [
                        {required: true, message: '请输入直播课堂标题', trigger: 'blur'},
                    ],
                    create: [
                        {required: true, message: '请输入主讲人', trigger: 'blur'},
                    ],
                    liveDescribed: [
                        {required: true, message: '请输入直播简介', trigger: 'blur'},
                    ]
                },
            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", "/liveManagement");
            //获取所有的学校
            getAllSchool(qs.stringify({})).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        res.data.forEach(item => {
                            const classObj = {addSchoolId: item.id, addSchoolName: item.school_name};
                            this.allSchool.push(classObj);
                        });
                        //编辑数据回显
                        const moment = require("moment");
                        editInformation(qs.stringify({
                            course_id: this.$route.params.id,
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                                if (res.data && res.data != '[]') {
                                    this.ruleForm.title = res.data.title
                                    this.currentSelectId = res.data.teacher_id
                                    // this.ruleForm.pictureList = res.data.pic
                                    this.ruleForm.liveDescribed = res.data.con
                                    this.ruleForm.maxAmount = res.data.max_users
                                    this.liveUsPictureList.push(res.data.pic[0].url)
                                    res.data.school_ids.split(',').map(item => {
                                        this.allSchool.forEach(ids => {
                                            if (item == ids.addSchoolId) {
                                                this.currentCheckBox.push(ids.addSchoolName)

                                            }
                                        })
                                    })
                                }
                            } else {
                                promptUtil.wait(this);
                            }
                        }).catch(error => {
                            promptUtil.LOG('editInformation-err', error);
                        })
                    } else {
                        promptUtil.wait(this);
                    }
                }
            }).catch(error => {
                PubSub.publish("currentMenuIndex", "/liveManage");
                promptUtil.LOG('getAllSchool-error', error);
            })
            this.userRole = storageUtil.readUserRole();
            // console.log('this.userRole', this.userRole)
            //获取所有的教师
            // getTeacherList(qs.stringify({
            //   school_id: storageUtil.readTeacherInfo().school_id,
            // })).then(res => {
            //   // console.log('getTeacherList', res)
            //   if (res.code == SUCCESS_CODE) {
            //     if (res.data && res.data != '[]') {
            //       res.data.forEach(item => {
            //         const classObj = {teacherId: item.id, teacherName: item.nick};
            //         this.getAllTeacher.push(classObj);
            //       });
            //     } else {
            //
            //       promptUtil.wait(this);
            //     }
            //   }
            // }).catch(error => {
            //   PubSub.publish("currentMenuIndex", "/liveManage");
            //   promptUtil.timeout(this);
            // })

        },
        methods: {
            saveAddLiveInformation() {
                this.allSchool.forEach(item => {
                    const obj = {value: item.addSchoolId, label: item.addSchoolName}
                    this.saveSchoolIdArray.push(obj)
                })
                this.currentCheckBox.forEach(item => {
                    const arr = staticUtil.findValueFromArray(item, this.saveSchoolIdArray)
                    this.sendSchoolArray.push(arr)
                })
                if (this.ruleForm.title.trim() == "" || this.ruleForm.liveDescribed.trim() == ""
                    || this.currentSelectId == '' || this.currentCheckBox == false) {
                    promptUtil.warning(this, "请填写相应信息");
                    return;
                }
                // this.liveUsPictureList.length == 0 ||
                // this.allSchool.forEach(item => {
                //   this.sendSchoolId.push(item.addSchoolId);
                // });
                const moment = require("moment");
                const loading = promptUtil.loading(this);
                editSaveAddInformation(qs.stringify({
                    course_id: this.$route.params.id,
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    title: this.ruleForm.title,
                    classification: this.ruleForm.classification,
                    teacher_id: this.currentSelectId,
                    // school_ids: JSON.stringify(this.sendSchoolId),  this.currentCheckBox
                    school_ids: this.sendSchoolArray,
                    max_users: this.ruleForm.maxAmount,
                    con: this.ruleForm.liveDescribed,
                    // img: this.liveUsPictureList.length= 0 ? "" : JSON.stringify(this.liveUsPictureList),
                    create_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            loading.close();
                            promptUtil.success(this, res.msg)
                            this.ruleForm.title = ""
                            this.ruleForm.classification = ""
                            this.ruleForm.liveDescribed = ""
                            this.currentSelectId = ""
                            this.ruleForm.selectSchool = []
                            // this.$refs.delClassUpload.clearFiles()//主讲人和时间
                            this.$router.push({path: "/liveManagement"})
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg);
                        loading.close();
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    loading.close();
                    promptUtil.LOG('editSaveAddInformation-err', error);
                })


            },

            selectChange(val) {
                // this.currentSelectId=val
                // console.log('this.currentSelectId',this.currentSelectId)
            },


            //添加页面开播时间校验
            liveTimeChange(event) {
                // console.log('liveTimeChange', event)
                //结束时间与开始时间间隔需大于15分钟并小于24小时，开始时间和结束时间范围必须在当前时间一年以内
                const now = new Date().getTime()
                let start = event[0]
                let end = event[1]
                let startTime = start.getTime()
                let endTime = end.getTime()
                if (!(startTime > now && endTime - startTime > 60 * 15 * 1000 && endTime - startTime < 24 * 60 * 60 * 1000 && endTime < now + 60 * 60 * 24 * 365 * 1000)) {
                    promptUtil.warning(this, '请选择正确的时间范围')
                    this.ruleForm.shelfUnderTimeData = []
                }
            },

            //图片方法

            // 删除上传的图片监听
            handlePictureRemove(file, fileList) {
                // console.log(file, fileList);
            },
            // 预览机构信息选中上传的图片
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImageVisibleAdd = true
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
                    this.ruleForm.picture.push(file.uid);
                }
                return isJPG && isLt2M;
                // console.log(file)
            },
            // 上传图片时
            handleRrogress(event, file, fileList) {
                this.saveAddInfoDisabled = true

            },
            // 上传图片成功回调
            handleSuccessUploadImage(response, file, fileList) {
                this.saveAddInfoDisabled = false
                this.liveUsPictureList = []
                this.liveUsPictureList.push(response)
                // console.log('this.liveUsPictureList', this.liveUsPictureList)

            },
            //上传文件失败回调
            handleErrorUpload(err, file, fileList) {
                // console.log('上传文件失败回调')
                promptUtil.wait(this);
            },
            //删除文件回调
            handlePictureRemove(file, fileList) {

                this.liveUsPictureList.splice(
                    this.liveUsPictureList.findIndex(item => item === file.url),
                    1
                )

            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allSchool.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allSchool.length;
            },
            //选择所有
            handleCheckAllChange(val) {
                this.allSchoolLable=[]
                this.allSchool.forEach(item=>{
                    this.allSchoolLable.push(item.addSchoolName)
                })
                this.currentCheckBox = val ? this.allSchoolLable : [];
                this.isIndeterminate = false;
            },
        },
    }
</script>

<style scoped>
  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    content: "\E634";
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

  .theRecycleBinBox {
    width: 50%;
    border-radius: 10px;
    color: #606266;
    margin-right: 10px;
    font-size: 16px;
  }
</style>
