<template>
  <div class="remind">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>提醒</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
    <div v-if="remind.length == 0" class="noData">暂无数据</div>
    <!--<el-table v-else-if="remind.length > 0"
              :data="remind"
              style="width: 70%;margin:0 15%;">
      <el-table-column width="calc(100% - 200px)">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="400" trigger="hover" :content="scope.row.con">
            <span style="cursor: pointer;white-space: nowrap" slot="reference">{{scope.row.con}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="time" width="200">
        <template slot-scope="scope">{{scope.row.add_time > 0 ? moment(parseInt(scope.row.add_time)*1000).format('YYYY-MM-DD'):""}}</template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="pageShow">&lt;!&ndash;pageShow&ndash;&gt;
      <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="permitList"
      ></el-pagination>
    </el-row>-->
  </div>
</template>

<script>
  const moment = require("moment")
  import storageUtil from "../../utils/storageUtil"
  import promptUtil from '../../utils/promptUtil'
  import {
    qs,
    remindList
  }from "@/api/api.js";
    export default {
      name: "remind",
      data(){
        return{
          remind:[],
          pageShow:false,
          permitList:0,
          currentPage:1,
          pageSize:10,
          moment:moment
        }
      },
      mounted(){
        promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      //  this.initRemind();
        /*this.remind = [
          {title:"欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"即将上线新课程",time:"2016-07-11"},
          {title:"教师管理增加新功能",time:"2016-07-11"},
          {title:"欢迎等等老师加入新家庭欢迎等等老师加入新家庭欢迎等等老师加入新家庭欢迎等等老师加入新家庭欢迎等等老师加入新家庭欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"即将上线新课程",time:"2016-07-11"},
          {title:"教师管理增加新功能",time:"2016-07-11"},
          {title:"欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"即将上线新课程",time:"2016-07-11"},
          {title:"教师管理增加新功能",time:"2016-07-11"},
          {title:"欢迎等等老师加入新家庭！",time:"2016-07-11"},
          {title:"即将上线新课程",time:"2016-07-11"},
          {title:"教师管理增加新功能",time:"2016-07-11"},
          {title:"奥松只能期待您的加入，啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦",time:"2016-07-11"}
        ];*/
      },
      methods:{
        // 列表分页函数
        handleCurrentChange(val) {
          debugger;
          this.currentPage = val;
          this.initRemind();
        },
        initRemind(){
          remindList(
            qs.stringify({
              user_id: storageUtil.readTeacherInfo().id,
              page: this.currentPage,
              pagenum: this.pageSize,
            })
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                debugger;
                if(res.data && res.data!='[]'){
                  this.remind = res.data.data;
                  this.permitList = res.data.count;
                  this.pageShow = this.permitList > this.pageSize ? true:false;
                }
              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              promptUtil.LOG('remindList-err',err);
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
</style>
