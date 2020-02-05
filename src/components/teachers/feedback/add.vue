<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-bottom: 20px;">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="问题标题" prop="title">
          <el-input v-model="ruleForm.title" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="type">
          <el-radio-group v-model="ruleForm.type" v-for="item in typeList" :key="item.value">
            <el-radio :label="item.value" :key="item.value" style="margin-right:10px">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="问题描述" prop="desc">
          <div style="width: 100%;">
            <vue-ueditor-wrap v-model="ruleForm.desc" :config="editConfig" :destroy="true"></vue-ueditor-wrap>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreateSubmit">立即创建</el-button>
          <el-button @click="returnFeedback">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import {
    qs,
    getCategory,
    addFeedbackItem,
  } from '../../../api/api'
  import '../../../api/restfulapi'
  import promptUtil from "../../../utils/promptUtil"
  import storageUtil from "../../../utils/storageUtil"
  import childHeader from '../../component/childHeader'
  export default {
    components: {"VueUeditorWrap":VueUeditorWrap,"als-child-header": childHeader},
    data(){
      return{
        routerConfig: [{name:'问题反馈',to:'/feedback'},{name:'添加反馈',to:''}],
        typeList:[],
        ruleForm:{
          type:'',
          title:'',
          desc:'<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>您的反馈，是我们前进的方向</h2>',
        },
        editConfig:{
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          serverUrl: 'http://www.alsrobot.vip',
          // 初始容器宽度
          initialFrameWidth: '100%',
          UEDITOR_HOME_URL: '/static/ALSEditor/'
        },
        rules:{
          title: [
            { required: true, message: '请输入问题标题', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      this.initData()
    },
    methods: {
      initData(){
        const loading = promptUtil.loading(this)
        getCategory().then(res=>{
            if(res.code==SUCCESS_CODE){
            this.typeList = res.data
            this.ruleForm.type = this.typeList[0].value
          }
          loading.close()
        }).catch(err=>{
          promptUtil.LOG('getCategory-err',err)
          loading.close()
        })
      },
      onCreateSubmit(){
          this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const loading = promptUtil.loading(this)
            addFeedbackItem(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              user_id: storageUtil.readTeacherInfo().id,
              title: this.ruleForm.title,
              con: this.ruleForm.desc,
              category_id: this.ruleForm.type
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this,'添加成功')
                this.returnFeedback()
              }else{
                promptUtil.error(this,res.msg)
              }
              loading.close()
            }).catch(err=>{
              loading.close()
              promptUtil.LOG("addFeedbackItem-err",err)
            })
          }else{
            promptUtil.warning(this,"请填写必要信息")
            return false;
          }
        })
      },
      returnFeedback(){
        this.$router.replace({path: ROUTER_FEEDBACK})
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
