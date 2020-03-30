<template>
    <div>
      <!-- 面包屑 -->
      <el-row>
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card>
        <el-row>
          <el-col :span="18">
            <el-input
              size="small"
              style="width: 240px"
              placeholder="请输入查询信息"
              v-model="inputQueryInfo"
              clearable
              @keydown.native.enter="queryCustomInfo"
            ></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="queryCustomInfo">搜索</el-button>
          </el-col>
          <el-col :span="6" style="display: flex;justify-content: flex-end">
            <el-button type="primary" @click="addCourseItem" :loading="isAddLoading">添加课时</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- 课程包说明 -->
      <el-card style="margin-top: 20px;">
        <el-row>
          <el-col :span="24" style="font-weight: bold;font-size: 24px;">
            <label>{{packageInfo.course}}</label>
          </el-col>
          <el-col :span="24" style="margin-top: 10px;">
            <label>教学软件 : </label><label>{{packageInfo.software}}</label>
          </el-col>
          <el-col :span="24" style="margin-top: 10px;">
            <label>简要介绍 : </label><label>{{packageInfo.introduce}}</label>
          </el-col>
        </el-row>
      </el-card>
      <!-- 列表 -->
      <el-table
        class="table_hover"
        :data="customTableData"
        style="width: 100%;margin-top: 20px;"
        :header-row-style="{'color':'#409EFF'}"
        @row-click="customItemsList"
      >
        <el-table-column
          props="index"
          type="index"
          align="center"
          :index="indexMethod"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column prop="name" align="center" label="课时名称" @click="customItemsList"></el-table-column>
        <el-table-column prop="desc" align="center" label="简要介绍"></el-table-column>
        <el-table-column align="center" label="操作" width="460">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain icon="el-icon-view" @click="seeCourse({index: scope.$index, row:scope.row})">查看课时</el-button>
            <el-button size="small" type="primary" plain icon="el-icon-edit" @click="editCourse({index: scope.$index, row:scope.row})">编辑课时</el-button>
            <el-button size="small" type="danger" plain icon="el-icon-delete" @click="delCourse({index: scope.$index, row:scope.row})">删除课时</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="center" class="mt" style="margin-top: 20px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="customItemsInfoList"
        ></el-pagination>
      </el-row>
      <el-dialog title="提示" :visible.sync="isDelCustomItem" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-question"></i>
          </el-col>
          <el-col :span="20">
            <span>确定要删除改课时吗?</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelCustomItem = false">取 消</el-button>
          <el-button type="primary" @click="delCustomItem" :loading="isDelCustomLoading">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>
