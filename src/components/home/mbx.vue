<template>
  <div>
    <el-row :gutter="20" style="margin-left: 10px;margin-right: 20px;margin-top: 40px;">
      <el-col :span="16">
        <el-card class="box-card" style="height:300px;" shadow="always">
          <div slot="header" class="clearfix" style="display: flex;align-items:center">
            <span style="border-left: 3px solid #00a2ff;padding-left: 5px;">{{$t(`message.index_system_statistics`)}}</span>
            <div style="display: flex;justify-content: flex-end;flex: 1;">
              <el-date-picker
                @change="systematicSelectTime"
                style="width: 260px;"
                v-model="currentSystematic"
                size="small"
                type="daterange"
                :range-separator="$t(`message.picker_date_to_placeholder`)"
                :start-placeholder="$t(`message.picker_date_start_placeholder`)"
                :end-placeholder="$t(`message.picker_date_end_placeholder`)">
              </el-date-picker>
              <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 10px"
                         @click="systematicSearch"></el-button>
            </div>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in systematicStatistics" :key="index">
              <el-card class="box-card boxBackgroundStyle" shadow="always" :style="'background-color:' + item.color">
                <p><i :class="item.icon + ' iconClass'"></i></p>
                <span class="boxFontSize" style="font-size: 28px">
                 <template>
                   <countTo :startVal='item.startVal' :endVal='item.endVal' :duration='3000'></countTo>
                 </template>
              </span>
                <p class="boxFontSize">{{item.text}}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" style="height:300px;">
          <el-row :gutter="0">
            <el-col :span="12">
              <i class="el-icon-edit-outline" style="color:#00a2ff;font-weight: bold;"></i><label
              style="margin-left:10px;color:#00a2ff;font-weight: bold;">{{$t(`message.string_label_announcement`)}}</label>
            </el-col>
            <el-col :span="12">
              <div class="moreRemind" @click="handleMoreNotice">{{$t(`message.string_label_more`)}}</div>
            </el-col>
          </el-row>
          <el-row type="flex" style="height: 300px;" justify="center" align="middle" v-if="notices.length == 0">
            <span class="noData">{{$t(`message.string_label_no_data`)}}</span>
          </el-row>
          <div v-else-if="notices.length > 0"
               style="margin-left:15px;margin-right:5px;margin-top:5px;height: 240px;overflow-y:auto;"
               class="nth_child">
            <el-row v-for="(item,index) in notices" :key="index" class="border_bottom mt">
              <el-col :span="1"></el-col>
              <el-col :span="1">
                <div class="blue_line"></div>
              </el-col>
              <el-col :span="22">
                <el-link :underline="false" @click="handleMoreNotice"><span class="fontStyle">{{item.title}}</span>
                  <p class="years">{{item.add_time > 0 ?
                    moment(parseInt(item.add_time)*1000).format('YYYY-MM-DD'):""}}</p></el-link>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-left: 10px;margin-right: 20px;margin-top: 40px;">
      <el-col :span="12">
        <el-card class="box-card" shadow="always" style="height:520px !important">
          <div slot="header" class="clearfix" style="display: flex;align-items: center">
            <span style="border-left: 3px solid #00a2ff;padding-left: 5px;">{{$t(`message.index_school_student_class_title`)}}</span>
            <div style="display: flex;justify-content: flex-end;flex: 1">
              <div class="showTimeBlock">{{showTime}}</div>
              <div class="block">
                <el-date-picker
                  style="width: 160px;"
                  size="small"
                  v-model="currentTimestamp"
                  type="date"
                  :placeholder="$t(`message.picker_date_day_placeholder`)"
                  @change="onChangeDatePicker">
                </el-date-picker>
              </div>
              <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 10px"
                         @click="schoolStudentSearch"></el-button>
            </div>
          </div>
          <div id="signInStatus" style="height:390px !important;width: 100% !important;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="always"  style="height:520px !important">
          <div slot="header" class="clearfix" style="display: flex;align-items: center">
            <span style="border-left: 3px solid #00a2ff;padding-left: 5px;">{{$t(`message.index_course_content_statistics`)}}</span>
            <div style="display: flex;justify-content: flex-end;flex: 1">
              <el-date-picker
                @change="classHourContentChange"
                v-model="value1"
                style="width: 260px;"
                size="small"
                type="daterange"
                :range-separator="$t(`message.picker_date_to_placeholder`)"
                :start-placeholder="$t(`message.picker_date_start_placeholder`)"
                :end-placeholder="$t(`message.picker_date_end_placeholder`)">
              </el-date-picker>
              <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 10px"
                         @click="classHourSearch"></el-button>
            </div>
          </div>
          <el-row style="height:200px">
            <div id="classStatus" style="height:300px !important;width: 100% !important;"></div>
          </el-row>
          <el-row style="height:200px">
            <div id="classStudentStatus" style="height:300px !important;width: 100% !important;"></div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!--    <el-row :gutter="20" style="margin-left: 10px;margin-right: 20px;margin-top: 40px;">-->
    <!--      <el-col :span="12">2</el-col>-->
    <!--      <el-col :span="12">2</el-col>-->
    <!--    </el-row>-->
  </div>
