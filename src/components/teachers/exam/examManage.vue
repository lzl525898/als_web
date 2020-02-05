<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card shadow="always" style="margin-top:20px">
      <el-row>
        <el-col :span="10">
          <el-date-picker
            value-format="yyyy/MM/dd"
            style="margin-right:10px;width:250px"
            size="small"
            :clearable="false"
            v-model="examFilter.date"
            type="daterange"
            @change="onChangeDatePicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-input placeholder="请输入考试名称" prefix-icon="el-icon-search" v-model="examFilter.keys" size="small" style="width:250px" @keyup.enter.native="queryExam"></el-input>
        </el-col>
        <el-col :span="14">
          <div style="display:flex;justify-content:flex-end;align-items:center">
            <el-button type="danger" icon="el-icon-delete" size="small" :disabled="multipleSelection.length==0" @click="onClickDeleteExam" :loading="isDelExamLoading">删除</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="dialogCreateExamVisible=true">创建考试</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="always" style="margin-top:20px;">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="name" label="考试名称"></el-table-column>
        <el-table-column label="总分" width="100">
          <template slot-scope="scope">{{ (scope.row.score*1).toFixed(1) }}</template>
        </el-table-column>
        <el-table-column prop="start" label="开始时间" width="170"></el-table-column>
        <el-table-column prop="end" label="结束时间" width="170"></el-table-column>
        <el-table-column prop="creator" label="创建人" width="150"></el-table-column>
        <el-table-column prop="ctime" label="创建时间" width="170"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-link :underline="false" @click="onClickEdit({index: scope.$index, row:scope.row})"><i class="el-icon-edit" style="color:#409EFF;"></i></el-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="成绩查询" placement="top">
              <el-link :underline="false" @click="onClickQuery({index: scope.$index, row:scope.row})"><i class="el-icon-document-checked" style="color:#409EFF;margin-left:5px;"></i></el-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="统计分析" placement="top">
              <el-link :underline="false" @click="onClickAnalysis({index: scope.$index, row:scope.row})"><i class="el-icon-data-line" style="color:#409EFF;margin-left:5px;"></i></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center;margin-top:20px;" v-show="examDataFromServer.length>0">
        <el-pagination
          background
          @current-change="examCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="examDataList"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog title="创建考试" :visible.sync="dialogCreateExamVisible" width="30%" @open="openDialogCallBack" @close="closeCallBack">
      <el-card style="padding-right:20px;">
        <el-form :model="dialogRuleForm" :rules="dialogRules" ref="dialogRules" label-width="100px">
          <el-form-item label="考试名称" prop="name" required>
            <el-input v-model="dialogRuleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="考试时间" required prop="date">
            <el-date-picker v-model="dialogRuleForm.date" type="datetimerange" align="right" unlink-panels
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="参与学生" prop="students" required>
            <el-cascader v-model="dialogRuleForm.students" :options="classesInfo" :props="props" collapse-tags clearable style="width:100%;"></el-cascader>
          </el-form-item>
<!--          <el-form-item label="发布考试" prop="publish" >-->
<!--            <el-switch style="margin-top:-3px" v-model="dialogRuleForm.publish" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>-->
<!--          </el-form-item>-->
          <el-form-item>
            <div style="display:flex;justify-content:flex-end;align-items:center">
              <el-button @click="onResetForm('dialogRules')">取消</el-button>
              <el-button type="primary" @click="onClickCreateExam('dialogRules')">立即创建</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
    <el-dialog title="编辑考试" :visible.sync="dialogEditExamVisible" width="30%" @close="closeEditCallBack" @open="openEditCallBack">
      <el-card style="padding-right:20px;">
        <el-form :model="dialogRuleForm" :rules="dialogRules" ref="dialogEditRules" label-width="100px">
          <el-form-item label="考试名称" prop="name" required>
            <el-input v-model="dialogRuleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="考试时间" required  prop="date">
            <el-date-picker v-model="dialogRuleForm.date" type="datetimerange" align="right" unlink-panels
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="参与学生" prop="students" required>
            <el-cascader v-model="dialogRuleForm.students" :options="classesInfo" :props="props" collapse-tags clearable style="width:100%;"></el-cascader>
          </el-form-item>
