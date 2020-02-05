<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="20">
        <el-select v-model="currentSelectCategory" clearable placeholder="请选择问题类型" @change="selectValueChange">
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入关键字"
          v-model="inputKeyWords"
          clearable
          style="width: 200px;"
          @keydown.native.enter="queryFeedbackInfo"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="queryFeedbackInfo">搜索</el-button>
      </el-col>
      <el-col :span="4" style="display:flex;justify-content:flex-end">
        <el-button type="primary" icon="el-icon-plus" @click="addFeedback">添加反馈</el-button>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <!-- 列表 -->
      <el-table
        border
        class="table_hover"
        :data="tableData"
        style="width: 100%;margin-top: 20px;"
        :header-row-style="{'color':'#409EFF'}"
      >
        <el-table-column prop="title" align="center" label="反馈标题" width="380"></el-table-column>
        <el-table-column prop="type" align="center" label="类型" width="200"></el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="scope">
            <div v-html='scope.row.desc'></div>
          </template>
        </el-table-column>
        <el-table-column prop="time" align="center" label="发布时间" width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain icon="el-icon-view" @click="seeFeedback({index: scope.$index, row:scope.row})">查看</el-button>
            <el-button size="small" type="danger" plain icon="el-icon-delete" @click="delFeedback({index: scope.$index, row:scope.row})" :disabled="scope.row.del_type==0" :loading="isDelLoading">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-row type="flex" justify="center" class="mt" style="margin-top: 20px;" v-show="dataFromServer.length>0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="feedbackList"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {
    qs,
    getCategory,
    delFeedbackItem,
    getFeedbackList
  } from '../../../api/api'
  import '../../../api/restfulapi'
  import promptUtil from "../../../utils/promptUtil"
  import storageUtil from "../../../utils/storageUtil"
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data(){
      return{
        routerConfig: [{name:'问题反馈',to:''}],
        pageSize: 10, // 分页页码大小
        currentPage: 1, // 分页当前页码
        inputKeyWords: '', // 查询关键字
        categoryList: [], // 类别{value,label}
        currentSelectCategory: "",
        tableData:[],
        dataFromServer:[],
        isDelLoading: false,
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_FEEDBACK);
      this.initData()
    },
    methods:{
      initData(){
        const loading = promptUtil.loading(this)
        getCategory().then(res=>{
          if(res.code==SUCCESS_CODE){
            this.categoryList = res.data
          }
          this.getFilterList(loading)
        }).catch(err=>{
          promptUtil.LOG('getCategory-err',err)
          loading.close()
        })
      },
      selectValueChange(val){
        const keywords = this.inputKeyWords ? this.inputKeyWords.trim() : ''
        this.getFilterList(promptUtil.loading(this), keywords, val)
      },
      getFilterList(loading, str="", cateId=0){
        getFeedbackList(qs.stringify({
          user_id:storageUtil.readTeacherInfo().id,
          school_id:storageUtil.readTeacherInfo().school_id,
          str:str,
          category_id: cateId
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.dataFromServer = []
            if(res.data && res.data!='[]'){
              res.data.map(item=>{
                let categoryLabel = '其他问题'
                const category = this.categoryList.find(cate=>cate.value==item.category_id)
                if(category){
                  categoryLabel = category.label
                }
                const obj = {
                  id: item.id,
                  title: item.title,
                  type: categoryLabel,
                  desc: item.con,
                  time: item.time_str,
                  create_id:item.create_id,
                  del_type: item.del_type,
                }
                this.dataFromServer.push(obj)
              })
            }
            if(this.dataFromServer.length%this.pageSize==0 && this.dataFromServer.length/this.pageSize<this.currentPage){
              this.currentPage = this.currentPage - 1
            }
            this.handleCurrentChange(1)
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG("getFeedbackList-err", err)
        })
      },
      // 通过关键字查询反馈
      queryFeedbackInfo(){
        const keywords = this.inputKeyWords ? this.inputKeyWords.trim() : ''
        this.getFilterList(promptUtil.loading(this),keywords)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        //当前页面需要显示得条数=所有条数
        this.tableData = this.dataFromServer.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        )
      },
      // 添加反馈
      addFeedback(){
        this.$router.push({path: ROUTER_FEEDBACK_ADD})
      },
      seeFeedback(obj){
        this.$router.push({path: ROUTER_FEEDBACK_SEE + "/" + obj.row.id})
      },
      delFeedback(obj){
        this.isDelLoading = true
        delFeedbackItem(qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          id: obj.row.id,
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.dataFromServer.splice(this.dataFromServer.findIndex(item=>item.id==obj.row.id),1)
            if(this.dataFromServer.length%this.pageSize==0 && this.dataFromServer.length/this.pageSize<this.currentPage){
              this.currentPage = this.currentPage - 1
            }
            this.handleCurrentChange(this.currentPage)
            promptUtil.success(this, '删除成功')
          }else{
            promptUtil.error(this,res.msg)
          }
          this.isDelLoading = false
        }).catch(err=>{
          this.isDelLoading = false
          promptUtil.LOG("delFeedbackItem-err",err)
        })
      },
    },
    computed: {
      feedbackList:{
        get() {
          return this.dataFromServer ? this.dataFromServer.length : 0;
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
</style>
