<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>

    <el-card style="margin-top:20px;">
      <el-row>
        <el-col :span="12">
          <el-input :placeholder="inputPlaceholder" prefix-icon="el-icon-search" v-model="examStudentFilter.keywords" size="small" style="width:250px"></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" @click="dataInquiry">查询</el-button>
        </el-col>
        <el-col :span="12" style="display:flex;justify-content:flex-end">
          <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button v-show="activeName=='first'" size="small" type="primary" icon="el-icon-finished" @click="onClickSelectExam">选择考试</el-button>
          <el-button v-show="activeName=='second'" size="small" type="primary" icon="el-icon-finished" @click="onClickSelectStudent">选择考生</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" style="margin-top:20px;" @tab-click="handleClick">
      <el-tab-pane label="按考试查询" name="first">
        <div>
          <div style="display:flex;justify-content:flex-start;align-items:center;margin:10px 20px 20px 20px;color:#909399;font-size:14px;font-weight:bold">
            <div style="flex:1">考试名称</div><div style="flex:1">创建者</div><div style="flex:1">考试时间</div>
          </div>
          <div style="height:1px;background-color:#F6F7FA"></div>
          <div style="display:flex;justify-content:flex-start;align-items:center;margin:20px 20px 10px 20px;color:#909399;font-size:14px;">
            <div style="flex:1">{{targetSelectExam.name}}</div><div style="flex:1">{{targetSelectExam.creator}}</div><div style="flex:1">{{targetSelectExam.startTime}}</div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按考生查询" name="second">
        <div style="display:flex;justify-content:flex-start;align-items:center;margin:10px 20px 20px 20px;color:#909399;font-size:14px;;font-weight:bold">
          <div style="flex:1">学生姓名</div><div style="flex:1">账号</div><div style="flex:1">所在班级</div>
        </div>
        <div style="height:1px;background-color:#F6F7FA"></div>
        <div style="display:flex;justify-content:flex-start;align-items:center;margin:20px 20px 10px 20px;color:#909399;font-size:14px;">
          <div style="flex:1">{{targetSelectStudent.name}}</div><div style="flex:1">{{targetSelectStudent.account}}</div><div style="flex:1">{{targetSelectStudent.classroom}}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-show="activeName=='first'">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width:100%;margin-top:20px;box-shadow:1px 1px 1px #DCDFE6,1px -1px 1px #DCDFE6,-1px 1px 1px #DCDFE6,-1px -1px 1px #DCDFE6;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="account" label="账户"></el-table-column>
        <el-table-column prop="name" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="classroom" label="所属班级" show-overflow-tooltip></el-table-column>
        <el-table-column label="分数" >
          <template slot-scope="scope">{{(scope.row.score*1).toFixed(1)}}</template>
        </el-table-column>
        <el-table-column label="通过考试">
          <template slot-scope="scope">
            <span v-show="scope.row.examResult==1" style="color:#67C23A">是</span>
            <span v-show="scope.row.examResult!=1" style="color:#F56C6C">否</span>
          </template>
        </el-table-column>
        <el-table-column label="考试状态">
          <template slot-scope="scope">
            <span v-show="scope.row.force==1" style="color:#67C23A">已交卷</span>
            <span v-show="scope.row.force==0" style="color:#909399">未考试</span>
            <span v-show="scope.row.force==3" style="color:#909399">考试未开始</span>
            <span v-show="scope.row.force==2" style="color:#E6A23C">考试中</span>
            <span v-show="scope.row.force==-1" style="color:#F56C6C">缺考</span>
          </template>
        </el-table-column>
        <el-table-column prop="stime" label="交卷时间"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-link :underline="false" @click="onClickDetail({index: scope.$index, row:scope.row})"><i class="el-icon-edit-outline" style="color:#409EFF;"></i></el-link>
            </el-tooltip>