<!--          <el-form-item label="发布考试" prop="publish" >-->
<!--            <el-switch style="margin-top:-3px" v-model="dialogRuleForm.publish" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>-->
<!--          </el-form-item>-->
          <el-form-item>
            <div style="display:flex;justify-content:flex-end;align-items:center">
              <el-button @click="onResetForm('dialogEditRules')">取消</el-button>
              <el-button type="primary" @click="onClickEditExam('dialogEditRules')" :loading="isExamEditLoading">保存修改</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  import PubSub from "pubsub-js"
  import vuexUtil from '../../../utils/vuexUtils'
  import timeUtil from '../../../utils/timeUtil'
  import stringUtil from '../../../utils/stringUtil'
  import promptUtil from "../../../utils/promptUtil"
  import storageUtil from "../../../utils/storageUtil"
  import childHeader from '../../component/childHeader'
  import '../../../router/router'
  import '../../../api/restfulapi'
  import {
    qs,
    updateExam, // 修改考试
    createExam, // 添加考试
    getExamById, // 通过id查询考试
    delExamByIds, // 删除考试
    queryExamList, // 获取考试列表
    getClassAndStudentByTeacher, // 获取老师名下所有学生
  } from '../../../api/api'
  export default {
    name: "examManage",
    components:{"als-child-header": childHeader},
    data(){
      return{
        routerConfig: [{name:vuexUtil.checkMenuExist(this,'examManage').target.name,to:''}],
        examFilter:{keys:'',date:timeUtil.getCurrWeekDays("/").split("-")},
        currentPage:1,
        pageSize:20,
        dialogCreateExamVisible:false,
        dialogEditExamVisible:false,
        examDataFromServer:[],
        tableData: [],
        isDelExamLoading:false,
        multipleSelection: [],
        props: { multiple: true },
        classesInfo:[], // 学校的学生
        dialogRuleForm:{name:'',date:'',students:[],publish:true},
        dialogRules:{
          name:[
            { required: true, message: '请输入考试名称'},
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请选择日期范围', trigger: 'change' }
          ],
          students: [
            { required: true, message: '请选择学生', trigger: 'change' }
          ],
        },
        targetExamId:0,
        isExamEditLoading:false,
      }
    },
    computed: {
      examDataList: {
        get() {
          return this.examDataFromServer.length
        }
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_EXAM_MANAGE);
      this.initData()
    },
    methods:{
      initData(){
        this.getExamList()
      },
      getExamList(){
        const loading = promptUtil.loading(this)
        queryExamList(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          start_date: this.examFilter.date[0],
          end_date: this.examFilter.date[1],
          keywords: this.examFilter.keys
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
          this.examCurrentChange(this.currentPage)
        }).catch(err=>{
          promptUtil.LOG('queryExamList-err',err)
          loading.close()
        })
      },
      onClickCreateExam(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let studentsArr = []
            if(this.dialogRuleForm.students&&this.dialogRuleForm.students.length>0){
              this.dialogRuleForm.students.map(item=>{
                studentsArr.push(item[1])
              })
            }
            const loading = promptUtil.loading(this)
            createExam(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              student_ids: stringUtil.array2String(studentsArr,","),
              title: this.dialogRuleForm.name,
              user_id: storageUtil.readTeacherInfo().id,
              start_time: this.dialogRuleForm.date[0].getTime()/1000,
              end_time: this.dialogRuleForm.date[1].getTime()/1000,
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this, res.msg)
                this.getExamList()
              }else{
                promptUtil.warning(this, res.msg)
              }
              this.dialogCreateExamVisible = false
              loading.close()
            }).catch(err=>{
              promptUtil.LOG('createExam-err',err)
              loading.close()
            })
          } else {
            return false;
          }
        });
      },
      onClickEditExam(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let studentsArr = []
            if(this.dialogRuleForm.students&&this.dialogRuleForm.students.length>0){
              this.dialogRuleForm.students.map(item=>{
                studentsArr.push(item[1])
              })
            }
            this.isExamEditLoading = true
            let startTime = ''
            let endTime = ''
            try{
              startTime = this.dialogRuleForm.date[0].getTime()/1000
              endTime = this.dialogRuleForm.date[1].getTime()/1000
            }catch (e) {
              startTime = this.dialogRuleForm.date[0]/1000
              endTime = this.dialogRuleForm.date[1]/1000
            }
            updateExam(qs.stringify({
              paper_id:this.targetExamId,
              school_id: storageUtil.readTeacherInfo().school_id,
              student_ids: stringUtil.array2String(studentsArr,","),
              title: this.dialogRuleForm.name,
              user_id: storageUtil.readTeacherInfo().id,
              start_time: startTime,
              end_time: endTime,
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                this.onResetForm(formName)
                promptUtil.success(this, res.msg)
                this.getExamList()
              }else{
                promptUtil.warning(this, res.msg)
              }
              this.isExamEditLoading = false
              this.dialogEditExamVisible = false
            }).catch(err=>{
              this.isExamEditLoading = false
              promptUtil.LOG('createExam-err',err)
            })
          } else {
            return false;
          }
        });
      },
      closeCallBack(){
        this.onResetForm('dialogRules')
      },
      closeEditCallBack(){
        this.onResetForm('dialogEditRules')
      },
      openEditCallBack(){
        getClassAndStudentByTeacher(qs.stringify({
          teacher_id:storageUtil.readTeacherInfo().id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.classesInfo = res.data
          }else{
            this.dialogEditExamVisible = false
          }
        }).catch(err=>{
          promptUtil.LOG('getClassAndStudentByTeacher-err',err)
          this.dialogEditExamVisible = false
        })
      },
      openDialogCallBack(){
        getClassAndStudentByTeacher(qs.stringify({
          teacher_id:storageUtil.readTeacherInfo().id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.classesInfo = res.data
          }
        }).catch(err=>{
          promptUtil.LOG('getClassAndStudentByTeacher-err',err)
          this.dialogCreateExamVisible = false
        })
      },
      onResetForm(formName){
        try{
          this.$refs[formName].resetFields()
        }catch (e) {}
        this.dialogCreateExamVisible = false
        this.dialogEditExamVisible = false
        this.dialogRuleForm = {name:'',date:'',students:[],publish: true}
      },
      onChangeDatePicker(){
        this.getExamList()
      },
      queryExam(){
        if(this.examFilter.keys && this.examFilter.keys!=''){
          this.getExamList()
        }
      },
      onClickDeleteExam(){
        this.$confirm('此操作将永久删除考试数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isDelExamLoading = true
          const ids = []
          this.multipleSelection.map(item=>ids.push(item.id))
          delExamByIds(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            paper_ids: stringUtil.array2String(ids,",")
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              this.multipleSelection = []
              this.$refs.multipleTable.clearSelection()
              promptUtil.success(this,res.msg)
              this.getExamList()
            }else{
              promptUtil.warning(this,res.msg)
            }
            this.isDelExamLoading = false
          }).catch(err=>{
            promptUtil.LOG('delExamByIds-err',err)
            this.isDelExamLoading = false
          })
        }).catch(()=>{});
      },
      examCurrentChange(val){
        this.currentPage = val
        this.tableData = this.examDataFromServer.slice((this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize)
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      onClickEdit(obj){
        const loading = promptUtil.loading(this)
        getExamById(qs.stringify({paper_id: obj.row.id})).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.dialogRuleForm.name = res.data.title
            this.dialogRuleForm.date = [res.data.start_time*1000,res.data.end_time*1000]
            this.dialogRuleForm.students = res.data.students
            this.dialogEditExamVisible = true
            this.targetExamId = obj.row.id
          }else{
            promptUtil.warning(this, res.msg)
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG('getExamById-err',err)
        })
      },
      onClickQuery(obj){
        const examObj = {
          id:obj.row.id,
          name:obj.row.name,
          time:obj.row.start+'—'+obj.row.end,// 考试时间段
          creator:obj.row.creator//考试创建者
        }
        this.$store.dispatch("setExamInfo",examObj)
        this.$router.push({path:ROUTER_EXAM_RESULT})
      },
      onClickAnalysis(obj){
        this.$store.dispatch("setExamId", obj.row.id)
        this.$router.push({path:ROUTER_EXAM_ANALYSIS})
      },
    }
  }
</script>

<style scoped>

</style>
