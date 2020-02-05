<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="display:flex;flex:1;justify-content:center">
          <el-radio-group v-model="recordType" @change="changeRecordType">
            <el-radio-button label="1">教师数据报表</el-radio-button>
            <el-radio-button label="2">班级数据报表</el-radio-button>
            <el-radio-button label="3">上课记录报表</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px;">
      <div style="display: flex;">
        <div class="v_line"></div>
        <div class="v_line_text">数据范围</div>
      </div>
      <el-row style="margin-left: 20px;margin-top: 20px;">
        <div style="display:flex;align-items: center;margin-bottom: 20px;" v-show="recordType==3">
          <label>报表类型</label>
          <div style="margin-left:20px;">
            <el-radio-group v-model="reportFormType">
              <el-radio :label="1">按课程</el-radio>
              <el-radio :label="2">按班级</el-radio>
              <el-radio :label="3">按教师</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div style="display:flex;align-items: center;">
          <label>日期范围</label>
          <div style="margin-left:20px">
            <el-tooltip class="item" effect="dark" :content="tag.date" placement="top" v-for="(tag,index) in dataTag" :key="index">
              <el-tag :type="tag.type" class="tag_width" :key="index" @click.native="onClickDataTag(tag.id)">{{tag.label}}</el-tag>
            </el-tooltip>
            <el-date-picker @change="onChangeDatePicker" style="width:220px" size="small" value-format="yyyy/MM/dd" :clearable="false" v-model="dataFrame" type="daterange" range-separator="" start-placeholder="请选择日期"></el-date-picker>
          </div>
          <div style="flex:1;display:flex;justify-content:flex-end"><el-button size="small" type="primary" @click="onClickGenReport" :loading="isLoading">生成报表</el-button></div>
        </div>
      </el-row>
    </el-card>
    <div v-show="recordType==1 && isGenTable">
      <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;">
        当前结果：<span class="record-span-color">{{teacherDataInfo.date}}</span>: 共计<span class="record-span-color">{{teacherDataInfo.teacher}}</span>名老师|平均出勤率
        <el-tooltip class="item" effect="dark" content="总学生出勤人次/总学生应到人次" placement="top">
          <el-link type="primary" :underline="false"><i class="el-icon-question"></i></el-link></el-tooltip>: <span class="record-span-color">{{teacherDataInfo.attendance}}%</span>
        <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onClickExport">导出>></el-link>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="教师姓名" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0">
              <el-tooltip class="item" effect="dark" content="该教师已删除" placement="right">
                <span style="color:#999">{{scope.row.name}}</span>
              </el-tooltip>
            </div>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上课数量" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="onClickTeacherRecord(scope.row)">{{scope.row.calendar_num}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="arrivalTime" label="实到人次" align="center"></el-table-column>
        <el-table-column prop="arriveTime" label="应到人次" align="center"></el-table-column>
        <el-table-column label="出勤率" align="center">
          <template slot-scope="scope">{{scope.row.attendance}}%</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope"><el-button type="primary" plain size="small" @click="onClickTeacherRecord(scope.row)">查看</el-button></template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="recordType==2 && isGenTable">
      <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;">
        当前结果：<span class="record-span-color">{{classDataInfo.date}}</span>: 共计
        <span class="record-span-color">{{classDataInfo.classroom}}</span>个班级|平均出勤率:<span class="record-span-color">{{classDataInfo.attendance}}%</span>
        <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onClickExport">导出>></el-link>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="className" label="班级名称" align="center"></el-table-column>
        <el-table-column prop="packageName" label="课程名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="teacherName" label="教师名称" align="center"></el-table-column>
        <el-table-column prop="startTime" label="上课时间" align="center"></el-table-column>
        <el-table-column prop="arrivalTime" label="实到人次" align="center"></el-table-column>
        <el-table-column prop="arriveTime" label="应到人次" align="center"></el-table-column>
        <el-table-column label="出勤率" align="center"><template slot-scope="scope">{{scope.row.attendance}}%</template></el-table-column>
      </el-table>
    </div>
    <div v-show="recordType==3 && isGenTable">
      <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;">
        当前结果:<span class="record-span-color">{{recordDataInfo.date}}</span>: 共计
        <span class="record-span-color">{{recordDataInfo.count}}</span>条记录|教师平均完成课时:<span class="record-span-color">{{recordDataInfo.teacher}}%</span>|学员平均消耗课时:<span class="record-span-color">{{recordDataInfo.student}}%</span>
        <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onClickExport">导出>></el-link>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" :label="tableColumnName"></el-table-column>
        <el-table-column prop="arrivalTime" label="实到人次" align="center" width="150"></el-table-column>
        <el-table-column prop="arriveTime" label="应到人次" align="center" width="150"></el-table-column>
        <el-table-column label="出勤率" align="center" width="150">
          <template slot-scope="scope">{{scope.row.attendance}}%</template>
        </el-table-column>
        <el-table-column prop="teacherHour"label="教师完成课时" align="center" width="150"></el-table-column>
        <el-table-column prop="studentHour" label="学员消耗课时" align="center" width="150"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope"><el-button type="primary" plain size="small" @click="onClickRecordDetail(scope.row)">查看</el-button></template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display:flex;justify-content:center;margin-top:20px;" v-show="serverDataList>0 && isGenTable">
      <el-pagination
        background
        @current-change="serverDataChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="serverDataList"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    const TMP_TEACHER_RECORD = 'tmp_teacher_record'
    const TMP_COURSE_RECORD = 'tmp_course_record'
    import PubSub from "pubsub-js"
    import '../../../router/router'
    import {
      qs,
      exportExcel, // 导出excel
      eduReporterClass, // 统计班级
      eduReporterRecord, // 统计课时
      eduReporterTeacher, // 统计教师
    } from '../../../api/api'
    import storageUtil from '../../../utils/storageUtil'
    import promptUtil from '../../../utils/promptUtil'
    import timeUtil from '../../../utils/timeUtil'
    import childHeader from '../../component/childHeader'
    export default {
        components: {"als-child-header": childHeader},
        name: "eduReporter",
        data(){
          return{
            routerConfig: [{name: '教务统计', to: ''}],
            tableData:[],
            serverData1: [],
            serverData2: [],
            serverData3: [],
            teacherDataInfo:{date:'',teacher:0,attendance:0},
            classDataInfo:{date:'',classroom:0,attendance:0},
            recordDataInfo:{date:'',count:0,teacher:0.00,student:0.00},
            tableColumnName: '',
            currentPage:1,
            pageSize: 20,
            recordType: "1",
            reportFormType: 1,
            dataTag: [
              {type:"",label:'本月',date:timeUtil.getCurrMonthDays('/'),id:0},
              {type:"info",label:'上月',date:timeUtil.getLastMonthDays('/'),id:1},
              {type:"info",label:'今日',date:timeUtil.getCurrDays('/'),id:2},
              {type:"info",label:'昨日',date:timeUtil.getYesterday('/'),id:3},
              {type:"info",label:'本周',date:timeUtil.getCurrWeekDays('/'),id:4},
              {type:"info",label:'上周',date:timeUtil.getLastWeekDays('/'),id:5},
              {type:"info",label:'今年',date:timeUtil.getCurrYearDays('/'),id:6},
              {type:"info",label:'去年',date:timeUtil.getLastYearDays('/'),id:7}
            ],
            dataFrame: [],
            curDateFrame: [],
            currentDataTag: 0,
            isGenTable:false, // true 表示点击过生成报告  false 重置生成报告
            isLoading: false,
          }
        },
        computed:{
          serverDataList:{
            get() {
              if(this.recordType==1){
                return this.serverData1.length
              }else if(this.recordType==2){
                return this.serverData2.length
              } else {
                return this.serverData3.length
              }
            }}
        },
        mounted(){
          promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
          PubSub.publish("currentMenuIndex", ROUTER_EDU_REPORT)
          if(!this.$store.state.eduReportRefresh.teacher){ //  是否需要刷新 true 需要清空数据 false 回显以前数据
            if(window.sessionStorage.getItem(TMP_TEACHER_RECORD)){
              const baseObj =  JSON.parse(window.sessionStorage.getItem(TMP_TEACHER_RECORD)) || {}
              this.recordType = baseObj.recordType
              this.curDateFrame = baseObj.curDateFrame
              this.currentDataTag = baseObj.currentDataTag
              this.currentPage = baseObj.currentPage
              this.dataFrame = baseObj.dataFrame
              this.reportFormType = baseObj.reportFormType
              this.serverData1 = baseObj.serverData1
              this.teacherDataInfo = baseObj.teacherDataInfo
              this.dataTag[0].type = 'info'
              if(this.currentDataTag!=-1){
                this.dataTag[this.currentDataTag].type = ''
              }
              this.serverDataChange(this.currentPage)
              this.isGenTable = true
              this.$store.dispatch('setEduReport', {teacher:true,record:true})
            }
          }else if(!this.$store.state.eduReportRefresh.record){
            if(window.sessionStorage.getItem(TMP_COURSE_RECORD)){
              const baseObj =  JSON.parse(window.sessionStorage.getItem(TMP_COURSE_RECORD)) || {}
              this.recordType = baseObj.recordType
              this.curDateFrame = baseObj.curDateFrame
              this.currentDataTag = baseObj.currentDataTag
              this.currentPage = baseObj.currentPage
              this.dataFrame = baseObj.dataFrame
              this.reportFormType = baseObj.reportFormType
              this.serverData3 = baseObj.serverData3
              this.tableColumnName = baseObj.tableColumnName
              this.recordDataInfo = baseObj.recordDataInfo
              this.dataTag[0].type = 'info'
              if(this.currentDataTag!=-1){
                this.dataTag[this.currentDataTag].type = ''
              }
              this.serverDataChange(this.currentPage)
              this.isGenTable = true
              this.$store.dispatch('setEduReport', {teacher:true,record:true})
            }
          }
        },
        methods:{
          changeRecordType(){
            this.dataTag = [
              {type:"",label:'本月',date:timeUtil.getCurrMonthDays('/'),id:0},
              {type:"info",label:'上月',date:timeUtil.getLastMonthDays('/'),id:1},
              {type:"info",label:'今日',date:timeUtil.getCurrDays('/'),id:2},
              {type:"info",label:'昨日',date:timeUtil.getYesterday('/'),id:3},
              {type:"info",label:'本周',date:timeUtil.getCurrWeekDays('/'),id:4},
              {type:"info",label:'上周',date:timeUtil.getLastWeekDays('/'),id:5},
              {type:"info",label:'今年',date:timeUtil.getCurrYearDays('/'),id:6},
              {type:"info",label:'去年',date:timeUtil.getLastYearDays('/'),id:7}
            ]
            this.isGenTable = false
            this.currentPage = 1
            this.currentDataTag = 0
            this.reportFormType = 1
          },
          onClickGenReport(){
            this.isLoading = true
            if(this.currentDataTag==-1){ // 按日期进行查询
              this.curDateFrame = this.dataFrame
            } else { // 按tag日期进行查询
              this.curDateFrame = (this.dataTag[this.currentDataTag].date).split("-")
            }
            if(this.recordType==1){
              eduReporterTeacher(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                start_date: this.curDateFrame[0],
                end_date: this.curDateFrame[1]
              })).then(res=>{
                if(res.code==SUCCESS_CODE){
                  this.teacherDataInfo.date = this.curDateFrame[0]+"-"+this.curDateFrame[1]
                  this.teacherDataInfo.teacher = res.data.teacher_num
                  this.teacherDataInfo.attendance = res.data.attendance_teacher
                  if(res.data.tableData&&res.data.tableData!='[]'&&res.data.tableData.length>0){
                    this.serverData1 = res.data.tableData
                    this.serverDataChange(this.currentPage)
                    this.isGenTable = true
                  }
                }else{
                  promptUtil.warning(this, res.msg)
                }
                this.isLoading = false
              }).catch(err=>{
                promptUtil.LOG('eduReporterTeacher-err',err)
                this.isLoading = false
              })
            }else if(this.recordType==2){
              eduReporterClass(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                start_date: this.curDateFrame[0],
                end_date: this.curDateFrame[1]
              })).then(res=>{
                if(res.code==SUCCESS_CODE){
                  this.classDataInfo.date = this.curDateFrame[0]+"-"+this.curDateFrame[1]
                  this.classDataInfo.classroom = res.data.calendar_num
                  this.classDataInfo.attendance = res.data.attendance_calendar
                  if(res.data.serverData&&res.data.serverData!='[]'&&res.data.serverData.length>0){
                    this.serverData2 = res.data.serverData
                    this.serverDataChange(this.currentPage)
                    this.isGenTable = true
                  }
                }else{
                  promptUtil.warning(this, res.msg)
                }
                this.isLoading = false
              }).catch(err=>{
                promptUtil.LOG('eduReporterClass-err',err)
                this.isLoading = false
              })
            }else{
              eduReporterRecord(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                start_date: this.curDateFrame[0],
                end_date: this.curDateFrame[1],
                select_type: this.reportFormType==1 ? 'course' : (this.reportFormType==2 ? 'class' : 'teacher')
              })).then(res=>{
                if(res.code==SUCCESS_CODE){
                  // recordDataInfo:{date:'',count:0,teacher:0.00,student:0.00},
                  this.recordDataInfo.date = this.curDateFrame[0]+"-"+this.curDateFrame[1]
                  this.recordDataInfo.count = res.data.calendar_num
                  this.recordDataInfo.teacher = res.data.studentHour
                  this.recordDataInfo.student = res.data.teacherHour
                  // this.recordDataInfo.teacher =
                  if(this.reportFormType==1){
                    this.tableColumnName = '课程名称'
                  }else if(this.reportFormType==2){
                    this.tableColumnName = '班级名'
                  }else{
                    this.tableColumnName = '教师名'
                  }
                  if(res.data.serverData&&res.data.serverData!='[]'&&res.data.serverData.length>0){
                    this.serverData3 = res.data.serverData
                    this.serverDataChange(this.currentPage)
                    this.isGenTable = true
                  }
                }else{
                  promptUtil.warning(this, res.msg)
                }
                this.isLoading = false
              }).catch(err=>{
                promptUtil.LOG('eduReporterClass-err',err)
                this.isLoading = false
              })
            }
          },
          // 跳转到班级明细
          onClickTeacherRecord(obj){
            const moment = require("moment")
            const info = moment(this.curDateFrame[0]).valueOf() + '-' + moment(this.curDateFrame[1]).valueOf() + '-' + obj.id
            const resourceData = {
              curDateFrame: this.curDateFrame,
              currentDataTag: this.currentDataTag,
              dataFrame: this.dataFrame,
              recordType: this.recordType,
              reportFormType: this.reportFormType,
              currentPage: this.currentPage,
              serverData1: this.serverData1,
              teacherDataInfo: this.teacherDataInfo
            }
            window.sessionStorage.setItem(TMP_TEACHER_RECORD, JSON.stringify(resourceData))
            this.$router.push({path:ROUTER_RECORD_LIST+'class/'+ info})
          },
          // 跳转到上课记录明细
          onClickRecordDetail(obj){
            const moment = require("moment")
            let type
            if(this.tableColumnName=='课程名称'){
              type = 1
            }else if(this.tableColumnName=='班级名'){
              type = 2
            }else{
              type = 3
            }
            const resourceData = {
              curDateFrame: this.curDateFrame,
              currentDataTag: this.currentDataTag,
              recordType: this.recordType,
              dataFrame: this.dataFrame,
              reportFormType: this.reportFormType,
              currentPage: this.currentPage,
              serverData3: this.serverData3,
              tableColumnName: this.tableColumnName,
              recordDataInfo: this.recordDataInfo
            }
            window.sessionStorage.setItem(TMP_COURSE_RECORD, JSON.stringify(resourceData))
            const info = moment(this.curDateFrame[0]).valueOf() + '-' + moment(this.curDateFrame[1]).valueOf() + '-' + type + '-' + obj.id + '-' + (obj.table=='' ? 'empty' : obj.table)
            this.$router.push({path:ROUTER_RECORD_LIST+'teachinglog/'+ info})
          },
          onClickExport(){
            const moment = require('moment')
            const startTime = moment(this.curDateFrame[0]).format('YYYYMMDD')
            const endTime = moment(this.curDateFrame[1]).format('YYYYMMDD')
            const targetParams = []
            const params = {head:[],body:[],name:''}
            if(this.recordType==1){ // 教师数据报表
              params.head = ['教师名称','上课数次','实到人次','应到人次','出勤率']
              params.name = startTime + '—' + endTime + '教师报表'
              this.serverData1.map(item=>{
                const tmpArr = []
                tmpArr.push(item.name)
                tmpArr.push(item.calendar_num)
                tmpArr.push(item.arrivalTime)
                tmpArr.push(item.arriveTime)
                tmpArr.push(item.attendance+'%')
                targetParams.push(tmpArr)
              })
            }else if (this.recordType==2){ // 班级数据报表
              params.head = ['班级名称','课程名称','授课教师','上课时间','实到人次','应到人次','出勤率',]
              params.name = startTime + '—' + endTime + '班级报表'
              this.serverData2.map(item=>{
                const tmpArr = []
                tmpArr.push(item.className && item.className!='' ? item.className : '--')
                tmpArr.push(item.packageName && item.packageName!='' ? item.packageName : '--')
                tmpArr.push(item.teacherName && item.teacherName!='' ? item.teacherName : '--')
                tmpArr.push(item.startTime && item.startTime!='' ? item.startTime : '--')
                tmpArr.push(item.arrivalTime)
                tmpArr.push(item.arriveTime)
                tmpArr.push(item.attendance+'%')
                targetParams.push(tmpArr)
              })
            } else if (this.recordType==3) { // 上课记录报表
              params.head = ['empty','实到人次','应到人次','出勤率','教师完成课时','学生消耗课时']
              if(this.reportFormType==1){
                params.head[0] = '课程名称'
              } else if (this.reportFormType==1) {
                params.head[0] = '班级名'
              } else {
                params.head[0] = '教师名'
              }
              params.name = startTime + '—' + endTime + '上课记录报表'
              this.serverData3.map(item=>{
                const tmpArr = []
                tmpArr.push(item.name && item.name!='' ? item.name : '--')
                tmpArr.push(item.arrivalTime)
                tmpArr.push(item.arriveTime)
                tmpArr.push(item.attendance+'%')
                tmpArr.push(item.teacherHour)
                tmpArr.push(item.studentHour)
                targetParams.push(tmpArr)
              })
            }
            params.body = targetParams
            exportExcel(qs.stringify({data:JSON.stringify(params)})).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this, '数据准备完毕,等待下载中')
                window.open(res.data, "_self")
              }
            }).catch(err=>{
              promptUtil.LOG('exportExcel-err',err)
            })
          },
          serverDataChange(val) {
            this.currentPage = val
            if(this.recordType==1){
              this.tableData = this.serverData1.slice((this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize)
            }else if(this.recordType==2){
              this.tableData = this.serverData2.slice((this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize)
            }else{
              this.tableData = this.serverData3.slice((this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize)
            }
          },
          onClickDataTag(id){
              if(this.currentDataTag!=-1){ // 没有选择任何一个
              this.dataTag[this.currentDataTag].type = "info"
            }
            this.dataFrame = ""
            this.dataTag[id].type = ""
            this.currentDataTag = id
          },
          onChangeDatePicker(date){
              this.dataTag[this.currentDataTag].type = "info"
            this.currentDataTag = -1
            this.dataFrame = date
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
    line-height:20px;
    margin-left:5px;
  }
  .tag_width {
    width: 60px;
    text-align: center;
    margin-right: 20px;
  }
  .tag_width:hover{
    cursor: pointer;
  }
  .record-span-color{
    color: #333333;
  }
</style>