</template>
<script>
const moment = require("moment");
const echarts = require("echarts");
import countTo from "vue-count-to";
import PubSub from "pubsub-js";
import storageUtil from "../../utils/storageUtil";
import promptUtil from "../../utils/promptUtil";
import timeUtil from "../../utils/timeUtil";
import {
  qs,
  noticeList,
  remindList,
  noticeDetail,
  remindDetail,
  getmenu,
  getSystematicStatistics,
  getBeginClassStatistics,
  getclassHourStatistics
} from "../../api/api";

export default {
  components: { countTo: countTo },
  data() {
    return {
      classStatisticsOption: {}, // 上课统计图
      classStatus: {}, // 课时统计
      classStudentStatus: {}, // 课时学生统计
      editorCardInfo: [],
      notices: [],
      remind: [],
      moment: moment,
      signInStatusChart: null,
      classStatusChart: null,
      classStudentStatusChart: null,
      lazyLoadTimeout: 100,
      value1: "",
      currentTimestamp: "", // 当前选择日期的时间戳
      showTime: "", // 时间范围
      currentSelectTime: "",
      currentSystematic: "",
      systematicStartTime: "", //系统查询开始时间
      systematicEndTime: "", //系统查询结束时间
      classHourStartTime: "", //课时内容查询开始时间
      classHourEndTime: "", //课时内容查询结束时间
      classBeginsArray: {
        //上课统计数据数组
        success: [0, 0, 0, 0, 0, 0, 0], // 出勤
        failed: [0, 0, 0, 0, 0, 0, 0], // 缺勤
        waited: [0, 0, 0, 0, 0, 0, 0] // 请假
      },
      temporary: 0, //临时课
      cycle: 0, //周期课
      temporaryNum: 0, //临时课人数
      cycleNum: 0, //周期课人数
      systematicStatistics: [],
      judgeCnEn: ""
    };
  },
  watch: {
    "$i18n.locale": function() {
      this.classStatus = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#E6A23C", "#F56C6C"],
        legend: {
          orient: "vertical",
          x: "left",
          data: [
            this.$t("message.string_label_course_temporary"),
            this.$t("message.string_label_course_cycle")
          ]
        },
        series: [
          {
            name: this.$t("message.index_course_class_info"),
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "35%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.temporary,
                name: this.$t("message.string_label_course_temporary")
              },
              {
                value: this.cycle,
                name: this.$t("message.string_label_course_cycle")
              }
            ]
          },
          {
            name: this.$t("message.index_course_class_type"),
            type: "pie",
            radius: ["10%", "20%"],
            center: ["50%", "35%"],
            label: {
              normal: {
                formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c} ",
                backgroundColor: "#eee",
                borderColor: "#aaa",
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: "#999",
                    lineHeight: 22,
                    align: "center"
                  },
                  hr: {
                    borderColor: "#aaa",
                    width: "100%",
                    borderWidth: 0.2,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 0
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "#334455",
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              {
                value: this.temporary,
                name: this.$t("message.string_label_course_temporary")
              },
              {
                value: this.cycle,
                name: this.$t("message.string_label_course_cycle")
              }
            ]
          }
        ]
      };
      this.classStatusChart.setOption(this.classStatus);
      this.classStudentStatus = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#409EFF", "#67C23A"],
        legend: {
          orient: "vertical",
          x: "left",
          data: [
            this.$t("message.index_course_number_temporary_number"),
            this.$t("message.index_course_number_cycle_number")
          ]
        },
        series: [
          {
            name: this.$t("message.index_course_class_number"),
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "40%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center",
                textStyle: {
                  fontSize: "12px"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.temporaryNum,
                name: this.$t("message.index_course_number_temporary_number")
              },
              {
                value: this.cycleNum,
                name: this.$t("message.index_course_number_cycle_number")
              }
            ]
          },
          {
            name: this.$t("message.index_course_student_number"),
            type: "pie",
            radius: ["10%", "20%"],
            center: ["50%", "40%"],
            label: {
              normal: {
                formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c} ",
                backgroundColor: "#eee",
                borderColor: "#aaa",
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: "#999",
                    lineHeight: 22,
                    align: "center"
                  },
                  hr: {
                    borderColor: "#aaa",
                    width: "100%",
                    borderWidth: 0.2,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 0
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "#334455",
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              {
                value: this.temporaryNum,
                name: this.$t("message.index_course_number_temporary_number")
              },
              {
                value: this.cycleNum,
                name: this.$t("message.index_course_number_cycle_number")
              }
            ]
          }
        ]
      };
      this.classStudentStatusChart.setOption(this.classStudentStatus);
      this.classStatisticsOption = {
        title: {
          text: this.$t("message.index_school_class_statistics_title")
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: "right",
          padding: [8, 25, 5, 1],
          data: [
            this.$t("message.string_label_class_attendance"),
            this.$t("message.string_label_class_absence"),
            this.$t("message.string_label_class_takeleave")
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {},
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            this.$t("message.string_label_week_monday"),
            this.$t("message.string_label_week_tuesday"),
            this.$t("message.string_label_week_wednesday"),
            this.$t("message.string_label_week_thursday"),
            this.$t("message.string_label_week_friday"),
            this.$t("message.string_label_week_saturday"),
            this.$t("message.string_label_week_sunday")
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: this.$t("message.string_label_class_attendance"),
            type: "line",
            stack: this.$t("message.string_label_class_attendance"),
            data: this.classBeginsArray.success
          },
          {
            name: this.$t("message.string_label_class_absence"),
            type: "line",
            stack: this.$t("message.string_label_class_absence"),
            data: this.classBeginsArray.failed
          },
          {
            name: this.$t("message.string_label_class_takeleave"),
            type: "line",
            stack: this.$t("message.string_label_class_takeleave"),
            data: this.classBeginsArray.waited
          }
        ]
      };
      this.signInStatusChart.setOption(this.classStatisticsOption);
      this.systematicStatistics = [
        {
          icon: "el-icon-user ",
          startVal: 0,
          endVal: 0,
          text: this.$t("message.index_system_statistics_student_all"),
          color: "#409EFF"
        },
        {
          icon: " el-icon-circle-plus-outline",
          startVal: 0,
          endVal: 0,
          text: this.$t("message.index_system_statistics_student_new"),
          color: "#67C23A"
        },
        {
          icon: "el-icon-sort",
          startVal: 0,
          endVal: 0,
          text: this.$t("message.index_system_statistics_student_conver"),
          color: "#E6A23C"
        },
        {
          icon: "el-icon-date",
          startVal: 0,
          endVal: 0,
          text: this.$t("message.index_system_statistics_student_advisory"),
          color: "#F56C6C"
        }
      ];
    }
  },
  mounted() {
    this.systematicStatistics = [
      {
        icon: "el-icon-user ",
        startVal: 0,
        endVal: 0,
        text: this.$t("message.index_system_statistics_student_all"),
        color: "#409EFF"
      },
      {
        icon: " el-icon-circle-plus-outline",
        startVal: 0,
        endVal: 0,
        text: this.$t("message.index_system_statistics_student_new"),
        color: "#67C23A"
      },
      {
        icon: "el-icon-sort",
        startVal: 0,
        endVal: 0,
        text: this.$t("message.index_system_statistics_student_conver"),
        color: "#E6A23C"
      },
      {
        icon: "el-icon-date",
        startVal: 0,
        endVal: 0,
        text: this.$t("message.index_system_statistics_student_advisory"),
        color: "#F56C6C"
      }
    ];
    promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id); // true 表示已过期 false表示未过期
    //获取menu菜单
    PubSub.publish("currentMenuIndex", "/");
    getmenu(
      qs.stringify({
        user_id: storageUtil.readTeacherInfo().id
      })
    )
      .then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != "[]") {
            this.editorCardInfo = res.data;
          }
        } else if (res.code == ERROR_CODE_) {
          promptUtil.error(this, res.msg);
        } else {
          promptUtil.wait(this, res.msg);
        }
      })
      .catch(err => {
        promptUtil.LOG("getmenu-err", err);
      });
    this.initNotice();
    this.initRemind();
    this.initChart();
    this.initSignInStatus();
    this.initClassStatus();
    this.initStudentClassStatus();
    this.initGetBeginClassInformation();
    this.initGetSystemInformation();
    this.initGetclassContentInformation();
    this.initData();
  },
  methods: {
    initData() {
      this.currentTimestamp = new Date().getTime();
      this.showSelectTime(this.currentTimestamp, "date");
    },

    onCardClick(router) {
      this.$router.replace({ path: router });
    },
    // 点击提醒更多触发
    handleMoreRemind() {
      this.$router.push({
        path: `/remind`
      });
    },
    // 点击公告更多触发
    handleMoreNotice() {
      this.$router.push({
        path: `/notice`
      });
    },

    initNotice() {
      // const loading = promptUtil.loading(this);
      noticeList(
        qs.stringify({
          start_date: timeUtil.getPreMonthDays(3, "/").split("-")[0],
          end_date: timeUtil.getCurrDays("/").split("-")[0],
          page: 1,
          pagenum: 5
        })
      )
        .then(res => {
          // loading.close();
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]" && res.data.data.data) {
              this.notices = res.data.data.data;
            }
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          // loading.close();
          promptUtil.LOG("noticeList-err", err);
        });
    },
    initRemind() {
      remindList(
        qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          page: 1,
          pagenum: 5
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]" && res.data.data) {
              this.remind = res.data.data.data;
            }
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("remindList-err", err);
        });
    },
    //初始化Chart
    initChart() {
      this.classStatusChart = echarts.init(
        document.getElementById("classStatus")
      );
      this.classStudentStatusChart = echarts.init(
        document.getElementById("classStudentStatus")
      );
      this.signInStatusChart = echarts.init(
        document.getElementById("signInStatus")
      );
    },
    //课时内容统计  临时课 周期课
    initClassStatus() {
      this.classStatusChart.showLoading();
      setTimeout(() => {
        this.classStatusChart.hideLoading();
        this.classStatus = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          color: ["#E6A23C", "#F56C6C"],
          legend: {
            orient: "vertical",
            x: "left",
            data: [
              this.$t("message.string_label_course_temporary"), //临时课
              this.$t("message.string_label_course_cycle")
            ]
          },
          series: [
            {
              name: this.$t("message.index_course_class_info"),
              type: "pie",
              radius: ["40%", "60%"],
              center: ["50%", "35%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: this.temporary,
                  name: this.$t("message.string_label_course_temporary")
                },
                {
                  value: this.cycle,
                  name: this.$t("message.string_label_course_cycle")
                }
              ]
            },
            {
              name: this.$t("message.index_course_class_type"),
              type: "pie",
              radius: ["10%", "20%"],
              center: ["50%", "35%"],
              label: {
                normal: {
                  formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c} ",
                  backgroundColor: "#eee",
                  borderColor: "#aaa",
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                    a: {
                      color: "#999",
                      lineHeight: 22,
                      align: "center"
                    },
                    hr: {
                      borderColor: "#aaa",
                      width: "100%",
                      borderWidth: 0.2,
                      height: 0
                    },
                    b: {
                      fontSize: 12,
                      lineHeight: 0
                    },
                    per: {
                      color: "#eee",
                      backgroundColor: "#334455",
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: [
                {
                  value: this.temporary,
                  name: this.$t("message.string_label_course_temporary")
                },
                {
                  value: this.cycle,
                  name: this.$t("message.string_label_course_cycle")
                }
              ]
            }
          ]
        };
        this.classStatusChart.setOption(this.classStatus);
      }, this.lazyLoadTimeout);
    },
    //课时内容统计  临时课人数 周期课人数
    initStudentClassStatus() {
      this.classStudentStatusChart.showLoading();
      setTimeout(() => {
        this.classStudentStatusChart.hideLoading();
        this.classStudentStatus = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          color: ["#409EFF", "#67C23A"],
          legend: {
            orient: "vertical",
            x: "left",
            data: [
              this.$t("message.index_course_number_temporary_number"),
              this.$t("message.index_course_number_cycle_number")
            ]
          },
          series: [
            {
              name: this.$t("message.index_course_class_number"),
              type: "pie",
              radius: ["40%", "60%"],
              center: ["50%", "40%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center",
                  textStyle: {
                    fontSize: "12px"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: this.temporaryNum,
                  name: this.$t("message.index_course_number_temporary_number")
                },
                {
                  value: this.cycleNum,
                  name: this.$t("message.index_course_number_cycle_number")
                }
              ]
            },
            {
              name: this.$t("message.index_course_student_number"),
              type: "pie",
              radius: ["10%", "20%"],
              center: ["50%", "40%"],
              label: {
                normal: {
                  formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c} ",
                  backgroundColor: "#eee",
                  borderColor: "#aaa",
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                    a: {
                      color: "#999",
                      lineHeight: 22,
                      align: "center"
                    },
                    hr: {
                      borderColor: "#aaa",
                      width: "100%",
                      borderWidth: 0.2,
                      height: 0
                    },
                    b: {
                      fontSize: 12,
                      lineHeight: 0
                    },
                    per: {
                      color: "#eee",
                      backgroundColor: "#334455",
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: [
                {
                  value: this.temporaryNum,
                  name: this.$t("message.index_course_number_temporary_number")
                },
                {
                  value: this.cycleNum,
                  name: this.$t("message.index_course_number_cycle_number")
                }
              ]
            }
          ]
        };
        this.classStudentStatusChart.setOption(this.classStudentStatus);
      }, this.lazyLoadTimeout);
    },
    //上课统计图
    initSignInStatus() {
      this.signInStatusChart.showLoading();
      setTimeout(() => {
        this.signInStatusChart.hideLoading();
        this.classStatisticsOption = {
          title: {
            text: this.$t("message.index_school_class_statistics_title")
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            x: "right",
            padding: [8, 25, 5, 1],
            data: [
              this.$t("message.string_label_class_attendance"),
              this.$t("message.string_label_class_absence"),
              this.$t("message.string_label_class_takeleave")
            ]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {},
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
              this.$t("message.string_label_week_monday"),
              this.$t("message.string_label_week_tuesday"),
              this.$t("message.string_label_week_wednesday"),
              this.$t("message.string_label_week_thursday"),
              this.$t("message.string_label_week_friday"),
              this.$t("message.string_label_week_saturday"),
              this.$t("message.string_label_week_sunday")
            ]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: this.$t("message.string_label_class_attendance"),
              type: "line",
              stack: this.$t("message.string_label_class_attendance"),
              data: this.classBeginsArray.success
            },
            {
              name: this.$t("message.string_label_class_absence"),
              type: "line",
              stack: this.$t("message.string_label_class_absence"),
              data: this.classBeginsArray.failed
            },
            {
              name: this.$t("message.string_label_class_takeleave"),
              type: "line",
              stack: this.$t("message.string_label_class_takeleave"),
              data: this.classBeginsArray.waited
            }
          ]
        };
        this.signInStatusChart.setOption(this.classStatisticsOption);
      }, this.lazyLoadTimeout);
    },
    //系统统计搜索
    systematicSearch() {
      this.initGetSystemInformation();
    },
    //校区内学生上课统计
    schoolStudentSearch() {
      this.initGetBeginClassInformation();
    },
    //课时内容统计搜索
    classHourSearch() {
      this.initGetclassContentInformation();
    },

    //change函数
    onChangeDatePicker(val) {
      // this.currentSelectTime = val?val.getTime():""
      if (val) {
        this.currentSelectTime = val.getTime();
        this.showSelectTime(this.currentSelectTime, "date");
      } else {
        this.currentSelectTime = new Date().getTime();
        this.showSelectTime(this.currentSelectTime, "date");
      }
    },
    showSelectTime(time, type) {
      let weekArray = this.get_week_time(time, type);
      this.showTime = weekArray[0] + "—" + weekArray[1];
    },
    get_week_time(time, type) {
      //time 目标日期 格式日期或时间戳 type 返回格式 date日期 time 日期时间 timestamp(默认)毫秒时间戳
      if (!type) type = "timestamp";
      var Y, m, d, date, week, week_start, s;
      date = new Date(time);
      week = date.getDay() == 0 ? 7 : date.getDay();
      week_start = date.getTime() - (week - 1) * 60 * 60 * 24 * 1000; //周一为第一天 所以要减一，周日第一天不减
      s = new Date(week_start);
      Y = s.getFullYear();
      m = s.getMonth() + 1 < 10 ? "0" + (s.getMonth() + 1) : s.getMonth() + 1;
      d = s.getDate();
      var ds = new Date(Y + "-" + m + "-" + d + " 00:00:00").getTime();
      if (type == "date") {
        return [
          this.get_daystart_date(ds),
          this.get_daystart_date(ds + 60 * 60 * 24 * 1000 * 7 - 1)
        ];
      } else if (type == "time") {
        return [
          this.get_daystart_date(ds, "time"),
          this.get_daystart_date(ds + 60 * 60 * 24 * 1000 * 7 - 1, "time")
        ];
      } else {
        return [
          new Date(ds).getTime(),
          new Date(ds + 60 * 60 * 24 * 1000 * 7).getTime()
        ];
      }
    },
    get_daystart_date(time, type) {
      //时间戳转日期函数
      if (!type) type = "date";
      var Y, M, D, h, m, s;
      var date = new Date(time);
      Y = date.getFullYear() + "/";
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
      D = date.getDate();
      h = " " + date.getHours() + ":";
      m = date.getMinutes() + ":";
      s = date.getSeconds();
      if (type != "time") {
        return Y + M + D;
      } else {
        return Y + M + D + h + m + s;
      }
    },
    systematicSelectTime(val) {
      if (val) {
        // this.systematicStartTime = Math.round(val[0].getTime() / 1000)
        // this.systematicEndTime = Math.round(val[1].getTime() / 1000)
        this.systematicStartTime = moment(Math.round(val[0].getTime())).format(
          "YYYY-MM-DD"
        );
        this.systematicEndTime = moment(Math.round(val[1].getTime())).format(
          "YYYY-MM-DD"
        );
      } else {
        this.systematicStartTime = "";
        this.systematicEndTime = "";
      }
    },
    //课时内容统计change 函数
    classHourContentChange(val) {
      if (val) {
        this.classHourStartTime = Math.round(val[0].getTime() / 1000);
        this.classHourEndTime = Math.round(val[1].getTime() / 1000);
      } else {
        this.classHourStartTime = "";
        this.classHourEndTime = "";
      }
    },
    //获取系统统计数据
    initGetSystemInformation() {
      //获取系统统计数据
      getSystematicStatistics(
        qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          start_time: this.systematicStartTime,
          end_time: this.systematicEndTime
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.systematicStatistics[0].endVal = res.data.student_num;
              this.systematicStatistics[1].endVal = res.data.new_student_num;
              this.systematicStatistics[2].endVal = res.data.zx_num;
              this.systematicStatistics[3].endVal = res.data.zx_student_num;
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("getSystematicStatistics-err", err);
        });
    },
    //获取上课统计图
    initGetBeginClassInformation() {
      getBeginClassStatistics(
        qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          time: Math.round(this.currentSelectTime / 1000)
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "{}") {
              this.classBeginsArray.success = res.data.success;
              this.classBeginsArray.failed = res.data.failed;
              this.classBeginsArray.waited = res.data.waited;
            }
            this.initSignInStatus();
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("getBeginClassStatistics-err", err);
        });
    },
    //获取课时内容统计图
    initGetclassContentInformation() {
      getclassHourStatistics(
        qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          start_time: this.classHourStartTime,
          end_time: this.classHourEndTime
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              (this.temporary = res.data.ls),
                (this.cycle = res.data.zq),
                (this.temporaryNum = res.data.ls_student),
                (this.cycleNum = res.data.zq_student),
                this.initClassStatus();
              this.initStudentClassStatus();
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("getSystematicStatistics-err", err);
        });
    }
  }
};
</script>
<style scoped>
.grid-content {
  border-radius: 10px;
  min-height: 144px;
}

