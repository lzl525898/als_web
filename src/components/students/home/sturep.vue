<template>
    <div>
      <el-row>
        <div style="font-size: 20px;font-weight:bold">学情报告</div>
      </el-row>
      <el-card class="box-card" style="width: 100%;margin-top: 20px;">
        <el-row>
          <el-col :span="8">
            <span style="font-weight: bold">学生姓名&nbsp;&nbsp;&nbsp;{{userBaseInfo.name}}</span>
          </el-col>
          <el-col :span="8">
            <span style="font-weight: bold">所在班级&nbsp;&nbsp;&nbsp;{{userBaseInfo.classInfo.name}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px;">
          <el-col :span="8">
            <div style="float:left">
              <span>平均成绩</span>
            </div>
            <div style="float:left;margin-left:10px;">
              <el-rate
                v-model="userBaseInfo.verageScore"
                disabled
                show-text
                text-color="#ff9900"
                :texts="verageScore"
              ></el-rate>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-row style="margin-top: 15px;">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-row-style="{'color':'#409EFF'}"
        >
          <el-table-column
            align="center"
            props="id"
            type="index"
            :index="indexMethod"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column align="center" prop="name" label="报告名称"></el-table-column>
          <el-table-column align="center" prop="type" label="报告类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type=='1'">课程报告</span>
              <span v-else>任务报告</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="update" label="更新时间"></el-table-column>
          <el-table-column align="center" prop="status" label="报告状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='1'">已发布</span>
              <span v-else style="color:red">待发布</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="showReportDialog({row:scope.row})"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="reportInfoList"
        ></el-pagination>
      </el-row>
      <report-dialog ref="reportdialog"></report-dialog>
    </div>
</template>

<script>
    import reportDialog from "../../teachers/report/reportDialog.vue";
    import promptUtil from "../../../utils/promptUtil";
    import storageUtil from "../../../utils/storageUtil";
    import stringUtil from "../../../utils/stringUtil";
    import '../../../api/restfulapi';
    import {
      qs,
      getReportList,
      intoReportBaseInfo,
      getStudentReportDetail
    } from "../../../api/api";
    export default {
      components: {
        reportDialog
      },
      data(){
        return {
          tableData: [], // 班级数据
          queryFromServer: [], // 服务器请求数据
          pageSize: 10, // 分页页码大小
          currentPage: 1, // 分页当前页码
          verageScore: [], // 学生平均分
          userBaseInfo: { // 当前学生基本信息
            id: "",
            name: "",
            verageScore: 0,
            classInfo: { name: "", id: "" }
          },
          reportDetailInfo: {// 报告详情信息
            pictures: [],
            video: "",
            studentInfo: { avatar: "" },
            teacherInfo: { avatar: "" },
            qrData: { url: "" }
          }
        }
      },
      mounted(){
        promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
        this.verageScore = stringUtil.getEvaluateArray();
        PubSub.publish("currentMenuIndex", "/sturep");
        const loading = promptUtil.loading(this)
        intoReportBaseInfo(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            student_id: storageUtil.readTeacherInfo().id
          })
        ).then(res=>{
          if (res.code == SUCCESS_CODE) {
            PubSub.publish("currentMenuIndex", "/sturep");
            if(res.data && res.data=='[]'){
              loading.close();
              promptUtil.wait(this);
              return;
            }
            this.userBaseInfo = res.data;
            getReportList(
              qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                student_id: storageUtil.readTeacherInfo().id
              })
            ).then(res=>{
              loading.close();
              PubSub.publish("currentMenuIndex", "/sturep");
              if (res.code == SUCCESS_CODE) {
                loading.close();
                this.queryFromServer = [];
                if(res.data && res.data!='[]'){
                  this.queryFromServer = this.anysisDataFromServer(res.data);
                }
                this.handleCurrentChange(1);
              } else {
                promptUtil.wait(this);
              }
            }).catch(err=>{
              loading.close();
              promptUtil.LOG('getReportList-err',err);
            })
          } else {
            loading.close();
            promptUtil.wait(this);
          }
        }).catch(err=>{
          loading.close();
          promptUtil.LOG('intoReportBaseInfo-err',err);
        })
      },
      methods: {
        // 显示查看报告对话框
        showReportDialog(obj) {
          const loading = promptUtil.loading(this);
          getStudentReportDetail(
            qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              task_id: obj.row.id
            })
          ).then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                if(res.data && res.data=='[]'){
                  promptUtil.wait(this);
                  return
                }
                this.reportDetailInfo = res.data;
                this.$refs.reportdialog.start(this.reportDetailInfo);
              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              loading.close();
              promptUtil.LOG('getStudentReportDetail-err',err);
            });
        },
        // 解析从服务器传过来的数据
        anysisDataFromServer(res) {
          const moment = require("moment");
          const collatData = []
          res.map(item => {
            item.update = moment(parseInt(item.update) * 1000).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            if(item.status==1){
              collatData.push(item)
            }
            return item;
          });
          return collatData;
        },
        // 当前页触发函数
        handleCurrentChange(val) {
          this.currentPage = val;
          this.tableData = this.queryFromServer.slice(
            (this.currentPage - 1) * this.pageSize,
            this.pageSize + (this.currentPage - 1) * this.pageSize
          );
        },
        // 设置当前table索引
        indexMethod(index) {
          return index + 1 + (this.currentPage - 1) * 10;
        },
      },
      computed: {
        reportInfoList: {
          get() {
            return this.queryFromServer.length;
          }
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
</style>
