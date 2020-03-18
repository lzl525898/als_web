<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <div style="overflow: hidden;margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <p class="title">{{ $t("message.statistical_center_flow_title1") }}</p>
            <div id="container" style="width: 100%;height: 400px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div style="height: 434px">
              <p class="title">存储详情</p>
              <div style="width: 80%;margin: 0 auto;margin-top: 80px">
                <div style="display: flex;justify-content: space-between">
                  <div>
                    <p style="font-size: 18px;font-weight: bold">已使用存储：{{statisticalData.used}}</p>
                    <p style="font-size: 18px;font-weight: bold">月剩余访问次数：{{statisticalData.residualtimes}}次</p>
                    <p style="font-size: 18px;font-weight: bold">剩余存储空间：{{statisticalData.surplusStorage}}G</p>
                    <span style="line-height: 40px;mzrgin-right: 10px;padding-top: 10px">如剩余访问次数与剩余存储量不足，请拨打电话{{statisticalData.tel}}或关注右侧公众号联系客服</span>
                  </div>
                  <div style="width: 280px;height: 100%">
                    <img :src="statisticalData.img" alt=""
                         style="width: 100%;height: 100%;display: block">
                    <!--                    <img src="../../../../static/images/base/ewm.png" alt=""-->
                    <!--                         style="width: 100%;height: 100%;display: block">-->
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!--      搜索-->
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
            <div style="flex:1;display:flex;justify-content:flex-end">
              <el-button size="small" type="primary" @click="onClickGenReport" :loading="isLoading">生成报表</el-button>
            </div>
          </div>
        </el-row>
      </el-card>
      <!--      列表-->

      <div v-show="showTable">
        <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;">
          当前结果：<span class="record-span-color">{{statisticalData.showCurrentTime}}</span>: 共计访问<span
          class="record-span-color">{{flowTableArray.length}}</span>次
          : 共计浏览文件大小<span class="record-span-color">{{statisticalData.totalSize}}</span>MB
          <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onClickExport">
            导出>>
          </el-link>
        </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="teacherName" label="教师名称" align="center"></el-table-column>
          <el-table-column prop="time" label="时间" align="center"></el-table-column>
          <el-table-column prop="file" label="操作文件" align="center"></el-table-column>
          <el-table-column prop="size" label="文件大小" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div style="display:flex;justify-content:center;margin-top:20px;" v-show="flowTableArray.length>0">
      <el-pagination
        background
        @current-change="flowDataChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="flowDataList"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    const echarts = require("echarts");
    import PubSub from "pubsub-js"
    import '../../../router/router'
    import {
        qs,
        businessAnalysis,
        eduReporterTeacher,
        exportExcel,
        flowStatistics,
        getSchoolDueInfo,
        getFlowTableList
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
                routerConfig: [{name: '流量统计', to: ''}],
                flow: null,
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
                currentDataTag: 0,
                dataFrame: [],
                isLoading: false,
                tableData: [],
                currentPage: 1,
                pageSize: 20,
                flowTableArray: [],
                teacherDataInfo: {date: '', teacher: 0, attendance: 0},
                showTable: false,
                statisticalData: {
                    used: '',//使用的存储
                    residualtimes: '',
                    surplusStorage: '',
                    surplusPercentage: '',
                    tel: '',
                    img: '',
                    total: '',
                    totaltimes: '',
                    totalSize: 0,
                    showCurrentTime: ''
                }
            }
        },
        computed: {
            flowDataList: {
                get() {
                    return this.flowTableArray.length
                }
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/flow");
            flowStatistics(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        this.statisticalData.surplusPercentage = res.data.surplus_bai
                        this.statisticalData.used = res.data.use_str
                        this.statisticalData.residualtimes = res.data.surplus_cishu
                        this.statisticalData.surplusStorage = res.data.surplus_G
                        this.statisticalData.total = res.data.max_G
                        this.statisticalData.totaltimes = res.data.max_cishu
                        this.genNewfFowChart();
                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            }).catch(err => {
                promptUtil.LOG('getSystematicStatistics-err', err)
            })

            getSchoolDueInfo(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                user_id: storageUtil.readTeacherInfo().id
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        this.statisticalData.tel = res.data.tel
                        this.statisticalData.img = res.data.qrcode
                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            }).catch(err => {
                promptUtil.LOG('getSystematicStatistics-err', err)
            })

        },
        methods: {
            //强制保留两位小数
            toDecimal2(x) {
                var f = parseFloat(x);
                if (isNaN(f)) {
                    return false;
                }
                var f = Math.round(x * 100) / 100;
                var s = f.toString();
                var rs = s.indexOf('.');
                if (rs < 0) {
                    rs = s.length;
                    s += '.';
                }
                while (s.length <= rs + 2) {
                    s += '0';
                }
                return s;
            },
            onChangeDatePicker(date) {
                this.dataTag[this.currentDataTag].type = "info"
                this.currentDataTag = -1
                this.dataFrame = date
            },
            changeRecordType() {
                this.dataTag = [
                    {type: "", label: '本月', date: timeUtil.getCurrMonthDays('/'), id: 0},
                    {type: "info", label: '上月', date: timeUtil.getLastMonthDays('/'), id: 1},
                    {type: "info", label: '今日', date: timeUtil.getCurrDays('/'), id: 2},
                    {type: "info", label: '昨日', date: timeUtil.getYesterday('/'), id: 3},
                    {type: "info", label: '本周', date: timeUtil.getCurrWeekDays('/'), id: 4},
                    {type: "info", label: '上周', date: timeUtil.getLastWeekDays('/'), id: 5},
                    {type: "info", label: '今年', date: timeUtil.getCurrYearDays('/'), id: 6},
                    {type: "info", label: '去年', date: timeUtil.getLastYearDays('/'), id: 7}
                ]
                this.currentPage = 1
                this.currentDataTag = 0
                this.reportFormType = 1
            },
            onClickGenReport() {
                this.isLoading = true
                this.showTable = true
                if (this.currentDataTag == -1) { // 按日期进行查询
                    this.curDateFrame = this.dataFrame
                } else { // 按tag日期进行查询
                    this.curDateFrame = (this.dataTag[this.currentDataTag].date).split("-")
                }
                const moment = require('moment')
                getFlowTableList(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1]
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.flowTableArray=[]
                            var sum = 0;
                            res.data.forEach(item => {
                                sum += item.file_size / 1024 / 1024
                                const obj = {
                                    teacherName: item.user_name,
                                    time: moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss'),
                                    file: item.text,
                                    size: this.toDecimal2(item.file_size / 1024 / 1024) + 'MB'
                                }
                                this.flowTableArray.push(obj)
                                this.flowDataChange(this.currentPage)
                            })
                            this.statisticalData.totalSize = Math.floor(sum * 100) / 100
                            this.statisticalData.showCurrentTime = this.curDateFrame[0] + "-" + this.curDateFrame[1]
                        }else{
                            this.flowTableArray=[]
                            this.flowDataChange(this.currentPage)
                            this.statisticalData.showCurrentTime = this.curDateFrame[0] + "-" + this.curDateFrame[1]
                        }
                    } else {
                        promptUtil.warning(this, res.msg)
                    }
                    this.isLoading = false
                }).catch(err => {
                    promptUtil.LOG('eduReporterTeacher-err', err)
                    this.isLoading = false
                })
            },
            onClickDataTag(id) {
                if (this.currentDataTag != -1) { // 没有选择任何一个
                    this.dataTag[this.currentDataTag].type = "info"
                }
                this.dataFrame = ""
                this.dataTag[id].type = ""
                this.currentDataTag = id
            },
            //导出
            onClickExport() {
                const moment = require('moment')
                const startTime = moment(this.curDateFrame[0]).format('YYYYMMDD')
                const endTime = moment(this.curDateFrame[1]).format('YYYYMMDD')
                const targetParams = []
                const params = {head: [], body: [], name: ''}
                // 教师数据报表
                params.head = ['教师名称', '时间', '操作文件', '文件大小']
                params.name = startTime + '—' + endTime + '流量报表'
                this.flowTableArray.map(item => {
                    const tmpArr = []
                    tmpArr.push(item.teacherName)
                    tmpArr.push(item.time)
                    tmpArr.push(item.file)
                    tmpArr.push(item.size)
                    targetParams.push(tmpArr)
                })
                params.body = targetParams
                exportExcel(qs.stringify({data: JSON.stringify(params)})).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '数据准备完毕,等待下载中')
                        window.open(res.data, "_self")
                    }
                }).catch(err => {
                    promptUtil.LOG('exportExcel-err', err)
                })
            },
            flowDataChange(val) {
                this.currentPage = val
                this.tableData = this.flowTableArray.slice((this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize)
            },
            genNewfFowChart() {
                const userValue = (10000 - this.statisticalData.surplusPercentage*100) / 100
                const option = {
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                        feature: {
                            // restore: {},
                            // saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: '存储空间',
                            type: 'gauge',
                            detail: {formatter: '{value}%'},
                            data: [{
                                value: userValue,
                                name: `总计(${this.statisticalData.total}G)\n已用(${this.statisticalData.used})`
                            }]
                        }
                    ]
                };
                this.flow = echarts.init(document.getElementById('container'));
                // setInterval(function () {
                //     option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                //     this.flow.setOption(option);
                //     return
                // },2000);
                if (option && typeof option === "object") {
                    this.flow.setOption(option);
                }
            }
        }
    }
</script>

<style scoped>
  .title {
    border-left: 3px solid #00a2ff;
    padding-left: 5px;
    overflow: hidden;
  }

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

  .record-span-color {
    color: #333333;
  }
</style>
