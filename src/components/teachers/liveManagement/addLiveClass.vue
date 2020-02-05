<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/liveManagement' }">直播管理</el-breadcrumb-item>
            <el-breadcrumb-item>新建直播课时</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
    <!--      输入表单-->
    <div class="search">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="直播名称：" prop="liveName">
          <el-input v-model="ruleForm.liveName" placeholder="请输入直播名称"></el-input>
        </el-form-item>
        <el-form-item label="开播时间：" prop="liveShelUnderTime">
          <el-date-picker
            v-model="ruleForm.liveShelUnderTime"
            @change="liveTimeChange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="直播简介：" prop="liveDetail">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入课程介绍"
            v-model="ruleForm.liveDetail">
          </el-input>
        </el-form-item>
        <!--          直播模式-->
        <el-form-item label="直播模式" prop="liveModel">
          <el-radio-group v-model="ruleForm.liveModel">
            <el-radio :label="1">视频直播+聊天互动</el-radio>
            <el-radio :label="2">文档直播+聊天互动</el-radio>
            <el-radio :label="3">文档+视频+聊天互动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否公开" prop="open">
          <!--            active-text="是"-->
          <!--            inactive-text="否"-->
          <el-switch
            v-model="ruleForm.open"
          >
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="saveAddInformation">保存</el-button>
          <el-button size="small" @click="resetSearchRuleForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    import '../../../api/restfulapi';
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
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
        saveCreateClassInformation,


    } from "@/api/api.js";

    export default {
        data() {
            return {
                ruleForm: {
                    liveName: '',
                    liveShelUnderTime: [],
                    liveDetail: '',
                    liveTalk: '',
                    open: true,
                    liveModel: 3,
                },
                rules: {
                    liveName: [
                        {required: true, message: '请输入直播名称', trigger: 'blur'},
                    ],
                    liveShelUnderTime: [
                        {required: true, message: '请输入开播时间', trigger: 'blur'},
                    ],
                    liveDetail: [
                        {required: true, message: '请输入直播简介', trigger: 'blur'},
                    ],

                },
            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", "/liveManagement");
        },
        methods: {
            saveAddInformation() {
                if (this.ruleForm.liveName.trim() == "" || this.ruleForm.liveDetail.trim() == "") {
                    promptUtil.warning(this, "请填写相应信息");
                    return;
                }

                if (this.ruleForm.liveShelUnderTime == null || this.ruleForm.liveShelUnderTime.length === 0) {
                    promptUtil.warning(this, "请填写相应信息");
                    return;
                }
                const moment = require("moment");
                const loading = promptUtil.loading(this);
                saveCreateClassInformation(qs.stringify({
                    subject_id: this.$route.params.id,
                    title: this.ruleForm.liveName,
                    con: this.ruleForm.liveDetail,
                    type: this.ruleForm.liveModel,
                    starttime: moment(this.ruleForm.liveShelUnderTime[0]).format("YYYY-MM-DD HH:mm:ss"),
                    endtime: moment(this.ruleForm.liveShelUnderTime[1]).format("YYYY-MM-DD HH:mm:ss"),
                    if_gk: this.ruleForm.open == false ? '1' : '0',
                    create_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    //  console.log('123123', res)
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            loading.close();
                            promptUtil.success(this, res.msg)
                            this.ruleForm.liveName = ""
                            this.ruleForm.liveDetail = ""
                            this.ruleForm.liveShelUnderTime.length = 0
                            this.$router.push({path: `/liveManagement/liveClass/` + this.$route.params.id});
                        }

                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg);
                        loading.close();
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    loading.close();
                    promptUtil.LOG('saveCreateClassInformation-err', error);
                })

            },
            //重置表单
            resetSearchRuleForm(formName) {
                this.$refs[formName].resetFields();
            },
            //添加页面开播时间校验
            liveTimeChange(event) {

                // console.log('event', event)
                if (event && event != null) {
                    // console.log('liveTimeChange', event)
                    //结束时间与开始时间间隔需大于15分钟并小于24小时，开始时间和结束时间范围必须在当前时间一年以内
                    const now = new Date().getTime()
                    let start = event[0]
                    let end = event[1]
                    let startTime = start.getTime()
                    let endTime = end.getTime()
                    if (!(startTime > now && endTime - startTime > 60 * 15 * 1000 && endTime - startTime < 24 * 60 * 60 * 1000 && endTime < now + 60 * 60 * 24 * 365 * 1000)) {
                        promptUtil.warning(this, '请选择正确的时间范围')
                        this.ruleForm.liveShelUnderTime = []

                    }
                }
            },


        }
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

  .search {
    width: 50%;
    border-radius: 10px;
    color: #606266;
    margin-right: 10px;
    font-size: 16px;
  }

</style>
