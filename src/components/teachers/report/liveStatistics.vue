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
            <div class="header-wrapper-card-title">本日最高峰值</div>
            <div class="header-wrapper-card-content-wrap">
              <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal='13' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
              </div>
              <div class="header-wrapper-content-wrap-div-img">
                <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="box-card header-wrapper-card" shadow="always" style="margin-left:20px">
          <div>
            <div class="header-wrapper-card-title">直播最高峰值</div>
            <div class="header-wrapper-card-content-wrap">
              <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal='999' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
              </div>
              <div class="header-wrapper-content-wrap-div-img">
                <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
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
                  <als-count-to :startVal='0' :endVal='999' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">课次</span>
              </div>
              <div class="header-wrapper-content-wrap-div-img">
                <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
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
                  <als-count-to :startVal='0' :endVal='999' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
              </div>
              <div class="header-wrapper-content-wrap-div-img">
                <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
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
                  <als-count-to :startVal='0' :endVal='999' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">课次</span>
              </div>
              <div class="header-wrapper-content-wrap-div-img">
                <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <el-card class="box-card" shadow="always" style="margin-top:20px">
        <div style="display:flex;">
          <div class="filter-title-wrapper">
            <div class="filter-title-wrapper-box">
              <div class="title-circle"/><div>上课学生人次&nbsp;:&nbsp;</div>
              <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal='130' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
              </div>
              <div class="title-circle" style="margin-left:20px"/><div>上课教师人次&nbsp;:&nbsp;</div>
              <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal='10' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">人次</span>
              </div>
            </div>
            <div class="filter-title-wrapper-box">
              <div class="title-circle"/><div>直播课次&nbsp;:&nbsp;</div>
              <div class="header-wrapper-content-wrap-div">
                <span class="header-wrapper-content-wrap-div-count">
                  <als-count-to :startVal='0' :endVal='130' :duration='1500'/>
                </span><span class="header-wrapper-content-wrap-div-text">课次</span>
              </div>
            </div>
          </div>
          <div style="flex:2;display:flex;justify-content:flex-end;align-items:flex-start;">
            <div style="display:flex;justify-content:flex-end;align-items:center;">
              <el-link :underline="false" style="margin-right:20px" :type="filter.currentDays==0 ? 'primary' : 'info'" @click="handleClickDays(0)">7天</el-link>
              <el-link :underline="false" style="margin-right:20px" :type="filter.currentDays==1 ? 'primary' : 'info'" @click="handleClickDays(1)">30天</el-link>
              <el-link :underline="false" style="margin-right:20px" :type="filter.currentDays==2 ? 'primary' : 'info'" @click="handleClickDays(2)">90天</el-link>
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
        <div class="echart-wrapper"><div id="stackStatistics" :style="{height:'430px',width:charts.stackWidth+'px'}"/></div>
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
          <el-date-picker v-model="filter.studentTableDate" v-show="filter.tableType==1" :clearable="false" @change="handleChangeRecordStudentPicker"
                          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
          <el-date-picker v-model="filter.teacherTableDate" v-show="filter.tableType==2" :clearable="false" @change="handleChangeRecordTeacherPicker"
                          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
          <el-select
            v-show="filter.tableType==2"
            v-model="filter.teacherArray"
            size="small" multiple collapse-tags style="margin-left: 20px;"
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
            size="small" multiple collapse-tags style="margin-left: 20px;"
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
                    <el-table-column prop="intoDate" align="center" label="进入教室时间"></el-table-column>
                    <el-table-column prop="leaveDate" align="center" label="离开教室时间"></el-table-column>
                    <el-table-column prop="leaveDate" align="center" label="应上课次" width="120"></el-table-column>
                    <el-table-column prop="leaveDate" align="center" label="实上课次" width="120"></el-table-column>
                  </el-table>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="student" align="left" label="学员"></el-table-column>
            <el-table-column prop="classNumber" align="center" label="应上课次" width="120"></el-table-column>
            <el-table-column prop="actualNumber" align="center" label="实上课次" width="120"></el-table-column>
          </el-table>
        </div>
        <div v-show="filter.tableType==2">
          <el-table :data="tableData.teacherTableData" border style="width: 100%" @expand-change="expandChangeClick">
            <el-table-column type="expand" style="margin:0;padding:0">
              <template slot-scope="props">
                <el-form style="margin: 0;padding:0">
                  <el-table :data="props.row.tableData" border style="width: 100%">
                    <el-table-column prop="date" align="center" label="上课时间"></el-table-column>
                    <el-table-column prop="name" align="center" label="直播课名称"></el-table-column>
                    <el-table-column prop="studentInfo" align="center" label="学员信息"></el-table-column>
                    <el-table-column prop="intoDate" align="center" label="进入教室时间"></el-table-column>
                    <el-table-column prop="leaveDate" align="center" label="离开教室时间"></el-table-column>
                    <el-table-column prop="intoDate" align="center" label="学员人次" width="120"></el-table-column>
                    <el-table-column prop="leaveDate" align="center" label="实上课次" width="120"></el-table-column>
                  </el-table>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="student" align="left" label="讲师"></el-table-column>
            <el-table-column prop="classNumber" align="center" label="学员人次" width="120"></el-table-column>
            <el-table-column prop="actualNumber" align="center" label="实上课次" width="120"></el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
</template>