.grid-content:hover {
  cursor: pointer;
}

.bg-purple {
  background: #fff;
}

.indexName {
  color: #000;
  font-weight: bold;
}

.indexName:hover {
  color: #00a2ff;
  font-weight: bold;
}

.moreRemind {
  color: #898988;
  text-align: right;
}

.moreRemind:hover {
  cursor: pointer;
  color: #00a2ff;
  text-align: right;
}

.moreNotice {
  color: #898988;
  text-align: right;
}

.moreNotice:hover {
  cursor: pointer;
  color: #00a2ff;
  text-align: right;
}

.el-icon-date {
  font-weight: bold;
}

.noData {
  display: block;
  font-size: 30px;
  color: #e6e6e6;
}

.el-icon-circle-plus {
  font-size: 44px;
  color: #9ddede;
}

.years {
  font-size: 14px;
  color: #2a2a2a;
  margin: 5px 0;
}

.border_bottom {
  border-bottom: 1px #eee solid;
}

.mt {
  margin-top: 10px;
  /*color:#606266;*/
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

/*.nth_child>el-row:nth-child(first){*/

/*}*/
.blue_line {
  width: 3px;
  height: 20px;
  background-color: #9ddede;
  margin: 0 auto;
}

.fontStyle {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  display: flex;
}

/*上*/
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}

