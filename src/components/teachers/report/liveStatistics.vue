<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <div class="header-title">直播课概况</div>
    <div class="header-wrapper">
      <el-card class="box-card header-wrapper-card" shadow="always">
        <div>
          <div class="header-wrapper-card-title">本日参课总人数</div>
          <div class="header-wrapper-card-content-wrap">
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=liveClassStatistics.today.endVal :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
            </div>
            <div class="header-wrapper-content-wrap-div-img">
              <img :src=liveClassStatistics.today.url />
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card header-wrapper-card" shadow="always" style="margin-left:20px">
        <div>
          <div class="header-wrapper-card-title">直播课最高峰</div>
          <div class="header-wrapper-card-content-wrap">
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=liveClassStatistics.highest.endVal :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
            </div>
            <div class="header-wrapper-content-wrap-div-img">
              <img :src=liveClassStatistics.highest.url />
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card header-wrapper-card" shadow="always" style="margin-left:20px">
        <div>
          <div class="header-wrapper-card-title">本日直播课次</div>
          <div class="header-wrapper-card-content-wrap">
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=liveClassStatistics.todayNum.endVal :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">课次</span>
            </div>
            <div class="header-wrapper-content-wrap-div-img">
              <img :src=liveClassStatistics.todayNum.url />
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card header-wrapper-card" shadow="always" style="margin-left:20px">
        <div>
          <div class="header-wrapper-card-title">参加直播总人次</div>
          <div class="header-wrapper-card-content-wrap">
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=liveClassStatistics.allPeopleNum.endVal :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
            </div>
            <div class="header-wrapper-content-wrap-div-img">
              <img :src=liveClassStatistics.allPeopleNum.url />
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card header-wrapper-card" shadow="always" style="margin-left:20px">
        <div>
          <div class="header-wrapper-card-title">开设直播总课次</div>
          <div class="header-wrapper-card-content-wrap">
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=liveClassStatistics.liveAllNum.endVal :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">课次</span>
            </div>
            <div class="header-wrapper-content-wrap-div-img">
              <img :src=liveClassStatistics.liveAllNum.url />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!--      card-->
    <el-card class="box-card" shadow="always" style="margin-top:20px">
      <div style="display:flex;">
        <div class="filter-title-wrapper">
          <div class="filter-title-wrapper-box">
            <div class="title-circle"/>
            <div>上课学生人次&nbsp;:&nbsp;</div>
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=charts.studentNum :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
            </div>
            <div class="title-circle" style="margin-left:20px"/>
            <div>上课教师人次&nbsp;:&nbsp;</div>
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=charts.teacherNum :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
            </div>
          </div>
          <div class="filter-title-wrapper-box">
            <div class="title-circle"/>
            <div>直播课次&nbsp;:&nbsp;</div>
            <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal=charts.livesNum :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">课次</span>
            </div>
          </div>
        </div>
        <!--          选择时间-->
        <div style="flex:2;display:flex;justify-content:flex-end;align-items:flex-start;">
          <div style="display:flex;justify-content:flex-end;align-items:center;">
            <el-link :underline="false" style="margin-right:20px" :type="filter.currentDays==0 ? 'primary' : 'info'"
                     @click="handleClickDays(0)">7天
            </el-link>
            <el-link :underline="false" style="margin-right:20px" :type="filter.currentDays==1 ? 'primary' : 'info'"
                     @click="handleClickDays(1)">30天
            </el-link>
            <el-link :underline="false" style="margin-right:20px" :type="filter.currentDays==2 ? 'primary' : 'info'"
                     @click="handleClickDays(2)">90天
            </el-link>
            <el-date-picker
              v-model=filter.dateFrame
              type="daterange"
              size="small"
              @change="handleChangeDate"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <!--        echart-->
      <div class="echart-wrapper">
        <div id="stackStatistics" :style="{height:'430px',width:charts.stackWidth+'px'}"/>
      </div>
    </el-card>
    <div class="header-title">直播课详情</div>
    <el-card class="box-card" shadow="always">
      <div class="live-class-info-wrapper">
        <el-radio-group v-model="filter.tableType">
          <el-radio-button label="1">学生</el-radio-button>
          <el-radio-button label="2">教师</el-radio-button>
        </el-radio-group>

      </div>
      <el-divider></el-divider>
      <div class="live-info-filter-wrapper">
        <el-date-picker v-model="filter.studentTableDate" v-show="filter.tableType==1" :clearable="false"
                        @change="handleChangeRecordStudentPicker"
                        type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        size="small"></el-date-picker>
        <el-date-picker v-model="filter.teacherTableDate" v-show="filter.tableType==2" :clearable="false"
                        @change="handleChangeRecordTeacherPicker"
                        type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        size="small"></el-date-picker>
        <el-select
          v-show="filter.tableType==2"
          v-model="filter.teacherArray"
          size="small" multiple collapse-tags style="margin-left: 20px;"
          clearable
          placeholder="请选择教师">
          <el-option
            v-for="item in filter.teacherPackage"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <div style="display: flex;align-items: center">
              <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
              <div style="margin-left: 40px">{{ item.label }}</div>
            </div>
          </el-option>
        </el-select>
        <el-select
          v-show="filter.tableType==1"
          v-model="filter.studentArray"
          clearable
          size="small" multiple collapse-tags style="margin-left: 20px;"
          @change="changeStudent"
          placeholder="请选择学生">
          <el-option
            v-for="item in filter.studentPackage"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select
          v-show="filter.tableType==1"
          v-model="filter.classroomArray"
          size="small" multiple collapse-tags style="margin-left: 20px;"
          clearable
          placeholder="请选择班级">
          <el-option
            v-for="item in filter.classroomPackage"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-divider></el-divider>
      <div style="display:flex;margin-top:-10px;margin-bottom:12px;">
        <div style="flex:1">
          <el-button plain size="small" @click="exportRecordResult">导出当前结果</el-button>
        </div>
        <div style="flex:1;display:flex;justify-content:flex-end;">
          <el-button type="primary" plain size="small" @click="handleClickQuery">查询</el-button>
        </div>
      </div>
      <div v-show="filter.tableType==1">
        <el-table :data="tableData.studentTableData" border style="width: 100%" @expand-change="expandChangeClick">
          <el-table-column type="expand" style="margin:0;padding:0">
            <template slot-scope="props">
              <el-form style="margin: 0;padding:0">
                <el-table :data="props.row.tableData" border style="width: 100%">
                  <el-table-column prop="date" align="center" label="上课时间"></el-table-column>
                  <el-table-column prop="name" align="center" label="直播课名称"></el-table-column>
                  <el-table-column  align="center" label="进出教室时间">
                  <template slot-scope="scope">
                    <div v-for="item in scope.row.intoDate">
                      <div>{{item}}</div>
                    </div>
                  </template>
                  </el-table-column>
                  <el-table-column prop="beginClass" align="center" label="应上课次" width="120"></el-table-column>
                  <el-table-column prop="realClass" align="center" label="实上课次" width="120"></el-table-column>
                </el-table>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="student" align="left" label="学员"></el-table-column>
          <el-table-column prop="classNumber" align="center" label="应上课次" width="120"></el-table-column>
          <el-table-column prop="actualNumber" align="center" label="实上课次" width="120"></el-table-column>
        </el-table>
        <!--    分页-->
          <als-pagination :size="8" @tableData="changeStudentTableData($event)" @currentPage="changeStudentPage($event)"
                            ref="alsPageination" style="margin-top:20px"/>
      </div>
      <div v-show="filter.tableType==2">
        <el-table :data="tableData.teacherTableData" border style="width: 100%" @expand-change="expandChangeClick">
          <el-table-column type="expand" style="margin:0;padding:0">
            <template slot-scope="props">
              <el-form style="margin: 0;padding:0">
                <el-table :data="props.row.tableData" border style="width: 100%">
                  <el-table-column prop="date" align="center" label="上课时间"></el-table-column>
                  <el-table-column prop="name" align="center" label="直播课名称"></el-table-column>
                  <el-table-column  align="center" label="学员信息">
                    <template slot-scope="scope">
                      <div v-for="item in scope.row.studentInfo">
                        <el-tooltip class="item" effect="light" placement="top-start">
                          <div slot="content" style="margin-top: -8px">
                            <p><i class="el-icon-user-solid"></i><img :src=item.avatar alt="" style="width:20px;height: 20px;margin-left:10px;margin-top:5px;border-radius: 50%"></p>
                            <p v-if="item.phone!=''"><i class="el-icon-phone"></i><span style="margin-left: 10px">{{item.phone}}</span>  </p>
                            <p><i class="el-icon-s-cooperation"></i><span style="margin-left: 10px">{{item.class_name}}</span></p>
                            <p><i class="el-icon-s-claim"></i><span style="margin-left: 10px">{{item.type_str}}</span></p>
                          </div>
