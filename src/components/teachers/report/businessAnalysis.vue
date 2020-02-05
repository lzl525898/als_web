<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px;">
      <div style="display: flex;">
        <div class="v_line"></div>
        <div class="v_line_text">数据范围</div>
      </div>
      <el-row style="margin-left: 20px;margin-top: 20px;">
        <div style="display:flex;align-items: center;">
          <label>日期范围</label>
          <div style="margin-left:20px">
            <el-tooltip class="item" effect="dark" :content="tag.date" placement="top" v-for="(tag,index) in dataTag"
                        :key="index">
              <el-tag :type="tag.type" class="tag_width" :key="index" @click.native="onClickDataTag(tag.id)">
                {{tag.label}}
              </el-tag>
            </el-tooltip>
            <el-date-picker @change="onChangeDatePicker" style="width:220px" size="small" value-format="yyyy/MM/dd"
                            :clearable="false" v-model="dataFrame" type="daterange" range-separator=""
                            start-placeholder="请选择日期"></el-date-picker>
          </div>
        </div>
      </el-row>
      <div style="display: flex;margin-top: 20px;">
        <div class="v_line"></div>
        <div class="v_line_text">报表类别</div>
      </div>
      <el-row style="margin-left: 20px;margin-top: 20px;">
        <div style="display:flex;align-items: center;">
          <label>招生概况</label>
          <div style="margin-left:20px">
            <el-checkbox-group v-model="checkListStudent">
              <el-checkbox label="1">新增咨询</el-checkbox>
              <el-checkbox label="2">新增咨询数据环比</el-checkbox>
              <el-checkbox label="3">转化人次</el-checkbox>
              <el-checkbox label="4">转化数据环比</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div style="display:flex;align-items: center;margin-top:20px;">
          <label>教务概况</label>
          <div style="margin-left:20px">
            <el-checkbox v-model="studentCheckBox">学员概况</el-checkbox>
          </div>
        </div>
        <div style="display:flex;align-items: center;margin-top:16px;">
          <label>员工概况</label>
          <div style="margin-left:20px">
            <el-checkbox v-model="teacherCheckBox">教师概况</el-checkbox>
          </div>
          <!--          <div style="flex:1;margin-right:0;display:flex;justify-content:flex-end;"><el-button size="small" type="primary" @click="onClickGenReport" :loading="isLoading">生成报表</el-button></div>-->
        </div>
        <div style="display:flex;align-items: center;margin-top:16px;">
          <label>访问次数</label>
          <div style="margin-left:20px">
            <el-checkbox v-model="flowCheckBox">访问次数</el-checkbox>
          </div>
          <div style="flex:1;margin-right:0;display:flex;justify-content:flex-end;">
            <el-button size="small" type="primary" @click="onClickGenReport" :loading="isLoading">生成报表</el-button>
          </div>
        </div>
      </el-row>
    </el-card>
    <el-card style="margin-top:20px;"
             v-show="showChart.newConsult || showChart.newConsultRingCompare || showChart.recruitStudents || showChart.recruitStudentsRingCompare || showChart.students || showChart.teachers || showChart.flow">
      <el-row :gutter="20" style="margin-top:-20px">
        <el-col :span="8" v-show="showChart.newConsult" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">新增咨询</div>
            </div>
            <div id="newConsult" class="echart-wrapper"></div>
          </div>
        </el-col>
        <el-col :span="8" v-show="showChart.newConsultRingCompare" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">新增咨询数据环比</div>
              <div style="flex:1;display:flex;justify-content:flex-end;margin-right:30px">
                <el-date-picker v-show="newConsultRingCompareDataFrame.length>0"
                                @change="onNewConsultRingCompareDatePicker" style="width:220px" size="mini"
                                value-format="yyyy/MM/dd" :clearable="false" v-model="newConsultRingCompareDataFrame"
                                type="daterange"></el-date-picker>
              </div>
            </div>
            <div id="newConsultRingCompare" class="echart-wrapper"></div>
          </div>
        </el-col>
        <el-col :span="8" v-show="showChart.recruitStudents" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">转化人次</div>
            </div>
            <div id="recruitStudents" class="echart-wrapper"></div>
          </div>
        </el-col>
        <el-col :span="8" v-show="showChart.recruitStudentsRingCompare" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">转化数据环比</div>
              <div style="flex:1;display:flex;justify-content:flex-end;margin-right:30px">
                <el-date-picker v-show="recruitStudentsRingCompareDataFrame.length>0"
                                @change="onRecruitStudentsRingCompareDatePicker" style="width:220px" size="mini"
                                value-format="yyyy/MM/dd" :clearable="false"
                                v-model="recruitStudentsRingCompareDataFrame" type="daterange"></el-date-picker>
              </div>
            </div>
            <div id="recruitStudentsRingCompare" class="echart-wrapper"></div>
          </div>
        </el-col>
        <el-col :span="8" v-show="showChart.students" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">学员概况</div>
            </div>
            <div id="students" class="echart-wrapper"></div>
          </div>
        </el-col>
        <el-col :span="8" v-show="showChart.teachers" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">教师概况</div>
            </div>
            <div id="teachers" class="echart-wrapper"></div>
          </div>
        </el-col>
        <el-col :span="8" v-show="showChart.flow" class="el-col-width">
          <div class="echart_item">
            <div style="display: flex;">
              <div class="v_line"></div>
              <div class="v_line_text">教师访问次数</div>
            </div>
            <div id="flow" class="echart-wrapper"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
    const echarts = require("echarts");
    import $ from 'jquery'
    import PubSub from "pubsub-js"
    import '../../../router/router'
    import {
        qs,
        businessAnalysis
    } from '../../../api/api'
    import storageUtil from '../../../utils/storageUtil'
    import promptUtil from '../../../utils/promptUtil'
    import timeUtil from '../../../utils/timeUtil'
    import childHeader from '../../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        name: "businessAnalysis",
        data() {
            return {
                routerConfig: [{name: '机构统计', to: ''}],
                dataTag: [
                    {type: "", label: '本月', date: timeUtil.getCurrMonthDays('/'), id: 0},
                    {type: "info", label: '上月', date: timeUtil.getLastMonthDays('/'), id: 1},
                    {type: "info", label: '今日', date: timeUtil.getCurrDays('/'), id: 2},
                    {type: "info", label: '昨日', date: timeUtil.getYesterday('/'), id: 3},
                    {type: "info", label: '本周', date: timeUtil.getCurrWeekDays('/'), id: 4},
                    {type: "info", label: '上周', date: timeUtil.getLastWeekDays('/'), id: 5},
                    {type: "info", label: '今年', date: timeUtil.getCurrYearDays('/'), id: 6},
                    {type: "info", label: '去年', date: timeUtil.getLastYearDays('/'), id: 7}
                ],
                showChart: {
                    newConsult: false, newConsultRingCompare: false, recruitStudents: false,
                    recruitStudentsRingCompare: false, students: false, teachers: false, flow: false
                },
                dataFrame: [],
                curDateFrame: [],
                newConsultRingCompareDataFrame: [],
                recruitStudentsRingCompareDataFrame: [],
                currentDataTag: 0,
                studentCheckBox: false,
                teacherCheckBox: false,
                flowCheckBox: false,
                checkListStudent: [],
                isLoading: false,
                eChart: {
                    newConsult: '', newConsultRingCompare: '', recruitStudents: '',
                    recruitStudentsRingCompare: '', students: '', teachers: '', flow: ''
                },
                chartData: {
                    newConsult: {
                        xAxisData: [], seriesData: []
                    },
                    newConsultRingCompare: {
                        xAxisData: [], seriesData: []
                    },
                    recruitStudents: {
                        xAxisData: [], seriesData1: [], seriesData2: []
                    },
                    recruitStudentsRingCompare: {
                        xAxisData: [], seriesData1: [], seriesData2: []
                    },
                    students: {
                        xAxisData: [], seriesData: []
                    },
                    teachers: {
                        xAxisData: [], seriesData: []
                    },
                    flow: {
                        xAxisData: [0, 0, 0, 0, 0, 0, 66, 8, 21, 12, 0, 0,],
                        seriesData: ["2019-02-01", "2019-03-01", "2019-04-01", "2019-05-01", "2019-06-01", "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-01", "2019-12-01"]
                    }
                }
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", ROUTER_BUSINESS_ANALYSIS)
        },
        methods: {
            onNewConsultRingCompareDatePicker(val) {
                const loading = promptUtil.loading(this)
                const timeArray = val
                const typeArray = ['newConsultRingCompare']
                businessAnalysis(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1],
                    newConsultRingCompare_huanbi_start: timeArray[0],
                    newConsultRingCompare_huanbi_end: timeArray[1],
                    select_type: JSON.stringify(typeArray)
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data.newConsultRingCompare) {
                            this.chartData.newConsultRingCompare = res.data.newConsultRingCompare
                            if (this.chartData.newConsultRingCompare.xAxisData && this.chartData.newConsultRingCompare.xAxisData.length > 0) {
                                this.newConsultRingCompareDataFrame = (this.chartData.newConsultRingCompare.xAxisData[1]).split("-")
                            }
                            this.genNewConsultRingCompareChart();
                        }
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("businessAnalysis-err", err)
                    loading.close()
                })
            },
            onRecruitStudentsRingCompareDatePicker(val) {
                const loading = promptUtil.loading(this)
                const timeArray = val
                const typeArray = ['recruitStudentsRingCompare']
                businessAnalysis(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1],
                    recruitStudentsRingCompare_huanbi_start: timeArray[0],
                    recruitStudentsRingCompare_huanbi_end: timeArray[1],
                    select_type: JSON.stringify(typeArray)
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data.recruitStudentsRingCompare) {
                            this.chartData.recruitStudentsRingCompare = res.data.recruitStudentsRingCompare
                            if (this.chartData.recruitStudentsRingCompare.xAxisData && this.chartData.recruitStudentsRingCompare.xAxisData.length > 0) {
                                this.recruitStudentsRingCompareDataFrame = (this.chartData.recruitStudentsRingCompare.xAxisData[1]).split("-")
                            }
                            this.genRecruitStudentsRingCompareChart();
                        }
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("businessAnalysis-err", err)
                    loading.close()
                })
            },
            onClickGenReport() {
                const typeArray = []
                if (this.checkListStudent && this.checkListStudent.length > 0) {
                    this.checkListStudent.map(id => {
                        if (id == 1) {
                            typeArray.push('newConsult')
                        }
                        if (id == 2) {
                            typeArray.push('newConsultRingCompare')
                        }
                        if (id == 3) {
                            typeArray.push('recruitStudents')
                        }
                        if (id == 4) {
                            typeArray.push('recruitStudentsRingCompare')
                        }
                    })
                }
                if (this.studentCheckBox) { // 学员概述
                    typeArray.push('students')
                }
                if (this.teacherCheckBox) { // 教师概述
                    typeArray.push('teachers')
                }
                if (this.flowCheckBox) { // 流量概述
                    typeArray.push('flow')
                }
                if (typeArray.length == 0) {
                    promptUtil.warning(this, '请选择报表类别')
                    return
                }
                this.showChart.newConsult = false
                this.showChart.newConsultRingCompare = false
                this.showChart.recruitStudents = false
                this.showChart.recruitStudentsRingCompare = false
                this.showChart.students = false
                this.showChart.teachers = false
                this.showChart.flow = false
                this.newConsultRingCompareDataFrame = []
                this.recruitStudentsRingCompareDataFrame = []
                this.isLoading = true
                if (this.currentDataTag == -1) { // 按日期进行查询
                    this.curDateFrame = this.dataFrame
                } else { // 按tag日期进行查询
                    this.curDateFrame = (this.dataTag[this.currentDataTag].date).split("-")
                    this.newConsultRingCompareDataFrame = (this.dataTag[this.currentDataTag].date).split("-")
                    this.recruitStudentsRingCompareDataFrame = (this.dataTag[this.currentDataTag].date).split("-")
                }
                businessAnalysis(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1],
                    select_type: JSON.stringify(typeArray)
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data.newConsult) {
                            this.chartData.newConsult = res.data.newConsult
                        }
                        if (res.data.newConsultRingCompare) {
                            this.chartData.newConsultRingCompare = res.data.newConsultRingCompare
                            if (this.chartData.newConsultRingCompare.xAxisData && this.chartData.newConsultRingCompare.xAxisData.length > 0) {
                                this.newConsultRingCompareDataFrame = (this.chartData.newConsultRingCompare.xAxisData[1]).split("-")
                            }
                        }
                        if (res.data.students) {
                            this.chartData.students = res.data.students
                        }
                        if (res.data.teachers) {
                            this.chartData.teachers = res.data.teachers
                        }
                        //添加流量统计
                          if(res.data.flow){
                              this.chartData.flow = res.data.flow

                          }
                        if (res.data.recruitStudents) {
                            this.chartData.recruitStudents = res.data.recruitStudents
                        }
                        if (res.data.recruitStudentsRingCompare) {
                            this.chartData.recruitStudentsRingCompare = res.data.recruitStudentsRingCompare
                            if (this.chartData.recruitStudentsRingCompare.xAxisData && this.chartData.recruitStudentsRingCompare.xAxisData.length > 0) {
                                this.recruitStudentsRingCompareDataFrame = (this.chartData.recruitStudentsRingCompare.xAxisData[1]).split("-")
                            }
                        }
                        this.showStatisticsChart()
                    }
                    this.isLoading = false
                }).catch(err => {
                    promptUtil.LOG("businessAnalysis-err", err)
                    this.isLoading = false
                })
            },
            showStatisticsChart() {
                if (this.checkListStudent && this.checkListStudent.length > 0) {
                    this.checkListStudent.map(id => {
                        if (id == 1) {
                            this.showChart.newConsult = true
                        }
                        if (id == 2) {
                            this.showChart.newConsultRingCompare = true
                        }
                        if (id == 3) {
                            this.showChart.recruitStudents = true
                        }
                        if (id == 4) {
                            this.showChart.recruitStudentsRingCompare = true
                        }
                    })
                }
                if (this.studentCheckBox) {
                    this.showChart.students = true
                }
                if (this.teacherCheckBox) {
                    this.showChart.teachers = true
                }
                if (this.flowCheckBox) {
                    this.showChart.flow = true
                }
                setTimeout(() => {
                    $('#newConsult').width(($('.el-col-width').width()) * 0.96)
                    $('#newConsultRingCompare').width(($('.el-col-width').width()) * 0.96)
                    $('#recruitStudents').width(($('.el-col-width').width()) * 0.96)
                    $('#recruitStudentsRingCompare').width(($('.el-col-width').width()) * 0.96)
                    $('#students').width(($('.el-col-width').width()) * 0.96)
                    $('#teachers').width(($('.el-col-width').width()) * 0.96)
                    $('#flow').width(($('.el-col-width').width()) * 0.96)
                    this.eChart.newConsult = echarts.init(document.getElementById('newConsult'));
                    this.eChart.newConsultRingCompare = echarts.init(document.getElementById('newConsultRingCompare'));
                    this.eChart.recruitStudents = echarts.init(document.getElementById('recruitStudents'));
                    this.eChart.recruitStudentsRingCompare = echarts.init(document.getElementById('recruitStudentsRingCompare'));
                    this.eChart.students = echarts.init(document.getElementById('students'));
                    this.eChart.teachers = echarts.init(document.getElementById('teachers'));
                    this.eChart.flow = echarts.init(document.getElementById('flow'));
                }, 100)
                setTimeout(() => {
                    if (this.showChart.newConsult) {
                        this.genNewConsultChart();
                    }
                    if (this.showChart.newConsultRingCompare) {
                        this.genNewConsultRingCompareChart();
                    }
                    if (this.showChart.recruitStudents) {
                        this.genRecruitStudentsChart();
                    }
                    if (this.showChart.recruitStudentsRingCompare) {
                        this.genRecruitStudentsRingCompareChart();
                    }
                    if (this.showChart.students) {
                        this.genStudentsChart();
                    }
                    if (this.showChart.teachers) {
                        this.genTeachersChart();
                    }
                    if (this.showChart.flow) {
                        this.genFlowChart();
                    }
                }, 300)
            },
            onClickDataTag(id) {
                if (this.currentDataTag != -1) { // 没有选择任何一个
                    this.dataTag[this.currentDataTag].type = "info"
                }
                this.dataFrame = ""
                this.dataTag[id].type = ""
                this.currentDataTag = id
            },
            onChangeDatePicker(date) {
                this.dataTag[this.currentDataTag].type = "info"
                this.currentDataTag = -1
                this.dataFrame = date
            },
            genNewConsultChart() {
                const option = {
                    color: ['#00a2ff'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.newConsult.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '新增咨询',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.chartData.newConsult.seriesData
                    }]
                };
                this.eChart.newConsult.setOption(option)
            },
            genNewConsultRingCompareChart() {
                const option = {
                    color: ['#00a2ff'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.newConsultRingCompare.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '新增咨询',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.chartData.newConsultRingCompare.seriesData
                    }]
                };
                this.eChart.newConsultRingCompare.setOption(option)
            },
            genRecruitStudentsChart() {
                const option = {
                    color: ['#00a2ff', '#e5323e'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    legend: {data: ['已付费学员', '待转换学员']},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.recruitStudents.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '已付费学员',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.chartData.recruitStudents.seriesData1
                    }, {
                        name: '待转换学员',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.chartData.recruitStudents.seriesData2
                    }]
                }
                this.eChart.recruitStudents.setOption(option)
            },
            genRecruitStudentsRingCompareChart() {
                const option = {
                    color: ['#00a2ff', '#e5323e'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    legend: {data: ['已付费学员', '待转换学员']},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.recruitStudentsRingCompare.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '已付费学员',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.chartData.recruitStudentsRingCompare.seriesData1
                    }, {
                        name: '待转换学员',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.chartData.recruitStudentsRingCompare.seriesData2
                    }]
                }
                this.eChart.recruitStudentsRingCompare.setOption(option)
            },
            genStudentsChart() {
                const option = {
                    color: ['#00a2ff'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.students.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '学员概况',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.chartData.students.seriesData
                    }]
                };
                this.eChart.students.setOption(option)
            },
            genTeachersChart() {
                const option = {
                    color: ['#00a2ff'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.teachers.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '教师概况',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.chartData.teachers.seriesData
                    }]
                };
                this.eChart.teachers.setOption(option)
            },
            genFlowChart() {
                const option = {
                    color: ['#00a2ff'],
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: [{
                        type: 'category',
                        data: this.chartData.flow.xAxisData,
                        axisTick: {alignWithLabel: true}
                    }],
                    yAxis: [{type: 'value'}],
                    series: [{
                        name: '访问次数',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.chartData.flow.seriesData
                    }]
                };
                this.eChart.flow.setOption(option)
            },
        }
    }
</script>

<style scoped>
  .v_line {
    height: 20px;
    width: 3px;
    background-color: #00a2ff;
  }

  .v_line_text {
    line-height: 20px;
    margin-left: 5px;
  }

  .tag_width {
    width: 60px;
    text-align: center;
    margin-right: 20px;
  }

  .tag_width:hover {
    cursor: pointer;
  }

  .echart_item {
    height: 400px;
    width: 100%;
    margin-top: 20px;
  }

  .echart-wrapper {
    padding-left: 5px;
    padding-right: 5px;
    height: 350px;
    width: 96%;
    margin-top: 20px;
  }
</style>
