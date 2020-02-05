<template>
    <div class="notice">
      <el-row>
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <div v-if="notices.length == 0" class="noData">暂无数据</div>
      <div v-else-if="notices.length > 0" style="margin-top: 20px;margin-left: 10%;margin-right: 10%;">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item class="notice" v-for="(item,index) in notices" :key="index" :name="index">
            <template slot="title">
              <div style="font-weight:bold">{{item.title}}</div>
            </template>
            <div v-html="item.con">{{item.con}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="pageShow">
        <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                       layout="total, prev, pager, next, jumper" :total="permitList"
        ></el-pagination>
      </el-row>
    </div>
</template>

<script>
    const moment = require("moment")
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../component/childHeader'
    import {
      qs,
      noticeList
    }from "@/api/api.js";
    export default {
      components:{"als-child-header": childHeader},
      name: "notice",
      data(){
        return{
          routerConfig: [{name:'公告',to:''}],
          notices:[],
          pageShow:false,
          permitList:0,//分页总数
          currentPage:1,//分页当前页
          pageSize:10,
          activeNames:-1,//默认展开的条目
          moment:moment
        }
      },
      mounted(){
        promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
        this.initNotice();
      },
      methods:{
        // 列表分页函数
        handleCurrentChange(val) {
          this.currentPage = val;
          this.initNotice();
        },
        handleChange(val) {
          //console.log(val);
        },
        initNotice(){
          const loading = promptUtil.loading(this);
          noticeList(
            qs.stringify({
              page: this.currentPage,
              pagenum: this.pageSize,
            })
          )
            .then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                if(res.data && res.data!='[]' && res.data.data){
                  this.notices = res.data.data.data;
                  this.permitList = res.data.data.total;
                  this.pageShow = this.permitList > this.pageSize ? true:false;

                  setTimeout(()=>{
                    document.getElementsByClassName('notice')
                  },500)

                }
              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              loading.close();
              promptUtil.LOG('noticeList-err',err);
            });
        }
      }
    }
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
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
  .bg-purple {
    background: #fff;
  }
  .bg-purple-light {
    background: #fff;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .grid1-content {
    border-radius: 4px;
    min-height: 46px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }
  .notice{
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
  .list > li{
    height: 30px;
    line-height: 30px;
    font-size: 17px;
    cursor: pointer;
  }
  .el-collapse-item .el-collapse-item__header{
    font-size: 20px ;
  }
  .el-collapse-item__header {
    font-size: 15px ;
  }
</style>
