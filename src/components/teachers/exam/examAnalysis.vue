<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:20px;">
      <el-col :span="24">
        <div style="display:flex;flex:1;justify-content:center;position: relative">
          <el-radio-group v-model="recordType" @change="changeRecordType">
            <el-radio-button label="1">成绩统计</el-radio-button>
            <el-radio-button label="2">试题分析</el-radio-button>
          </el-radio-group>
          <el-button type="primary" @click="getExamList" style="position:absolute;right:0;top:0;">选择考试</el-button>
        </div>
      </el-col>
    </el-row>
    <div v-show="recordType==1&&currentShowType==0">
      <div style="padding-top:100px;display:flex;justify-content:center;align-items:center">
        <el-image style="width: 360px; height: 360px" :src="noDataUrl" fit="scale-down"></el-image>
      </div>
    </div>
    <div v-show="currentShowType==1&&recordType==1">
      <el-card>
        <div style="font-size:16px;">{{examAnalysis.examName}}</div>
        <el-divider></el-divider>
        <div style="display:flex;margin-bottom:-20px;">
          <div style="flex:1">
            <div class="item-wrapper"><div class="item-title">总分:</div><div style="font-size:14px">{{examAnalysis.totalScore}}分</div></div>
            <div class="item-wrapper"><div class="item-title">及格分:</div><div style="font-size:14px">{{examAnalysis.passScore}}分（及格率{{examAnalysis.passingRate}}%）</div></div>
            <div class="item-wrapper"><div class="item-title">答题时长:</div><div style="font-size:14px">{{examAnalysis.examLong}}分钟（平均答题时长{{examAnalysis.averageLong}}）</div></div>
            <div class="item-wrapper"><div class="item-title">考试时间:</div><div style="font-size:14px">{{examAnalysis.times}}</div></div>
          </div>
          <div style="flex:1">
            <div class="item-wrapper"><div class="item-title">应考人数:</div><div style="font-size:14px">{{examAnalysis.totalStu}}人（实考{{examAnalysis.actualStu}}人，参考率{{examAnalysis.referenceRate}}%）</div></div>
            <div class="item-wrapper"><div class="item-title">平均分:</div><div style="font-size:14px">{{examAnalysis.averageScore}}分</div></div>
            <div class="item-wrapper"><div class="item-title">最高分:</div><div style="font-size:14px">{{examAnalysis.maxScore}}分</div></div>
            <div class="item-wrapper"><div class="item-title">最低分:</div><div style="font-size:14px">{{examAnalysis.minScore}}分</div></div>
          </div>
        </div>
      </el-card>
      <el-tabs type="border-card" v-model="tabActive" style="margin-top:20px;" @tab-click="onClickChangeTabs">
        <el-tab-pane label="成绩分析" name="exam">
          <div style="display:flex;margin-top:10px;">
            <div style="flex:1;display:flex;justify-content:flex-start;align-items:center">
              <div style="font-size:14px;">选择班级</div>
              <el-select v-model="scoreStatistics.classroom" size="small" style="margin-left:10px" @change="onChangeClassRoom">
                <el-option v-for="item in scoreStatistics.classrooms" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div style="flex:1;display:flex;justify-content:flex-end;text-align:center">
              <el-button size="small" type="primary" plain @click="onClickExportExam">导出答题情况</el-button>
            </div>
          </div>
          <el-table :data="scoreStatistics.tableData" style="width: 100%;margin-top:10px;">
            <el-table-column prop="classroom" label="班级" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalStu" label="应考人数"></el-table-column>
            <el-table-column prop="actualStu" label="实考人数"></el-table-column>
            <el-table-column prop="referenceRate" label="参考率"></el-table-column>
            <el-table-column prop="passingRate" label="及格率"></el-table-column>
            <el-table-column prop="maxScore" label="最高分"></el-table-column>
            <el-table-column prop="minScore" label="最低分"></el-table-column>
            <el-table-column prop="averageScore" label="平均分"></el-table-column>
            <el-table-column label="平均时长">
              <template slot-scope="scope">{{averageLong2String(scope.row.averageLong)}}</template>
            </el-table-column>
          </el-table>
          <als-pageination @tableData="changeExamTableData($event)" ref="alsPageinationScore" style="margin-top:20px;"></als-pageination>
          <div id="scoreStatisticsChart" style="height:400px;margin-top:20px;"></div>
        </el-tab-pane>
        <el-tab-pane label="考生信息" name="student">
          <div style="display:flex;margin-top:10px;">
            <div style="flex:3;display:flex;justify-content:flex-start;align-items:center">
              <div style="font-size:14px;">筛选考生</div>
              <el-select v-model="studentStatistics.studentType" size="small" style="margin-left:10px" @change="onChangeClassFilter">
                <el-option v-for="item in studentFilter" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div style="font-size:14px;margin-left:20px;">选择班级</div>
              <el-select v-model="studentStatistics.classroom" size="small" style="margin-left:10px" @change="onChangeStuClassRoom">
                <el-option v-for="item in scoreStatistics.classrooms" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div style="flex:1;display:flex;justify-content:flex-end;text-align:center">
              <el-button size="small" type="primary" plain @click="onClickExportStudentInfo">导出</el-button>
            </div>
          </div>
          <el-table :data="studentStatistics.tableData" style="width: 100%;margin-top:10px;" v-loading="isStudentTabLoading">
            <el-table-column prop="stuName" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="所在班级"></el-table-column>
            <el-table-column prop="long" label="答题时长"></el-table-column>
            <el-table-column prop="times" label="交卷时间"></el-table-column>
            <el-table-column prop="nums" label="考试次数"></el-table-column>
            <el-table-column prop="score" label="成绩"></el-table-column>
            <el-table-column label="结果">
              <template slot-scope="scope">
                <span v-if="scope.row.result==11">通过</span>
                <span v-if="scope.row.result==10">未通过</span>
                <span v-if="scope.row.result==-1">漏考</span>
              </template>
            </el-table-column>
          </el-table>
          <als-pageination @tableData="changeStudentTableData($event)" ref="alsPageinationStudent" style="margin-top:20px;"></als-pageination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-show="recordType==2">
      <el-card shadow="always">
        <div style="display:flex">
          <div style="flex:4;display:flex;justify-content:flex-start;align-items:center">
            <div style="font-size:14px;">选择班级</div>
            <el-select v-model="paperStatistics.classroom" size="small" style="margin-left:10px" @change="onChangeQuestionClassRoom">
              <el-option v-for="item in scoreStatistics.classrooms" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div style="font-size:14px;margin-left:20px;">题型</div>
            <el-select v-model="paperStatistics.questionType" size="small" style="margin-left:10px" @change="onChangeQuestionType">
              <el-option v-for="item in questionFilter" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div style="flex:1;display:flex;justify-content:flex-end;align-items:center">
            <el-button type="primary" plain size="small" @click="onClickExportQuestions">导出</el-button>
          </div>
        </div>
        <el-table :data="questionTableData" style="width: 100%" v-loading="isQuestionLoading">
          <el-table-column type="index" :index="indexMethod" width="55" label="序号"></el-table-column>
          <el-table-column label="题型" width="120"><template slot-scope="scope">
            <span v-if="scope.row.type==1">单选题</span>
            <span v-if="scope.row.type==3">判断题</span>
            <span v-if="scope.row.type==2">多选题</span>
          </template></el-table-column>
          <el-table-column label="题目内容" prop="content" show-overflow-tooltip></el-table-column>
          <el-table-column label="正确人次" prop="right" width="100"></el-table-column>
          <el-table-column label="答题人次" prop="answer" width="100"></el-table-column>
          <el-table-column label="正确率" prop="rightRate" width="100"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="right" inline>
                <div style="margin-left:140px;margin-right:300px;">
                  <div>等分情况</div>
                  <div style="border:1px dashed #606266;height:200px;margin-top:20px;margin-bottom:20px;padding:10px">
                    <div style="background-color:#F2F6FC;height:100%;">
                      <el-tooltip class="item" effect="dark" :content="'正确率为'+props.row.rightRate" placement="top">
                        <el-progress style="padding-top:80px;margin-left:40px;margin-right:40px" :text-inside="true" :stroke-width="26" :percentage="props.row.rightFloat"></el-progress>
                      </el-tooltip>
                      <div style="display:flex;align-items:center;justify-content:center;margin-top:40px;">
                        <div style="border-radius:3px;width:20px;height:20px;background-color:#00a2ff;margin-right:10px;"></div>对
                        <div style="border-radius:3px;width:20px;height:20px;background-color:#EBEEF5;margin-right:10px;margin-left:10px;"></div>错
                      </div>
                    </div>
                  </div>
                  <div>答案:{{props.row.rightKey}}</div>
                  <div style="margin-top:20px;">解析:{{props.row.analysis}}</div>
                </div>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog
      :visible.sync="dialogSelectExamVisible"
      top="5vh"
      width="46%"
      :show-close="false"
      :before-close="handleClose">
      <div slot="title" style="font-size:24px;text-align:center;padding-top:10px;margin-bottom:-10px;">选择考试</div>
      <div :style="{marginLeft:'10px',marginRight:'10px'}">
        <div style="display:flex;margin-bottom: 20px;">
          <div style="display:flex;align-items:center;justify-content:flex-end;flex:1">考试名称:<el-input v-model="examFilter.keywords" placeholder="请输入考试名称" size="small" style="width:200px;margin-right:30px;"></el-input></div>
          <div style="display:flex;align-items:center;justify-content:flex-start;flex:1;" >考试时间:
            <el-date-picker v-model="examFilter.date" :clearable="false" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" style="width:260px"></el-date-picker>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;flex:1;margin-bottom:20px;">
          <el-button size="small" style="margin-right:20px;width:80px" @click="onClickReset">重置</el-button><el-button type="primary" size="small" style="margin-left:20px;width:80px" @click="getExamList">搜索</el-button>
        </div>
        <div style="height:1px;background-color:#409EFF"></div>
        <div style="margin-top:20px;">
          <el-table class="table_hover" ref="selectExamTable" :data="examTableData" tooltip-effect="dark" :style="{width:'100%',height:dialogHeight+'px',}" @row-click="onClickExamRow">
            <el-table-column prop="name" label="考试名称"></el-table-column>
            <el-table-column prop="score" label="总分" width="90"></el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">可用</span>
                <span v-else>不可用</span>
              </template>
            </el-table-column>
            <el-table-column prop="start" label="开始时间" width="160"></el-table-column>
            <el-table-column prop="end" label="结束时间" width="160"></el-table-column>
            <el-table-column prop="creator" label="创建人" width="140"></el-table-column>
            <el-table-column prop="ctime" label="创建时间" width="160"></el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center;margin-top:20px;" v-show="examDataFromServer.length>0">
            <el-pagination
              background
              @current-change="selectExamCurrentChange"
              :current-page="examCurrentPage"
              :page-size="examPageSize"
              layout="total, prev, pager, next, jumper"
              :total="selectExamDataList"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const echarts = require("echarts")
  import PubSub from "pubsub-js"
  import exportUtil from '../../../utils/exportUtil'
  import timeUtil from '../../../utils/timeUtil'
  import vuexUtil from '../../../utils/vuexUtils'
  import promptUtil from '../../../utils/promptUtil'
  import storageUtil from '../../../utils/storageUtil'
  import childHeader from '../../component/childHeader'
  import pageination from '../../commons/pagination/pagination'
  import '../../../router/router'
  import '../../../api/restfulapi'
  import {
    qs,
    queryExamList, // 获取考试列表
    getAnalysisExam, // 获取考试分析
    getStudentListFromExam, // 指定考试内获取学生列表
    getQuestionListFromExam, // 获取试题分析列表
  } from '../../../api/api'
  export default {
    name: "examAnalysis",
    components:{"als-child-header": childHeader,"als-pageination": pageination},
    data(){
      return{
        tabActive: "exam", // exam student
        currentShowType:0,
        noDataUrl: require('../../../../static/images/base/nodata.png'),
        isQuestionLoading:false,
        isStudentTabLoading:false,
        examAnalysis:{
          examName:'',totalScore:'',passScore:'',passingRate:'',totalStu:'',actualStu:'',times:'',
          maxScore:'',minScore:'',averageScore:'',examLong:'',averageLong:'',referenceRate:''},
        recordType: "1",
        dialogHeight:0,
        questionFilter:[{label:'全部题型',value:0},{label:'单选题',value:1},{label:'多选题',value:2},{label:'判断题',value:3}],
        studentFilter:[{label:'全部考生',value:-2},{label:'通过',value:11},{label:'未通过',value:10},{label:'已考',value:1},{label:'漏考',value:-1}],
        paperStatistics:{classroom:0,questionType:0},
        studentStatistics:{classroom:0,tableData:[],tableDataServer:[],studentType:-2},
        scoreStatistics:{classrooms:[],classroom:0,tableData:[],tableDataServer:[],chart:''},
        routerConfig: [{name:vuexUtil.checkMenuExist(this,'analysisExam').target.name,to:''}],
        examFilter:{keywords:'',date:timeUtil.getCurrWeekDays("/").split("-")},
        dialogSelectExamVisible:false,
        examCurrentPage:1,
        examPageSize:9,
        examTableData:[],
        questionTableData:[],
        examDataFromServer:[],
        targetExamObj:{id:0},
      }
    },
    computed:{
      selectExamDataList: {
        get() {
          return this.examDataFromServer.length
        }
      },
    },
    created(){
      this.dialogHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 420
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_EXAM_ANALYSIS);
      if(this.$store.state.examId && this.$store.state.examId!=0){
        this.targetExamObj.id = this.$store.state.examId
        this.getTargetExamAnalysis(this.targetExamObj.id)
      } else{
        this.initialize()
      }
    },
    methods:{
      initData(){
        this.recordType ='1'
        this.tabActive = "exam"
        this.currentShowType = 0
        this.isStudentTabLoading = false
        this.questionTableData = []
        this.paperStatistics = {classroom:0,questionType:0}
        this.studentStatistics ={classroom:0,tableData:[],tableDataServer:[],studentType:-2}
        this.scoreStatistics ={classrooms:[],classroom:0,tableData:[],tableDataServer:[],chart:''}
      },
      initialize(){
        this.getExamList()
      },
      onClickReset(){
        this.examFilter.keywords=''
        this.examFilter.date = timeUtil.getCurrWeekDays("/").split("-")
      },
      changeRecordType(val){
        if(this.questionTableData.length==0 && val==2){  // 点击试题分析
          if(this.scoreStatistics.classrooms && this.scoreStatistics.classrooms.length==0){
            this.scoreStatistics.classrooms = [{value:0,label:'全部班级'}]
          }
          if(this.currentShowType==1){ // 选择了考试以后才查询
            this.getQuestionList()
          }
        }
      },
      onChangeQuestionClassRoom(){
        this.getQuestionList()
      },
      onChangeQuestionType(){
        this.getQuestionList()
      },
      // 获取考试试题列表
      getQuestionList(){
        this.isQuestionLoading = true
        getQuestionListFromExam(qs.stringify({
          paper_id:this.targetExamObj.id,
          class_id:this.paperStatistics.classroom,
          type:this.paperStatistics.questionType
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.questionTableData = []
            if(res.data && res.data!='[]'){
              res.data.map(item=>{
                let obj = {
                  answers:item.answer,
                  id: item.id,
                  type: item.type,
                  right: item.num_true,
                  content: item.question,
                  analysis: item.analysis,
                  answer: item.num_all,
                  rightRate: item.lv&&item.lv!=0 ? item.lv : '0%',
                  rightFloat: (item.lv&&item.lv!=0) ? (item.lv.replace("%","") ? item.lv.replace("%","")*1:0) : 0,
                  rightKey: item.type==3 ? (item.key==1 ? '正确' : '错误') : item.key
                }
                this.questionTableData.push(obj)
              })
            }
            this.isQuestionLoading = false
          }
        }).catch(err=>{
          this.isQuestionLoading = false
          promptUtil.LOG('getQuestionListFromExam-err',err)
        })
      },
      handleClose(done){
        done();
      },
      selectExamCurrentChange(val){
        this.examCurrentPage = val
        this.examTableData = this.examDataFromServer.slice((this.examCurrentPage - 1) * this.examPageSize,
          this.examPageSize + (this.examCurrentPage - 1) * this.examPageSize)
      },
      getExamList(){
        let startDate = ''
        let endDate = ''
        if(typeof(this.examFilter.date[0])!='string'){ // 表明是date格式
          const moment = require('moment')
          startDate = moment.unix((new Date(this.examFilter.date[0].getTime()))/1000).format("YYYY/MM/DD")
          endDate = moment.unix((new Date(this.examFilter.date[1].getTime()))/1000).format("YYYY/MM/DD")
        }else{
          startDate = this.examFilter.date[0]
          endDate = this.examFilter.date[1]
        }
        const loading = promptUtil.loading(this)
        queryExamList(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          start_date: startDate,
          end_date: endDate,
          keywords: this.examFilter.keywords
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.examDataFromServer = []
            if(res.data && res.data!='[]'){
              this.examDataFromServer = res.data
            }
            this.examFilter.keys = ""
          }
          loading.close()
          this.selectExamCurrentChange(1)
          this.dialogSelectExamVisible = true
        }).catch(err=>{
          promptUtil.LOG('queryExamList-err',err)
          loading.close()
        })
      },
      analysisExamData(data){
        let min = (Math.floor((data.student_long / 60) % 60))/10 >= 1 ? Math.floor((data.student_long / 60) % 60) : '0' + Math.floor((data.student_long / 60) % 60)
        let sec = Math.floor((data.student_long) % 60)
        this.scoreStatistics.classrooms = [{value:0,label:'全部班级'}]
        if(data.class && data.class!='[]' && data.class!=''){
          data.class.map(item=>this.scoreStatistics.classrooms.push(item))
        }
        if(data.class_info && data.class_info!='[]' && data.class_info!=''){
          this.scoreStatistics.tableDataServer = data.class_info
        }
        this.examAnalysis={
          examName:data.title,
          totalScore:data.score,
          passScore:data.score_jige,
          passingRate:data.jigelv,
          totalStu:data.student_num,
          actualStu:data.student_num_chuqin,
          times:data.times,
          maxScore:data.score_max?data.score_max:0,
          minScore:data.score_min?data.score_min:0,
          averageScore:data.score_pingjun,
          examLong:data.long/60,
          averageLong:min+'分'+sec+'秒',
          referenceRate:data.numlv
        }
      },
      changeStudentTableData(data){
        this.studentStatistics.tableData = data
      },
      changeExamTableData(data){
        this.scoreStatistics.tableData = data
      },
      onChangeClassFilter(){
        this.getStudentList()
      },
      onChangeStuClassRoom(){
        this.getStudentList()
      },
      onChangeClassRoom(val){
        if(val==0){ // 搜索全部
          this.$refs.alsPageinationScore.setServerData(this.scoreStatistics.tableDataServer)
        }else{
          let selectClassDetail = this.scoreStatistics.tableDataServer.find(item=>item.class_id==val)
          const tmpArr = []
          if(selectClassDetail){
            tmpArr.push(selectClassDetail)
          }
          this.$refs.alsPageinationScore.setServerData(tmpArr)
        }
      },
      averageLong2String(times){
        let m = Math.floor((times / 60) % 60)
        let s = Math.floor(times % 60)
        return m + '分' + s + '秒'
      },
      computedScoreStatistics(){
        const obj = {0:{referenceRate:0,passingRate:0,averageScore:0,averageLong:0}}
        let referenceRate = 0
        let passingRate = 0
        let averageScore = 0
        let averageLong = 0
        let count = this.scoreStatistics.tableDataServer.length
        try{
          this.scoreStatistics.tableDataServer.map(item=>{
            referenceRate = referenceRate + item.referenceRate.replace("%", '')*1
            passingRate = passingRate + item.passingRate.replace("%", '')*1
            averageScore = averageScore + item.averageScore
            averageLong = averageLong + item.averageLong
            obj[item.class_id] = {
              referenceRate: item.referenceRate.replace("%", '')*1,
              passingRate: item.passingRate.replace("%", '')*1,
              averageScore: item.averageScore,
              averageLong: item.averageLong
            }
          })
        }catch(e){}
        obj[0] = {referenceRate:referenceRate/count,passingRate:passingRate/count,averageScore:averageScore/count,averageLong:averageLong/count}
        return obj
      },
      // 生成成绩分析页面
      genScoreStatisticsChart(){
        this.scoreStatistics.chart.showLoading()
        this.scoreStatistics.chart.hideLoading()
        let classNameArray = [] // 班级名称
        let referenceRateArray = [] // 参考率
        let passingRateArray = [] // 及格率
        let averageScoreArray = [] // 平均分
        let averageLongArray = [] // 答题时长
        const scoreObj = this.computedScoreStatistics()
        try{
          this.scoreStatistics.classrooms.map(item=>{
            classNameArray.push(item.label)
            referenceRateArray.push(scoreObj[item.value].referenceRate)
            passingRateArray.push(scoreObj[item.value].passingRate)
            averageScoreArray.push(scoreObj[item.value].averageScore)
            averageLongArray.push(Math.round(scoreObj[item.value].averageLong/60))
          })
        }catch (e) {}
        const option = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          legend: {
            bottom: 'auto',
            data:['参考率', '及格率','平均分','答题时长(分钟)'],
            itemGap: 5
          },
          grid: {
            top: '12%',
            left: '1%',
            right: '10%',
            containLabel: true
          },
          xAxis: [{type : 'category', data : classNameArray}],
          yAxis: [
            {type : 'value',
              axisLabel: {
                formatter: function (a) {
                  a = +a;
                  return isFinite(a) ? echarts.format.addCommas(+a) : '';
                }
              }
            }
          ],
          dataZoom: [
            {show: true, start: 94, end: 100},
            {type: 'inside', start: 94, end: 100},
            {show: true, yAxisIndex: 0, filterMode: 'empty', width: 30, height: '80%', showDataShadow: false, left: '93%'}
          ],
          series : [
            {name: '参考率', type: 'bar', data: referenceRateArray},
            {name: '及格率', type: 'bar', data: passingRateArray},
            {name: '平均分', type: 'bar', data: averageScoreArray},
            {name: '答题时长(分钟)', type: 'bar', data: averageLongArray}
          ]
        };
        this.scoreStatistics.chart.setOption(option)
      },
      onClickExportQuestions(){
        let name = '['+this.examAnalysis.examName + ']试题分析'
        let header = ['题型','试题内容','正确答案','解析','正确人次','答题人次','正确率']
        let body = []
        if(this.questionTableData&&this.questionTableData.length&&this.questionTableData.length>0){
          this.questionTableData.map(item=>{
            const bodyItem = []
            let typeLabel = ''
            if(item.type==1){
              typeLabel = '单选题'
            }else if(item.type==2){
              typeLabel = '多选题'
            }else if(item.type==3){
              typeLabel = '判断题'
            }
            let questionContent = item.content + '\r\n'
            if(item.answers&&item.answers.A&&item.answers.A!=''){
              questionContent = questionContent + 'A.' + item.answers.A + '\r\n'
            }
            if(item.answers&&item.answers.B&&item.answers.B!=''){
              questionContent = questionContent + 'B.' + item.answers.B + '\r\n'
            }
            if(item.answers&&item.answers.C&&item.answers.C!=''){
              questionContent = questionContent + 'C.' + item.answers.C + '\r\n'
            }if(item.answers&&item.answers.D&&item.answers.D!=''){
              questionContent = questionContent + 'D.' + item.answers.D + '\r\n'
            }
            bodyItem.push(typeLabel)
            bodyItem.push(questionContent)
            bodyItem.push(item.rightKey)
            bodyItem.push(item.analysis)
            bodyItem.push(item.right)
            bodyItem.push(item.answer)
            bodyItem.push(item.rightRate)
            body.push(bodyItem)
          })
        }
        exportUtil.excelExport(this,name, header,body)
      },
      onClickExportStudentInfo(){
        let name = '['+this.examAnalysis.examName + ']考生信息'
        let header = ['姓名','所在班级','答题时长','交卷时间','考试次数','成绩','结果']
        let body = []
        if(this.studentStatistics.tableData&&this.studentStatistics.tableData.length&&this.studentStatistics.tableData.length>0){
          this.studentStatistics.tableData.map(item=>{
            const bodyItem = []
            let result = ''
            if(item.result==11){
              result = '通过'
            }else if(item.result==10){
              result = '未通过'
            }else if(item.result==-1){
              result = '漏考'
            }
            bodyItem.push(item.stuName)
            bodyItem.push(item.className)
            bodyItem.push(this.averageLong2String(item.long))
            bodyItem.push(item.times)
            bodyItem.push(item.nums)
            bodyItem.push(item.score)
            bodyItem.push(result)
            body.push(bodyItem)
          })
        }
        exportUtil.excelExport(this,name, header,body)
      },
      onClickExportExam(){
        let name = '['+this.examAnalysis.examName + ']答题情况'
        let header = ['班级','应考人数','实考人数','参考率','及格率','最高分','最低分','平均分','平均时长']
        let body = []
        if(this.scoreStatistics.tableDataServer&&this.scoreStatistics.tableDataServer.length&&this.scoreStatistics.tableDataServer.length>0){
          this.scoreStatistics.tableDataServer.map(item=>{
            const bodyItem = []
            bodyItem.push(item.classroom)
            bodyItem.push(item.totalStu)
            bodyItem.push(item.actualStu)
            bodyItem.push(item.referenceRate)
            bodyItem.push(item.passingRate)
            bodyItem.push(item.maxScore)
            bodyItem.push(item.minScore)
            bodyItem.push(item.averageScore)
            bodyItem.push(this.averageLong2String(item.averageLong))
            body.push(bodyItem)
          })
        }
        exportUtil.excelExport(this,name, header,body)
      },
      onClickExamRow(row){
        if(row.status!=1){
          promptUtil.warning(this,'该考试不可分析')
        }else{
          this.targetExamObj = row
          this.getTargetExamAnalysis(row.id)
        }
      },
      // 获取指定考试的详情
      getTargetExamAnalysis(targetId){
        const loading = promptUtil.loading(this)
        getAnalysisExam(qs.stringify({
          paper_id:targetId
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.$store.dispatch("setExamId", 0)
            this.initData()
            this.analysisExamData(res.data)
            this.dialogSelectExamVisible = false
            this.currentShowType = 1
            this.$refs.alsPageinationScore.setServerData(this.scoreStatistics.tableDataServer)
            setTimeout(()=>{
              this.scoreStatistics.chart = echarts.init(document.getElementById('scoreStatisticsChart'))
              this.genScoreStatisticsChart()
            },350)
          }else{
            promptUtil.warning(this,res.msg)
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG('getAnalysisExam-err',err)
        })
      },
      getStudentList(){
        this.isStudentTabLoading = true
        getStudentListFromExam(qs.stringify({
          paper_id:this.targetExamObj.id,
          class_id:this.studentStatistics.classroom,
          force:this.studentStatistics.studentType,
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.studentStatistics.tableDataServer = []
            if(res.data && res.data!='[]'){
              res.data.map(item=>{
                let obj = {
                  className:item.class_name,
                  stuName:item.student_name,
                  long:this.averageLong2String(item.long),
                  times:item.submit_time,
                  nums:item.num,
                  score:item.score,
                  result:item.force
                }
                this.studentStatistics.tableDataServer.push(obj)
              })
            }
            this.$refs.alsPageinationStudent.setServerData(this.studentStatistics.tableDataServer)
          }
          this.isStudentTabLoading = false
        }).catch(err=>{
          promptUtil.LOG('getStudentListFromExam-err',err)
          this.isStudentTabLoading = false
        })
      },
      onClickChangeTabs(tab){
        if(tab.index==0){
          this.$refs.alsPageinationScore.setServerData(this.scoreStatistics.tableDataServer)
        }else if(tab.index==1){ // 考生信息
          if(this.studentStatistics.tableDataServer.length==0){ // 没数据需要重新获取
            this.getStudentList()
          }
        }
      },
      indexMethod(index) {
        return index+1;
      }
    }
  }
</script>

<style scoped>
  .item-wrapper{
    display:flex;
    margin-bottom: 20px;
  }
  .item-title{
    width:74px;
    margin-right:6px;
    color:#909399;
    font-size:14px
  }
  .table_hover:hover {
    cursor: pointer;
  }
</style>