<!--            <el-tooltip class="item" effect="dark" content="下载" placement="top">-->
<!--              <el-link :underline="false" @click="onClickDownload({index: scope.$index, row:scope.row})"><i class="el-icon-download" style="color:#409EFF;margin-left:5px;"></i></el-link>-->
<!--            </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-link :underline="false" @click="onClickDelete({index: scope.$index, row:scope.row})"><i class="el-icon-delete" style="color:#409EFF;margin-left:5px;"></i></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center;margin-top:20px;" v-show="tableDataFromServer.length>0">
        <el-pagination
          background
          @current-change="tableDataCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableDataList"
        ></el-pagination>
      </div>
    </div>
    <div v-show="activeName=='second'">
      <el-table
        :data="stuTableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width:100%;margin-top:20px;box-shadow:1px 1px 1px #DCDFE6,1px -1px 1px #DCDFE6,-1px 1px 1px #DCDFE6,-1px -1px 1px #DCDFE6;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="考试名"></el-table-column>
        <el-table-column label="分数" >
          <template slot-scope="scope">{{(scope.row.score*1).toFixed(1)}}</template>
        </el-table-column>
        <el-table-column label="通过考试">
          <template slot-scope="scope">
            <span v-show="scope.row.examResult==1" style="color:#67C23A">是</span>
            <span v-show="scope.row.examResult!=1" style="color:#F56C6C">否</span>
          </template>
        </el-table-column>
        <el-table-column label="考试状态">
          <template slot-scope="scope">
            <span v-show="scope.row.status==1" style="color:#67C23A">已交卷</span>
            <span v-show="scope.row.status==0" style="color:#909399">未考</span>
            <span v-show="scope.row.status==3" style="color:#909399">考试未开始</span>
            <span v-show="scope.row.status==2" style="color:#E6A23C">考试中</span>
            <span v-show="scope.row.status==-1" style="color:#F56C6C">漏考</span>
          </template>
        </el-table-column>
        <el-table-column prop="times" label="考试次数"></el-table-column>
        <el-table-column prop="stime" label="交卷时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-link :underline="false" @click="onClickDetailExam({index: scope.$index, row:scope.row})"><i class="el-icon-edit-outline" style="color:#409EFF;"></i></el-link>
            </el-tooltip>