<script>
  import {
    qs,
    checkFreeFlow,
    intoCourseBaseInfo,
    delCourseItemById,
    handleCustomItemSelf
  } from '../../../api/api'
  import '../../../api/restfulapi'
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        freeFlowStatus: false, // true 有流量  false 无流量
        freeFlowMsg: '本月流量不足',
        routerConfig: [{name:'自定义课程',to:'/custom'},{name:'自定义课程课时',to:''}],
        customId: 0, // 自定义课程id
        targetObj: "", // 当前选中的item
        isDelCustomItem:false,
        isDelCustomLoading: false,
        inputQueryInfo: '', // 查询时关键字
        packageInfo: {course: '',software:'',introduce:''},
        pageSize: 10, // 分页页码大小
        currentPage: 1, // 分页当前页码
        customTableData: [], //当前页面
        customList: [], // 课时列表
        isAddLoading:false,
      }
    },
    mounted() {

      if(this.$route.params.id&&this.$route.params.id!=0){
        promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
        checkFreeFlow(qs.stringify({school_id:storageUtil.readTeacherInfo().school_id})).then(res=>{
            if(res.code==SUCCESS_CODE){
                this.freeFlowStatus = true
            }else{
                this.freeFlowStatus = false
            }
            this.freeFlowMsg = res.msg
        }).catch(err=>{
            promptUtil.LOG('checkFreeFlow-err',err)
        })
        this.initData()
      }else{
        this.$router.push({path: ROUTER_CUSTOM})
      }
    },
    methods: {
      initData(){
        this.customId = this.$route.params.id
        this.getCourseList(promptUtil.loading(this))
      },
      delCustomItem(){
        const loading = promptUtil.loading(this)
        this.isDelCustomLoading = true
        delCourseItemById(qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          id: this.targetObj.row.id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.customList.splice( this.customList.findIndex(item=> item.id==this.targetObj.row.id),1)
            if(this.customList.length%this.pageSize==0 && this.customList.length/this.pageSize<this.currentPage){
              this.currentPage = this.currentPage - 1
            }
            this.handleCurrentChange(this.currentPage)
            promptUtil.success(this,'删除成功')
          }
          loading.close()
          this.isDelCustomItem = false
          this.isDelCustomLoading = false
        }).catch(err=>{
          promptUtil.LOG('delCourseItemById-err',err)
          loading.close()
          this.isDelCustomLoading = false
        })
      },
      analysisData(data){
        const arr = []
        if(data){
          data.map(item=>{
            const obj = {
              desc: item.desc,
              name: item.name,
              id: item.id
            }
            arr.push(obj)
          })
        }
        return arr
      },
      getCourseList(loading,keys){
        intoCourseBaseInfo(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          class_id: this.customId,
          str: keys ? keys : ""
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.customList = []
            if(res.data){
              if(res.data.item!='[]'){
                this.customList = this.analysisData(res.data.item)
              }
              this.packageInfo = {
                course: res.data.course_name,
                software: res.data.software ? res.data.software : "--",
                introduce: res.data.desc ? res.data.desc : "--"
              }
            }
            this.handleCurrentChange(1)
          }else{
            promptUtil.warning(this, res.msg)
          }
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("intoCourseBaseInfo-err",err)
          loading.close()
        })
      },
      // 点击添加课时按钮时触发
      addCourseItem(){
        const loading = promptUtil.loading(this)
        this.isAddLoading = true
        const videoObj = {url: "", name: ""}
        const videoArr = []
        videoArr.push(videoObj)
        handleCustomItemSelf(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id, course_id: this.customId, name: '请修改自定义课时名称',
          planName: "", plan: "", courseware: "", coursewareName: "", desc: "", tool: "", videoImg: "",
          sort: 500, examine: -1, video: JSON.stringify(videoArr), id:0 // add->0 edit->id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.$store.dispatch("customCourseInfo",{type:'edit', course: this.customId, item: res.data})
            this.$router.push({path: ROUTER_CUSTOM_ITEM + "/" + this.customId})
          } else {
            promptUtil.warning(this, res.msg)
          }
          this.isAddLoading = false
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("handleCustomItemSelf-err",err)
          this.isAddLoading = false
          loading.close()
        })
      },
      // 根据关键字查询课时
      queryCustomInfo(){
        this.getCourseList(promptUtil.loading(this),this.inputQueryInfo)
      },
      // 设置当前table索引
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * this.pageSize;
      },
      // 进入查看课时页面
      customItemsList(event) {
        this.$router.push({path: ROUTER_CUSTOM_SEE + "/" + event.id});
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        //当前页面需要显示得条数=所有条数
        this.customTableData = this.customList.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        )
      },
      // seeCourseById(id){
      //     console.log("id",id)
      //   this.$store.dispatch("customCourseDetail", {id: this.customId, name: this.packageInfo.course})
      //   this.$router.push({path: ROUTER_CUSTOM_ITEM_SEE + "/" + id})
      // },
      seeCourse(obj){
          if(!this.freeFlowStatus){
              this.$notify({
                  title: this.$t(`message.system_info`),
                  message: this.freeFlowMsg,
                  type: 'warning'
              });
              return
          }
          this.$store.dispatch("customCourseDetail", {id: this.customId, name: this.packageInfo.course})
          this.$router.push({path: ROUTER_CUSTOM_ITEM_SEE + "/" + obj.row.id})
      },
      editCourse(obj){
        this.$store.dispatch("customCourseInfo",{type:'edit', course: this.customId, item: obj.row.id})
        this.$router.push({path: ROUTER_CUSTOM_ITEM + "/" + this.customId})
      },
      delCourse(obj){
        this.targetObj = obj
        this.isDelCustomItem = true
      },
    },
    computed: {
      customItemsInfoList:{
        get() {
          return this.customList ? this.customList.length : 0;
        }
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #eee;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .table_hover:hover {
    cursor: pointer;
  }
  .el-table_2_column_6 {
    cursor: pointer;
  }
  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }
</style>
