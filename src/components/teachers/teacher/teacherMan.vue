<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="3">
        <el-input
          placeholder="请输入教师昵称"
          v-model="inputQueryInfo"
          clearable
          @keydown.native.enter="queryClassInfo"
        ></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="addTeacher">添加教师</el-button>
      <label v-show="teacherMaxCount!=''" style="color: #999;font-weight: bold;margin-left: 20px">可添加 <span style="color:#333">{{teacherMaxCount}}</span> 个教师账号</label>
    </el-row>
    <el-row>
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
        <el-table-column align="center" label="账号">
          <template slot-scope="scope">
            <div>{{scope.row.account}}<label style="margin-left:10px"><el-tag type="danger" size="mini" v-if="scope.row.id==currentTeacherCountId">校长</el-tag><el-tag size="mini" v-else>教师</el-tag></label></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nick" label="昵称"></el-table-column>
        <el-table-column align="center" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-if="scope.row.sex==2">女</span>
            <span v-if="scope.row.sex==0">保密</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="phone" label="手机"></el-table-column>
        <el-table-column align="center" label="班级" style="width: 300px">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="班级"
              width="240"
              trigger="click">
              <div>
                <el-tag style="margin-left: 5px;margin-bottom: 5px;" effect="plain" v-for="(item,index) in scope.row.classes.classNames" :key="index">{{item}}</el-tag>
              </div>
              <div slot="reference" class="classRoomItems">{{scope.row.classes.className}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remarks" label="备注"></el-table-column>
        <el-table-column align="center" label="操作" width="380">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.bcb==1"
              size="mini"
              type="success"
              plain
              @click.native="intSuperBlockly"
            >进入编程吧</el-button>
            <el-button
              v-else
              size="mini"
              type="primary"
              plain
              @click.native="bindSuperblockly({index: scope.$index, row:scope.row})"
            >绑定编程吧</el-button>
            <el-button
              class="mt"
              size="mini"
              plain
              @click="showEditTeacherDialog({index: scope.$index, row:scope.row})"
            >编辑
            </el-button>
            <el-button
              class="mt"
              size="mini"
              plain
              @click="showPwdTeacherDialog({index: scope.$index, row:scope.row})"
            >密码重置
            </el-button>
            <el-button
              class="mt"
              size="mini"
              type="danger"
              plain
              @click="showDelTeacherDialog({index: scope.$index, row:scope.row})"
              :disabled="scope.row.id==currentTeacherCountId"
            >删除
            </el-button>
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
        :total="teacherInfoList"
      ></el-pagination>
    </el-row>
    <el-dialog
      title="编辑信息"
      :visible.sync="teacherDialogFormVisible"
      width="35%"
      :before-close="resetFormWithDialog"
    >
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form
            :model="ruleFormWithTeacher"
            :rules="rulesWithTeacher"
            ref="ruleFormWithTeacher"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="昵称" prop="nick">
              <el-input v-model="ruleFormWithTeacher.nick" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model.number="ruleFormWithTeacher.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="ruleFormWithTeacher.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
                <el-radio :label="0">保密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="班级">
              <el-checkbox-group v-model="ruleFormWithTeacher.classes" :disabled="isSchoolAdmin">
                <el-checkbox
                  v-for="item in allClassNames"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="专属颜色">
              <el-color-picker v-model="ruleFormWithTeacher.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="ruleFormWithTeacher.remarks" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item v-show="isShowAddTeacher" label="默认密码" prop="password">
              <el-input placeholder="请输入默认密码" v-model="ruleFormWithTeacher.password"></el-input>
            </el-form-item>
            <el-form-item v-show="isShowAddTeacher" label="短信提醒">
              <el-switch v-model="ruleFormWithTeacher.post" active-text="发送短信" inactive-text="不发送" style="margin-top:-3px"></el-switch>
              <el-tooltip class="item" effect="dark" content="新建教师账户信息将已短信的形式发送给已填写手机号的用户，请确保手机号正确" placement="right-start" style="margin-top:-3px;">
                <el-link :underline="false"><i class="el-icon-info"></i></el-link>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormWithDialog">取 消</el-button>
        <el-button
          v-show="isShowAddTeacher"
          type="primary"
          @click="handleAddTeacher"
          :loading="isLoadingWithAdd"
        >确 定
        </el-button>
        <el-button
          v-show="!isShowAddTeacher"
          type="primary"
          @click="handleEditTeacher"
          :loading="isLoadingWithAdd"
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{delDialogContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelTeacher" :loading="isLoadingWithDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="pwdDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-warning"></i>
        </el-col>
        <el-col :span="20">
          <div style="font-weight: 600">{{pwdDialogContent.title}}</div>
          <br>
          <div>{{pwdDialogContent.account}}</div>
          <br>
          <div>{{pwdDialogContent.nick}}</div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetTeacherPwd" :loading="isLoadingWithPwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PubSub from "pubsub-js";
  import storageUtil from "../../../utils/storageUtil";
  import stringUtil from "../../../utils/stringUtil";
  import promptUtil from "../../../utils/promptUtil";
  import superBlockly from "../../../utils/superBlockly";
  import '../../../api/restfulapi';
  import {
    qs,
    getAllClass,
    addTeacher,
    editTeacher,
    delTeacherById,
    resetTeacherPwd,
    getTeacherCount,
    getTeacherList,
  } from "@/api/api.js";
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        routerConfig: [{name:'教师管理',to:''}],
        inputQueryInfo: "", // 搜索内容
        tableData: [], // 班级数据
        queryFromServer: [], // 服务器请求数据
        pageSize: 10, // 分页页码大小
        currentPage: 1, // 分页当前页码
        requestTimeout: 2000, // 请求服务器超时时间
        getTableContentTimeoutId: null, // 模拟异步请求定时id
        teacherDialogFormVisible: false, // 编辑教师对话框是否显示
        isLoadingWithAdd: false, // 添加按钮是否加载状态
        isShowAddTeacher: true, // 是否显示添加教师确认按钮
        allClassNames: [], // 当前学校所有已经创建的班级
        delDialogContent: "", // 删除对话框中显示的内容
        delDialogVisible: false, // 删除确认对话框显示状态
        isLoadingWithDel: false, // 删除确认对话框中确认按钮加载状态
        pwdDialogVisible: false, // 重置密码对话框显示状态
        isLoadingWithPwd: false, // 重置密码确认对话框中确认按钮加载状态
        currentResetTeaId: "", // 当前要重置密码的教师id
        isSchoolAdmin: false, // 判断是否为管理员
        pwdDialogContent: {title: "", account: "", nick: ""}, // 重置密码对话框中显示的内容
        currentDelTeacherIndex: 0, // 当前要删除的教师index
        currentTeacherCountId: 0, // 当前教师的id
        ruleFormWithTeacher: {
          password:"",
          nick: "",
          phone: "",
          classes: [],
          remarks: "",
          sex:0,
          color: '#409EFF',
          current: 0,
          post: true, // 发送短信
        }, // 教师表单基本信息
        rulesWithTeacher: {
          password: [
            {required: true, message: "请输入默认密码", trigger: "blur"},
            {pattern: /^(\w){6,20}$/, message: "只能输入6-20个字母、数字、下划线"}
          ],
          // 教师表单验证
          nick: [
            {required: true, message: "请输入教师昵称", trigger: "blur"},
            {pattern: /^[0-9a-zA-Z]|[\u4e00-\u9fa5]+$/, message: "含有特殊字符"}
          ],

          phone: [
            {required: true, message: "请输入手机号", trigger: "blur"},
            {type: "number", message: "手机必须为数字值", trigger: "blur"}
            // { pattern:/^[1][3,4,5,7,8][0-9]{9}$/ , message: '手机号格式不正确' }
          ]
        },
        teacherMaxCount: "", // 教师最大数量
      };
    },
    created() {
      PubSub.subscribe("superblockly_bind", (msg, data) => {
        if(data && data.indexOf("bindtea")!=-1){
          try{
            const userId = data.split("-")[0]
            this.tableData.map(item=>{
              if(userId == item.id && item.bcb!=1){
                item.bcb = 1
              }
            })
          }catch (e) {
            promptUtil.LOG("superblockly_bind-err",e)
          }
        }
      });
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/teacherMan");
      const loading = promptUtil.loading(this);
      // 1.初始化需要获取学校当前拥有的所有班级数组
      // 2.获取学校当前所有的教师信息数组
      this.currentTeacherCountId = storageUtil.readTeacherInfo().id;
      getTeacherCount(qs.stringify({school_id:storageUtil.readTeacherInfo().school_id})).then(res=>{
        this.teacherMaxCount = res.data==0 ? 2 : res.data
      }).catch(err=>promptUtil.LOG("getTeacherCount-err",err))
      getAllClass(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          teacher_id: storageUtil.readTeacherInfo().id,
          role_id: 1
        })
      )
        .then(res => {
          PubSub.publish("currentMenuIndex", "/teacherMan");
          this.allClassNames = [];
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              res.data.forEach(item => {
                const classObj = {classId: item.id, className: item.class_name};
                this.allClassNames.push(classObj);
              });
            }
            loading.close();
          } else {
            loading.close();
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          loading.close();
          PubSub.publish("currentMenuIndex", "/teacherMan");
          promptUtil.LOG("getAllClass-err",err);
        });
      getTeacherList(
        qs.stringify({school_id: storageUtil.readTeacherInfo().school_id})
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              this.queryFromServer = res.data;
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              this.tableData = [];
            }
            this.getTableContentTimeoutId = null;
          } else {
            promptUtil.wait(this);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
          promptUtil.LOG("getTeacherList-err",err);
        });
    },
    methods: {
      intSuperBlockly(){
        superBlockly.gotoSuperBlockly()
      },
      // 绑定编程吧
      bindSuperblockly(obj){
        const accountInfo = {userId: obj.row.id}
        superBlockly.bindAccount('tea',this, accountInfo, promptUtil.loading(this))
      },
      // 设置当前table索引
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * 10;
      },
      // 查询触发函数
      queryClassInfo() {
        const loading = promptUtil.loading(this);
        getTeacherList(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            teacher_name: this.inputQueryInfo.trim()
          })
        )
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              this.inputQueryInfo = "";
              // 重置当前页为1
              this.currentPage = 1;
              this.queryFromServer = [];
              if (res.data && res.data != '[]') {
                this.queryFromServer = res.data;
              }
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              promptUtil.wait(this);
            }
            loading.close();
          })
          .catch(err => {
            loading.close();
            promptUtil.LOG("getTeacherList-err",err);
          });
      },
      // 添加教师按钮触发函数
      addTeacher() {
        if(this.teacherMaxCount<this.queryFromServer.length){ // 应该是 <= 但是有校长，所以 <
          promptUtil.error(this,'教师账号已超出限制数量')
          return
        }
        this.isSchoolAdmin = false;
        this.resetFormWithDialog()
        this.isShowAddTeacher = true;
        this.teacherDialogFormVisible = true;
        this.ruleFormWithTeacher.password = stringUtil.randomString(6);
      },
      // 显示删除教师对话框
      showDelTeacherDialog(obj) {
        this.currentResetTeaId = obj.row.id;
        this.delDialogVisible = true;
        this.delDialogContent = "您确定要删除 【 " + obj.row.nick + " 】 吗？";
        this.currentDelTeacherIndex = obj.index + (this.currentPage - 1) * this.pageSize; // 为教师索引，不是教师id
      },
      // 显示编辑教师对话框
      showEditTeacherDialog(obj) {
        this.isShowAddTeacher = false; // 显示编辑确认按钮
        if (
          storageUtil.readTeacherInfo().school_admin == 1 &&
          storageUtil.readTeacherInfo().id == obj.row.id
        ) {
          this.isSchoolAdmin = true;
        } else {
          this.isSchoolAdmin = false;
        }
        this.ruleFormWithTeacher.sex = obj.row.sex;
        this.ruleFormWithTeacher.nick = obj.row.nick;
        this.ruleFormWithTeacher.phone = obj.row.phone;
        this.ruleFormWithTeacher.remarks = obj.row.remarks;
        this.ruleFormWithTeacher.current = obj.index;
        this.ruleFormWithTeacher.color = obj.row.color;
        if (obj.row.classes.className) {
          this.ruleFormWithTeacher.classes = obj.row.classes.className.split(",");
        } else {
          this.ruleFormWithTeacher.classes = [];
        }
        this.teacherDialogFormVisible = true;
      },
      // 显示重置密码对话框
      showPwdTeacherDialog(obj) {
        this.pwdDialogVisible = true;
        this.currentResetTeaId = obj.row.id;
        this.pwdDialogContent.title = "确定要重置密码吗？重置密码 : 111000";
        this.pwdDialogContent.account = "教师账号 : " + obj.row.account;
        this.pwdDialogContent.nick = "教师昵称 : " + obj.row.nick;
      },
      // 重置教师密码触发函数
      handleResetTeacherPwd() {
        this.isLoadingWithPwd = true;
        resetTeacherPwd(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            teacher_id: this.currentResetTeaId
          })
        )
          .then(res => {
            // console.log(res)
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, res.msg);
            } else {
              promptUtil.wait(this);
            }
            this.isLoadingWithPwd = false;
            this.pwdDialogVisible = false;
          })
          .catch(err => {
            this.isLoadingWithPwd = false;
            this.pwdDialogVisible = false;
            promptUtil.LOG("resetTeacherPwd-err",err);
          });
      },
      // 确认删除教师触发函数
      handleDelTeacher() {
        this.isLoadingWithDel = true;
        delTeacherById(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            teacher_id: this.currentResetTeaId
          })
        )
          .then(res => {
            this.isLoadingWithDel = false;
            this.delDialogVisible = false;
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, res.msg);
              this.queryFromServer.splice(this.currentDelTeacherIndex, 1);
              //防止queryFromServer中的数据为pageSize的倍数时tableData为空
              if (this.currentPage > Math.ceil(this.queryFromServer.length /this.pageSize) ) {
                this.currentPage--;
              }
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              if(res.code == ERROR_CODE){
                promptUtil.warning(this, res.msg)
              }else{
                if(res.msg){
                  promptUtil.warning(this, res.msg)
                }else{
                  promptUtil.wait(this)
                }
              }
            }
          })
          .catch(err => {
            this.isLoadingWithDel = false;
            this.delDialogVisible = false;
            promptUtil.LOG("delTeacherById-err",err);
          });
      },
      // 确认编辑教师按钮触发函数
      handleEditTeacher() {
        if (this.ruleFormWithTeacher.nick.trim() === "") {
          return;
        }
        if (this.ruleFormWithTeacher.phone === "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        } else {
          let phoneValdate = /^[1][3,4,5,7,8][0-9]{9}$/;
          if (!phoneValdate.test(this.ruleFormWithTeacher.phone)) {
            promptUtil.warning(this, "手机号格式不正确");
            return;
          }
        }

        // listA 当前编辑状态下选中的班级  listB 编辑之前教师所拥有的班级
        const teacheClasses = this.queryFromServer[
        this.ruleFormWithTeacher.current +
        (this.currentPage - 1) * this.pageSize
          ].classes;
        const listA = this.ruleFormWithTeacher.classes;
        let listB = null;
        if (teacheClasses != "") {
          listB = this.queryFromServer[
          this.ruleFormWithTeacher.current +
          (this.currentPage - 1) * this.pageSize
            ].classes.classOwn.map(item => {
            return item.className;
          });
        } else {
          listB = [];
        }
        if (
          this.ruleFormWithTeacher.sex ===
          this.queryFromServer[
          this.ruleFormWithTeacher.current +
          (this.currentPage - 1) * this.pageSize
            ].sex &&
          this.ruleFormWithTeacher.color ===
          this.queryFromServer[
          this.ruleFormWithTeacher.current +
          (this.currentPage - 1) * this.pageSize
            ].color &&
          this.ruleFormWithTeacher.nick ===
          this.queryFromServer[
          this.ruleFormWithTeacher.current +
          (this.currentPage - 1) * this.pageSize
            ].nick &&
          this.ruleFormWithTeacher.remarks ===
          this.queryFromServer[
          this.ruleFormWithTeacher.current +
          (this.currentPage - 1) * this.pageSize
            ].remarks &&
          this.ruleFormWithTeacher.phone ===
          this.queryFromServer[
          this.ruleFormWithTeacher.current +
          (this.currentPage - 1) * this.pageSize
            ].phone &&
          listA.length === listB.length &&
          listA.every(a => listB.some(b => a === b)) &&
          listB.every(_b => listA.some(_a => _a === _b))
        ) {
          this.teacherDialogFormVisible = false;
          return;
        }
        this.isLoadingWithAdd = true;
        editTeacher(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            teacher_id: this.queryFromServer[
            this.ruleFormWithTeacher.current +
            (this.currentPage - 1) * this.pageSize
              ].id,
            sex: this.ruleFormWithTeacher.sex,
            color: this.ruleFormWithTeacher.color,
            nick: this.ruleFormWithTeacher.nick,
            phone: this.ruleFormWithTeacher.phone,
            remark: this.ruleFormWithTeacher.remarks,
            classes: this.getClassIdsWithClassName(
              this.ruleFormWithTeacher.classes
            )
          })
        )
          .then(res => {
            this.isLoadingWithAdd = false;
            this.teacherDialogFormVisible = false;
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, res.msg);
              this.queryFromServer[
              this.ruleFormWithTeacher.current +
              (this.currentPage - 1) * this.pageSize
                ].sex = this.ruleFormWithTeacher.sex;
              this.queryFromServer[
              this.ruleFormWithTeacher.current +
              (this.currentPage - 1) * this.pageSize
                ].color = this.ruleFormWithTeacher.color;
              this.queryFromServer[
              this.ruleFormWithTeacher.current +
              (this.currentPage - 1) * this.pageSize
                ].nick = this.ruleFormWithTeacher.nick.trim();
              this.queryFromServer[
              this.ruleFormWithTeacher.current +
              (this.currentPage - 1) * this.pageSize
                ].phone = (this.ruleFormWithTeacher.phone + "").trim();
              this.queryFromServer[
              this.ruleFormWithTeacher.current +
              (this.currentPage - 1) * this.pageSize
                ].remarks =
                this.ruleFormWithTeacher.remarks == null
                  ? ""
                  : this.ruleFormWithTeacher.remarks.trim();
              this.queryFromServer[
              this.ruleFormWithTeacher.current +
              (this.currentPage - 1) * this.pageSize
                ].classes = this.genClassInfoStruct(
                this.ruleFormWithTeacher.classes
              );
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              promptUtil.wait(this);
              if (res.code == ERROR_CODE) {
                promptUtil.error(this, res.msg);
              } else {
                promptUtil.wait(this);
              }
            }
          })
          .catch(err => {
            this.isLoadingWithAdd = false;
            this.teacherDialogFormVisible = false;
            promptUtil.LOG("editTeacher-err",err);
          });
      },
      // 生成班级信息数据结构
      genClassInfoStruct(classArray) {
        let classInfo = {className: "", classOwn: []};
        let classNames = "";
        classArray.forEach(item => {
          if (item.trim() !== "") {
            classNames = classNames + item + ",";
          }
          const classInfoItem = this.allClassNames.filter(object => {
            return object.className === item;
          });
          classInfo.classOwn.push(classInfoItem[0]);
        });
        classInfo.className = classNames.substr(0, classNames.length - 1);
        return classInfo;
      },
      //过班级名获得班级id
      getClassIdsWithClassName(classes) {
        let classIds = "";
        classes.forEach(v => {
          let classItem = this.allClassNames.find(item => {
            return item.className.trim() === v.trim();
          });
          classIds = classIds + classItem.classId + ",";
        });
        return classIds.substr(0, classIds.length - 1);
      },
      // 确认添加教师按钮触发函数
      handleAddTeacher() {
        if (this.ruleFormWithTeacher.password.trim() == "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        }else{
          let patrn=/^(\w){6,20}$/;
          if (!patrn.exec(this.ruleFormWithTeacher.password)){
            promptUtil.warning(this, "只能输入6-20个字母、数字、下划线");
            return;
          }
        }
        if (this.ruleFormWithTeacher.nick.trim() == "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        }
        if (this.ruleFormWithTeacher.phone == "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        } else {
          let phoneValdate = /^[1][3,4,5,7,8][0-9]{9}$/;
          if (!phoneValdate.test(this.ruleFormWithTeacher.phone)) {
            promptUtil.warning(this, "手机号格式不正确");
            return;
          }
        }
        this.isLoadingWithAdd = true; // 改变按钮加载状态
        addTeacher(
          qs.stringify({
            sms: this.ruleFormWithTeacher.post ? 1 : 0,
            password: this.ruleFormWithTeacher.password,
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            sex: this.ruleFormWithTeacher.sex,
            nick: this.ruleFormWithTeacher.nick.trim(),
            phone: this.ruleFormWithTeacher.phone,
            color: this.ruleFormWithTeacher.color,
            remark: this.ruleFormWithTeacher.remarks,
            classes: this.getClassIdsWithClassName(
              this.ruleFormWithTeacher.classes
            )
          })
        )
          .then(res => {
            this.isLoadingWithAdd = false;
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, res.msg);
              // res.data.id
              this.queryFromServer.push({
                id: res.data.id,
                color: res.data.color,
                sex: this.ruleFormWithTeacher.sex,
                account: res.data.account,
                nick: this.ruleFormWithTeacher.nick.trim(),
                phone: (this.ruleFormWithTeacher.phone + "").trim(),
                remarks:
                  this.ruleFormWithTeacher.remarks == null
                    ? ""
                    : this.ruleFormWithTeacher.remarks.trim(),
                classes: this.genClassInfoStruct(this.ruleFormWithTeacher.classes)
              });
              this.resetFormWithDialog();
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              promptUtil.error(this, res.msg);
            }
          })
          .catch(err => {
            this.isLoadingWithAdd = false;
            promptUtil.LOG("addTeacher-err",err);
          });
      },
      // 重置添加教师对话框
      resetFormWithDialog() {
        this.ruleFormWithTeacher.nick = "";
        this.ruleFormWithTeacher.phone = "";
        this.ruleFormWithTeacher.remarks = "";
        this.ruleFormWithTeacher.classes = [];
        this.ruleFormWithTeacher.color = "#409EFF";
        try{
          this.$refs.ruleFormWithTeacher.resetFields();
        }catch (e) {
        }
        this.teacherDialogFormVisible = false;
      },
      // 当前页触发函数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.tableData = this.queryFromServer.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        );
      }
    },
    watch: {
      tableData(newVal,oldVal){
        if(newVal && newVal.length>0){
          newVal.map(item=>{
            const classArray = item.classes.classOwn
            if(classArray && classArray.length>0){
              const classNames = []
              classArray.map(obj=>{
                classNames.push(obj.className)
              })
              item.classes.classNames = classNames
            }
          })
        }
      },
    },
    computed: {
      teacherInfoList: {
        get() {
          return this.queryFromServer.length;
        }
      }
    }
  };
</script>
<style scoped>
  .el-icon-warning {
    margin-top: -10px;
  }

  .el-icon-warning:before {
    font-size: 36px;
    color: #ffba42;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

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

  .fs {
    font-size: 18px;
    line-height: 2.5;
    color: #00a2ff;
    font-weight: bold;
  }

  h4 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    color: #00a2ff;
  }

  .ahref {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: #00a2ff;
    display: block;
  }

  .ml a {
    text-align: center;
  }

  .mt {
    margin: 4px;
  }
  .classRoomItems {
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #00a2ff;
  }
  .classRoomItems:hover{
    cursor: pointer;
  }
</style>
