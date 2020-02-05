<template>
    <div>
      <!-- 面包屑 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <div style="border-radius: 4px;padding: 5px 10px;margin-bottom: 30px;width: 92%;">
        <div style="display: flex;justify-content: space-between;align-items: center;" >
          <h2>学生许可</h2>
          <!--<el-tooltip class="item" effect="dark" :content='isAdmin?"管理者：可通过右侧按钮完成许可码的验证与分配":"老师：请通过下方列表中的按钮完成相应操作"' placement="left">
            <p style="margin-right: 20px;"><span class="el-icon-question"></span>如何应用许可</p>
          </el-tooltip>-->
          <el-switch v-show="userRole == 1" @change="switchChange" v-model="isAdmin" active-text="校长" inactive-text="老师"></el-switch>
        </div>
        <p>每个学生需要一个许可，以便在登录后访问相关课程。</p>
        <p v-if="isAdmin">校长获取验证许可码后，可将其分配给相应教师</p>
        <p v-else>当教师第一次将许可应用给学生时，我们将自动应用许可证</p>
      </div>
      <div style="display: flex;justify-content: space-between">
        <el-card class="box-card" shadow="always" style="width: 48%;">
          <div id="pieChart" style="height:300px;width:100%;margin-top:10px;"></div>
        </el-card>
        <el-card v-show="isAdmin" class="box-card" shadow="always" style="width: 48%;">
            <div style="font-size: 18px;text-align: center;height: 200px;">
              <template>
                <countTo style="font-size: 75px;" :startVal='startVal' :endVal='endVal' :duration='3000'></countTo>
              </template>
              <p style="font-size: 30px;">待分配许可码</p>
            </div>
            <div style="display: flex;justify-content: center">
              <el-button type="primary" @click="testCode">验证许可码</el-button>
              <el-button type="primary" @click="allocate">分配许可码</el-button>
            </div>
        </el-card>
      </div>
      <el-row style="margin: 20px 0;">
        <span style="font-weight: bold;font-size:18px;line-height: 44px">许可详情</span>
      </el-row>
      <el-tabs v-show="isAdmin" v-model="activeTab" type="card" @tab-click="handleClick">
        <el-tab-pane label="已分配许可" name="allocated">
          <!-- 列表 -->
          <el-table ref="multipleTable" :data="dataAllocated" tooltip-effect="dark" border :header-row-style="{'color':'#409EFF'}" style="width: 100%">
            <el-table-column label="序号" type="index" :index="indexMethod" align="center" width="60">
            </el-table-column>
            <el-table-column prop="code" label="许可码" align="center">
            </el-table-column>
            <el-table-column prop="teacher_name" align="center" label="许可教师">
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope"><span :style="{color: scope.row.start_time > 0 ? 'red':''}" style="font-weight: bold">{{scope.row.start_time > 0?"已激活":"未激活"}}</span></template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="pageShow1">
            <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage1" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="permitList1"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="未分配许可" name="notAllocated">
          <el-table ref="multipleTable" :data="dataNotAllocated" tooltip-effect="dark" border :header-row-style="{'color':'#409EFF'}" style="width: 100%">
            <el-table-column label="序号"  type="index" :index="indexMethod" align="center" width="60">
            </el-table-column>
            <el-table-column prop="code" label="许可码" align="center">
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">{{moment(parseInt(scope.row.create_time)*1000).format('YYYY-MM-DD HH:mm:ss')}}</template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope"><span style="font-weight: bold">未分配</span></template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="pageShow2">
            <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage2" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="permitList2"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-show="!isAdmin" v-model="activeTab" type="card" @tab-click="handleClick">
        <el-tab-pane label="已使用许可" name="used">
          <!-- 列表 -->
          <el-table ref="multipleTable" :data="dataActived" tooltip-effect="dark" border :header-row-style="{'color':'#409EFF'}" style="width: 100%">
            <el-table-column label="序号"  type="index" :index="indexMethod" align="center" width="60">
            </el-table-column>
            <el-table-column prop="code" label="许可码" align="center">
            </el-table-column>
            <el-table-column prop="student_name" align="center" label="许可学生">
            </el-table-column>
            <el-table-column align="center" label="起始时间">
              <template slot-scope="scope">{{scope.row.start_time > 0 ? moment(parseInt(scope.row.start_time)*1000).format('YYYY-MM-DD HH:mm:ss'):""}}</template>
            </el-table-column>
            <el-table-column align="center" label="结束时间">
              <template slot-scope="scope">{{scope.row.end_time > 0 ? moment(parseInt(scope.row.end_time)*1000).format('YYYY-MM-DD HH:mm:ss'):""}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="400">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click.native="cancelPermit({index: scope.$index, row:scope.row})">取消许可
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="pageShow3">
            <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="permitList3"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="未使用许可" name="notUsed">
          <!-- 列表 -->
          <el-table ref="multipleTable" :data="dataNotActived" tooltip-effect="dark" border :header-row-style="{'color':'#409EFF'}" style="width: 100%">
            <el-table-column label="序号"  type="index" :index="indexMethod" align="center" width="60">
            </el-table-column>
            <el-table-column prop="code" label="许可码" align="center">
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope"><span :style="{color: scope.row.start_time > 0 ? 'red':''}" style="font-weight: bold">{{scope.row.start_time > 0?"已激活":"未激活"}}</span></template>
            </el-table-column>
            <el-table-column  align="center" label="起始时间">
              <template slot-scope="scope">{{scope.row.start_time >0 ? moment(parseInt(scope.row.start_time)*1000).format('YYYY-MM-DD HH:mm:ss'):""}}</template>
            </el-table-column>
            <el-table-column align="center" label="结束时间">
              <template slot-scope="scope">{{scope.row.end_time >0 ? moment(parseInt(scope.row.end_time)*1000).format('YYYY-MM-DD HH:mm:ss'):""}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="400">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click.native="handlePermit({index: scope.$index, row:scope.row})">使用许可
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="pageShow4"><!--pageShow-->
            <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="permitList4"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <!--使用与取消许可弹框-->
      <el-dialog title="许可" :visible.sync="dialogVisible" width="25%">
        <el-row style="font-size: 18px;" v-if="isCancel">是否取消对学生：<span style="font-weight: bold">{{selectedRow.row.student_name}}</span>的许可?</el-row>
        <el-row v-else type="flex" align="middle">
          <el-col :span="10"><span style="font-size:16px;">将许可应用于学生:</span></el-col>
          <el-col :span="14">
            <el-select v-model="selectedStudent"  placeholder="请选择" ref="currentSelectStudent">
              <el-option v-for="item in students" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="okClick" :loading="isLoadingWithOk">确 定</el-button>
        </span>
      </el-dialog>
      <!--验证校验码-->
      <el-dialog title="验证许可" :visible.sync="testDialogVisible" width="400px" @close="$refs.upload.clearFiles()">
        <el-upload ref="upload" accept=".txt,.als" :auto-upload="false" drag list-type="text" :limit="1"
                   :on-change="changeStatus" :on-error="errUpload" :on-success="successUpload" :on-remove="removeFile"
                   :data="{school_id:baseInfo.school_id,user_id: baseInfo.id}" :action="testCodeFile">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.txt,.als文件，最多上传1个文件</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="testDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadFile" :loading="isLoadingWithUp">确 定</el-button>
        </span>
      </el-dialog>
      <!--分配教师弹框-->
      <el-dialog title="许可教师" :visible.sync="teaDialogVisible" width="20%">
        <el-row type="flex" align="middle" style="font-size: 15px;padding-bottom: 20px;">
          <el-col :span="6">许可教师</el-col>
          <el-col :span="18">
            <el-select size="small" v-model="allocateInfo.teacher_id" placeholder="请选择">
              <el-option v-for="item in teachersInfo" :key="item.id" :label="item.nick" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row align="middle" type="flex" style="font-size: 15px">
          <el-col :span="6">许可数量</el-col>
          <el-col :span="18">
            <el-input-number size="small" v-model="allocateInfo.number" :min="1" :max="dataFromServer2.length" label=""></el-input-number>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="teaDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd" :loading="isLoadingWithAdd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    const moment = require("moment")
    const echarts = require("echarts")
    import countTo from 'vue-count-to';
    import storageUtil from "../../../utils/storageUtil"
    import promptUtil from '../../../utils/promptUtil'
    import {
      qs,
      getTeacherList,
      codeAllocate,
      cancelPermit,
      permit,
      teacherAllocate,
      testCodeFile,
      permitStudents
    }from "@/api/api.js";
    import childHeader from '../../component/childHeader'
    export default {
      components: { "countTo":countTo,"als-child-header": childHeader },
      data(){
        return{
          routerConfig: [{name:'许可分配',to:''}],
          isAdmin:false,//用于切换管理员与教师的开关
          baseInfo:[],
          userRole:"",
          dataNotAllocated:[],//服务端获取未分配的许可数据
          dataAllocated:[],//服务端获取已分配的许可数据
          dataActived:[],//服务端获取已激活的许可数据
          dataNotActived:[],//服务端获取未激活的许可数据
          pieChart: null, // 统计chart
          activeTab:"used",
          pageShow1: true, // 默认隐藏列表分页
          pageShow2: true, // 默认隐藏列表分页
          pageShow3: true, // 默认隐藏列表分页
          pageShow4: true, // 默认隐藏列表分页
          pageSize: 10, // 默认列表分页值
          currentPage1: 1, // 已分配列表分页当前页码
          currentPage2: 1, // 未分配列表分页当前页码
          currentPage3: 1, // 已使用列表分页当前页码
          currentPage4: 1, //未使用列表分页当前页面
          dataFromServer1:[],// 已分配列表数据
          dataFromServer2:[],
          dataFromServer3:[],
          dataFromServer4:[],
          selectedRow:{
            row:{}
          },
          dialogVisible:false, //控制许可的弹框可见性
          testDialogVisible:false,//管理员验证许可弹框
          teaDialogVisible:false,
          students:[],//许可下拉框中机构学生
          selectedStudent:"", //许可下拉框中的值选中的学生
          isCancel:false, //许可弹框中的内容判定
          teachersInfo:[],//机构教师信息
          allocateInfo:{ //获取教师许可许可弹框中选中信息
            teacher_id:'',
            number:''
          },
          moment:moment,
          testCodeFile:testCodeFile,
          startVal: 0,//未分配数字滚动起始值
          endVal: 0,
          isLoadingWithOk:false,
          isLoadingWithUp:false,//校验验证码按钮
          isLoadingWithAdd:false,
          allowUpload: false, // 默认不允许点击提交验证许可
        }
      },
      mounted(){
        promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
        PubSub.publish("currentMenuIndex", "/permission");
        this.baseInfo = storageUtil.readTeacherInfo();
        this.userRole = storageUtil.readUserRole();
        this.isAdmin = this.userRole == 1?true:false;
        this.activeTab = this.isAdmin? "allocated":"used";
        this.initDataMethod();
      },
      methods:{
        initDataMethod: function(){
          const role = this.isAdmin ?0:1;
          const loading = promptUtil.loading(this);
            codeAllocate(
              qs.stringify({
                school_id: this.baseInfo.school_id,
                user_id: this.baseInfo.id,
                role: role   /*校长 1教师*/
              })
            )
              .then(res => {
                loading.close();
                if (res.code == SUCCESS_CODE) {
                  if(res.data && res.data!='[]'){
                    res.data.forEach(item=>{
                      switch (item.text) {
                        case "已分配":
                          this.dataFromServer1 = item.data;
                          break;
                        case "未分配":
                          this.dataFromServer2 = item.data;
                          break;
                        case "已使用":
                          this.dataFromServer3 = item.data;
                          break;
                        case "未使用":
                          this.dataFromServer4 = item.data;
                          break;
                      }
                    })
                    this.handleCurrentChange(1);
                    this.drawChart();
                  }
                } else {
                  promptUtil.wait(this);
                }
              })
              .catch(err => {
                loading.close();
                promptUtil.LOG('codeAllocate-err',err);
              });
        },
        drawChart: function(){
          var option = {
            title: {
              text: '许可分配',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'right',
              data: ['已使用许可','未使用许可']
            },
            series : [
              {
                name: '许可分配情况',
                type: 'pie',
                radius : '75%',
                center: ['50%', '55%'],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          this.pieChart = echarts.init(document.getElementById('pieChart'));
          if(this.userRole == 1 && this.isAdmin == true){
            option.legend.data = ['已分配许可','未分配许可'];
            option.series[0].data = [
              {value:this.dataFromServer1.length, name:'已分配许可'},
              {value:this.dataFromServer2.length, name:'未分配许可'}
            ];

          }else{
            option.series[0].data = [
              {value:this.dataFromServer3.length, name:'已使用许可'},
              {value:this.dataFromServer4.length, name:'未使用许可'}
            ];
          }
          this.pieChart.setOption(option);
          window.onresize = this.pieChart.resize;
        },
        handleClick(tab, event) {
          this.handleCurrentChange(1);
        },
        // 设置当前table索引
        indexMethod(index) {
          switch (this.activeTab) {
            case "used":
              return index + 1 + (this.currentPage3 - 1) * 10;
              break;
            case "notUsed":
              return index + 1 + (this.currentPage4 - 1) * 10;
              break;
            case "allocated":
              return index + 1 + (this.currentPage1 - 1) * 10;
              break;
            case "notAllocated":
              return index + 1 + (this.currentPage2 - 1) * 10;
              break;
            default:
          }

        },
        // 列表分页函数
        handleCurrentChange(val) {
            switch (this.activeTab) {
              case "used":
                this.currentPage3 = val;
                this.dataActived = this.dataFromServer3.slice(
                  (this.currentPage3 - 1) * this.pageSize,
                  this.pageSize + (this.currentPage3 - 1) * this.pageSize);
                break;
              case "notUsed":
                this.currentPage4 = val;
                this.dataNotActived = this.dataFromServer4.slice(
                  (this.currentPage4 - 1) * this.pageSize,
                  this.pageSize + (this.currentPage4 - 1) * this.pageSize)
                break;
              case "allocated":
                this.currentPage1 = val;
                this.dataAllocated = this.dataFromServer1.slice(
                  (this.currentPage1 - 1) * this.pageSize,
                  this.pageSize + (this.currentPage1 - 1) * this.pageSize);
                break;
              case "notAllocated":
                this.currentPage2 = val;
                this.dataNotAllocated = this.dataFromServer2.slice(
                  (this.currentPage2 - 1) * this.pageSize,
                  this.pageSize + (this.currentPage2 - 1) * this.pageSize)
          }


        },
        handlePermit(obj){
          this.selectedRow = obj;
          this.isCancel = false;
          this.dialogVisible = true;
          this.students = [];
          this.selectedStudent = "";
          const loading = promptUtil.loading(this);
          permitStudents(
            qs.stringify({
              school_id: this.baseInfo.school_id,
              teacher_id: this.baseInfo.id,
              role_id: this.baseInfo.school_admin
            })
          )
            .then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                if(res.data && res.data!='[]'){
                  this.students = res.data;
                }
              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              loading.close();
              promptUtil.LOG("permitStudents-err",err);
            });

        },
        cancelPermit(obj){
          this.selectedRow = obj;
          this.isCancel = true;
          this.dialogVisible = true;
        },
        okClick(){
          this.dialogVisible = false;
          if(!this.selectedStudent && !this.isCancel){
            promptUtil.error(this,"请选择学生");
            return;
          }
          const loading = promptUtil.loading(this);
          this.isLoadingWithOk = true;
          if(this.isCancel){
            cancelPermit(
              qs.stringify({
                school_id: this.baseInfo.school_id,
                user_id: this.baseInfo.id,
                student_id: this.selectedRow.row.student_id,
                code_id: this.selectedRow.row.id
              })
            )
              .then(res => {
                this.isLoadingWithOk = false;
                loading.close();
                if (res.code == SUCCESS_CODE) {
                  this.initDataMethod();
                } else {
                  promptUtil.wait(this);
                }
              })
              .catch(err => {
                this.isLoadingWithOk = false;
                loading.close();
                promptUtil.LOG('cancelPermit-err',err);
              });
          }else{
            permit(
              qs.stringify({
                school_id: this.baseInfo.school_id,
                user_id: this.baseInfo.id,
                student_id: this.selectedStudent,
                code_id: this.selectedRow.row.id
              })
            )
              .then(res => {
                this.isLoadingWithOk = false;
                loading.close();
                if (res.code == SUCCESS_CODE) {
                  this.selectedStudent = null;
                  this.initDataMethod();
                } else {
                  promptUtil.wait(this);
                }
              })
              .catch(err => {
                this.isLoadingWithOk = false;
                loading.close();
                promptUtil.LOG("permit-err",err);
              });
          }

        },
        allocate(){
          this.teaDialogVisible = true;
          this.allocateInfo.teacher_id = null;
          this.allocateInfo.number = 1;
          getTeacherList(
            qs.stringify({school_id: this.baseInfo.school_id})
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                if (res.data && res.data != '[]') {
                  this.teachersInfo = res.data;
                } else {
                  this.teachersInfo = [];
                }
              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              promptUtil.LOG("getTeacherList-err",err);
            });
        },
        testCode(){
          this.testDialogVisible = true;
          this.allowUpload = false;
        },
        confirmAdd(){
          this.teaDialogVisible = false;
          if(!this.allocateInfo.teacher_id){
            promptUtil.error(this,"请选择教师");
            return;
          }
          if(!this.allocateInfo.number){
            promptUtil.error(this,"请选择分配数量");
            return;
          }
          this.isLoadingWithAdd = true;
          const loading = promptUtil.loading(this);
          teacherAllocate(
            qs.stringify({
              school_id: this.baseInfo.school_id,
              user_id: this.baseInfo.id,
              teacher_id:this.allocateInfo.teacher_id,
              num:this.allocateInfo.number
            })
          )
            .then(res => {
              loading.close();
              this.isLoadingWithAdd = false;
              if (res.code == SUCCESS_CODE) {
                promptUtil.success(this,"分配成功");
                this.initDataMethod();
              } else {
                promptUtil.error(this,res.msg);
              }
            })
            .catch(err => {
              loading.close();
              this.isLoadingWithAdd = false;
              promptUtil.LOG("teacherAllocate-err",err);
            });
        },
        switchChange(){
          this.activeTab = this.isAdmin == true ? "allocated":"used";
          this.initDataMethod();
          this.drawChart();
        },
        uploadFile(){
          if(this.allowUpload){
            this.isLoadingWithUp = true;
            this.$refs.upload.submit();
          }else{
            promptUtil.error(this, '请上传文件')
          }
        },
        errUpload(){
          this.allowUpload = false;
          this.isLoadingWithUp = false;
          promptUtil.wait(this);
        },
        removeFile(file,fileList){
          if(fileList.length == 0){
            this.allowUpload = false;
          }
        },
        changeStatus(){
          this.allowUpload = true
        },
        successUpload(response, file, fileList){
          this.isLoadingWithUp = false;
          this.testDialogVisible = false;
          this.allowUpload = false;
          this.$refs.upload.clearFiles();
          if(response.code == SUCCESS_CODE){
            this.initDataMethod();
            promptUtil.success(this, '上传成功')
          }else{
            promptUtil.error(this, response.msg)
          }
        }
      },
      watch:{
        dataFromServer2:function(val,oldVal){
          this.startVal = oldVal.length;
          this.endVal = val.length;
        }
      },
      computed:{
        permitList1: {
          get() {
            if (this.dataFromServer1.length > this.pageSize) {
              this.pageShow1 = true
            } else {
              this.pageShow1 = false
            }
            return this.dataFromServer1.length;
          }
        },
        permitList2: {
          get() {
            if (this.dataFromServer2.length > this.pageSize) {
              this.pageShow2 = true
            } else {
              this.pageShow2 = false
            }
            return this.dataFromServer2.length;
          }
        },
        permitList3: {
          get() {
            if (this.dataFromServer3.length > this.pageSize) {
              this.pageShow3 = true
            } else {
              this.pageShow3 = false
            }
            return this.dataFromServer3.length;
          }
        },
        permitList4: {
          get() {
            if (this.dataFromServer4.length > this.pageSize) {
              this.pageShow4 = true
            } else {
              this.pageShow4 = false
            }
            return this.dataFromServer4.length;
          }
        }
      },

    }
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple-dark {
    background: #eee;
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
  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }
</style>
