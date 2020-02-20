<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!-- 查询 -->
    <el-row :gutter="16">
      <el-col :span="3">
        <el-input
          :placeholder="$t(`message.classroom_search_input_placeholder`)"
          v-model="inputQueryInfo"
          clearable
          @keydown.native.enter="queryClassInfo"
        ></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-search" @click="queryClassInfo">{{$t(`message.student_management_search`)}}</el-button>
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
    <!-- 添加班级 -->
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="addClassRoom">{{$t(`message.classroom_add_button_title`)}}</el-button>
    </el-row>
    <el-row>
      <!-- 列表 -->
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
          :label="$t(`message.student_management_tableData_number`)"
          width="60"
        ></el-table-column>
        <el-table-column align="center" prop="class_name" :label="$t(`message.classroom_table_column_classname`)"></el-table-column>
        <el-table-column align="center" prop="stucount" :label="$t(`message.classroom_table_column_count`)"></el-table-column>
        <el-table-column align="center" prop="remark" :label="$t(`message.user_system_school_table_label_desc`)"></el-table-column>
        <el-table-column align="center" :label="$t(`message.student_management_tableData_user_operation`)" width="280px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleIntoRoomDialog({index: scope.$index, row:scope.row})"
            >{{$t(`message.string_label_see`)}}</el-button>
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleClassRoomDialog('edit',{index: scope.$index, row:scope.row})"
            >{{$t(`message.string_label_edit`)}}</el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              @click="delClassRoomDialog({index: scope.$index, row:scope.row})"
            >{{$t(`message.string_label_delete`)}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页 -->
    <el-row type="flex" justify="center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="classInfoList"
      ></el-pagination>
    </el-row>
    <!-- 弹出框 -->
    <el-dialog
      :title="$t(`message.student_management_tableData_operation_editInformation`)"
      :visible.sync="dialogFormVisible"
      width="35%"
      :before-close="resetFormWithDialog"
    >
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form
            :model="ruleFormWithClassRoom"
            :rules="rulesWithClassRoom"
            ref="ruleFormWithClassRoom"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item :label="$t(`message.classroom_table_column_classname`)" prop="name">
              <el-input v-model="ruleFormWithClassRoom.name" :placeholder="$t(`message.classroom_search_input_placeholder`)"></el-input>
            </el-form-item>
            <el-form-item :label="$t(`message.user_system_school_table_label_desc`)">
              <el-input v-model="ruleFormWithClassRoom.remarks" :placeholder="$t(`message.consult_dialog_please_input_remark`)"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleFunc('add',false)">{{$t(`message.button_cancel`)}}</el-button>
        <el-button
          v-show="isEditHandle"
          type="primary"
          @click="editClassRoomBtn"
          :loading="isLoadingWithAdd"
        >{{$t(`message.button_confirm`)}}</el-button>
        <el-button
          v-show="!isEditHandle"
          type="primary"
          @click="dialogFormVisibleFunc('add',true)"
          :loading="isLoadingWithAdd"
        >{{$t(`message.button_confirm`)}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t(`message.dialog_header_title_prompt`)" :visible.sync="delDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{delDialogContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">{{$t(`message.button_cancel`)}}</el-button>
        <el-button type="primary" @click="handleDelClassRoom" :loading="isLoadingWithDel">{{$t(`message.button_confirm`)}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PubSub from "pubsub-js";
  import storageUtil from "../../../utils/storageUtil";
  import promptUtil from "../../../utils/promptUtil";
  import '../../../api/restfulapi';
  import {
    qs,
    addClass,
    delClassById,
    editClassById,
    getAllClass,
    filterClassByKeyWords
  } from "@/api/api.js";
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        routerConfig: [{name:'',to:''}],
        inputQueryInfo: "", // 搜索内容
        tableData: [], // 班级数据
        queryFromServer: [], // 服务器请求数据
        pageSize: 10, // 分页页码大小
        currentPage: 1, // 分页当前页码
        requestTimeout: 2000, // 请求服务器超时时间
        getTableContentTimeoutId: null, // 模拟异步请求定时id
        isLoadingWithAdd: false, // 添加班级按钮是否为加载状态
        isLoadingWithDel: false, // 删除班级按钮是否为加载状态
        dialogFormVisible: false, // 对话框是否显示
        delDialogVisible: false, // 删除对话框是否显示
        delDialogContent: "", // 删除对话框中显示的内容
        isEditHandle: false, // 是否显示编辑班级的确定按钮
        currentSelectClassId: 0, // 当前要点选的班级id
        currentDelClassRoomIndex: 0, // 当前要删除的班级index
        currentTeacherOwnClass: [], // 当前教师所拥有的班级id数组
        ruleFormWithClassRoom: { name: "", remarks: "", isNew: true, current: 0 }, //编辑数据
        rulesWithClassRoom: {
          name: [{ required: true, message: "", trigger: "blur" }]
        }
      };
    },
    watch: {
      '$i18n.locale': function () {
          this.routerConfig[0].name = this.$t(`message.classroom_header_title`)
          this.rulesWithClassRoom.name[0].message = this.$t(`message.classroom_search_input_placeholder`)
      }
    },
    mounted() {
      this.routerConfig[0].name = this.$t(`message.classroom_header_title`)
      this.rulesWithClassRoom.name[0].message = this.$t(`message.classroom_search_input_placeholder`)
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/classMan");
      const loading = promptUtil.loading(this);
      // 初始化需要获取学校当前所有班级信息数组
      getAllClass(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          role_id: storageUtil.readTeacherInfo().school_admin,
          teacher_id: storageUtil.readTeacherInfo().id
        })
      )
        .then(res => {
          PubSub.publish("currentMenuIndex", ROUTER_CLASS_MAN);
          if (res.code == SUCCESS_CODE) {
            this.queryFromServer = [];
            if(res.data && res.data!='[]'){
              this.queryFromServer = res.data;
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            }else{
              this.tableData = this.queryFromServer;
            }
            this.getTableContentTimeoutId = null;
          } else  {
            promptUtil.wait(this);
          }
          loading.close();
        })
        .catch(err => {
          promptUtil.LOG('getAllClass-err',err);
          PubSub.publish("currentMenuIndex", ROUTER_CLASS_MAN);
          loading.close();
        });
    },
    computed: {
      classInfoList: {
        get() {
          return this.queryFromServer.length;
        }
      }
    },
    methods: {
      // 设置当前table索引
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * 10;
      },
      // 搜索按钮触发函数
      queryClassInfo() {
        const loading = promptUtil.loading(this);
        if (this.inputQueryInfo.trim() == "") {
          getAllClass(
            qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              role_id: storageUtil.readTeacherInfo().school_admin,
              teacher_id: storageUtil.readTeacherInfo().id
            })
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                this.queryFromServer = [];
                if(res.data && res.data!='[]'){
                  this.queryFromServer = res.data;
                  this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                  );
                }else{
                  this.tableData = this.queryFromServer;
                }
                this.getTableContentTimeoutId = null;
              } else {
                promptUtil.wait(this);
              }
              // 清空当前搜索内容
              loading.close();
              this.inputQueryInfo = "";
            })
            .catch(err => {
              promptUtil.LOG('getAllClass-err',err);
              loading.close();
            });
          return;
        }
        // 查询的内容  如果内容为空则请求所有班级数据
        filterClassByKeyWords(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            class_name: this.inputQueryInfo.trim()
          })
        )
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              // 重置当前页为1
              this.currentPage = 1;
              this.queryFromServer = [];
              if(res.data && res.data!='[]'){
                this.queryFromServer = res.data;
                // 根据请求api返回值设置tableData
                this.tableData = this.queryFromServer.slice(
                  (this.currentPage - 1) * this.pageSize,
                  this.pageSize + (this.currentPage - 1) * this.pageSize
                );
              }else{
                this.tableData = this.queryFromServer;
              }
            } else {
              promptUtil.wait(this);
            }
            loading.close();
            this.inputQueryInfo = "";
          })
          .catch(err => {
            promptUtil.LOG('filterClassByKeyWords-err',err);
            loading.close();
          });
      },
      // 删除班级按钮触发函数
      delClassRoomDialog(object) {
        if(object.row.stucount>0){
          promptUtil.warning(this, this.$t(`message.classroom_valid_delete_warning`))
          return
        }
        this.currentSelectClassId = object.row.id;
        this.delDialogVisible = true;
        this.delDialogContent =
          this.$t(`message.consult_dialog_content_del`) + " 【 " + object.row.class_name + " 】 ？";
        this.currentDelClassRoomIndex =
          object.index + (this.currentPage - 1) * this.pageSize; // 为班级索引，不是班级id
      },
      // 删除当前选中的班级
      handleDelClassRoom() {
        this.isLoadingWithDel = true;
        delClassById(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            class_id: this.currentSelectClassId,
            teacher_id:storageUtil.readTeacherInfo().id
          })
        )
          .then(res => {
            this.isLoadingWithDel = false;
            this.delDialogVisible = false;
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, res.msg);
              this.queryFromServer.splice(this.currentDelClassRoomIndex, 1);
              //防止queryFromServer中的数据为pageSize的倍数时tableData为空
              // if(this.queryFromServer.length % this.pageSize == 0){
              //   this.currentPage --;
              // }
              //防止queryFromServer中的数据为pageSize的倍数时tableData为空
              if (this.currentPage > Math.ceil(this.queryFromServer.length /this.pageSize) ) {
                this.currentPage--;
              }
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              promptUtil.warning(this,res.msg)
              // promptUtil.wait(this);
            }
          })
          .catch(err => {
            this.isLoadingWithDel = false;
            this.delDialogVisible = false;
            promptUtil.LOG('delClassById-err',err);
          });
      },
      // 添加班级触发函数
      addClassRoom() {
        this.ruleFormWithClassRoom.name = "";
        this.ruleFormWithClassRoom.remarks = "";
        this.ruleFormWithClassRoom.isNew = true;
        this.isEditHandle = false;
        this.dialogFormVisible = true;
      },
      // 编辑班级——确定按钮
      editClassRoomBtn() {
        if (
          this.ruleFormWithClassRoom.name == null ||
          this.ruleFormWithClassRoom.name.trim() == ""
        ) {
          promptUtil.warning(this, this.$t(`message.classroom_search_input_placeholder`));
          return;
        }
        if (
          this.ruleFormWithClassRoom.name ===
          this.queryFromServer[
          this.ruleFormWithClassRoom.current +
          (this.currentPage - 1) * this.pageSize
            ].class_name &&
          this.ruleFormWithClassRoom.remarks ===
          this.queryFromServer[
          this.ruleFormWithClassRoom.current +
          (this.currentPage - 1) * this.pageSize
            ].remark
        ) {
          promptUtil.LOG("内容一致，无需提交")
          this.dialogFormVisible = false;
          return;
        }
        this.isLoadingWithAdd = true;
        editClassById(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            teacher_id:storageUtil.readTeacherInfo().id,
            class_id: this.currentSelectClassId,
            class_name: this.ruleFormWithClassRoom.name.trim(),
            remark: this.ruleFormWithClassRoom.remarks
          })
        )
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              this.dialogFormVisible = false;
              promptUtil.success(this,res.msg);
              this.queryFromServer[
              this.ruleFormWithClassRoom.current +
              (this.currentPage - 1) * this.pageSize
                ].class_name = this.ruleFormWithClassRoom.name.trim();
              this.queryFromServer[
              this.ruleFormWithClassRoom.current +
              (this.currentPage - 1) * this.pageSize
                ].remark = this.ruleFormWithClassRoom.remarks.trim();
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
            } else {
              this.ruleFormWithClassRoom.name = "";
              this.dialogFormVisible = false;
              promptUtil.wait(this);
              promptUtil.warning(this, res.msg);
            }
            this.isLoadingWithAdd = false;
          })
          .catch(err => {
            promptUtil.LOG('editClassById-err',err);
            this.dialogFormVisible = false;
            this.isLoadingWithAdd = false;
          });
      },
      // 操作查看按钮
      handleIntoRoomDialog(object) {
        this.$store.dispatch("setCurrentClassName", object.row.class_name?object.row.class_name: this.$t(`message.classroom_name`))
        this.$router.push({path: ROUTER_CLASS_ROOM+object.row.id})
      },
      // 操作编辑按钮
      handleClassRoomDialog(type, object) {
        if (type === "edit") {
          this.isEditHandle = true;
          this.currentSelectClassId = object.row.id;
          this.ruleFormWithClassRoom.isNew = false;
          this.ruleFormWithClassRoom.current = object.index;
          this.ruleFormWithClassRoom.name = object.row.class_name;
          this.ruleFormWithClassRoom.remarks = object.row.remark;
          this.dialogFormVisible = true;
        }
      },
      // 班级dialog触发事件
      dialogFormVisibleFunc(type, object) {
        if (type === "add") {
          if (object) {
            // true 添加  false 取消
            if (!this.ruleFormWithClassRoom.name.trim()) {
              return;
            }
            this.isLoadingWithAdd = true;
            if (this.ruleFormWithClassRoom.isNew) {
              // 添加班级
              addClass(
                qs.stringify({
                  teacher_id: storageUtil.readTeacherInfo().id,
                  school_id: storageUtil.readTeacherInfo().school_id,
                  class_name: this.ruleFormWithClassRoom.name.trim(),
                  remark: this.ruleFormWithClassRoom.remarks.trim()
                })
              )
                .then(res => {
                  if (res.code == SUCCESS_CODE) {
                    this.dialogFormVisible = false;
                    promptUtil.success(this, res.msg);
                    this.queryFromServer.push(res.data);
                    this.$refs.ruleFormWithClassRoom.resetFields();
                    this.tableData = this.queryFromServer.slice(
                      (this.currentPage - 1) * this.pageSize,
                      this.pageSize + (this.currentPage - 1) * this.pageSize
                    );
                  } else {
                    this.ruleFormWithClassRoom.name = "";
                    this.dialogFormVisible = false;
                    promptUtil.warning(this, res.msg);
                  }
                  this.isLoadingWithAdd = false;
                })
                .catch(err => {
                  promptUtil.LOG('addClass-err',err);
                  this.dialogFormVisible = false;
                  this.isLoadingWithAdd = false;
                });
            }
          } else {
            this.$refs.ruleFormWithClassRoom.resetFields();
            this.dialogFormVisible = false;
          }
        }
      },
      // 重置添加班级对话框
      resetFormWithDialog() {
        this.$refs.ruleFormWithClassRoom.resetFields();
        this.ruleFormWithClassRoom.name = "";
        this.ruleFormWithClassRoom.remarks = "";
        this.dialogFormVisible = false;
      },
      // 当前页触发函数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.tableData = this.queryFromServer.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        );
      }
    }
  };
</script>

<style scoped>
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
</style>