<!--            <el-tooltip class="item" effect="dark" content="下载" placement="top">-->
<!--              <el-link :underline="false" @click="onClickDownload({index: scope.$index, row:scope.row})"><i class="el-icon-download" style="color:#409EFF;margin-left:5px;"></i></el-link>-->
<!--            </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-link :underline="false" @click="onClickDeleteExam({index: scope.$index, row:scope.row})"><i class="el-icon-delete" style="color:#409EFF;margin-left:5px;"></i></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center;margin-top:20px;" v-show="stuTableDataFromServer.length>0">
        <el-pagination
          background
          @current-change="stuTableDataCurrentChange"
          :current-page="currentStuPage"
          :page-size="stuPageSize"
          layout="total, prev, pager, next, jumper"
          :total="stuTableDataList"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      class="table_hover"
      :visible.sync="dialogSelectExamVisible"
      top="5vh"
      width="46%"
      :show-close="false"
      @opened="examListOpened"
      :before-close="handleClose">
      <div slot="title" style="font-size:24px;text-align:center;padding-top:10px;margin-bottom:-10px;">选择考试</div>
      <div class="select_exam_wrapper" :style="{marginLeft:'10px',marginRight:'10px'}">
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
          <el-table ref="selectExamTable" :data="examTableData" tooltip-effect="dark" :style="{width:'100%',height:dialogHeight+'px',}" @row-click="onClickExamRow">
            <el-table-column prop="name" label="考试名称"></el-table-column>
            <el-table-column prop="score" label="总分" width="90"></el-table-column>
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
    <el-dialog
      :visible.sync="dialogSelectStudentVisible"
      top="5vh"
      width="46%"
      :show-close="false"
      @opened="examListOpened"
      :before-close="handleClose">
      <div slot="title" style="font-size:24px;text-align:center;padding-top:10px;margin-bottom:-10px;">选择考生</div>
      <div class="select_exam_wrapper" :style="{marginLeft:'10px',marginRight:'10px'}">
        <div style="display:flex;margin-bottom: 20px;">
          <div style="display:flex;align-items:center;justify-content:flex-end;flex:1">账号:<el-input v-model="studentFilter.account" placeholder="请输入考生账号" size="small" style="width:170px"></el-input></div>
          <div style="display:flex;align-items:center;justify-content:center;flex:1">姓名:<el-input v-model="studentFilter.name" placeholder="请输入考生姓名" size="small" style="width:170px"></el-input></div>
          <div style="display:flex;align-items:center;justify-content:flex-start;flex:1;">手机:<el-input v-model="studentFilter.phone" placeholder="请输入手机号" size="small" style="width:170px"></el-input></div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;flex:1;margin-bottom:20px;">
          <el-button size="small" style="margin-right:20px;width:80px" @click="onClickReset">重置</el-button><el-button type="primary" size="small" style="margin-left:20px;width:80px" @click="getStudentList">搜索</el-button>
        </div>
        <div style="height:1px;background-color:#409EFF"></div>
        <div style="margin-top:20px;">
          <el-table class="table_hover" ref="selectStudentTable" :data="studentTableData" tooltip-effect="dark" :style="{width:'100%',height:dialogHeight+'px',}" @row-click="onClickStudentRow">
            <el-table-column prop="account" label="账号" width="140"></el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="classroom" label="所属班级" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机" width="130"></el-table-column>
            <el-table-column label="性别" width="65">
              <template slot-scope="scope">
                <span v-if="scope.row.sex==1">男</span>
                <span v-if="scope.row.sex==2">女</span>
                <span v-if="scope.row.sex==0">保密</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center;margin-top:20px;" v-show="studentDataFromServer.length>0">
            <el-pagination
              background
              @current-change="selectStudentCurrentChange"
              :current-page="studentCurrentPage"
              :page-size="studentPageSize"
              layout="total, prev, pager, next, jumper"
              :total="selectStudentDataList"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PubSub from "pubsub-js"
  import timeUtil from '../../../utils/timeUtil'
  import vuexUtil from '../../../utils/vuexUtils'
  import promptUtil from '../../../utils/promptUtil'
  import storageUtil from '../../../utils/storageUtil'
  import childHeader from '../../component/childHeader'
  import '../../../router/router'
  import '../../../api/restfulapi'
  import {
    qs,
    exportExcel, // 导出到excel
    queryExamList, // 获取考试列表
    getStudentList, // 获取学生列表
    delStudentExamData, // 删除学生考试数据
    studentWithExamList, // 按考试查询学生列表
    examWithStudentList, // 按学生查询考试列表
  } from '../../../api/api'
  export default {
    name: "examResult",
    components:{"als-child-header": childHeader},
    data(){
      return{
        tableDataFromServer: [],
        tableData: [],
        stuTableDataFromServer: [],
        stuTableData: [],
        activeName:'first', // first second
        routerConfig: [{name:vuexUtil.checkMenuExist(this,'examResult').target.name,to:''}],
        examFilter:{keywords:'',date:timeUtil.getCurrWeekDays("/").split("-")},
        studentFilter:{name:'',account:'',phone:''},
        dialogSelectExamVisible:false,
        dialogSelectStudentVisible:false,
        dialogHeight:0,
        examDataFromServer:[],
        examTableData:[],
        studentDataFromServer:[],
        studentTableData:[],
        examCurrentPage:1,
        examPageSize:9,
        studentCurrentPage:1,
        studentPageSize:9,
        inputPlaceholder:'',
        examStudentFilter:{keywords:''},
        currentPage:1,
        pageSize:10,
        currentStuPage:1,
        stuPageSize:10,
        multipleSelection:[],
        targetSelectExam:{name:'',creator:'',startTime:'',id:''},
        targetSelectStudent:{name:'',account:'',classroom:'',id:''},
      }
    },
    watch:{
      activeName: {
        handler(val){
          this.multipleSelection = []
          if(val=='first'){
            this.inputPlaceholder = '请输入姓名、账号信息'
          }else{
            this.inputPlaceholder = '请输入考试名称'
          }
        },
        immediate:true
      }
    },
    computed:{
      tableDataList: {
        get() {
          return this.tableDataFromServer.length
        }
      },
      stuTableDataList: {
        get() {
          return this.stuTableDataFromServer.length
        }
      },
      selectExamDataList: {
        get() {
          return this.examDataFromServer.length
        }
      },
      selectStudentDataList: {
        get() {
          return this.studentDataFromServer.length
        }
      },
    },
    created(){
      this.dialogHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 420
    },
    mounted() {
      window.onresize = () => {
        this.dialogHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 420
      }
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_EXAM_RESULT);
      if(this.$store.state.examInfo.id && this.$store.state.examInfo.id!=''){ // 证明是点选详情跳转
        this.targetSelectExam = {
          name:this.$store.state.examInfo.name,
          creator:this.$store.state.examInfo.creator,
          startTime:this.$store.state.examInfo.time,
          id:this.$store.state.examInfo.id
        }
        this.$store.dispatch("setExamInfo",{})
        this.getStudentListWithExam()
      }else { // 需要初始化弹出dialog
        this.initData()
      }
    },
    methods:{
      initData(){
        if(this.activeName=='first'){
          this.getExamList()
        }else{
          this.getStudentList()
        }
      },
      onClickReset(){
        this.examFilter.keywords=''
        this.examFilter.date = timeUtil.getCurrWeekDays("/").split("-")
        this.studentFilter.name = ''
        this.studentFilter.sex = ''
        this.studentFilter.phone = ''
      },
      handleSelectionChange(val){
        this.multipleSelection = val
      },
      exportData(){
        if(this.activeName=='first'){ // 按考试查询——导出
          if(this.multipleSelection.length>0){
            this.exportStudentWithExam()
          }else{
            promptUtil.warning(this,'请选择要导出的数据')
          }
        }else{ // 按学生查询——导出
          if(this.multipleSelection.length>0){
            this.exportExamWithStudent()
          }else{
            promptUtil.warning(this,'请选择要导出的数据')
          }
        }
      },
      exportStudentWithExam(){
        const targetParams = []
        const params = {head: [], body: [], name: ''}
        params.head = ['账号', '用户名', '电话', '所属班级', '分数', '通过考试', '考试状态', '交卷时间']
        params.name = storageUtil.readTeacherInfo().school_name + '—学生考试数据'
        this.multipleSelection.map(item=>{
          const tmpArr = []
          let forceLabel = ''
          if(item.force==1){
            forceLabel = '已交卷'
          }else if(item.force==2){
            forceLabel = '考试中'
          }else if(item.force==3){
            forceLabel = '考试未开始'
          }else if(item.force==0){
            forceLabel = '未考试'
          }else if(item.force==-1){
            forceLabel = '漏考'
          }
          tmpArr.push(item.account)
          tmpArr.push(item.name)
          tmpArr.push(item.phone)
          tmpArr.push(item.classroom)
          tmpArr.push((item.score*1).toFixed(1)+"")
          tmpArr.push(item.examResult==1?'是':'否')
          tmpArr.push(forceLabel)
          tmpArr.push(item.stime)
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
      exportExamWithStudent(){
        const targetParams = []
        const params = {head: [], body: [], name: ''}
        params.head = ['考试名', '分数', '通过考试', '考试状态', '考试次数','交卷时间']
        params.name = storageUtil.readTeacherInfo().school_name + '—学生【'+this.targetSelectStudent.name+'】的考试数据'
        this.multipleSelection.map(item=>{
          const tmpArr = []
          let forceLabel = ''
          if(item.status==1){
            forceLabel = '已交卷'
          }else if(item.status==2){
            forceLabel = '考试中'
          }else if(item.status==3){
            forceLabel = '考试未开始'
          }else if(item.status==0){
            forceLabel = '未考试'
          }else if(item.status==-1){
            forceLabel = '缺考'
          }
          tmpArr.push(item.name)
          tmpArr.push((item.score*1).toFixed(1)+"")
          tmpArr.push(item.examResult==1?'是':'否')
          tmpArr.push(forceLabel)
          tmpArr.push(item.times)
          tmpArr.push(item.stime)
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
      dataInquiry(){
        if(this.activeName=='first'){
          if(this.targetSelectExam.id&&this.targetSelectExam.id!=''){
            this.getStudentListWithExam()
          }else{
            promptUtil.warning(this,'请选择考试')
          }
        }else if(this.activeName=='second'){
          if(this.targetSelectStudent.id&&this.targetSelectStudent.id!=''){
            this.getExamListWithStudent()
          }else{
            promptUtil.warning(this,'请选择学生')
          }
        }
      },
      getExamListWithStudent(){
        const loading = promptUtil.loading(this)
        examWithStudentList(qs.stringify({
          school_id:storageUtil.readTeacherInfo().school_id,
          student_id:this.targetSelectStudent.id,
          keyword:this.examStudentFilter.keywords
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.examStudentFilter.keywords=''
            this.stuTableDataFromServer = []
            if(res.data && res.data!='[]'){
              this.stuTableDataFromServer = res.data
            }
          }
          this.currentStuPage = 1
          this.stuTableDataCurrentChange(this.currentStuPage)
          this.dialogSelectStudentVisible = false
          loading.close()
        }).catch(err=>{
          loading.close()
          this.dialogSelectStudentVisible = false
          promptUtil.LOG('examWithStudentList-err',err)
        })
      },
      getStudentListWithExam(){
        const loading = promptUtil.loading(this)
        studentWithExamList(qs.stringify({
          school_id:storageUtil.readTeacherInfo().school_id,
          paper_id:this.targetSelectExam.id,
          keyword:this.examStudentFilter.keywords
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.tableDataFromServer = []
            if(res.data && res.data!='[]'){
              this.tableDataFromServer = res.data
              this.currentPage = 1
            }
            this.tableDataCurrentChange(this.currentPage)
          }
          this.dialogSelectExamVisible = false
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG('studentWithExamList-err',err)
        })
      },
      getStudentList(){
        this.dialogSelectStudentVisible = true
        const loading = promptUtil.loading(this)
        getStudentList(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            teacher_id: storageUtil.readTeacherInfo().id,
            role_id: storageUtil.readTeacherInfo().school_admin,
            stu_name:this.studentFilter.name,
            account:this.studentFilter.account,
            phone:this.studentFilter.phone
          })
        ).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.studentDataFromServer = []
            if(res.data && res.data!='[]'){
              res.data.map(item=>{
                let stuObj = {
                  id:item.id,
                  account:item.account,
                  name:item.name,
                  classroom:item.classes.className,
                  phone:item.phone,
                  sex:item.sex
                }
                this.studentDataFromServer.push(stuObj)
              })
            }
            this.studentFilter.name=''
            this.studentFilter.phone=''
            this.studentFilter.account=''
          }
          this.selectStudentCurrentChange(1)
          this.dialogSelectStudentVisible = true
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG("getStudentList-err",err)
        })
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
          this.currentPage = 1
          this.selectExamCurrentChange(this.currentPage)
          this.dialogSelectExamVisible = true
        }).catch(err=>{
          promptUtil.LOG('queryExamList-err',err)
          loading.close()
        })
      },
      handleClick(){
        this.currentPage = 1
        if(this.activeName=='first'){
          this.tableDataCurrentChange(this.currentPage)
        }else if(this.activeName=='second'){
          this.stuTableDataCurrentChange(this.currentPage)
        }
      },
      onClickStudentRow(row){
        this.targetSelectStudent = {name:row.name,account:row.account,classroom:row.classroom,id:row.id}
        this.getExamListWithStudent()
      },
      onClickExamRow(row){
        this.targetSelectExam = {name:row.name,creator:row.creator,startTime:row.start+'—'+row.end,id:row.id}
        this.getStudentListWithExam()
      },
      selectExamCurrentChange(val){
        this.examCurrentPage = val
        this.examTableData = this.examDataFromServer.slice((this.examCurrentPage - 1) * this.examPageSize,
          this.examPageSize + (this.examCurrentPage - 1) * this.examPageSize)
      },
      selectStudentCurrentChange(val){
        this.studentCurrentPage = val
        this.studentTableData = this.studentDataFromServer.slice((this.studentCurrentPage - 1) * this.studentPageSize,
          this.studentPageSize + (this.studentCurrentPage - 1) * this.studentPageSize)
      },
      tableDataCurrentChange(val){
        this.currentPage = val
        this.tableData = this.tableDataFromServer.slice((this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize)
      },
      stuTableDataCurrentChange(val){
        this.currentStuPage = val
        this.stuTableData = this.stuTableDataFromServer.slice((this.currentStuPage - 1) * this.stuPageSize,
          this.stuPageSize + (this.currentStuPage - 1) * this.stuPageSize)
      },
      examListOpened(){
      },
      onClickSelectExam(){
        this.getExamList()
      },
      onClickSelectStudent(){
        this.getStudentList()
      },
      handleClose(done){
        done();
      },
      onClickDetail(obj){
        let routeUrl = this.$router.resolve({path: ROUTER_EXAM_DETAIL + obj.row.id});
        window.open(routeUrl.href, '_blank');
      },
      onClickDetailExam(obj){
        let routeUrl = this.$router.resolve({path: ROUTER_EXAM_DETAIL + obj.row.id});
        window.open(routeUrl.href, '_blank');
      },
      onClickDelete(obj){
        this.deleteHandle(obj)
      },
      onClickDeleteExam(obj){
        this.deleteHandle(obj)
      },
      deleteHandle(obj){
        this.$confirm('此操作将永久删除考生的考试数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = promptUtil.loading(this)
          let ids = ''
          let studentId = ''
          if(this.activeName=='first'){
            ids = obj.row.id
            studentId = obj.row.student_id
          }else{
            ids = obj.row.id
            studentId = this.targetSelectStudent.id
          }
          delStudentExamData(qs.stringify({
            school_id:storageUtil.readTeacherInfo().school_id,
            ids:ids,
            student_id:studentId
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              if(this.activeName=='first'){
                this.tableDataFromServer.splice(this.tableDataFromServer.findIndex(item=>item.id==obj.row.id)+this.pageSize*(this.currentPage-1),1)
                this.tableDataCurrentChange(this.currentPage)
              }else{
                this.stuTableDataFromServer.splice(this.stuTableDataFromServer.findIndex(item=>item.id==obj.row.id)+this.stuPageSize*(this.currentStuPage-1),1)
                this.stuTableDataCurrentChange(this.currentStuPage)
              }
              promptUtil.success(this, res.msg)
            }else{
              promptUtil.warning(this, res.msg)
            }
            loading.close()
          }).catch(err=>{
            loading.close()
            promptUtil.LOG('delStudentExamData-err',err)
          })
        }).catch(()=>{});
      }
    }
  }
</script>

<style scoped>
  .table_hover:hover {
    cursor: pointer;
  }
</style>
