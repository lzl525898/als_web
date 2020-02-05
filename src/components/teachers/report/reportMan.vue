<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
        <el-card class="box-card" style="width: 100%;margin-top: 20px;">
          <el-row>
            <el-col :span="8">
              <span style="font-weight: bold">学生姓名&nbsp;&nbsp;&nbsp;{{userBaseInfo.name}}</span>
            </el-col>
            <el-col :span="8">
              <span style="font-weight: bold">所在班级&nbsp;&nbsp;&nbsp;{{userBaseInfo.classInfo.name}}</span>
            </el-col>

            <el-col :span="6" :offset="2">
              <span style="font-weight: bold">切换学生&nbsp;&nbsp;&nbsp;</span>
              <el-select v-model="currentSelectChild" placeholder="请选择" @change="handleStudentChange">
                <el-option-group
                  v-for="group in studentList"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>

            </el-col>
          </el-row>
          <el-row style="margin-top: 12px;">
            <el-col :span="8">
              <div style="float:left">
                <span>平均成绩</span>
              </div>
              <div style="float:left;margin-left:10px;">
                <el-rate
                  v-model="userBaseInfo.verageScore"
                  disabled
                  show-text
                  text-color="#ff9900"
                  :texts="verageScore"
                ></el-rate>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 15px;">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreateReport">创建报告</el-button>
    </el-row>
    <el-row style="margin-top: 15px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-row-style="{'color':'#409EFF'}"
      >
        <el-table-column
          align="center"
          props="id"
          type="index"
          :index="indexMethod"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column align="center" prop="name" label="报告名称"></el-table-column>
        <el-table-column align="center" prop="type" label="报告类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='1'">课程报告</span>
            <span v-else>任务报告</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="update" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="status" label="报告状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='1'">已发布</span>
            <span v-else style="color:red">待发布</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status=='0'"
              size="mini"
              type="primary"
              plain
              @click="goEditReportPage({index: scope.$index, row:scope.row})"
            >编辑
            </el-button>
            <el-button
              v-else
              size="mini"
              type="primary"
              plain
              @click="showReportDialog({row:scope.row})"
            >查看
            </el-button>
            <el-button size="mini" type="danger" plain
                       @click="showDeleleReportDialog({index: scope.$index, row:scope.row})">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="reportInfoList"
      ></el-pagination>
    </el-row>
    <!-- 父组件 -->
    <report-dialog ref="reportdialog"></report-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{delDialogContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelReport" :loading="isLoadingWithDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    const echarts = require("echarts");
    import reportDialog from "./reportDialog.vue";
    import vueQr from "vue-qr";
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import stringUtil from "../../../utils/stringUtil";
    import staticUtil from "../../../utils/staticUtil";
    import '../../../api/restfulapi';
    import '../../../router/router'
    import {
        qs,
        getReportList,
        delReportById,
        getStuDetailList,
        intoReportBaseInfo,
        getStudentReportDetail
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'
    export default {
        components: {"vueQr":vueQr, "reportDialog":reportDialog,"als-child-header": childHeader},
        data() {
            return {
              routerConfig: [{name:'学情报告',to:'/report'},{name:this.$store.state.currentStudentName+'的学情报告',to:''}],
              inputQueryInfo: "", // 搜索内容
              tableData: [], // 班级数据
              queryFromServer: [], // 服务器请求数据
              pageSize: 10, // 分页页码大小
              currentPage: 1, // 分页当前页码
              requestTimeout: 2000, // 请求服务器超时时间
              getTableContentTimeoutId: null, // 模拟异步请求定时id
              currentSelectChild: "", // 当前选中的学生
              // reportDetailVisible: false, // 是否显示当前报告详情
              currentReportDetailId: 0, // 当前选中的报告id
              verageScore: [],
              studentInfo: [], // 学生列表信息
              userBaseInfo: {
                  // 当前学生基本信息
                  id: "",
                  name: "",
                  verageScore: 0,
                  classInfo: {name: "", id: ""}
              },
              studentList: [{label: '', options: [{value: '', label: ''}]}],// 该教师所有学生信息
              routeParam: "", // 路由参数，学生id
              delDialogVisible: false, // 显示删除报告对话框的状态
              isLoadingWithDel: false, // 删除操作时处理状态
              delDialogContent: '',// 删除对话框中内容
              currentDelReportIndex: '', // 当前删除的报告索引
              allStudentsArray: [], // 所有学生信息
            };
        },
        mounted() {
          this.allStudentsArray = []
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.initReportPage(this.$route.params.id)
        },

        methods: {
            // 初始化报告页面
            initReportPage(stuId) {
                // 1.初始化需要获取当前班级下所有学生信息
                // coding...
                // 2.获取当前学生信息
              this.verageScore = stringUtil.getEvaluateArray();
              const loading = promptUtil.loading(this);
              intoReportBaseInfo(
                  qs.stringify({
                      school_id: storageUtil.readTeacherInfo().school_id,
                      student_id: stuId
                  })
              ).then(res => {
                if (res.code == SUCCESS_CODE) {
                  // 4.获取所有学生列表
                  getStuDetailList(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        teacher_id: storageUtil.readTeacherInfo().id,
                        role_id: storageUtil.readTeacherInfo().school_admin
                    })).then(res => {
                      if (res.code == SUCCESS_CODE) {
                          if (res.data && res.data != '[]') {
                            this.studentList = res.data
                            this.studentList.forEach(item => {
                                this.allStudentsArray.push.apply(this.allStudentsArray, item.options) // 获取所有学生信息
                            })
                            this.currentSelectChild = this.getStudentNameById(parseInt(stuId))
                          }
                      }}).catch(err => {
                        loading.close()
                        promptUtil.LOG("getStuDetailList-err", err);
                      })
                      if (res.data == '[]') {
                          loading.close();
                          promptUtil.wait(this);
                          return;
                      }
                      this.userBaseInfo = res.data;
                      this.$store.dispatch("setStudentWithReportName", this.userBaseInfo.name); // 触发消息action调用
                  this.routerConfig[1].name = this.$store.state.currentStudentName+'的学情报告'
                      // 3.获取报告列表
                      getReportList(
                          qs.stringify({
                              school_id: storageUtil.readTeacherInfo().school_id,
                              student_id: stuId
                          })
                      ).then(res => {
                          loading.close();
                          if (res.code == SUCCESS_CODE) {
                              this.queryFromServer = [];
                              if (res.data && res.data != '[]') {
                                  this.queryFromServer = this.anysisDataFromServer(res.data);
                              }
                              this.handleCurrentChange(1);
                          } else {
                              promptUtil.wait(this);
                          }
                      }).catch(err => {
                          loading.close();
                          promptUtil.LOG("getReportList-err", err);
                      });
                      loading.close();
                      } else {
                          loading.close();
                          promptUtil.wait(this);
                      }
                  }).catch(err => {
                    loading.close();
                    promptUtil.LOG("intoReportBaseInfo-err", err);
                  });
            },
            // 通过id获取当前学生姓名
            getStudentNameById(stuId) {
                let stuName = ""
                this.allStudentsArray.map(item => {
                    if (item.value == stuId) {
                        stuName = item.label
                    }
                })
                return stuName
            },
            // 点选切换学生时触发
            handleStudentChange(val) {
                this.$router.replace({
                    path: ROUTER_REPORT_INFO + val
                });
            },
            // 创建报告响应事件
            handleCreateReport() {
                //参数为当前学生id
                this.$router.push({
                    path: ROUTER_REPORT_CREATE + this.$route.params.id
                });
            },
            // 进入编辑报告页面
            goEditReportPage(obj) {
                //参数为当前学生id 和 当前任务id
                this.$router.push({
                    path:
                        ROUTER_REPORT_EDIT + this.$route.params.id + `/` + obj.row.id
                });
            },
            // 点击删除按钮时出发显示对话框
            showDeleleReportDialog(obj) {
                this.currentReportDetailId = obj.row.id;
                this.delDialogVisible = true
                this.delDialogContent = '您确定要删除【' + obj.row.name + '】这个报告吗？'
                this.currentDelReportIndex = obj.index + (this.currentPage - 1) * this.pageSize;
            },
            // 执行删除操作
            handleDelReport() {
                this.isLoadingWithDel = true
                delReportById(qs.stringify({report_id: this.currentReportDetailId})).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.queryFromServer.splice(this.currentDelReportIndex, 1);
                        this.tableData = this.queryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                        promptUtil.success(this, res.msg)
                    } else {
                        promptUtil.warning(this, res.msg)
                    }
                    this.delDialogVisible = false
                    this.isLoadingWithDel = false
                }).catch(err => {
                    this.delDialogVisible = false
                    this.isLoadingWithDel = false
                    promptUtil.LOG("delReportById-err", err)
                })
            },
            // 显示查看报告对话框
            showReportDialog(obj) {
                this.currentReportDetailId = obj.row.id;
                const loading = promptUtil.loading(this);
                getStudentReportDetail(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        task_id: this.currentReportDetailId
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
            },
            // 打开报告详情对话框回调
            reportDialogOpened() {
                echarts
                    .init(document.getElementById("echart-main"))
                    .setOption(
                        staticUtil.genECharts(this.reportDetailInfo.dimension, echarts)
                    );
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
            // 解析从服务器传过来的数据
            anysisDataFromServer(res) {
                const moment = require("moment");
                const data = res.map(item => {
                    item.update = moment(parseInt(item.update) * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                    return item;
                });
                return data;
            },
        },
        computed: {
            reportInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            }
        },
        watch: {
            $route() {
                this.routeParam = this.$route.params.id
            },
            routeParam() {
                this.initReportPage(this.routeParam)
            }
        }
    };
</script>
<style scoped>
  .div-task-info {
    width: 100%;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .div-report-title {
    margin-top: 20px;
    width: 100%;
    color: #666666;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .div-report-name {
    text-align: center;
    margin: auto;
    font-size: 16px;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

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
