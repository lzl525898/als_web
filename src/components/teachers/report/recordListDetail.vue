<template>
    <div>
      <el-row>
        <el-col :span="24">
          <el-page-header @back="goBack" title="首页">
            <div slot="content" style="margin-top:5px;">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><el-link :underline="false" style="margin-top:-3px;" @click="goHistory">教务统计</el-link></el-breadcrumb-item>
                <el-breadcrumb-item to="" v-show="showType=='class'">班级明细</el-breadcrumb-item>
                <el-breadcrumb-item to="" v-show="showType=='teachinglog'">上课记录明细</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-page-header>
        </el-col>
      </el-row>
      <el-card style="margin-top: 20px;">
        <div v-show="showType=='class'">
          <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;">
            当前结果:共计<span class="record-span-color">{{classData.count}}</span>条记录
            <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onClickExport">导出>></el-link>
          </div>
          <el-table :data="classData.tableData" border style="width: 100%">
            <el-table-column prop="className" label="班级名称"></el-table-column>
            <el-table-column prop="courseName" label="课程名称" align="center" ></el-table-column>
            <el-table-column prop="schoolName" label="上课机构" align="center" width="300"></el-table-column>
            <el-table-column prop="startDate" label="开课日期" align="center" width="150"></el-table-column>
            <el-table-column label="班级人数" align="center" width="200">
              <template slot-scope="scope">
                <div style="display: flex;align-items:center;justify-content:center;" v-if="scope.row.count && scope.row.count!=''">
                  <el-progress :text-inside="true" :stroke-width="12" :show-text="false" :percentage="scope.row.percentage" style="width:120px;margin-right:5px;"></el-progress>{{scope.row.count}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="teacher"label="任课教师" align="center" width="150"></el-table-column>
            <el-table-column label="上课时间" align="center" width="270">
              <template slot-scope="scope">
                <div v-for="(timeString,index) in scope.row.timeList" :key="index">{{timeString}}</div>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="150">
              <template slot-scope="scope">{{scope.row.desc&&scope.row.desc!='' ? scope.row.desc : '--'}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="showType=='teachinglog'">
          <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;">
            当前结果:共计<span class="record-span-color">{{recordData.count}}</span>条记录
            <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onClickExport">导出>></el-link>
          </div>
          <el-table :data="recordData.tableData" border style="width: 100%">
            <el-table-column prop="startDate" label="上课日期" align="center"width="120"></el-table-column>
            <el-table-column prop="schoolName" label="上课机构" align="center"></el-table-column>
            <el-table-column prop="className" label="班级名称" align="center"></el-table-column>
            <el-table-column prop="courseName" label="课程名称" align="center"></el-table-column>
            <el-table-column prop="teacher"label="任课教师" align="center" width="150"></el-table-column>
            <el-table-column prop="leave"label="实到/应到" align="center" width="120"></el-table-column>
            <el-table-column prop="teacherHour" label="教师课时" align="center" width="120"></el-table-column>
            <el-table-column prop="studentHour" label="学员课时" align="center" width="120">
            </el-table-column>
            <el-table-column label="备注" align="center" width="150">
              <template slot-scope="scope">{{scope.row.desc&&scope.row.desc!='' ? scope.row.desc : '--'}}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
</template>

<script>
  const moment = require("moment")
  import '../../../router/router'
  import {
    qs,
    exportExcel,
    eduReportClassDetail, // 统计班级明细
    eduReporterRecordDetail, // 统计上课记录明细
  } from '../../../api/api'
  import storageUtil from '../../../utils/storageUtil'
  import promptUtil from '../../../utils/promptUtil'
  import stringUtil from '../../../utils/stringUtil'
  export default {
    name: "recordListDetail",
    data(){
      return{
        showType: '', // 显示类型
        classData: {
          count:0,
          tableData:[]
        },
        recordData: {
          count: 0,
          tableData:[],
        },
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      // this.$route.params.type,this.$route.params.info
      this.showType = this.$route.params.type
      if(this.showType=='class'){ // 班级明细
        if(this.$route.params.info){
          const params = this.$route.params.info.split('-')
          if(params.length==3){
            const moment = require("moment")
            const loading = promptUtil.loading(this)
            eduReportClassDetail(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: params[2],
              start_date: moment(params[0]*1).format('YYYY/MM/DD'),
              end_date: moment(params[1]*1).format('YYYY/MM/DD')
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                if(res.data && res.data.classData){
                  res.data.classData.map(item=>{
                    const numArr = item.count.split("/")
                    item.percentage = item.count=="0/0" ? 0 : parseInt(numArr[0]/numArr[1]*100)
                  })
                  this.classData.tableData = res.data.classData
                  this.classData.count = this.classData.tableData.length
                }else{
                  // 没有相关数据
                }
              }
              loading.close()
            }).catch(err=>{
              promptUtil.LOG('eduReportClassDetail-err',err)
              loading.close()
            })
            this.$store.dispatch('setEduReport', {teacher:false,record:true}) //  是否需要刷新 true 需要清空数据 false 回显以前数据
          }else{
            promptUtil.warning(this, '请返回上一页')
          }
        }
      }else{ // 上课记录明细
        if(this.$route.params.info){
          const params = this.$route.params.info.split('-')
          if(params.length==5){
            const loading = promptUtil.loading(this)
            eduReporterRecordDetail(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              value: params[3],
              table: params[4],
              select_type: params[2]==1 ? 'course': (params[2]==2 ? 'class' : 'teacher'),   // 课程 、班级、 教师
              start_date: moment(params[0]*1).format('YYYY/MM/DD'),
              end_date: moment(params[1]*1).format('YYYY/MM/DD')
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                if(res.data && res.data.tableData){
                  this.recordData.tableData = res.data.tableData
                  this.recordData.count = this.recordData.tableData.length
                }else{
                  // 没有相关数据
                }
              }
              loading.close()
            }).catch(err=>{
              promptUtil.LOG('eduReportClassDetail-err',err)
              loading.close()
            })
            this.$store.dispatch('setEduReport', {teacher:true,record:false}) //  是否需要刷新 true 需要清空数据 false 回显以前数据
          }else{
            promptUtil.warning(this, '请返回上一页')
          }
        }
      }
    },
    methods: {
      onClickExport(){
        if(this.showType=='class'){ // 课时明细
          if(this.classData.tableData.length==0){
            promptUtil.warning(this, '暂无数据可导出')
          }else{
            const arr = this.$route.params.info.split('-')
            const startTime = moment(arr[0]*1).format('YYYYMMDD')
            const endTime = moment(arr[1]*1).format('YYYYMMDD')
            const targetParams = []
            const params = {head:[],body:[],name:''}
            params.head = ['班级名称','课程名称','上课机构','开课日期','班级人数(实到/应到)','任课教师','上课时间','备注']
            params.name = startTime + "—" + endTime + '班级明细'
            this.classData.tableData.map(item=>{
              const tmpArr = []
              tmpArr.push(item.className && item.className!='' ? item.className : '--')
              tmpArr.push(item.courseName && item.courseName!='' ? item.courseName : '--')
              tmpArr.push(item.schoolName && item.schoolName!='' ? item.schoolName : '--')
              tmpArr.push(item.startDate && item.startDate!='' ? item.startDate : '--')
              tmpArr.push(item.count && item.count!='' ? item.count : '0/0')
              tmpArr.push(item.teacher && item.teacher!='' ? item.teacher : '--')
              tmpArr.push(item.timeList && item.timeList.length!=0 ?  stringUtil.array2String(item.timeList,","): '--')
              tmpArr.push(item.desc && item.desc!='' ? item.desc : '--')
              targetParams.push(tmpArr)
            })
            params.body = targetParams
            exportExcel(qs.stringify({data:JSON.stringify(params)})).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this, '数据准备完毕,等待下载中')
                window.open(res.data, "_self")
              }
            }).catch(err=>{
              promptUtil.LOG('exportExcel-err',err)
            })
          }
        }else if(this.showType=='teachinglog'){
          console.log("this.$route.params.info",this.$route.params.info)
          if(this.recordData.tableData.length==0){
            promptUtil.warning(this, '暂无数据可导出')
          }else{
            const arr = this.$route.params.info.split('-')
            const startTime = moment(arr[0]*1).format('YYYYMMDD')
            const endTime = moment(arr[1]*1).format('YYYYMMDD')
            const targetParams = []
            const params = {head:[],body:[],name:''}
            params.head = ['上课日期','上课机构','班级名称','课程名称','任课教师','实到/应到','教师课时','学员课时','备注']
            params.name = startTime + "—" + endTime + '上课记录明细'
            this.recordData.tableData.map(item=>{
              const tmpArr = []
              tmpArr.push(item.startDate && item.startDate!='' ? item.startDate : '--')
              tmpArr.push(item.schoolName && item.schoolName!='' ? item.schoolName : '--')
              tmpArr.push(item.className && item.className!='' ? item.className : '--')
              tmpArr.push(item.courseName && item.courseName!='' ? item.courseName : '--')
              tmpArr.push(item.teacher && item.teacher!='' ? item.teacher : '--')
              tmpArr.push(item.leave && item.leave!='' ? item.leave : '--')
              tmpArr.push(item.teacherHour)
              tmpArr.push(item.studentHour)
              tmpArr.push(item.desc && item.desc!='' ? item.desc : '--')
              targetParams.push(tmpArr)
            })
            params.body = targetParams
            exportExcel(qs.stringify({data:JSON.stringify(params)})).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this, '数据准备完毕,等待下载中')
                window.open(res.data, "_self")
              }
            }).catch(err=>{
              promptUtil.LOG('exportExcel-err',err)
            })
          }
        }
      },
      goBack() {
        this.$router.replace({path: '/'})
      },
      goHistory(){
        this.$router.go(-1);
      },
    }
  }
</script>

<style scoped>
  .record-span-color{
    color: #333333;
  }
</style>