.systemTotalBox {
  padding: 20px 20px 20px 20px;
}

.systemBoxOne {
  width: 10%;
  height: 100px;
  /*back*/
}

.boxFontSize {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

.iconClass {
  font-size: 40px;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.boxBackgroundStyle {
  height: 190px;
  text-align: center;
}
/*>=1100的设备*/
@media (min-width: 768px) {
  .showTimeBlock {
    display: none !important;
  }
}

/*>=1100的设备*/
@media (min-width: 992px) {
  .showTimeBlock {
    display: none !important;
  }
}
/*>=1100的设备*/
@media (min-width: 1100px) {
  .showTimeBlock {
    display: none !important;
  }
}
/*>=1024的设备*/
@media (min-width: 1024px) {
  .showTimeBlock {
    display: none !important;
  }
}
@media (min-width: 1366px) {
  .showTimeBlock {
    line-height: 30px;
    margin-right: 10px;
    font-size: 16px;
    display: none !important;
  }
}

@media (min-width: 1440px) {
  .showTimeBlock {
    line-height: 30px;
    margin-right: 10px;
    font-size: 16px;
    display: block !important;
  }
}

@media (min-width: 1680px) {
  .showTimeBlock {
    line-height: 30px;
    margin-right: 10px;
    font-size: 16px;
    display: block !important;
  }
}

@media (min-width: 1920px) {
  .showTimeBlock {
    line-height: 30px;
    margin-right: 10px;
    font-size: 16px;
    display: block !important;
  }
}
</style>

