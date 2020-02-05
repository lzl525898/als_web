<template>
    <div>
      <el-row>
        <el-col :span="24" style="margin-bottom: 20px;">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <div style="font-size: 24px;font-weight: bold;margin-bottom: 10px;">{{feedInfo.title}}</div>
        <el-divider></el-divider>
        <div v-html="feedInfo.desc"></div>
        <el-divider></el-divider>
        <div style="display: flex;align-items: center;"><span style="font-size: 24px;font-weight: bold;color:#409EFF;">{{replyList.length}}</span>&nbsp;个回答</div>
        <el-row style="margin-top: 10px;">
          <el-col v-if="replyList.length>0" v-for="item in replyList" :key="item.id">
            <div v-html="item.con"></div>
          </el-col>
          <el-col v-else>
            <div style="font-size: 32px;font-weight: bold;margin:auto;text-align: center;color:#888">暂无反馈</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>
<script>
  import {
    qs,
    getFeedbackById
  } from '../../../api/api'
  import '../../../api/restfulapi'
  import promptUtil from "../../../utils/promptUtil"
  import storageUtil from "../../../utils/storageUtil"
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data(){
      return{
        routerConfig: [{name:'问题反馈',to:'/feedback'},{name:'问题详情',to:''}],
        targetId: 0,
        feedInfo: {title:'',desc:'',time:''},
        serverMsg: '',
        replyList: []
      }
    },
    mounted(){
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      this.initData()
    },
    methods:{
      initData(){
        this.targetId = this.$route.params.id
        const loading = promptUtil.loading(this)
        getFeedbackById(qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          school_id: storageUtil.readTeacherInfo().school_id,
          id: this.targetId
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.feedInfo.title = res.data.question.title
            this.feedInfo.desc = res.data.question.con
            this.feedInfo.time = res.data.question.time_str
            this.replyList = res.data.feedback
          }else{
            promptUtil.warning(this,'暂无数据')
          }
          loading.close()
        }).catch(err=>{
          promptUtil.LOG('getFeedbackById-err',err)
          loading.close()
        })
      },
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
