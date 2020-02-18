<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/liveManagement' }">直播管理</el-breadcrumb-item>
            <el-breadcrumb-item>直播课时</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
    <!--      搜索-->
    <transition name="fade">
      <div class="search" v-if="search">
        <el-form :model="searchRuleForm" label-width="180px" :rules="rules" ref="searchRuleForm" class="demo-ruleForm">
          <el-form-item label="id：" prop="searchId">
            <el-input v-model="searchRuleForm.searchId" placeholder="请输入要搜索的id"></el-input>
          </el-form-item>
          <el-form-item label="直播课堂标题：" prop="searchTitle">
            <el-input v-model="searchRuleForm.searchTitle" placeholder="请输入要查询的直播课堂标题"></el-input>
          </el-form-item>
          <el-form-item label="开播时间" prop="searchListShelUnderTime">
            <el-date-picker
              v-model="searchRuleForm.searchListShelUnderTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <!--            <el-form-item label="审核：" prop="searchCreate">-->
          <!--              <el-input v-model="searchRuleForm.searchCreate" placeholder="请输入要查询的创建者"></el-input>-->
          <!--            </el-form-item>-->
          <!--                <el-form-item label="禁用：" prop="searchSpeaker">-->
          <!--                  <el-input v-model="searchRuleForm.searchSpeaker" placeholder="请输入要查询的主讲人"></el-input>-->
          <!--                </el-form-item>-->
          <el-form-item>
            <el-button type="primary" size="small" @click="liveSearch('searchRuleForm')">搜索</el-button>
            <el-button size="small" @click="resetSearchRuleForm('searchRuleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <el-row>
      <el-button type="primary" size="medium" @click="showSearchConditionsForm">搜索</el-button>
      <el-button type="primary" size="medium" @click="addLiveClass">新建</el-button>
      <el-button type="primary" size="medium" @click="downloadClient">下载客户端</el-button>
    </el-row>
    <el-dialog title="提示" :visible.sync="showRemoveDisableTableList" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{dialogDisableContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
              <el-button @click="showRemoveDisableTableList = false">取 消</el-button>
              <el-button type="primary" @click="handleRemoveDisableTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
    </el-dialog>


    <div class="mt">
      <!--列表-->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        border
        :header-row-style="{'color':'#409EFF'}"
        style="width: 100%">
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column
          label="序号"
          type="index"
          :index="indexMethod"
          props="id"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          prop="create"
          label="创建者"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="speakerMan"
          align="center"
          label="主讲人"
        >
        </el-table-column>
        <el-table-column
          prop="className"
          align="center"
          label="直播课程名称"
        >
        </el-table-column>
        <el-table-column
          prop="speaker"
          label="房间号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="studentInviteCode"
          align="center"
          label="学生邀请码"
        >
        </el-table-column>
        <el-table-column
          prop="teacherInviteCode"
          align="center"
          label="教师邀请码"
        >
        </el-table-column>

        <el-table-column
          prop="shelfTime"
          label="上架时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="underTime"
          label="下架时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="organ"
          label="机构名称"
          align="center">
        </el-table-column>
        <el-table-column align="center" label="操作" width="400">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showLiveClassEditDialog({index: scope.$index, row:scope.row})"
              v-if="scope.row.bofang_type==2">编辑
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="showLiveClassEditDialog({index: scope.$index, row:scope.row})"
              v-if="scope.row.bofang_type==0">编辑
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="showLiveClassEditDialog({index: scope.$index, row:scope.row})"
              v-if="scope.row.bofang_type==1" :disabled="disable=true">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="LiveClassDisable({index: scope.$index, row:scope.row})"
            >禁用
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click.native="returnShareInfo({index: scope.$index, row:scope.row})"
            >直播课分享
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click.native="newLiveClass({index: scope.$index, row:scope.row})"
            >教师讲课
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--       分页-->
      <el-row type="flex" justify="center" class="mt">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="liveInfoList"
        ></el-pagination>
      </el-row>
    </div>
    <el-dialog
      title="分享信息"
      :visible.sync="shareDialogVisible"
      width="30%">
      <div>
        <el-input
          readonly
          type="textarea"
          autosize
          v-model="shareInfo"
        />
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="shareDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    import '../../../api/restfulapi';
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import {
        qs,
        WEB_URL,
        getCreateClassInformation,
        disableTableListLiveClass,
    } from "@/api/api.js";

    export default {
        data() {
            return {
                shareInfo:'',
                currentLiveIndex: 0,
                shareDialogVisible:false,
                sendCourseId: '',
                saveDisableTableListArrayId: '',//表格中禁用row.id
                sendDisableTableListArrayId: [],//传给后台表格中的禁用ID
                isLoadingDisableWithDel: false, // 直播列表禁用确认对话框中确认按钮加载状态
                dialogDisableContent: '',// 直播列表对话框中显示要禁用的内容
                saveDisableTableListArrayIndex: '',
                showRemoveDisableTableList: false,
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                queryFromServer: [],//服务器返回直播列表数据的数据
                search: false,
                searchRuleForm: {
                    searchId: '',
                    searchCreate: '',
                    searchSpeaker: '',
                    searchTitle: '',
                    searchShelfTime: '',
                    searchUnderTime: '',
                    searchListShelUnderTime: []
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
                    ]
                },
                tableData: [],
            }
        },
        mounted() {
            // 管理员/教师邀请码   云课堂昵称
            PubSub.publish("currentMenuIndex", "/liveManagement");
            window.localStorage.setItem("paramsId", this.$route.params.id);
            const moment = require("moment");
            const loading = promptUtil.loading(this);
            getCreateClassInformation(qs.stringify({
                subject_id: this.$route.params.id,
                user_id: storageUtil.readTeacherInfo().id
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    loading.close()
                    // console.log('this.$route.params.id', this.$route.params.id)
                    // 重置当前页为1
                    this.tableData = []
                    this.currentPage = 1;
                    this.queryFromServer = [];
                    if (res.data && res.data != '[]') {
                        //  console.log('this.tableData.maxAmount66', res.data)
                        for (var i = 0; i < res.data.length; i++) {
                            const obj = {
                                organ: res.data[i].organ, // 机构名称
                                speakerMan: res.data[i].teacher, // 主讲人
                                sTime: res.data[i].s,
                                eTime: res.data[i].e,
                                student_url: res.data[i].user_url,
                                id: res.data[i].id,
                                create: res.data[i].create_name,
                                className: res.data[i].title,
                                speaker: res.data[i].room_id,
                                shelfTime: res.data[i].starttime,
                                underTime: res.data[i].endtime,
                                open: res.data[i].if_gk == 1 ? "否" : "是",
                                whetherAudit: res.data[i].sh,//= 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败"
                                whetherDisable: res.data[i].status,
                                bofangUrl: res.data[i].bofang_url,
                                bofang_type: res.data[i].bofang_type,
                                studentInviteCode: res.data[i].student_code, // 学生邀请码
                                teacherInviteCode: res.data[i].teacher_code,
                                cloudClassroomNickname: res.data[i].teacher_name

                            }
                            // console.log('bofang_type',res.data[i].bofang_type)
                            this.tableData.push(obj)
                        }
                        this.queryFromServer = this.tableData;
                        this.handleCurrentChange(1)
                    }
                } else {
                    loading.close()
                    promptUtil.wait(this);
                }
            }).catch(error => {
                loading.close()
                promptUtil.LOG('getCreateClassInformation-err', error);
            })


        },
        methods: {
            showSearchConditionsForm() {
                this.search = !this.search
            },
            //新建
            addLiveClass() {
                this.$router.push({path: `/liveManagement/add/` + this.$route.params.id});
            },
            //下载客户端
            downloadClient() {
                window.open("http://www.baijiayun.com/classroomdown/", "_blank")
            },
            //搜索
            liveSearch() {
                const moment = require("moment");
                if (this.searchRuleForm.searchId.trim() !== "") {
                    let valdate = /^[1-9]\d*$/;
                    if (!valdate.test(this.searchRuleForm.searchId.trim())) {
                        promptUtil.warning(this, "请输入数字");
                        return;
                    }
                }
                const loading = promptUtil.loading(this);
                var selectJson = {
                    subject_id: this.$route.params.id,
                    user_id: storageUtil.readTeacherInfo().id
                };

                if (this.searchRuleForm.searchId != "") selectJson['course_id'] = this.searchRuleForm.searchId;
                if (this.searchRuleForm.searchTitle != "") selectJson['title'] = this.searchRuleForm.searchTitle;
                if (this.searchRuleForm.searchListShelUnderTime != null && this.searchRuleForm.searchListShelUnderTime.length != 0) selectJson['starttime'] = moment(this.searchRuleForm.searchListShelUnderTime[0]).format("YYYY-MM-DD HH:mm:ss");
                if (this.searchRuleForm.searchListShelUnderTime != null && this.searchRuleForm.searchListShelUnderTime.length != 0) selectJson['endtime'] = moment(this.searchRuleForm.searchListShelUnderTime[1]).format("YYYY-MM-DD HH:mm:ss");
                getCreateClassInformation(qs.stringify(selectJson)).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        loading.close()
                        // console.log('成功信息', res)
                        // 重置当前页为1
                        this.tableData = []
                        this.currentPage = 1;
                        this.queryFromServer = [];
                        if (res.data && res.data != '[]') {
                            for (var i = 0; i < res.data.length; i++) {
                                const obj = {
                                    organ: res.data[i].organ, // 机构名称
                                    speakerMan: res.data[i].teacher, // 主讲人
                                    sTime: res.data[i].s,
                                    eTime: res.data[i].e,
                                    student_url: res.data[i].user_url,
                                    id: res.data[i].id,
                                    create: res.data[i].create_name,
                                    className: res.data[i].title,
                                    speaker: res.data[i].teacher_name,
                                    shelfTime: res.data[i].starttime,
                                    underTime: res.data[i].endtime,
                                    open: res.data[i].max_users,
                                    whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",
                                    whetherDisable: res.data[i].status,
                                    // open: res.data[i].if_gk = 1 ? false : true,
                                }
                                this.tableData.push(obj)
                            }
                            this.queryFromServer = this.tableData;
                            this.handleCurrentChange(1)
                        }
                    } else if (res.code = ERROR_CODE) {

                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    loading.close()
                    promptUtil.LOG('getCreateClassInformation-err', error)
                })
            },
            resetSearchRuleForm(formName) {
                this.$refs[formName].resetFields();
            },
            //点击编辑跳页
            showLiveClassEditDialog(obj) {
                this.$router.push({path: `/liveManagement/editAdd/` + obj.row.id});
            },

            // =======分页=========
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * 10;
            },
            // 当前页触发函数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                )
            },
            // 保存新建
            saveSearch() {

            },
            //禁用
            LiveClassDisable(obj) {
                this.saveDisableTableListArrayId = obj.row.id
                this.saveDisableTableListArrayIndex = obj.index
                this.showRemoveDisableTableList = true
                this.dialogDisableContent = '确定要禁用此课时么'
            },
            //表格中的禁用dialog中的确定按钮
            handleRemoveDisableTableList() {
                this.sendDisableTableListArrayId.push(this.saveDisableTableListArrayId)
                disableTableListLiveClass(qs.stringify({
                    course_id: this.sendDisableTableListArrayId,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '禁用成功')
                        this.queryFromServer.splice(this.saveDisableTableListArrayIndex, 1)
                        this.tableData = this.queryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('disableTableListLiveClass-err', error)
                })
                this.showRemoveDisableTableList = false
            },
            //待开播
            waitLiveClass() {

            },
            //回放观看
            playBackLiveClass(obj) {
                // this.sendCourseId=obj.row.id
                // getLiveClassUrl(qs.stringify({
                //   course_id: this.sendCourseId,
                //   user_id: storageUtil.readTeacherInfo().id
                // })).then(res => {
                //   if (res.code == SUCCESS_CODE) {
                //     if (res.data && res.data != '{}') {
                //       //0 未开播    //1 直播  //2 已结束
                //       // console.log('res.data',res.data.type)
                //       if(res.data.type==2){
                //         window.open(res.data.url, '_blank')
                //       }
                //     }
                //   } else if (res.code == ERROR_CODE) {
                //     promptUtil.error(this, res.msg)
                //   } else {
                //     promptUtil.wait(this)
                //   }
                //
                // }).catch(error => {
                //   //  console.log('error',error)
                //   promptUtil.timeout(this)
                // })
            },
            // 生成详细分享信息
            genShareInfo(){
                const moment = require("moment")
                const liveInfo = this.queryFromServer[this.currentLiveIndex]
                console.log("liveInfo",liveInfo)
                let sTime = moment(liveInfo.sTime*1000).format("YYYY/MM/DD HH:mm")
                let eTime = moment(liveInfo.eTime*1000).format("YYYY/MM/DD HH:mm")
                this.shareInfo = liveInfo.speakerMan + "｜" + liveInfo.organ + " 邀请您参加" + liveInfo.className + "\n" +
                    "直播主题：" +  liveInfo.organ + " " + liveInfo.className +"\n" +
                    "直播时间：" + sTime+ "—" + eTime+"\n" +
                    "参加码：" + liveInfo.studentInviteCode + "\n" +
                    "点击链接直接进入直播室：\n" +
                    WEB_URL + "/live/classroom\n" +
                    "建议下载客户端观看直播：\n" +
                    "https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/live/clientinstaller.zip"
            },
            // 返回分享信息
            returnShareInfo(obj) {
                this.currentLiveIndex = obj.index
                this.genShareInfo()
                this.shareDialogVisible = true
            },
            //教师讲课
            newLiveClass(obj) {
                window.location.href = "baijiacloud://"
                // this.sendCourseId = obj.row.id
                // getLiveClassUrl(qs.stringify({
                //     course_id: this.sendCourseId,
                //     user_id: storageUtil.readTeacherInfo().id
                // })).then(res => {
                //     if (res.code == SUCCESS_CODE) {
                //         if (res.data && res.data != '{}') {
                //             //0 未开播    //1 直播  //2 已结束
                //             // console.log('res.data',res.data.type)
                //             if (res.data.type == 0) {
                //                 promptUtil.warning(this, res.msg)
                //             }
                //             if (res.data.type == 1) {
                //                 window.open(res.data.url, '_blank')
                //             }
                //             if (res.data.type == 2) {
                //                 promptUtil.warning(this, res.msg)
                //             }
                //         }
                //     } else if (res.code == ERROR_CODE) {
                //         promptUtil.error(this, res.msg)
                //     } else {
                //         promptUtil.wait(this)
                //     }
                //
                // }).catch(error => {
                //     promptUtil.LOG('getLiveClassUrl-err', error)
                // })
            },
        },
        computed: {
            liveInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            },
        }

    }
</script>

<style scoped>
  .el-icon-question {
    margin-top: -10px;
    font-size: 40px;
    color: #f56c6c;
  }

  /*.el-icon-question:before {*/
  /*  content: "\E634";*/
  /*  font-size: 40px;*/
  /*  color: #f56c6c;*/
  /*}*/

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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .mt {
    margin-top: 20px;
  }


</style>
