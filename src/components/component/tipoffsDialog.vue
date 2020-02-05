<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="500px"
      center>
      <div slot="title" style="color: #333333;font-size: 20px;line-height: 26px;text-align:left;font-weight:bold">举报留言</div>
      <div>
        <el-radio-group v-model="radioLabel" size="medium" style="display:flex;flex-direction:column;" @change="onChangeRadio">
          <el-radio label="1" border style="flex:1;width:415px;margin-left:17px;margin-bottom:5px">{{radioContent[0]}}</el-radio>
          <el-radio label="2" border style="flex:1;width:415px;margin-left:17px;margin-bottom:5px">{{radioContent[1]}}</el-radio>
          <el-radio label="3" border style="flex:1;width:415px;margin-left:17px;margin-bottom:5px">{{radioContent[2]}}</el-radio>
          <el-radio label="4" border style="flex:1;width:415px;margin-left:17px;margin-bottom:5px">{{radioContent[3]}}</el-radio>
          <el-radio label="5" border style="flex:1;width:415px;margin-left:17px;margin-bottom:5px">其他</el-radio>
        </el-radio-group>
        <el-input v-show="radioLabel==5" type="textarea" :rows="4" placeholder="请描述你认为不当的内容" v-model="textarea"
                  maxlength="200" show-word-limit style="width:415px;margin-left:17px;"></el-input>
      </div>
      <div slot="footer" style="flex:1;display:flex;justify-content:flex-end;margin-right:22px;margin-top:-20px">
        <el-button type="primary" @click="onClickTipOffs" :loading="isLoading">举 报</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import promptUtil from '../../utils/promptUtil'
  import '../../api/restfulapi'
  import {
    qs,
    worksTipoffs
  } from '../../api/api'
  export default {
    name: "tipoffsDialog",
    data(){
      return{
        isLoading:false,
        radioLabel:'1',
        textarea:'',
        radioContent:["广告或垃圾信息","含有暴力、色情和低俗内容","散布违法、违禁内容","恶意人身攻击"],
        centerDialogVisible:false,
        info:{},
      }
    },
    methods:{
      onChangeRadio(val){
        if(val==5){
          this.textarea = ""
        }
      },
      show(data){
        this.info = data
        this.isLoading = false
        this.radioLabel = "1"
        this.textarea = ""
        this.centerDialogVisible = true
      },
      onClickTipOffs(){
        this.isLoading = true
        let content = ''
        if(this.radioLabel==5){
          content = this.textarea.trim()
        }else{
          content = this.radioContent[this.radioLabel*1-1]
        }
        if(content && content.trim() && content.trim()!=''){
          worksTipoffs(qs.stringify({
            scratch_id: this.info.scratch_id,
            pid: this.info.pid,
            user_id: this.info.user_id,
            text:content
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              promptUtil.success(this, res.msg)
            }
            this.isLoading = false
            this.centerDialogVisible = false
          }).catch(err=>{
            console.log("err",err)
            this.isLoading = false
            this.centerDialogVisible = false
          })
        }else{
          promptUtil.warning(this,'请描述你认为不当的内容')
          this.isLoading = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