<script>
    const echarts = require("echarts")
    import $ from 'jquery'
    import countTo from 'vue-count-to'
    import childHeader from '../../../components/component/childHeader'
    import timeUtil from '../../../utils/timeUtil'
    import vuexUtils from '../../../utils/vuexUtils'
    import promptUtil from '../../../utils/promptUtil'
    import storageUtil from '../../../utils/storageUtil'
    import {
        qs,
        getAllHourFilterData
    } from '../../../api/api'
    import '../../../api/restfulapi'
    export default {
        name: "liveStatistics",
        components: {"als-child-header": childHeader,"als-count-to":countTo},
        data(){
            return {
                routerConfig: [{name: '', to: ""}],
                filter:{dateFrame:[],currentDays:0, tableType:1, studentTableDate:[],teacherTableDate:[], studentArray:[],
                    studentPackage:[],classroomArray:[], classroomPackage:[],teacherArray:[],teacherPackage:[]},
                tableData: {studentTableData:[1,2,3,4],teacherTableData:[1,2,3,4]},
                charts: {stack: null, stackWidth:0, stackData:{
                    date: ['2010/11/01', '2010/11/02', '2010/11/03', '2010/11/04', '2010/11/05', '2010/11/06', '2010/11/07'],
                    data: {
                      student: [120, 132, 101, 134, 90, 230, 210],
                      teacher: [220, 182, 191, 234, 290, 330, 310],
                      lives: [820, 932, 901, 934, 1290, 1330, 1320],
                    }
                  }
                },
            }

        },
        created(){
            this.charts.stackWidth = (window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth)-300
        },
        mounted() {
            const name = vuexUtils.checkMenuExist(this, "liveStatistics").target && vuexUtils.checkMenuExist(this, "liveStatistics").target.name
                ? vuexUtils.checkMenuExist(this, "liveStatistics").target.name : '直播统计'
            this.routerConfig[0].name = name
            this.filter.studentTableDate = timeUtil.getCurrWeekDays("/").split("-")
            this.filter.teacherTableDate = timeUtil.getCurrWeekDays("/").split("-")
            this.getAllClassFilterData()
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.charts.stack = echarts.init(document.getElementById('stackStatistics'))
            this.genStackStatisticsChart()
        },
        methods: {
            expandChangeClick(){
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        $(".el-table__expanded-cell[class*=cell]").css("padding", 0).css("margin", 0)
                    }, 50 * i)
                }
            },
            exportRecordResult(){

            },
            handleClickQuery(){

            },
            handleChangeRecordStudentPicker(){

            },
            handleChangeRecordTeacherPicker(){

            },
            getAllClassFilterData(){
                getAllHourFilterData(qs.stringify({school_id: storageUtil.readTeacherInfo().school_id})).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.filter.classroomPackage = res.data.classroomPackage
                            this.filter.studentPackage = res.data.studentPackage
                            this.filter.teacherPackage = res.data.teacherPackage
                        }
                    }
                }).catch(err => {
                    promptUtil.LOG('getAllHourFilterData-err', err)
                })
            },
            genStackStatisticsChart(){
                this.charts.stack.showLoading()
                const option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['学生人次', '教师人次', '直播课次']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    color:['#d48265','#91c7ae', '#00A2FF',],
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.charts.stackData.date
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '学生人次',
                            type: 'line',
                            stack: '总量',
                            data: this.charts.stackData.data.student
                        },
                        {
                            name: '教师人次',
                            type: 'line',
                            stack: '总量',
                            data: this.charts.stackData.data.teacher
                        },
                        {
                            name: '直播课次',
                            type: 'line',
                            stack: '总量',
                            data: this.charts.stackData.data.lives
                        }
                    ]
                };
                setTimeout(()=>{
                    this.charts.stack.hideLoading()
                    this.charts.stack.setOption(option);
                },1000)

            },
            handleChangeDate(date){
                try{
                    let startTime = date[0].getTime()
                    let endTime = date[1].getTime()
                    this.filter.dateFrame = [startTime, endTime]
                    this.filter.currentDays = -1
                }catch (e) {
                    this.filter.dateFrame = []
                    this.filter.currentDays = 0
                }
            },
            handleClickDays(index){
                this.filter.currentDays = index
            }
        }
    }
</script>

<style scoped>
  .title-circle{
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background-color: #00A2FF;
    margin-right: 5px;
  }
  .echart-wrapper{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .live-class-info-wrapper{
    display:flex;
    justify-content:center;
    margin-top:5px;
    margin-bottom:20px;
    position:relative;
  }
  .live-info-filter-wrapper{
    display:flex;
    justify-content:flex-start;
    align-items: center;
  }
  .header-title{
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
  .filter-title-wrapper {
    display:flex;
    flex-direction:column;
  }
  .filter-title-wrapper-box{
    display:flex;
    align-items:center;
    justify-content: flex-start;
    flex:1;
  }
  .header-wrapper {
    display:flex;
  }
  .header-wrapper-card{
    width:210px
  }
  .header-wrapper-card-title {
    font-size:20px;
  }
  .header-wrapper-card-content-wrap {
    display:flex;
    align-items:center;
    margin-top:10px;
  }
  .header-wrapper-content-wrap-div {
    display: flex;
    align-items: baseline;
  }
  .header-wrapper-content-wrap-div-count {
    font-size:26px;
    font-weight:bold;
  }
  .header-wrapper-content-wrap-div-text {
    color:#898988;
  }
  .header-wrapper-content-wrap-div-img {
    flex:1;
    display:flex;
    justify-content:flex-end;
  }
  .header-wrapper-content-wrap-div-img img {
    width:80px;
    height:56px;
    border-radius:5px;
  }
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 5px 12px 0 #00a2ff30;
  }
</style>
