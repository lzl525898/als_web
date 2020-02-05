<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!-- 详情 -->
    <div class="showTask">
      <el-row class="lh">
        <el-col :span="1.5">
          <div class="grid-content bg-purple paddingLeft">任务名称&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">{{detailTask.name}}</div>
        </el-col>
        <!--<el-col :span="1" ><div class="grid-content bg-purple"><el-tag type="success">进行中</el-tag></div></el-col>-->
        <el-col :span="2" class="tr">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="3" class="tr" :offset="2">
          <div class="grid-content bg-purple">指派班级&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
        </el-col>
        <el-col :span="4" class>
          <div class="grid-content bg-purple">{{detailTask.className}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1.5">
          <div class="grid-content bg-purple paddingLeft">截止时间&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{detailTask.data}}</div>
        </el-col>
        <el-col :span="2" class="tr">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="3" class="tr" :offset="1">
          <div class="grid-content bg-purple">类型&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
        </el-col>
        <el-col :span="4" class v-if="detailTask.mission_id==1">
          <div class="grid-content bg-purple">Scratch3.0</div>
        </el-col>
        <el-col :span="4" class v-if="detailTask.mission_id==2">
          <div class="grid-content bg-purple">电子贴纸</div>
        </el-col>
        <el-col :span="4" class v-if="detailTask.mission_id==3">
          <div class="grid-content bg-purple">3D打印</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1.5">
          <div class="grid-content bg-purple paddingLeft">作品数量&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">{{detailTask.number}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1.5">
          <div class="grid-content bg-purple paddingLeft">作品要求&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
        </el-col>
        <div v-if="detailTask.requirement==''">
          <el-col :span="12"></el-col>
        </div>
        <div v-else>
          <el-button type="text" @click="dialogVisible = true" style="margin-top: -10px">点击查看作品要求</el-button>
          <el-dialog
            title="作品要求"
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleClose">
            <div style="width: 100%;height: 500px;overflow-y: auto">
              <div v-html="detailTask.requirement" style="width: 100% !important;">{{detailTask.requirement}} </div>
            </div>
          </el-dialog>
        </div>
      </el-row>
      <el-row>
        <div v-if="detailTask.mission_id==1">
          <el-col :span="1.5">
            <div class="grid-content bg-purple paddingLeft">编辑器&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">
              <span v-if="detailTask.editor=='1'">scratch3.0</span>
              <span v-if="detailTask.editor=='2'">python</span>
            </div>
          </el-col>
        </div>

      </el-row>
    </div>

    <!-- 查询-->
    <div class="queryTask">
      <el-row class="mt">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <span>班级 :</span>
            <el-select
              v-model="classOptions.class"
              clearable
              placeholder="请选择"
              @change="selectClassChange"
            >
              <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.class"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <!--<el-col :span="5">-->
        <!--<div class="grid-content bg-purple-light">-->
        <!--<span>提交状态：</span>-->
        <!--<el-select v-model="submitOptions.label" clearable placeholder="请选择" @change="selectSubmitChange">-->
        <!--<el-option v-for="item in submitOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="5">-->
        <!--<div class="grid-content bg-purple">-->
        <!--<div class="grid-content bg-purple-light">-->
        <!--<span>点评状态：</span>-->
        <!--<el-select v-model="rateOptions.label" clearable placeholder="请选择" @change="selectRateChange">-->
        <!--<el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-col>-->
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input placeholder="搜索学生姓名" prefix-icon="el-icon-search" v-model="queryKeyWords"></el-input>
          </div>
        </el-col>
        <el-col :span="1" class="ml">
          <div class="grid-content bg-purple">
            <el-button
              type="primary"
              :loading="isLoadingQueryKeyWords"
              @click="queryKeyWordsWithList"
            >搜索
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- table表格 -->
    <div class="mt" style="margin-bottom: 20px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-row-style="{'color':'#409EFF'}"
      >
        <el-table-column
          props="id"
          align="center"
          type="index"
          :index="indexMethod"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column align="center" label="学生">
          <template slot-scope="scope">
            <div style="display: flex;align-items:center;justify-content:center;margin-top:20px;">
              <div style="position: relative">
                <div style="position: absolute;top:-18px;left:0">{{scope.row.name}}</div>
                <div style="font-size: 10px">{{scope.row.account}}</div>
              </div>
              <!--              <div style="margin-left:15px;flex:1;display:flex;justify-content:flex-start;">{{scope.row.name}}</div>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="class" align="center" label="班级"></el-table-column>
        <el-table-column prop="work" align="center" label="作品">
          <template slot-scope="scope">
            <span v-if="scope.row.work=='未创作'" style="color:red">{{scope.row.work}}</span>
            <span v-else>{{scope.row.work}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" align="center" label="提交时间（最后一次）">
          <template slot-scope="scope">
            <span v-if="scope.row.time=='未提交'" style="color:red">{{scope.row.time}}</span>
            <span v-else>{{scope.row.time}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rate" align="center" label="评分" width="150">
          <template slot-scope="scope">
            <span
              v-if="scope.row.rate=='加把劲' || scope.row.rate=='再认真一点'"
              style="color: orangered"
            >{{scope.row.rate}}</span>
            <span
              v-if="scope.row.rate=='不错' || scope.row.rate=='给力' || scope.row.rate=='惊喜很棒'"
              style="color:#ff9900"
            >{{scope.row.rate}}</span>
            <span v-if="scope.row.rate=='未评分'" style="color:red">{{scope.row.rate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="400">
          <template slot-scope="scope">
            <el-button v-if="scope.row.url==''" type="primary" size="small" :disabled="true">查看作品</el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              :disabled="whetherOperation"
              @click="handleEdit({index: scope.$index, row:scope.row}, missionId)"
            >查看作品
            </el-button>
            <el-button
              v-if="scope.row.souce==1"
              type="danger"
              size="small"
              :disabled="whetherOperation"
              @click="handleComment(scope.$index, scope.row)"
            >查看点评
            </el-button>
            <el-button
              v-if="scope.row.souce==0"
              type="danger"
              size="small"
              :disabled="whetherOperation"
              @click="handleComment(scope.$index, scope.row)"
            >创建点评
            </el-button>
            <el-button
              v-if="scope.row.souce==2"
              type="danger"
              size="small"
              :disabled="whetherOperation"
              @click="handleComment(scope.$index, scope.row)"
            >继续点评
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-row type="flex" justify="center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="taskInfoList"
      ></el-pagination>
    </el-row>
    <!-- 父组件 -->
    <report-dialog ref="reportdialog"></report-dialog>
  </div>
</template>
<script>
    import PubSub from "pubsub-js";
    import stringUtil from "../../../utils/stringUtil";
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import staticUtil from "../../../utils/staticUtil";
    import reportDialog from "../report/reportDialog.vue";
    import childHeader from '../../component/childHeader';
    import '../../../api/restfulapi';
    import '../../../router/router';
    import {
        qs,
        detailTask,
        taskSee,
        detailClass,
        queryTaskSeeList,
        getStudentReportDetail
    } from "../../../api/api";

    export default {
        components: {
            "als-child-header": childHeader,
            "reportDialog": reportDialog,
        },
        data() {
            return {
                routerConfig: [{name: '任务管理', to: '/taskMan'}, {name: '任务详情', to: ''}],
                detailTask: {},
                missionId: '',//类型 scratch3.0 1 电子贴纸2 3D打印 3
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                tableData: [], // 班级数据
                queryFromServer: [], // 服务器请求数据
                getTableContentTimeoutId: null, // 模拟异步请求定时id
                currentSelectClassId: 0, // 当前点选的classId
                currentSelectSubmitType: 0, //当前点选的submit状态为全部
                currentSelectRateType: 0, //当前点选的rate状态为全部
                queryKeyWords: "", // 要搜索的关键字
                isLoadingQueryKeyWords: false, //查询是否加载状态
                reportDetailVisible: false, // 是否显示任务报告详情页
                classOptions: [], // 班级select
                whetherOperation: false,//是否能操作按钮
                submitOptions: [
                    {value: 0, label: "全部"},
                    {value: 1, label: "已提交"},
                    {value: 2, label: "待提交"}
                ], // 提交select
                rateOptions: [
                    {value: 0, label: "全部"},
                    {value: 1, label: "已评价"},
                    {value: 2, label: "待评价"}
                ], // 评分select
                // reportDetailInfo: {
                //   // 报告详情信息
                //   pictures: [],
                //   video: "",
                //   studentInfo: { avatar: "" },
                //   teacherInfo: { avatar: "" },
                //   qrData: { url: "" }
                // }
                dialogVisible: false
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/taskMan");
            const loading = promptUtil.loading(this);
            storageUtil.saveWorksDetail([]);
            this.$route.query.id;
            //班级
            detailTask(
                qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    task_id: this.$route.params.id,
                    user_id: storageUtil.readTeacherInfo().id

                })
            )
                .then(res => {
                    PubSub.publish("currentMenuIndex", "/taskMan");
                    if (res.code == SUCCESS_CODE) {
                        if (res.data.data == "Invalid date") {
                            res.data.data = "";
                        }
                        this.detailTask = res.data;
                        if (res.data.caozuo == 0) {
                            this.whetherOperation = true
                        }
                        this.missionId = res.data.mission_id
                        // console.log("this.detailTask",this.detailTask)
                    } else {
                        promptUtil.wait(this);
                    }
                    loading.close();
                    this.getTableContentTimeoutId = null;
                })
                .catch(err => {
                    loading.close();
                    promptUtil.LOG("detailTask-err", err);
                }),
                //任务列表
                taskSee(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        task_id: this.$route.params.id
                    })
                )
                    .then(res => {
                        // console.log("taskSee",res)
                        loading.close();
                        // console.log(res.data)souce 0 没创建 1 已发布 2 创建未发布
                        if (res.code == SUCCESS_CODE) {
                            this.queryFromServer = [];
                            if (res.data && res.data != '[]') {
                                this.queryFromServer = this.analyticalDataFromServer(res.data);
                            }
                            this.tableData = this.queryFromServer.slice(
                                (this.currentPage - 1) * this.pageSize,
                                this.pageSize + (this.currentPage - 1) * this.pageSize
                            );
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("taskSee-err", err);
                    });
            detailClass(
                qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    task_id: this.$route.params.id
                })
            )
                .then(res => {
                    loading.close();
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.classOptions = res.data;
                        }
                    } else {
                        promptUtil.wait(this);
                    }
                    loading.close();
                })
                .catch(err => {
                    loading.close();
                    promptUtil.LOG("detailClass-err", err);
                }),
                this.handleCurrentChange(1); //默认第一次访问使用第一页，页码是1.
        },
        methods: {
            // 选择班级select
            selectClassChange(val) {
                this.currentSelectClassId = val == null ? 0 : val;
            },
            // 选择提交select
            selectSubmitChange(val) {
                this.currentSelectSubmitType = val == null ? 0 : val;
            },
            // 选择评分select
            selectRateChange(val) {
                this.currentSelectRateType = val == null ? 0 : val;
            },
            // 查询操作触发函数
            queryKeyWordsWithList() {
                this.isLoadingQueryKeyWords = true;
                // console.log(this.currentSelectSubmitType) 以后添加
                // console.log(this.currentSelectClassId)
                // console.log(this.currentSelectRateType)  以后添加
                // console.log(this.queryKeyWords)
                // if (
                //   this.currentSelectClassId == 0 &&
                //   // && this.currentSelectSubmitType==0
                //   this.currentSelectRateType == 0 &&
                //   this.queryKeyWords == ""
                // ) {
                taskSee(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        task_id: this.$route.params.id,
                        class_id: this.currentSelectClassId,
                        student_name: this.queryKeyWords.trim()
                    })
                ).then(res => {
                    this.queryKeyWords = "";
                    if (res.code == SUCCESS_CODE) {
                        this.queryFromServer = [];
                        if (res.data && res.data != '[]' && res.data != undefined) {
                            this.queryFromServer = this.analyticalDataFromServer(res.data);
                        }
                        this.tableData = this.queryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                        this.handleCurrentChange(1);
                    } else {
                        promptUtil.wait(this);
                    }
                    this.isLoadingQueryKeyWords = false;
                })
                    .catch(err => {
                        this.isLoadingQueryKeyWords = false;
                        promptUtil.LOG("taskSee-err", err);
                    });
                // }
                // else {
                //   queryTaskSeeList(
                //     qs.stringify({
                //       school_id: storageUtil.readTeacherInfo().school_id,
                //       task_id: this.$route.params.id,
                //       class_id: this.currentSelectClassId,
                //       rate: this.currentSelectRateType,
                //       student_name: this.queryKeyWords.trim()
                //     })
                //   )
                //     .then(res => {
                //       if (res.code == 1) {
                //         this.queryKeyWords = "";
                //         this.queryFromServer = this.analyticalDataFromServer(res.data);
                //         this.tableData = this.queryFromServer.slice(
                //           (this.currentPage - 1) * this.pageSize,
                //           this.pageSize + (this.currentPage - 1) * this.pageSize
                //         );
                //         this.handleCurrentChange(1);
                //       } else if (res.code == -2) {
                //         this.queryKeyWords = "";
                //         this.queryFromServer = [];
                //         this.tableData = this.queryFromServer;
                //         this.handleCurrentChange(1);
                //       } else {
                //         promptUtil.wait(this);
                //       }
                //       this.isLoadingQueryKeyWords = false;
                //     })
                //     .catch(err => {
                //       //console.log(err)
                //       this.isLoadingQueryKeyWords = false;
                //       promptUtil.timeout(this);
                //     });
                // }
            },
            handleClose(done) {
                done();
                // this.$confirm('确认关闭？')
                //     .then(_ => {
                //         done();
                //     })
                //     .catch(_ => {
                //     });
            },
            // 进入查看作品
            handleEdit(item, mission) {
                this.$store.dispatch("setTaskDetail", {
                    taskId: this.$route.params.id,
                    studentId: item.row.stu_id,
                    stuName: item.row.name,
                    taskName: this.detailTask.name,
                    releaseTime: item.row.time,
                    className: this.detailTask.className,
                    souceType: item.row.souce,
                    reportId: item.row.report,
                    status: item.row.time == "未提交" ? 0 : 1,// 0 表示未发布作品  1 表示已提交作品
                    missionId: mission
                }); // 触发消息action调用
                storageUtil.saveWorksDetail({ // 为scratch3.0准备相应参数
                    worksUrl: item.row.url,
                    stuId: item.row.stu_id,
                    taskId: this.$route.params.id,
                    worksName: item.row.work
                });
                this.$router.push({
                    path:
                        `/taskMan/see/view/` + this.$route.params.id + "/" + item.row.stu_id
                });
            },

            // 打开报告详情对话框回调
            reportDialogOpened() {
                echarts
                    .init(document.getElementById("echart-main"))
                    .setOption(
                        staticUtil.genECharts(this.reportDetailInfo.dimension, echarts)
                    );
            },

            // 点评方法触发
            handleComment(index, row) {
                this.$store.dispatch("setStudentWithReportName", row.name)
                if (row.souce == 1) {
                    // 查看点评
                    const loading = promptUtil.loading(this);
                    getStudentReportDetail(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            task_id: row.report
                        })
                    ).then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data == '[]') {
                                promptUtil.wait(this)
                                return
                            }
                            this.reportDetailInfo = res.data;
                            this.reportDetailVisible = true;
                            this.$refs.reportdialog.seeRateReport(this.reportDetailInfo);
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                        .catch(err => {
                            loading.close();
                            promptUtil.LOG("getStudentReportDetail-err", err);
                        });
                    // row.report
                    // console.log(row.report)
                } else if (row.souce == 2) {
                    // 继续点评
                    this.$router.push({
                        path: ROUTER_REPORT_EDIT + row.stu_id + "/" + row.report
                    });
                } else {
                    // 创建点评
                    if (row.time == "未提交") {
                        promptUtil.warning(this, "该学生尚未提交作品");
                        return;
                    }
                    this.$store.dispatch("saveSCreateRateId", {
                        taskId: this.$route.params.id,
                        taskName: this.detailTask.name,
                        status: 1 // 1 表示从任务管理进入创建报告  0 从学情报告进入创建报告
                    });
                    this.$router.push({path: ROUTER_REPORT_CREATE + row.stu_id});
                }
            },

            // 当前页触发函数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                );
            },
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * 10;
            },
            // 解析从服务器获取的学生作品任务相关列表数据
            analyticalDataFromServer(res) {
                const moment = require("moment");
                const rateArray = stringUtil.getEvaluateArray();
                const data = res.map(item => {
                    if (item.time == "") {
                        item.time = "未提交";
                    } else {
                        item.time = moment(parseInt(item.time) * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                        );
                    }
                    if (item.rate == -1) {
                        item.rate = "未评分";
                    } else {
                        item.rate = rateArray[Math.round(parseFloat(item.rate)) - 1];
                    }
                    if (item.work == "") {
                        item.work = "未创作";
                    }
                    return item;
                });
                return data;
            }
        },
        computed: {
            taskInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            }
        }
    };
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

  .tr {
    text-align: right;
  }

  .elButton {
    line-height: 0;
  }

  .borderBottom {
    border-bottom: 1px #eee solid;
  }

  .el-input__inner {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
  }

  .lh {
    line-height: 40px;
  }

  .tCenter {
    /* text-align: center */
  }

  .mt {
    margin-top: 20px;
  }

  .showTask,
  .queryTask {
    margin-top: 30px;
    /* background-color: #eee; */
    box-shadow: 2px 2px 8px #eee;
    border-radius: 10px;
    color: #606266;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .queryTask {
    line-height: 80px;
    /* margin-top: 30px; */
  }

  .color {
    color: #606266;
  }

  .mt {
    margin-top: 30px;
  }

  .ml {
    margin-left: 50px;
  }

  .paddingLeft {
    padding-left: 20px;
  }
</style>