<!--                        type 1 以上课 绿色   未上课 0 蓝色   待上课 2 红色>-->
                          <div style="float: left;margin-left: 2px">
                          <div v-if="item.type==1">
                            <el-tag style="cursor: pointer" type="success" size="mini">{{item.name}}</el-tag>
                          </div>
                          <div v-if="item.type==0">
                            <el-tag style="cursor: pointer" size="mini">{{item.name}}</el-tag>
                          </div>
                          <div v-if="item.type==2">
                            <el-tag style="cursor: pointer" type="danger" size="mini">{{item.name}}</el-tag>
                          </div>
                          </div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="intoDate" align="center" label="进出教室时间">
                    <template slot-scope="scope">
                      <div v-for="item in scope.row.intoDate">
                        <div>{{item}}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="classNum" align="center" label="学员人次" width="120"></el-table-column>
                  <el-table-column prop="realNum" align="center" label="实上课次" width="120"></el-table-column>
                </el-table>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="teacher" align="left" label="讲师"></el-table-column>
          <el-table-column prop="classNumber" align="center" label="学员人次" width="120"></el-table-column>
          <el-table-column prop="actualNumber" align="center"  label="实上课次" width="120"></el-table-column>
        </el-table>
        <!--    分页-->
        <als-pagination :size="8" @tableData="changeTeacherTableData($event)" @currentPage="changeTeacherPage($event)"
                        ref="alsTeacherPageination"  style="margin-top:20px"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
