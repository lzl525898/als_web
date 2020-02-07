<template>
  <div class="remind">
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card shadow="always" style="margin-top: 20px;min-height: 600px" body-style="padding:0">
      <div v-show="!already"></div>
      <div v-show="already">
        <div v-show="remind.length == 0" class="noData">暂无数据</div>
        <div style="margin:20px;">
          <div style="display:flex;">
            <div>
              <el-input v-model="keywords" placeholder="请输入" size="small" style="width:220px" suffix-icon="el-icon-search" @keydown.native.enter="handleClickSearch"></el-input>
              <el-button type="primary" size="small" @click="handleClickSearch" :loading="searchLoading">搜索</el-button>
            </div>
            <!--          <div style="flex:1;display:flex;justify-content:flex-end">-->
            <!--            <el-link :underline="false">全部已读</el-link>-->
            <!--          </div>-->
          </div>
        </div>
        <div style="border:none;height:1px;background-color:#ebeef5"></div>
        <div v-show="remind.length != 0" style="padding-left:20px;padding-right:20px">
          <als-mail-wrap v-for="(item,index) in remind"
                         :key="index"
                         :id="item.id*1"
                         :title="item.title"
                         :content="item.content"
                         :status="item.status*1"
                         :time="item.time"
                         @detail="setMailDetailInfo($event)"
                         @read="changeReadStatus($event)"
          />
        </div>
        <als-pageination  :size="10" @tableData="changeRemindData($event)" ref="alsPageinationMails" style="margin-top:20px;margin-bottom:20px"></als-pageination>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="descDialogVisible"
      custom-class="mail-desc-dialog"
      width="800px"
      destroy-on-close
      center>
      <div>
        <div class="desc-dialog-title">{{dialogContent.title}}</div>
        <div class="desc-dialog-content" v-html="dialogContent.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    const moment = require("moment")
    import storageUtil from "../../utils/storageUtil"
    import promptUtil from '../../utils/promptUtil'
    import childHeader from '../component/childHeader'
    import mailWrap from "../component/mailWrap"
    import pageination from '../commons/pagination/pagination'
    import {
        qs,
        remindList
    }from "@/api/api.js";
    export default {
        name: "remind",
        components:{"als-child-header": childHeader, "als-mail-wrap":mailWrap,"als-pageination":pageination},
        data(){
            return{
                routerConfig: [{name:'站内通知',to:''}],
                already:false,
                keywords: '',
                descDialogVisible: false,
                dialogContent: {
                    title: '',
                    content: ''
                },
                remindServer: [],
                remind:[],
                currentPage: 1,
                searchLoading: false
            }
        },
        mounted(){
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
             this.initRemind();
        },
        methods:{
            handleClickSearch(){
                if(this.keywords && this.keywords!=''){
                    this.searchLoading = true
                    this.initRemind(this.keywords)
                }
            },
            changeRemindData(data){
                this.remind = data
            },
            changeReadStatus(data){
                try{
                    const index = this.remindServer.findIndex(item=>item.id==data.id)
                    this.remindServer[index].status = data.status
                    this.currentPage = this.$refs.alsPageinationMails.getCurrentPage()
                    this.$refs.alsPageinationMails.setCurrentPage(this.currentPage)
                    this.$refs.alsPageinationMails.setServerData(this.remindServer)
                }catch (e) {promptUtil.LOG('changeReadStatus-err',e)}
            },
            setMailDetailInfo(data){
                const {title, content} = data
                this.dialogContent.title = title
                this.dialogContent.content = content
                this.descDialogVisible = true
            },
            initRemind(text=''){
                const data = {
                    user_id: storageUtil.readTeacherInfo().id,
                    status: 2
                }
                if(text && text!=''){
                    data.text = text
                }
                remindList(qs.stringify(data)).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.searchLoading = false
                        this.keywords = ''
                        if(res.data && res.data!='[]'){
                            this.remindServer = res.data
                            if(text&&text!=''){
                                this.currentPage = 1
                            }
                        }else{
                            this.currentPage = 1
                            this.remindServer = []
                        }
                        this.$refs.alsPageinationMails.setCurrentPage(this.currentPage)
                        this.$refs.alsPageinationMails.setServerData(this.remindServer)
                    }
                    this.already =true
                }).catch(err => {
                    this.already =true
                    promptUtil.LOG('remindList-err',err);
                })
            }
        }
    }
</script>
<style>
  .mail-desc-dialog{
    border-radius: 10px;
  }
</style>
<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 5px 12px 0 #00a2ff30;
  }
  .remind{
    position: relative;
  }
  .noData{
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    font-size: 30px;
    color: #e6e6e6;
    margin-top: 300px;
  }
  .list{
    font-size: 14px;
    color: #606266;
    padding: 15px;
    display: flex;
    padding-right:0 ;
    border-bottom: 1px solid #EBEEF5;
    line-height: 25px;
    cursor: pointer;
  }
  .desc-dialog-title{
    height: 25px;
    line-height: 25px;
    color:#333;
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .desc-dialog-content{
    min-height: 100px;
    max-height: 440px;
    overflow-y:auto;
  }
</style>
