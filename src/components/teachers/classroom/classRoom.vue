<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!-- 班级概况 -->
    <el-row>
      <el-col :span="16"><span style="font-weight: bold;font-size:18px;line-height: 44px">班级概览</span></el-col>
      <el-col :span="8">
        <div style="float:right">切换班级&nbsp;&nbsp;
          <el-select v-model="classList.currentClass" @change="handleChangeClass">
            <el-option
              v-for="item in classList.classes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card" shadow="always">
      <el-row>
        <el-col>班级:{{$store.state.currentClassRoomName}}</el-col>
      </el-row>
      <el-row>
        <el-col>教师:{{classInfo.teacher}}</el-col>
      </el-row>
      <div id="statisticInfo" style="height:300px;width: 100%;margin-top:10px;"></div>
    </el-card>
    <!-- 操作统计 -->
    <el-row style="margin-top: 30px;">
      <el-col :span="24"><span style="font-weight: bold;font-size:18px;">操作统计</span></el-col>
    </el-row>
    <el-card class="box-card" shadow="always">
      <div style="display: flex;">
        <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
        <div style="width:6%;line-height:20px;margin-left:5px;"><span v-show="handleInfo.currentSwitch">近一周</span><span
          v-show="!handleInfo.currentSwitch">近一月</span></div>
        <div style="width:60%;margin-left: 30px;"></div>
        <div style="width:30%;display: flex;justify-content: flex-end;">
          <el-switch
            v-model="handleInfo.currentSwitch"
            active-text="近一周"
            inactive-text="近一月">
          </el-switch>
        </div>
      </div>
      <el-row style="line-height: 36px;margin-top: 10px;">
        <div v-show="handleInfo.currentSwitch">
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">最近学生登录人数</div>
            <div class="handle-div" :style="{width:handleInfo.week[0]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.weekNum[0]}}人</span>
          </div>
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">累计发布任务数量</div>
            <div class="handle-div" :style="{width:handleInfo.week[1]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.weekNum[1]}}人</span>
          </div>
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">累计发布报告数量</div>
            <div class="handle-div" :style="{width:handleInfo.week[2]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.weekNum[2]}}人</span>
          </div>
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">累计完成作品数量</div>
            <div class="handle-div" :style="{width:handleInfo.week[3]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.weekNum[3]}}人</span>
          </div>
        </div>
        <div v-show="!handleInfo.currentSwitch">
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">最近学生登录人数</div>
            <div class="handle-div" :style="{width:handleInfo.month[0]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.monthNum[0]}}人</span>
          </div>
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">累计发布任务数量</div>
            <div class="handle-div" :style="{width:handleInfo.month[1]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.monthNum[1]}}人</span>
          </div>
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">累计发布报告数量</div>
            <div class="handle-div" :style="{width:handleInfo.month[2]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.monthNum[2]}}人</span>
          </div>
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <div style="width: 150px;">累计完成作品数量</div>
            <div class="handle-div" :style="{width:handleInfo.month[3]+'px'}"></div>
            <span style="margin-left: 30px;">{{handleInfo.monthNum[3]}}人</span>
          </div>
        </div>
      </el-row>
    </el-card>
    <!-- 许可状态 -->
    <div v-if="isShowStudentTable">
      <el-row style="margin-top: 30px;">
        <el-col :span="20"><span style="font-weight: bold;font-size:18px;">许可状态</span></el-col>
        <el-col :span="4">
          <!--        <el-button type="primary" @click.native="handlePermit($event,true)">使用许可</el-button>-->
          <el-button type="primary" @click.native="handlePermit">禁用许可</el-button>
          <!--        <el-button type="primary" @click.native="handlePermit($event,true)">禁用许可</el-button>-->
        </el-col>
      </el-row>
      <el-card class="box-card" shadow="always">
        <el-table ref="multipleTable" :default-sort="{prop: 'label', order: 'descending'}"
                  @selection-change="handleSelectionChange" :data="studentsData" border style="width: 100%;"
                  :header-row-style="{'color':'#409EFF'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column align="center" label="账号" prop="account"></el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope"><span style="font-weight: bold">{{scope.row.name}}</span></template>
          </el-table-column>
          <el-table-column sortable align="center" label="状态" prop="label">
            <template slot-scope="scope"><span style="font-weight: bold">{{scope.row.label}}</span></template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div v-show="scope.row.status==0">
                <el-button size="mini" type="success"
                           @click.native="handleUserPermit({index: scope.$index, row:scope.row})">使用许可
                </el-button>
              </div>
              <div v-show="scope.row.status==1">
                <el-button size="mini" type="danger"
                           @click.native="handleForbiddenPermit({index: scope.$index, row:scope.row})">禁用许可
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="studentsPageShow">
          <el-pagination
            background
            @current-change="studentsHandleCurrentChange"
            :current-page="currentStudentPage"
            :page-size="studentPageSize"
            layout="total, prev, pager, next, jumper"
            :total="studentList"
          ></el-pagination>
        </el-row>
      </el-card>
    </div>
    <!--许可弹框-->
    <el-dialog center title="应用许可" :visible.sync="dialogTableVisible" style="font-size: 40px; max-height:1000px"
               width="500px" @close="dialogTableVisible = false">
      <div style="font-size: 18px;">
        <div class="center">取得所有课程权限</div>
        <div class="center" style="margin-top:20px;"
             :style="{'flex-direction':selectedStudents.length>1?'column':'row'}">
          <div>将许可应用于学生：</div>
          <ul style="list-style: none;padding:0;font-size: 20px;overflow-y: auto;width: 145px;"
              :style="{'height':selectedStudents.length>1?'165px':'auto'}">
            <li v-for="item in selectedStudents" style="padding: 5px 0;text-align: center">{{item.name}}&nbsp;</li>
          </ul>
        </div>
        <p class="center">可用许可:{{permitNumber}}</p>
        <template>
          <div class="center" style="margin-bottom: 30px" v-show="showDialogTableList"> 选择状态码：
            <el-select v-model="codeId" placeholder="请选择" style="min-width: 284px">
              <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.id"
                >
                  <span style="float: left; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  <span style="float: right">{{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </div>
        </template>
        <!--          表格结束-->
        <div class="center" style="flex-direction: column;font-size: 15px;">
          <button v-show="showPermit" type="button" class="el-button el-button--primary"
                  @click="closeDialog($event,true)" style="margin-bottom: 20px;width: 300px;"
                  :loading="isLoadingPermit">应用许可
          </button>
          <button v-show="!showPermit" type="button" class="el-button el-button--danger" @click="closeDialog"
                  style="margin-bottom: 20px;width: 300px;" :loading="isLoadingDisablePermit">禁用许可
          </button>
          <p class="center" style="cursor: pointer;">获取更多许可</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const echarts = require("echarts")
  import storageUtil from "../../../utils/storageUtil"
  import promptUtil from '../../../utils/promptUtil'
  import vuexUtils from '../../../utils/vuexUtils'
  import '../../../router/router';
  import {
    qs,
    seeClass,
    getAllClass,
    searchWeekMonth,
    permitStatusTableList,
    dislogTableList,
    saveApplicationPermit,
    savedialogSelect,
    disableApplicationPermit
  } from "@/api/api.js";
  import childHeader from '../../component/childHeader';
  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        routerConfig: [{name:'班级管理',to:'/classMan'},{name:this.$store.state.currentClassRoomName,to:''}],
        isLoadingPermit: false,
        isLoadingDisablePermit: false,
        selectedStudentsArray: [],
        status: true,
        studentId: '',//dialog应用许可按钮传值
        weekNumArray: [],//操作统计图
        weekArray: [],//人数
        allClassNames: [],//获取所有班级
        teacherName: '',
        reportEchartsArray: [],//报告数组
        personEchartsArray: [],//人数数组
        worksEchartsArray: [],//作品数组
        showDialogTableList: true,//展示许可弹框中的table
        routeParam: "", // 路由参数，班级id
        classList: { // 班级列表
          currentClass: '',
          classes: [{id: "", value: "", label: ""}]
        },
        studentDataFromServer: [], // 学生列表从服务器返回数据
        studentsData: [], // 学生列表数据
        studentsPageShow: false, // 默认隐藏学生列表分页
        studentPageSize: 10, // 默认学生列表分页值
        currentStudentPage: 1, // 班级学生列表分页当前页码
        classInfo: { // 班级概况
          teacher: "", // 教师昵称
          chartData: { // chart图数据
            year: "", // 统计的年份
            seriesData: [] // 统计数据
          }
        },
        handleInfo: { // 操作统计
          currentSwitch: true, // true 近一周 / 近一月
          week: [], weekNum: [], month: [], monthNum: []
        },
        statisticsChart: null, // 统计charts
        dialogTableVisible: false,//控制许可弹框可见
        selectedStudents: [],//选中学生
        dialogMultipleTable: [],//选中的许可码
        permitNumber: 0,//可许可学生数
        showPermit: true,//显示弹框中许可按钮
        dialogVisible: false,//控制弹框可见性
        multipleSelection: [], //复选框选中行
        options: [],
        codeId: '',
        monthEchartsArray: [],
        isShowStudentTable: false,
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      if (this.$store.state.currentClassRoomName && this.$store.state.currentClassRoomName != "") {
        this.getAllClassMethods()
        this.initDataMethod(this.$route.params.id)

      } else {
        this.$router.replace({path: "/classMan"})
      }
    },
    methods: {
      getAllClassMethods() {
        //获取所有班级
        getAllClass(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            teacher_id: storageUtil.readTeacherInfo().id,
            role_id: storageUtil.readTeacherInfo().school_admin
          })
        )
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              this.allClassNames = [];
              if (res.data && res.data != '[]') {
                res.data.forEach(item => {
                  const classObj = {value: item.id, label: item.class_name};
                  this.allClassNames.push(classObj);
                });
                //this.classList.currentClass选择班级的id
              }
            } else {
              promptUtil.wait(this);
            }
          })
          .catch(err => {
            PubSub.publish("currentMenuIndex", "/studyMan");
            promptUtil.LOG('getAllClass-err',err);
          });
      },
      // 初始化数据方法
      initDataMethod(classId) {
        //操作统计
        this.handleInfo.weekNum = []
        this.handleInfo.week = []
        this.handleInfo.monthNum = []
        this.handleInfo.month = []
        this.statisticsChart = echarts.init(document.getElementById('statisticInfo'))
        this.statisticsChart.showLoading()
        searchWeekMonth(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          class_id: classId,
          user_id: storageUtil.readTeacherInfo().id,
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.handleInfo.weekNum.push(res.data.week.student_num)
              this.handleInfo.weekNum.push(res.data.week.renwu)
              this.handleInfo.weekNum.push(res.data.week.baogao)
              this.handleInfo.weekNum.push(res.data.week.zuopin)
              this.handleInfo.week.push(res.data.week.student_num * 100)
              this.handleInfo.week.push(res.data.week.renwu * 100)
              this.handleInfo.week.push(res.data.week.baogao * 100)
              this.handleInfo.week.push(res.data.week.zuopin * 100)
              this.handleInfo.monthNum.push(res.data.month.student_num)
              this.handleInfo.monthNum.push(res.data.month.renwu)
              this.handleInfo.monthNum.push(res.data.month.baogao)
              this.handleInfo.monthNum.push(res.data.month.zuopin)
              this.handleInfo.month.push(res.data.month.student_num * 100)
              this.handleInfo.month.push(res.data.month.renwu * 100)
              this.handleInfo.month.push(res.data.month.baogao * 100)
              this.handleInfo.month.push(res.data.month.zuopin * 100)
            }
          } else if (res.code == ERROR_CODE_) {
            promptUtil.warning(this, res.msg)
          } else {
            promptUtil.wait(this);
          }
        }).catch(error => {
          promptUtil.LOG('searchWeekMonth-err',error);
        });
        //页面刷新 柱状图
        seeClass(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          class_id: this.$route.params.id,
          user_id: storageUtil.readTeacherInfo().id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            this.monthEchartsArray = res.data.month
            this.reportEchartsArray = res.data.baogao
            this.personEchartsArray = res.data.renshu
            this.worksEchartsArray = res.data.zuopin
            this.classInfo.teacher = res.data.teacher_name
            // this.classList.classes = [{value: "1", label: "Scratch3.0科创"}, {value: "2", label: "SteanX科创"}]
            this.classList.classes = this.allClassNames
            this.classList.currentClass = this.getClassNameById(classId)
            // this.classInfo.teacher = "涛涛老师"
            // this.classInfo.chartData.seriesData = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2]]
            this.classInfo.chartData.seriesData = []
            this.classInfo.chartData.seriesData.push(this.reportEchartsArray)
            this.classInfo.chartData.seriesData.push(this.personEchartsArray)
            this.classInfo.chartData.seriesData.push(this.worksEchartsArray)
          } else if (res.code == ERROR_CODE_) {
            promptUtil.warning(this, res.msg)
          } else {
            promptUtil.wait(this);
          }
          this.genStatisticsChart()
        }).catch(error => {
          promptUtil.LOG('seeClass-err',error);
        });
          //   this.handleInfo.month = [600, 500, 200, 300]
          // this.handleInfo.monthNum = [6, 5, 2, 3]
          //获取dialog中的列表
          // const moment = require("moment");
          // moment(this.ruleForm.liveShelUnderTime[0]).format("YYYY-MM-DD HH:mm:ss")
        this.getStatusCode();
        //获取许可状态列表
        this.studentsData = []
        this.studentDataFromServer = []
        if(!this.checkStudentTableShow()){
          return
        }
        if(this.$store.state.systemMenu && this.$store.state.systemMenu.findIndex(item=>item.url=="permission")>=0){
          permitStatusTableList(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            class_id: classId
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              if (res.data && res.data != "[]") {
                for (var i = 0; i < res.data.length; i++) {
                  const obj = {
                    id: res.data[i].id,
                    account: res.data[i].username,
                    name: res.data[i].real_name,
                    label: res.data[i].code == 0 ? "未分配名额" : "已分配名额",
                    status: res.data[i].code == 0 ? 0 : 1
                  }
                  this.studentDataFromServer.push(obj)
                  this.studentsHandleCurrentChange(1);
                }
              }
            } else if (res.code == ERROR_CODE_) {
              promptUtil.warning(this, res.msg)
            } else {
              promptUtil.wait(this);
            }
          }).catch(err => {
            promptUtil.LOG('permitStatusTableList-err',err);
          })
        }
      },
      checkStudentTableShow(){
        const systemArray = []
        this.$store.state.systemMenu.map(item=>{
          if(item.children && item.children.length>0){
            item.children.map(menu=>systemArray.push(menu))
          }
        })
        this.isShowStudentTable = vuexUtils.checkMenuExist(this,'permission')
        return status
      },
      // 对指定学生使用许可
      handleUserPermit(obj) {
        this.studentId = obj.row.id
        this.showPermit = true;
        this.showDialogTableList = true
        this.selectedStudents = [];
        this.dialogTableVisible = true;
        this.selectedStudents.push(obj.row);
        this.getStatusCode();
      },
      // 对指定学生禁用许可
      handleForbiddenPermit(obj) {
        this.handleUserPermit(obj)
        this.showDialogTableList = false
        this.showPermit = false;
      },
      handlePermit(event, param) {
        if (this.multipleSelection.length == 0) {
          promptUtil.warning(this, '请选择要许可的学生');
          return;
        }
        this.selectedStudents = [];
        this.selectedStudents = this.multipleSelection
        this.showDialogTableList = false
        this.showPermit = false;
        this.dialogTableVisible = true;
      },
      //关闭弹框
      closeDialog(event, param) {
        if (param) {
          if (this.codeId == "") {
            promptUtil.warning(this, "请选择状态码")
            return
          }
          this.isLoadingPermit = true
          saveApplicationPermit(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            student_id: this.studentId,
            code_id: this.codeId
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              this.isLoadingPermit = false
              promptUtil.success(this, res.msg)
              this.dialogTableVisible = false;
              this.codeId = ""
              this.permitNumber--;
            } else if (res.code == ERROR_CODE) {
              promptUtil.error(this, res.msg)
            } else {
              promptUtil.wait(this);
            }
          }).catch(err => {
            promptUtil.LOG('saveApplicationPermit-err',err);
          })
          this.selectedStudents.forEach(item => {
            item.status = 1;
            item.label = '已分配名额';
          })
        } else {
          this.selectedStudentsArray = []
          this.selectedStudents.forEach(item => {
            this.selectedStudentsArray.push(item.id)
          })
          this.isLoadingDisablePermit = true
          disableApplicationPermit(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            student_id: JSON.stringify(this.selectedStudentsArray)
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              this.isLoadingDisablePermit = false
              promptUtil.success(this, res.msg)
              this.dialogTableVisible = false;
              this.$refs.multipleTable.clearSelection();
            } else if (res.code == ERROR_CODE) {
              promptUtil.error(this, res.msg)
            } else {
              promptUtil.wait(this);
            }
          }).catch(err => {
            promptUtil.LOG('disableApplicationPermit-err',err);
          })
          this.selectedStudents.forEach(item => {
            item.status = 0;
            item.label = '未分配名额';
          })
        }
      },
      // 班级学生列表分页出发函数
      studentsHandleCurrentChange(val) {
        this.currentStudentPage = val
        this.studentsData = this.studentDataFromServer.slice(
          (this.currentStudentPage - 1) * this.studentPageSize,
          this.studentPageSize + (this.currentStudentPage - 1) * this.studentPageSize
        )
      },
      // 点选切换班级
      handleChangeClass(val) {
        this.$store.dispatch("setCurrentClassName", this.getClassNameById(val))
        this.$router.replace({
          path: ROUTER_CLASS_ROOM + val
        });
        if(this.allClassNames.length>0){
          let classObj = this.allClassNames.find(item=>item.value==val)
          this.routerConfig = [{name:'班级管理',to:'/classMan'},{name:classObj.label,to:''}]
        }else{
          this.routerConfig = [{name:'班级管理',to:'/classMan'}]
        }
      },
      // 根据id获取班级名称
      getClassNameById(classId) {
        let className = ""
        this.classList.classes.forEach(item => {
          if (item.value == classId) {
            className = item.label
          }
        })
        return className
      },
      // 生成统计数据chart
      genStatisticsChart() {
        setTimeout(() => {
          this.statisticsChart.hideLoading()
          var labelOption = {
            normal: {
              show: true,
              position: 'insideBottom',
              distance: 15,
              align: 'center',
              verticalAlign: 'middle',
              rotate: -90,
              formatter: '{c}  {name|{a}}',
              fontSize: 16,
              rich: {
                name: {
                  textBorderColor: '#fff'
                }
              }
            }
          };
          const seriesDetailData = [{name: '任务'}, {name: '报告'}, {name: '作品'}]
          seriesDetailData.map(item => {
            item.type = 'bar'
            item.label = labelOption
            switch (item.name) {
              case "任务":
                item.data = this.classInfo.chartData.seriesData[0]
                break;
              case "报告":
                item.data = this.classInfo.chartData.seriesData[1]
                break;
              case "作品":
                item.data = this.classInfo.chartData.seriesData[2]
                break;
            }
            return item
          })
          const option = {
            color: ['#188df0', '#006699', '#83bff6'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['任务', '报告', '作品']
            },
            toolbox: {
              show: true,
              orient: 'horizontal',
              left: 'right',
              top: 'top',
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                // saveAsImage: {show: true}
              }
            },


              // toolbox: {
              //     show : true,
              //     // orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
              //     //                            // 'horizontal' ¦ 'vertical'
              //     x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
              //                                // 'center' ¦ 'left' ¦ 'right'
              //                                // ¦ {number}（x坐标，单位px）
              //     y: '120',                  // 垂直安放位置，默认为全图顶端，可选为：
              //                                // 'top' ¦ 'bottom' ¦ 'center'
              //                                // ¦ {number}（y坐标，单位px）
              //     feature : {
              //         saveAsImage : {
              //             show: true
              //         }
              //     }
              // },









            calculable: true,
            xAxis: [
              {
                name: this.classInfo.chartData.year,
                type: 'category',
                axisTick: {show: false},
                data: this.monthEchartsArray
              }
            ],
            yAxis: [
              {
                name: '数量',
                type: 'value'
              }
            ],
            series: seriesDetailData
          }
          this.statisticsChart.setOption(option);
          window.onresize = this.statisticsChart.resize;
        }, 5)
      }
      ,
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
      ,
      handleDialogSelectionChange(val) {
        this.dialogMultipleTable = []
      },
      getStatusCode(){
        savedialogSelect(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id: storageUtil.readTeacherInfo().id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.options = res.data
              this.permitNumber = 0;
              this.options.forEach(item=>{
                this.permitNumber += item.options.length;
              });
            }
          } else if (res.code == ERROR_CODE_) {
            promptUtil.warning(this, res.msg)
          } else {
            promptUtil.wait(this);
          }
        }).catch(err => {
          promptUtil.LOG('savedialogSelect-err',err);
        })
      }

    }
    ,
    watch: {
      $route() {
        this.routeParam = this.$route.params.id
      }
      ,
      routeParam() {
        // this.dataClear()
        this.initDataMethod(this.routeParam)
      }
      ,
    }
    ,
    computed: {
      studentList: {
        get() {
          if (this.studentDataFromServer.length > this.studentPageSize) {
            this.studentsPageShow = true
          } else {
            this.studentsPageShow = false
          }
          return this.studentDataFromServer.length;
        }
      }
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

  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 5px 12px 0 #00a2ff30;
  }

  .handle-div {
    height: 16px;
    background: #00a2ff77;
    border-radius: 5px;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-dialog__title {
    font-size: 28px;
  }

  .el-dialog__body {

    height: 600px !important;
  }

  .el-select-dropdown__wrap {
    max-height: 170px !important;
  }
</style>