const echarts = require("echarts");
import $ from "jquery";
const moment = require("moment");
import countTo from "vue-count-to";
import childHeader from "../../../components/component/childHeader";
import timeUtil from "../../../utils/timeUtil";
import vuexUtils from "../../../utils/vuexUtils";
import promptUtil from "../../../utils/promptUtil";
import storageUtil from "../../../utils/storageUtil";
import pagination from "../../commons/pagination/pagination";
import {
  qs,
  getAllHourFilterData,
  getIntoAddClassData,
  getLiveStatisticsInformation,
  getLiveStudentTableInformation,
  getLiveTeacherTableInformation,
  getLiveEchartsInformation,
  exportExcel
} from "../../../api/api";
import "../../../api/restfulapi";

export default {
  name: "liveStatistics",
  components: {
    "als-child-header": childHeader,
    "als-count-to": countTo,
    "als-pagination": pagination
  },
  data() {
    return {
      routerConfig: [{ name: "", to: "" }],
      liveClassStatistics: {
        today: { endVal: null, url: "" },
        highest: { endVal: null, url: "" },
        todayNum: { endVal: null, url: "" },
        allPeopleNum: { endVal: null, url: "" },
        liveAllNum: { endVal: null, url: "" }
      },
      filter: {
        dateFrame: [],
        currentDays: 0,
        tableType: 1,
        studentTableDate: [],
        teacherTableDate: [],
        studentArray: [],
        studentPackage: [],
        classroomArray: [],
        classroomPackage: [],
        teacherArray: [],
        teacherPackage: []
      },
      tableData: { studentTableData: [], teacherTableData: [] },
      charts: {
        livesNum: null,
        studentNum: null,
        teacherNum: null,
        stack: null,
        stackWidth: 0,
        stackData: {
          date: [],
          data: {
            student: [],
            teacher: [],
            lives: []
          }
        }
      },
      currentPage: 1,
      teacherCurrentpage: 1,
      currentDay: [],
      currentStartDay: "",
      currentEndtDay: "",
      currentMonth: [],
      currentThreeMonthStartTime: "",
      currentThreeMonthEndtTime: ""
    };
  },
  created() {
    this.charts.stackWidth =
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) - 300;
  },
  mounted() {
    PubSub.publish("currentMenuIndex", "/liveStatistics");
    const name =
      vuexUtils.checkMenuExist(this, "liveStatistics").target &&
      vuexUtils.checkMenuExist(this, "liveStatistics").target.name
        ? vuexUtils.checkMenuExist(this, "liveStatistics").target.name
        : "直播统计";
    this.routerConfig[0].name = name;
    this.filter.studentTableDate = timeUtil.getCurrWeekDays("/").split("-");
    this.filter.teacherTableDate = timeUtil.getCurrWeekDays("/").split("-");
    this.currentDay = timeUtil.getCurrWeekDays("/").split("-");
    this.currentStartDay = moment(this.currentDay[0]).format("YYYY-MM-DD");
    this.currentEndtDay = moment(this.currentDay[1]).format("YYYY-MM-DD");
    this.getAllClassFilterData();
    promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id); // true 表示已过期 false表示未过期
    this.charts.stack = echarts.init(
      document.getElementById("stackStatistics")
    );
    this.genStackStatisticsChart();
    this.getLiveSurvey();
    this.getLiveStudentTable();
    this.getLiveTeacherTable();
    this.getLiveEcharts(this.currentStartDay, this.currentEndtDay);
  },
  methods: {
    //获取直播课概况数据
    getLiveSurvey() {
      getLiveStatisticsInformation(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.liveClassStatistics = res.data.liveClassStatistics;
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("getLiveStatisticsInformation-err", err);
        });
    },
    getLiveEcharts(startTime, endTime) {
      getLiveEchartsInformation(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          start_time: startTime,
          end_time: endTime
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.charts.livesNum = res.data.lives;
              this.charts.studentNum = res.data.student;
              this.charts.teacherNum = res.data.teacher;
              this.charts.stackData.date = res.data.date;
              this.charts.stackData.data = res.data.data;
              this.genStackStatisticsChart();
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("getLiveEchartsInformation-err", err);
        });
    },
    //获取学生table数据
    getLiveStudentTable() {
      const loading = promptUtil.loading(this);
      getLiveStudentTableInformation(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          start_time: moment(this.filter.studentTableDate[0]).format(
            "YYYY-MM-DD"
          ),
          end_time: moment(this.filter.studentTableDate[1]).format(
            "YYYY-MM-DD"
          ),
          student_id: this.filter.studentArray,
          class_id: this.filter.classroomArray
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.tableData.studentTableData = res.data.studentTableData;
              this.$refs.alsPageination.setCurrentPage(this.currentPage);
              this.$refs.alsPageination.setServerData(
                this.tableData.studentTableData
              );
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          }
          loading.close();
        })
        .catch(err => {
          promptUtil.LOG("getLiveTableInformation-err", err);
        });
    },
    //获取table数据
    getLiveTeacherTable() {
      const loading = promptUtil.loading(this);
      getLiveTeacherTableInformation(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          start_time: moment(this.filter.teacherTableDate[0]).format(
            "YYYY-MM-DD"
          ),
          end_time: moment(this.filter.teacherTableDate[1]).format(
            "YYYY-MM-DD"
          ),
          teacher_id: this.filter.teacherArray
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.tableData.teacherTableData = res.data.teacherTableData;
              this.$refs.alsTeacherPageination.setCurrentPage(this.currentpage);
              this.$refs.alsTeacherPageination.setServerData(
                this.tableData.teacherTableData
              );
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          }
          loading.close();
        })
        .catch(err => {
          promptUtil.LOG("getLiveTableInformation-err", err);
        });
    },
    //学生切换分页
    changeStudentTableData(val) {
      this.tableData.studentTableData = val;
    },
    changeStudentPage(data) {
      this.currentpage = data;
    },
    //教师切换分页
    changeTeacherTableData(val) {
      this.tableData.teacherTableData = val;
    },
    changeTeacherPage(data) {
      // this.teacherCurrentpage = data
      this.currentpage = data;
    },

    getExcelFromUrl(url) {
      promptUtil.success(this, "数据准备完毕,等待下载中");
      window.open(url, "_self");
    },

    expandChangeClick(row) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          $(".el-table__expanded-cell[class*=cell]")
            .css("padding", 0)
            .css("margin", 0);
        }, 50 * i);
      }
    },
    //选择学生
    changeStudent(val) {},
    //导出当前结果
    exportRecordResult() {
      if (this.filter.tableType == 1) {
        const targetParams = [];
        const params = { head: [], body: [], name: "" };
        const startTime = moment(this.filter.studentTableDate[0]).format(
          "YYYY-MM-DD"
        );
        const endTime = moment(this.filter.studentTableDate[1]).format(
          "YYYY-MM-DD"
        );
        params.name = startTime + "—" + endTime + "学生直播课信息";
        params.head = [
          "学员",
          "上课时间",
          "直播课名称",
          "进出教室时间",
          "应上课次数",
          "实上课次数"
        ];
        this.tableData.studentTableData.map(item => {
          let studentName = item.student;
          if (item.tableData.length != 0) {
            item.tableData.map(val => {
              const tmpArr = [];
              tmpArr.push(studentName);
              tmpArr.push(val.date);
              tmpArr.push(val.name);
              tmpArr.push(val.intoDate.join(" "));
              tmpArr.push(val.beginClass);
              tmpArr.push(val.realClass);
              targetParams.push(tmpArr);
            });
          }
        });

        params.body = targetParams;
        // console.log("studentparams", params);
        exportExcel(qs.stringify({ data: JSON.stringify(params) }))
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, "数据准备完毕,等待下载中");
              window.open(res.data, "_self");
            }
          })
          .catch(err => {
            promptUtil.LOG("exportExcel-err", err);
          });
      } else {
        const targetParams = [];
        const params = { head: [], body: [], name: "" };
        const startTime = moment(this.filter.studentTableDate[0]).format(
          "YYYY-MM-DD"
        );
        const endTime = moment(this.filter.studentTableDate[1]).format(
          "YYYY-MM-DD"
        );
        params.name = startTime + "—" + endTime + "教师直播课信息";
        params.head = [
          "讲师",
          "直播课名称",
          "学员信息",
          "进出教室时间",
          "学员人次",
          "实上课次"
        ];
        this.tableData.teacherTableData.map(item => {
          let teachertName = item.teacher;
          if (item.tableData.length != 0) {
            item.tableData.map(val => {
              const tmpArr = [];
              tmpArr.push(teachertName);
              tmpArr.push(val.name);
              var studentInforArray = [];
              val.studentInfo.map(student => {
                const obj = {
                  name: student.name,
                  className: student.class_name,
                  phone: student.phone,
                  type: student.type_str
                };
                studentInforArray.push(obj);
              });
              var str = studentInforArray
                .map(function(obj, index) {
                  return obj.name + obj.className + obj.phone + obj.type;
                })
                .join(" ");

              tmpArr.push(str);
              tmpArr.push(val.intoDate.join(" "));
              tmpArr.push(val.classNum);
              tmpArr.push(val.realClass);
              targetParams.push(tmpArr);
            });
          }
        });
        params.body = targetParams;
        // console.log("teacherparams", params);
        exportExcel(qs.stringify({ data: JSON.stringify(params) }))
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, "数据准备完毕,等待下载中");
              window.open(res.data, "_self");
            }
          })
          .catch(err => {
            promptUtil.LOG("exportExcel-err", err);
          });
      }
       },
    //查询
    handleClickQuery() {
      this.getSearchDataList(this.filter.tableType);
    },
    getSearchDataList(type) {
      const loading = promptUtil.loading(this);
      if (type == 1) {
        this.getLiveStudentTable();
      } else {
        this.getLiveTeacherTable();
      }
    },
    handleChangeRecordStudentPicker(val) {},
    handleChangeRecordTeacherPicker() {},
    getAllClassFilterData() {
      getAllHourFilterData(
        qs.stringify({ school_id: storageUtil.readTeacherInfo().school_id })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.filter.classroomPackage = res.data.classroomPackage;
              this.filter.studentPackage = res.data.studentPackage;
              this.filter.teacherPackage = res.data.teacherPackage;
            }
          }
        })
        .catch(err => {
          promptUtil.LOG("getAllHourFilterData-err", err);
        });
    },
    genStackStatisticsChart() {
      this.charts.stack.showLoading();
      const option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["学生人次", "教师人次", "直播课次"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        color: ["#d48265", "#91c7ae", "#00A2FF"],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.charts.stackData.date
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "学生人次",
            type: "line",
            stack: "总量",
            data: this.charts.stackData.data.student
          },
          {
            name: "教师人次",
            type: "line",
            stack: "总量",
            data: this.charts.stackData.data.teacher
          },
          {
            name: "直播课次",
            type: "line",
            stack: "总量",
            data: this.charts.stackData.data.lives
          }
        ]
      };
      setTimeout(() => {
        this.charts.stack.hideLoading();
        this.charts.stack.setOption(option);
      }, 1000);
    },
    handleChangeDate(date) {
      try {
        let startTime = moment(date[0]).format("YYYY-MM-DD");
        let endTime = moment(date[1]).format("YYYY-MM-DD");
        this.getLiveEcharts(startTime, endTime);
        this.filter.currentDays = -1;
      } catch (e) {
        this.filter.dateFrame = [];
        this.filter.currentDays = 0;
        this.getLiveEcharts(this.currentStartDay, this.currentEndtDay);
      }
    },
    handleClickDays(index) {
      this.filter.dateFrame = [];
      this.filter.currentDays = index;
      if (this.filter.currentDays == 2) {
        this.currentThreeMonthStartTime = "";
        this.currentThreeMonthEndtTime = "";
        let array = [];
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        array.push(start);
        array.push(end);
        this.currentThreeMonthStartTime = moment(array[0]).format("YYYY-MM-DD");
        this.currentThreeMonthEndtTime = moment(array[1]).format("YYYY-MM-DD");
        this.getLiveEcharts(
          this.currentThreeMonthStartTime,
          this.currentThreeMonthEndtTime
        );
      } else if (this.filter.currentDays == 1) {
        this.currentMonth = [];
        this.currentMonth = timeUtil.getCurrMonthDays("/").split("-");
        let startTime = moment(this.currentMonth[0]).format("YYYY-MM-DD");
        let endTime = moment(this.currentMonth[1]).format("YYYY-MM-DD");
        this.getLiveEcharts(startTime, endTime);
      } else {
        this.getLiveEcharts(this.currentStartDay, this.currentEndtDay);
      }
    }
  }
};
</script>

<style scoped>
.title-circle {
  height: 8px;
  width: 8px;
  border-radius: 8px;
  background-color: #00a2ff;
  margin-right: 5px;
}

.echart-wrapper {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.live-class-info-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 20px;
  position: relative;
}

.live-info-filter-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header-title {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #000;
}

.filter-title-wrapper {
  display: flex;
  flex-direction: column;
}

.filter-title-wrapper-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}

.header-wrapper {
  display: flex;
}

.header-wrapper-card {
  width: 210px;
}

.header-wrapper-card-title {
  font-size: 20px;
}

.header-wrapper-card-content-wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.header-wrapper-content-wrap-div {
  display: flex;
  align-items: baseline;
}

.header-wrapper-content-wrap-div-count {
  font-size: 26px;
  font-weight: bold;
}

.header-wrapper-content-wrap-div-text {
  color: #898988;
}

.header-wrapper-content-wrap-div-img {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.header-wrapper-content-wrap-div-img img {
  width: 80px;
  height: 56px;
  border-radius: 5px;
}

.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: 0 5px 12px 0 #00a2ff30;
}
</style>
