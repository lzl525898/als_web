<template>
  <div>
    <!-- <router-view></router-view> -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
<!--    搜索-->
    <el-row :gutter="16">
      <el-col :span="24">
        <el-select v-model="currentSelectClassRoom" clearable :placeholder="$t(`message.student_management_choose_class`)">
          <el-option
            v-for="item in allClassNames"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
        <el-input
          :placeholder="$t(`message.student_management_enter_student_name`)"
          v-model="inputQueryInfo"
          clearable
          style="width: 200px;"
          @keydown.native.enter="queryClassInfo"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="queryClassInfo">{{ $t("message.student_management_search") }}</el-button>
<!--        student_management_search-->
      </el-col>
    </el-row>
<!--    添加学生按钮-->
    <el-row>
      <div style="display: flex">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addStudentDialog"
          :disabled="isAddStudentHandle"
        >{{ $t("message.student_management_add_student")}}
        </el-button>
        <el-link :underline="false" style="margin-left: 20px">
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content" style="line-height: 20px">{{$t("message.student_management_tips_first_paragraph")}}<br/>{{$t("message.student_management_tips_second_paragraph")}}<el-link :underline="false" @click="onClickGotoClassMan"><span style="color:#00a2ff;padding:5px">{{$t("message.student_management_tips_third_paragraph")}}</span></el-link>{{$t("message.student_management_tips_four_paragraph")}}</div>
            <i class="el-icon-warning-outline" style="color:#00a2ff;font-size:16px"></i>
          </el-tooltip>
        </el-link>
        <div style="flex:1;display:flex;justify-content:flex-end;align-items:center">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="exportStudent"
          >{{$t("message.student_management_export_student")}}
          </el-button>
        </div>
      </div>
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
          :label="$t(`message.student_management_tableData_number`)"
          width="60"
        ></el-table-column>
        <el-table-column align="center" prop="account" :label="$t(`message.student_management_tableData_user_account`)"></el-table-column>
        <el-table-column align="center" prop="name" :label="$t(`message.student_management_tableData_user_name`)"></el-table-column>
        <el-table-column align="center" :label="$t(`message.student_management_tableData_user_gender`)">
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">{{$t("message.student_management_tableData_user_sex_n")}}</span>
            <span v-if="scope.row.sex==2">{{$t("message.student_management_tableData_user_sex_nv")}}</span>
            <span v-if="scope.row.sex==0">{{$t("message.student_management_tableData_user_sex_secrecy")}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="birth" :label="$t(`message.student_management_tableData_user_borth`)"></el-table-column>
        <el-table-column align="center" prop="phone" :label="$t(`message.student_management_tableData_parent_phone`)"></el-table-column>
        <el-table-column align="center" prop="classes.className" :label="$t(`message.student_management_tableData_user_class`)"></el-table-column>
        <el-table-column align="center" prop="school" :label="$t(`message.student_management_tableData_user_school`)"></el-table-column>
        <el-table-column align="center" :label="$t(`message.student_management_tableData_user_operation`)" width="400">
          <template slot-scope="scope">
            <!--            <el-button-->
            <!--              v-if="isShowLearnReport"-->
            <!--              size="mini"-->
            <!--              type="primary"-->
            <!--              plain-->
            <!--              @click="handleLearnReport({index: scope.$index, row:scope.row})"-->
            <!--            >学情报告-->
            <!--            </el-button>-->
            <el-button
              v-if="scope.row.bcb==1"
              size="mini"
              type="success"
              plain
              @click="intoSuperBlockly"
            >{{$t("message.student_management_tableData_operation_enter_programming")}}
            </el-button>
            <el-button
              v-else
              size="mini"
              type="primary"
              plain
              @click="bindSuperblockly({index: scope.$index, row:scope.row})"
            >{{$t("message.student_management_tableData_operation_binding_programming")}}
            </el-button>
            <el-button
              size="mini"
              plain
              @click="showEditStuDialog({index: scope.$index, row:scope.row})"
            >{{$t("message.student_management_tableData_operation_edit")}}
            </el-button>
            <el-button
              size="mini"
              plain
              @click="showPwdStuDialog({index: scope.$index, row:scope.row})"
            >{{$t("message.student_management_tableData_operation_password")}}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="showDelStuDialog({index: scope.$index, row:scope.row})"
            >{{$t("message.student_management_tableData_operation_del")}}
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
        :total="studentInfoList"
      ></el-pagination>
    </el-row>
    <el-dialog
      :title="$t(`message.student_management_tableData_operation_editInformation`)"
      :visible.sync="studentEditDialogVisible"
      width="35%"
      :before-close="resetFormWithDialog"
    >
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form
            :model="ruleFormWithStudent"
            :rules="rulesWithStudent"
            ref="ruleFormWithStudent"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item :label="$t(`message.student_management_studentEditDialogVisible_student_name`)" prop="name">
              <el-input v-model="ruleFormWithStudent.name" :placeholder="$t(`message.student_management_enter_student_name`)"></el-input>
            </el-form-item>
            <el-form-item :label="$t(`message.student_management_tableData_parent_phone`)" prop="phone">
              <el-input v-model.number="ruleFormWithStudent.phone" :placeholder="$t(`message.student_management_studentEditDialogVisible_input_phone`)"></el-input>
            </el-form-item>
            <el-form-item :label="$t(`message.student_management_studentEditDialogVisible_student_sex`)" prop="sex">
              <el-radio-group v-model="ruleFormWithStudent.sex">
                <el-radio :label="1">{{$t("message.student_management_tableData_user_sex_n")}}</el-radio>
                <el-radio :label="2">{{$t("message.student_management_tableData_user_sex_nv")}}</el-radio>
                <el-radio :label="0">{{$t("message.student_management_tableData_user_sex_secrecy")}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t(`message.student_management_studentEditDialogVisible_class`)" prop="classes">
              <el-select
                v-model="ruleFormWithStudent.classes"
                :placeholder="$t(`message.student_management_studentEditDialogVisible_select_class`)"
                style="width: 100%;"
                ref="ruleFormWithStudent"
              >
                <el-option
                  v-for="item in allClassNames"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.className"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t(`message.student_management_tableData_user_borth`)" prop="birth">
              <el-date-picker
                type="date"
                :placeholder="$t(`message.student_management_studentEditDialogVisible_select_data`)"
                value-format="yyyy-MM-dd"
                v-model="ruleFormWithStudent.birth"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t(`message.student_management_tableData_user_school`)">
              <el-input v-model="ruleFormWithStudent.school" :placeholder="$t(`message.student_management_studentEditDialogVisible_input_school`)"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormWithDialog">{{$t("message.button_cancel")}}</el-button>
<!--        确定-->
        <el-button type="primary" @click="handleEditStudent" :loading="isLoadingWithEdit">{{$t("message.button_confirm")}}</el-button>
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
        <el-button @click="delDialogVisible = false">{{$t("message.button_cancel")}}</el-button>
        <el-button type="primary" @click="handleDelStudent" :loading="isLoadingWithDel">{{$t("message.button_confirm")}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t(`message.student_management_tableData_operation_password`)" :visible.sync="pwdDialogVisible" width="20%">
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
        <el-button @click="pwdDialogVisible = false">{{$t("message.button_cancel")}}</el-button>
        <el-button type="primary" @click="handleResetStudentPwd" :loading="isLoadingWithPwd">{{$t("message.button_confirm")}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t(`message.student_management_addStudentDialog_addStudent`)"
      :visible.sync="addDialogVisible"
      width="32%"
      :before-close="resetAddStuWithDialog"
    >
      <el-row>
        <el-col :span="22" :offset="1">
          <el-tabs type="border-card">
            <el-tab-pane :label="$t(`message.student_management_create_student`)">
              <div>
                <el-input :placeholder="currentClassName" :disabled="true"></el-input>
              </div>
              <div style="border:1px solid #409EFF;border-radius: 3px;margin-top: 15px;">
                <el-input
                  class="textarea"
                  type="textarea"
                  v-model="addStudentFromTextarea"
                  :autosize="{ minRows: 17, maxRows: 17}"
                  :placeholder="$t(`message.student_management_create_student_tips`)"

                ></el-input>
              </div>
<!--              确认后将自动添加学生，请注意查看！-->
              <div
                style="color:#409EFF;text-align: center;margin: auto;padding-top:20px;"
              >{{$t("message.student_management_create_student_tips2")}}
              </div>
              <div style="color:#409EFF;text-align: center;margin: auto">{{$t("message.student_management_create_student_tips3")}}</div>
              <div
                style="display: flex;justify-content: center;align-items: center;margin-top: 20px;"
              >
                <el-button
                  type="primary"
                  @click="handleAddStuFromNew"
                  :loading="isLoadingWithAdd"
                >{{$t("message.button_confirm")}}
                </el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t(`message.student_management_create_student_conversion`)">
              <div>
                <el-input :placeholder="currentClassName" :disabled="true"></el-input>
              </div>
              <div style="border:1px solid #409EFF;border-radius: 3px;margin-top: 15px;height:369px;overflow-y:auto">
                <el-table
                  ref="conSelectStudentTable"
                  :data="conSelectStudent"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  @selection-change="handleConStudentChange">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    :label="$t(`message.student_management_tableData_user_name`)"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="phone"
                    :label="$t(`message.student_management_create_student_phone`)">
                  </el-table-column>
                </el-table>
              </div>
              <div
                style="color:#409EFF;text-align: center;margin: auto;padding-top:20px;"
              >{{$t("message.student_management_create_student_tips2")}}
              </div>
              <div style="color:#409EFF;text-align: center;margin: auto">{{$t("message.student_management_create_student_tips3")}}</div>
              <div
                style="display: flex;justify-content: center;align-items: center;margin-top: 20px;"
              >
                <el-button
                  type="primary"
                  @click="handleAddStuFromCon"
                  :loading="isLoadingWithCon"
                >{{$t("message.button_confirm")}}
                </el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t(`message.student_management_create_school_student_phone`)">
              <div style="height: 544px;">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <div style="width: 100%;height: 484px;overflow:auto;border: 1px solid #eee">
                      <el-tree
                        :data="addStudentData"
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                        @node-click="handleNodeClick"
                      >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                          <span v-if="currentSelectClassRoom!=data.id">{{ node.label }}</span>
                          <span
                            v-if="currentSelectClassRoom==data.id"
                            style="color:#409EFF"
                          >{{ node.label }}</span>
                          <el-tag v-if="currentSelectClassRoom==data.id" size="mini">{{$t("message.student_management_create_school_student_current_class")}}</el-tag>
                        </span>
                      </el-tree>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      v-if="addStudentDivDisplayStatus==0"
                      style="height:484px;width:100%;border: 1px solid #eee;display: flex;flex-direction:column;justify-content:center;align-items: center;"
                    >
                      <img
                        src="../../../../static/images/base/robot_bg.jpg"
                        style="width: 165px;height: 150px;"
                      >
                      <h1 style="font-size: 11px;color:#888;font-weight: normal;">{{$t("message.student_management_create_school_student_select_student")}}</h1>
                    </div>
                    <div
                      v-if="addStudentDivDisplayStatus==2"
                      style="height:484px;width:100%;border: 1px solid #eee;display: flex;flex-direction:column;justify-content:center;align-items: center;"
                    >
                      <img
                        src="../../../../static/images/base/robot_bg.jpg"
                        style="width: 165px;height: 150px;"
                      >
                      <h1 style="font-size: 11px;color:#888;font-weight: normal;">{{$t("message.student_management_create_school_student_no_student")}}</h1>
                    </div>
                    <div
                      v-if="addStudentDivDisplayStatus==1"
                      style="width: 100%;height:484px;overflow-x:auto;overflow-y:auto;border: 1px solid #eee"
                    >
                      <el-table
                        ref="multipleTable"
                        :data="studentsWithClassData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleStuSelectChange"
                      >
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column :label="fromTreeSelectClassName" style="width: 100%;">
                          <template slot-scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
                <div
                  style="display: flex;justify-content: center;align-items: center;margin-top: 20px;"
                >
                  <el-button
                    type="primary"
                    @click="handleAddStuFromOld"
                    :loading="isLoadingWithAdd"
                  >{{$t("message.button_confirm")}}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
    import PubSub from "pubsub-js";
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import superBlockly from "../../../utils/superBlockly";
    import '../../../api/restfulapi';
    import {
        qs,
        getAllClass,
        getStudentList,
        resetStudentPwd,
        delStudentById,
        addStudent,
        exportExcel,
        batchChangeClass,
        editStudentById,
        getConsultingManagement,
        conConsultingManagement
    } from "@/api/api.js";
    import stringUtil from "../../../utils/stringUtil";
    import '../../../router/router'
    import $ from "jquery";
    import childHeader from '../../component/childHeader'
    import certGenDialog from '../../component/certGenDialog'

    export default {
        components: {"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name: this.$t(`message.student_header_title`), to: ''}],
                addStudentData: [
                    {
                        id: "all",
                        label: "全部学生",
                        children: [
                            {
                                id: "other",
                                label: "所有班级学生",
                                children: []
                            }
                        ]
                    }
                ],
                inputQueryInfo: "", // 搜索内容
                tableData: [], // 班级数据
                queryFromServer: [], // 服务器请求数据
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                requestTimeout: 2000, // 请求服务器超时时间
                getTableContentTimeoutId: null, // 模拟异步请求定时id
                isAddStudentHandle: true, // 是否可以添加学生
                currentSelectClassRoom: null, // 当前选中的班级
                allClassNames: [], // 当前学校所有已经创建的班级
                delDialogContent: "", // 删除对话框中显示的内容
                delDialogVisible: false, // 删除确认对话框显示状态
                isLoadingWithDel: false, // 删除确认对话框中确认按钮加载状态
                isLoadingWithEdit: false, // 编辑对话框中确认按钮加载状态
                currentDelStudentIndex: 0, // 当前要删除的学生index
                pwdDialogVisible: false, // 重置密码对话框显示状态
                isLoadingWithPwd: false, // 重置密码确认对话框中确认按钮加载状态
                addDialogVisible: false, // 添加学生对话框显示状态
                isLoadingWithAdd: false, // 添加学生确认对话框中确认按钮加载状态
                isLoadingWithCon: false, // 转化学生确认对话框中确认按钮加载状态
                currentResetStuId: "", // 当前要重置密码的学生id
                studentEditDialogVisible: false, // 编辑教师对话框是否显示
                addStudentFromTextarea: "", // 添加新的学生
                addStudentDivDisplayStatus: 0, // 显示从已注册学生中更换班级的面板内容 0->全部1->有学生2->无学生
                fromTreeSelectClassName: "", // 从树中点选班级的班级名称
                studentsWithClassData: [], // 获取学生信息通过指定班级
                multipleStudentSelection: [], // 获取某个班级中的指定学生
                changeStudentsClassId: "", // 要批量修改班级中学生的班级id
                pwdDialogContent: {title: "", account: "", nick: ""}, // 重置密码对话框中显示的内容
                ruleFormWithStudent: {
                    name: "",
                    phone: "",
                    classes: "",
                    school: "",
                    birth: "",
                    sex: "",
                    current: 0
                }, // 教师表单基本信息
                conSelectStudent: [], // 添加选择转化的学生
                currentSelectStudentWithCon: [], // 当前选中的待转化学生
                rulesWithStudent: {
                    // 学生表单验证
                    name: [{required: true, message: "请输入学生姓名", trigger: "blur"}],
                    phone: [
                        {required: true, message: "请输入手机号", trigger: "blur"},
                        {type: "number", message: "手机必须为数字值", trigger: "blur"}
                    ]
                },
                isShowLearnReport: false, // 是否显示学情报告按钮
                // addStudentFromTextarea:'',
                // rules: {
                //   addStudentFromTextarea: [
                //      { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字' }
                //   ],
                // }
            };
        },
        created() {
            PubSub.subscribe("superblockly_bind", (msg, data) => {
                if (data && data.indexOf("bindstu") != -1) {
                    try {
                        const userId = data.split("-")[0]
                        this.tableData.map(item => {
                            if (userId == item.id && item.bcb != 1) {
                                item.bcb = 1
                            }
                        })
                    } catch (e) {
                        promptUtil.LOG("superblockly_bind-err", e)
                    }
                }
            });
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/studyMan");
            if (this.$store.state.systemMenu && this.$store.state.systemMenu != '' && this.$store.state.systemMenu.length >= 0) {
                this.isShowLearnReport = this.$store.state.systemMenu.findIndex(item => item.url == 'studyMan') >= 0 ? true : false
            }
            const loading = promptUtil.loading(this);
            // 1.初始化需要获取学校当前拥有的所有班级数组
            getAllClass(
                qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    teacher_id: storageUtil.readTeacherInfo().id,
                    role_id: storageUtil.readTeacherInfo().school_admin
                })
            )
                .then(res => {
                    PubSub.publish("currentMenuIndex", "/studyMan");
                    loading.close();
                    if (res.code == SUCCESS_CODE) {
                        this.allClassNames = [];
                        if (res.data && res.data != '[]') {
                            res.data.forEach(item => {
                                const classObj = {classId: item.id, className: item.class_name};
                                this.allClassNames.push(classObj);
                            });
                        }
                        this.getAllStudentList(loading);
                    } else {
                        promptUtil.wait(this);
                    }
                })
                .catch(err => {
                    loading.close();
                    PubSub.publish("currentMenuIndex", "/studyMan");
                    promptUtil.LOG("getAllClass-err", err);
                });
        },
        methods: {
            intoSuperBlockly() {
                superBlockly.gotoSuperBlockly()
            },
            // 绑定编程吧账户
            bindSuperblockly(obj) {
                const accountInfo = {userId: obj.row.id}
                superBlockly.bindAccount('stu', this, accountInfo, promptUtil.loading(this))
            },
            // 点选转化学生的操作相应
            handleConStudentChange(val) {
                this.currentSelectStudentWithCon = val
            },
            // 当前选择的学生操作响应
            handleStuSelectChange(val) {
                this.multipleStudentSelection = val;
            },
            // 显示添加学生对话框
            addStudentDialog() {
                const loading = promptUtil.loading(this);
                getAllClass(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        teacher_id: storageUtil.readTeacherInfo().id,
                        role_id: storageUtil.readTeacherInfo().school_admin
                    })
                )
                    .then(res => {
                        this.isLoadingWithAdd = false;
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            const children = [];
                            if (res.data && res.data != '[]') {
                                res.data.forEach(item => {
                                    children.push({id: item.id, label: item.class_name});
                                });
                            }
                            this.addStudentData = [
                                {
                                    id: "all",
                                    label: "全部学生",
                                    children: [
                                        {id: "other", label: "所有班级学生", children: children}
                                    ]
                                }
                            ];
                            getConsultingManagement(qs.stringify({
                                sid: storageUtil.readTeacherInfo().school_id,
                                create_id: storageUtil.readTeacherInfo().id,
                                zh: 0
                            })).then(res => {
                                if (res.code == SUCCESS_CODE) {
                                    this.conSelectStudent = []
                                    if (res.data && res.data != '[]') {
                                        res.data.forEach(item => {
                                            const obj = {
                                                id: item.id,
                                                name: item.name,
                                                phone: item.phone
                                            }
                                            this.conSelectStudent.push(obj)
                                        })
                                    } else {
                                        // 暂无数据
                                    }
                                    this.addDialogVisible = true;
                                }
                            }).catch(err => {
                                this.isLoadingWithAdd = false;
                                loading.close();
                                promptUtil.LOG("getConsultingManagement-err", err);
                            })
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.isLoadingWithAdd = false;
                        loading.close();
                        promptUtil.LOG("getAllClass-err", err);
                    });
            },
            // 点击tree获取当前点选的班级
            handleNodeClick(data) {
                if (data.id == "all") {
                    this.addStudentDivDisplayStatus = 0;
                }
                if (data.id == "other") {
                    if (!data.children) {
                        this.addStudentDivDisplayStatus = 2;
                    }
                }
                if (data.id != "all" && data.id != "mine" && data.id != "other") {
                    // 排除全部学生、我的学生、其他学生
                    if (data.id == this.currentSelectClassRoom) {
                        return;
                    }
                    this.changeStudentsClassId = data.id;
                    const loading = promptUtil.loading(this);
                    getStudentList(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            class_id: data.id
                        })
                    )
                        .then(res => {
                            loading.close();
                            if (res.code == SUCCESS_CODE) {
                                if (res.data && res.data != '[]') {
                                    this.addStudentDivDisplayStatus = 1;
                                    this.fromTreeSelectClassName = data.label;
                                    this.studentsWithClassData = res.data;
                                } else {
                                    this.addStudentDivDisplayStatus = 2;
                                    this.studentsWithClassData = [];
                                }
                            } else {
                                promptUtil.wait(this);
                            }
                        })
                        .catch(err => {
                            loading.close();
                            promptUtil.LOG("getStudentList-err", err);
                        });
                }
            },
            // 获取学生信息
            getDataFromMutipleStudents() {
                if (this.multipleStudentSelection.length == 0) {
                    return null;
                } else {
                    const stuIdArr = [];
                    this.multipleStudentSelection.forEach(item => {
                        stuIdArr.push(item.id);
                    });
                    return stringUtil.array2String(stuIdArr, ",");
                }
            },
            // 批量更换学生所在班级
            handleAddStuFromOld() {
                // console.log(this.currentSelectClassRoom)
                // console.log(this.multipleStudentSelection)
                const studentsId = this.getDataFromMutipleStudents();
                if (studentsId == null) {
                    // null 表示没有选择学生
                    this.resetAddStuWithDialog();
                    return;
                }
                this.isLoadingWithAdd = true;
                batchChangeClass(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        class_id: this.currentSelectClassRoom,
                        student_id: studentsId,
                        user_id: storageUtil.readTeacherInfo().id
                    })
                )
                    .then(res => {
                        this.isLoadingWithAdd = false;
                        this.resetAddStuWithDialog();
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            const loading = promptUtil.loading(this);
                            this.getAllStudentList(loading);
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.isLoadingWithAdd = false;
                        promptUtil.LOG("batchChangeClass-err", err);
                        this.resetAddStuWithDialog();
                    });
            },
            // 根据数据生成错误列表html
            genErrorListHtml(conArray) {
                const offsetTime = 100
                conArray.forEach((item, index) => {
                    const content = item.data.name + "(" + item.data.phone + ")" + "添加失败，原因:" + item.msg
                    setTimeout(() => {
                        this.$notify.error({
                            title: '提示',
                            message: content,
                            duration: 0
                        });
                    }, offsetTime * (index))
                })
            },
            // 添加转化过来的学生相应
            handleAddStuFromCon() {
                if (this.genStudentIdsFromCon().length == 0) {
                    promptUtil.warning(this, "请选择要转化的学生");
                    return;
                }
                this.isLoadingWithCon = true
                conConsultingManagement(qs.stringify({
                    ids: JSON.stringify(this.genStudentIdsFromCon()),
                    class_id: this.currentSelectClassRoom
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        const allNum = res.data.length
                        let successNum = 0;
                        const failedConArray = []
                        res.data.map(item => {
                            if (item.code == 0) {
                                failedConArray.push(item)
                            }
                        })
                        successNum = allNum - failedConArray.length
                        if (failedConArray.length > 0) {
                            this.genErrorListHtml(failedConArray)
                        }
                        if (successNum == 0) { //
                            promptUtil.error(this, '学生转化失败');
                        } else {
                            promptUtil.success(this, '成功转化' + successNum + '名学生');
                        }
                        const loading = promptUtil.loading(this);
                        this.getAllStudentList(loading);
                    } else {
                        promptUtil.wait(res.msg);
                    }
                    this.resetAddStuWithDialog();
                }).catch(err => {
                    promptUtil.LOG('conConsultingManagement-err', err);
                    this.resetAddStuWithDialog();
                })
            },
            // 添加新建学生响应
            handleAddStuFromNew() {
                if (this.genStudentNamesFromTextArea() == "") {
                    promptUtil.warning(this, "请按要求填写学生姓名");
                    return;
                }
                let valdate = /[,，]/g;
                if (valdate.test(this.addStudentFromTextarea.trim())) {
                    promptUtil.warning(this, "只能输入汉字、英文、数字");
                    return;
                }
                this.isLoadingWithAdd = true;
                addStudent(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        class_id: this.currentSelectClassRoom,
                        name: this.genStudentNamesFromTextArea(),
                        user_id: storageUtil.readTeacherInfo().id
                    })
                )
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            const loading = promptUtil.loading(this);
                            this.getAllStudentList(loading);
                            this.resetAddStuWithDialog();
                            this.isLoadingWithAdd = false;
                        } else {
                            promptUtil.warning(this, res.msg);
                            this.isLoadingWithAdd = false
                        }

                    })
                    .catch(err => {
                        promptUtil.LOG("addStudent-err", err);
                        this.resetAddStuWithDialog();
                    });
            },
            // 显示编辑学生对话框
            showEditStuDialog(obj) {
                const moment = require("moment");
                this.ruleFormWithStudent.name = obj.row.name;
                this.ruleFormWithStudent.phone = obj.row.phone;
                this.ruleFormWithStudent.school = obj.row.school;
                this.ruleFormWithStudent.birth = obj.row.birth == null || obj.row.birth == "" ? "" : moment(obj.row.birth).toDate();
                this.ruleFormWithStudent.classes = obj.row.classes.className;
                this.ruleFormWithStudent.sex = obj.row.sex;
                this.ruleFormWithStudent.current = obj.index;
                this.studentEditDialogVisible = true;
            },
            // 显示重置密码对话框
            showPwdStuDialog(obj) {
                this.pwdDialogVisible = true;
                this.currentResetStuId = obj.row.id;
                this.pwdDialogContent.title = "确定要重置密码吗？重置密码 : 111000";
                this.pwdDialogContent.account = "学生账号 : " + obj.row.account;
                this.pwdDialogContent.nick = "学生姓名 : " + obj.row.name;
            },
            // 显示删除学生对话框
            showDelStuDialog(obj) {
                this.currentResetStuId = obj.row.id;
                this.delDialogVisible = true;
                this.delDialogContent = "您确定要删除 【 " + obj.row.name + " 】 吗？";
                this.currentDelStudentIndex =
                    obj.index + (this.currentPage - 1) * this.pageSize; // 为学生索引，不是学生id
            },
            // 学情报告响应函数
            handleLearnReport(obj) {
                this.$store.dispatch("saveSCreateRateId", {
                    status: 0 // 1 表示从任务管理进入创建报告  0 从学情报告进入创建报告
                });
                this.$router.push({path: ROUTER_REPORT_INFO + obj.row.id});
            },
            // 编辑学生响应函数
            handleEditStudent() {
                if (
                    this.ruleFormWithStudent.name == null ||
                    this.ruleFormWithStudent.name.trim() === ""
                ) {
                    promptUtil.warning(this, "请填写学生姓名");
                    return;
                }
                if (
                    this.ruleFormWithStudent.phone == null ||
                    (this.ruleFormWithStudent.phone + "").trim() == ""
                ) {
                    promptUtil.warning(this, "请填写家长电话");
                    return;
                } else {
                    let phoneValdate = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                    if (!phoneValdate.test(this.ruleFormWithStudent.phone)) {
                        promptUtil.warning(this, "手机号格式不正确");
                        return;
                    }
                }
                const moment = require("moment");
                // console.log(moment(this.ruleFormWithStudent.birth).format('YYYY-MM-DD'))
                if (
                    this.ruleFormWithStudent.name === this.queryFromServer[this.ruleFormWithStudent.current + (this.currentPage - 1) * this.pageSize].name &&
                    this.ruleFormWithStudent.phone ===
                    this.queryFromServer[
                    this.ruleFormWithStudent.current +
                    (this.currentPage - 1) * this.pageSize
                        ].phone &&
                    this.ruleFormWithStudent.school ===
                    this.queryFromServer[
                    this.ruleFormWithStudent.current +
                    (this.currentPage - 1) * this.pageSize
                        ].school &&
                    this.ruleFormWithStudent.classes ===
                    this.queryFromServer[
                    this.ruleFormWithStudent.current +
                    (this.currentPage - 1) * this.pageSize
                        ].classes.className &&
                    this.ruleFormWithStudent.sex ==
                    this.queryFromServer[
                    this.ruleFormWithStudent.current +
                    (this.currentPage - 1) * this.pageSize
                        ].sex &&
                    moment(this.ruleFormWithStudent.birth).format("YYYY-MM-DD") ===
                    this.queryFromServer[
                    this.ruleFormWithStudent.current +
                    (this.currentPage - 1) * this.pageSize
                        ].birth
                ) {
                    // console.log("内容一致，不需要提交");
                    this.studentEditDialogVisible = false;
                    return;
                }
                this.isLoadingWithEdit = true;
                const queryString = qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    class_id: this.getClassIdByName(this.ruleFormWithStudent.classes),
                    user_id: storageUtil.readTeacherInfo().id,
                    sex: this.ruleFormWithStudent.sex,
                    student_id: this.queryFromServer[
                    this.ruleFormWithStudent.current +
                    (this.currentPage - 1) * this.pageSize].id,
                    birth: moment(this.ruleFormWithStudent.birth).format("YYYY-MM-DD") == "Invalid date" ? null : moment(this.ruleFormWithStudent.birth).format("YYYY-MM-DD"),
                    name: this.ruleFormWithStudent.name,
                    phone: this.ruleFormWithStudent.phone,
                    school: this.ruleFormWithStudent.school
                });
                // console.log(moment(this.ruleFormWithStudent.birth).format('YYYY-MM-DD')==='Invalid date'?'A':'B')
                editStudentById(queryString)
                    .then(res => {
                        this.isLoadingWithEdit = false;
                        this.studentEditDialogVisible = false;
                        // console.log(res)
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            const formatBirth = moment(this.ruleFormWithStudent.birth).format(
                                "YYYY-MM-DD"
                            );
                            this.queryFromServer[this.ruleFormWithStudent.current + (this.currentPage - 1) * this.pageSize].name = this.ruleFormWithStudent.name.trim();
                            this.queryFromServer[
                            this.ruleFormWithStudent.current +
                            (this.currentPage - 1) * this.pageSize
                                ].phone = this.ruleFormWithStudent.phone + "";
                            this.queryFromServer[
                            this.ruleFormWithStudent.current +
                            (this.currentPage - 1) * this.pageSize
                                ].school = this.ruleFormWithStudent.school;
                            this.queryFromServer[
                            this.ruleFormWithStudent.current +
                            (this.currentPage - 1) * this.pageSize
                                ].sex = this.ruleFormWithStudent.sex;
                            this.queryFromServer[
                            this.ruleFormWithStudent.current +
                            (this.currentPage - 1) * this.pageSize
                                ].birth = formatBirth === "Invalid date" ? "" : formatBirth;
                            this.queryFromServer[
                            this.ruleFormWithStudent.current +
                            (this.currentPage - 1) * this.pageSize
                                ].classes = this.genStudentInfoStruct(
                                this.ruleFormWithStudent.classes
                            );
                            this.tableData = this.queryFromServer.slice(
                                (this.currentPage - 1) * this.pageSize,
                                this.pageSize + (this.currentPage - 1) * this.pageSize
                            );
                        } else {
                            if (res.code == ERROR_CODE) {
                                promptUtil.error(this, res.msg);
                            } else {
                                promptUtil.wait(this);
                            }
                        }
                    })
                    .catch(err => {
                        promptUtil.LOG("editStudentById-err", err);
                    });
            },
            // 删除学生响应函数
            handleDelStudent() {
                this.isLoadingWithDel = true;
                delStudentById(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        student_id: this.currentResetStuId,
                        user_id: storageUtil.readTeacherInfo().id
                    })
                )
                    .then(res => {
                        this.isLoadingWithDel = false;
                        this.delDialogVisible = false;
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            this.queryFromServer.splice(this.currentDelStudentIndex, 1);
                            this.tableData = this.queryFromServer.slice(
                                (this.currentPage - 1) * this.pageSize,
                                this.pageSize + (this.currentPage - 1) * this.pageSize
                            );
                        } else {
                            promptUtil.wait(res.msg);
                        }
                    })
                    .catch(err => {
                        this.isLoadingWithDel = false;
                        this.delDialogVisible = false;
                        promptUtil.LOG("delStudentById-err", err);
                    });
            },
            // 获取所有学生列表
            getAllStudentList(loading) {
                getStudentList(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        teacher_id: storageUtil.readTeacherInfo().id,
                        role_id: storageUtil.readTeacherInfo().school_admin
                    })
                )
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.queryFromServer = [];
                            if (res.data && res.data != '[]') {
                                this.queryFromServer = res.data;
                                this.tableData = this.queryFromServer.slice(
                                    (this.currentPage - 1) * this.pageSize,
                                    this.pageSize + (this.currentPage - 1) * this.pageSize
                                );
                            } else {
                                this.tableData = []
                            }
                        } else {
                            promptUtil.wait(this);
                        }
                        loading.close();
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("getAllStudentList-err", err);
                    });
            },
            // 重置学生密码
            handleResetStudentPwd() {
                this.isLoadingWithPwd = true;
                resetStudentPwd(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        student_id: this.currentResetStuId,
                        user_id: storageUtil.readTeacherInfo().id
                    })
                )
                    .then(res => {
                        this.isLoadingWithPwd = false;
                        this.pwdDialogVisible = false;
                        if (res.code == 1) {
                            promptUtil.success(this, res.msg);
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.isLoadingWithPwd = false;
                        this.pwdDialogVisible = false;
                        promptUtil.LOG("resetStudentPwd-err", err);
                    });
            },
            // 通过班级查询
            queryClassInfoByClass() {
                const loading = promptUtil.loading(this);
                if (this.currentSelectClassRoom && this.currentSelectClassRoom != '') {
                    getStudentList(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            class_id: this.currentSelectClassRoom,
                            teacher_id: storageUtil.readTeacherInfo().id
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
                                // 根据请求api返回值设置tableData
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
                            promptUtil.LOG("getStudentList-err", err);
                        });
                } else {
                    getStudentList(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            role_id: storageUtil.readTeacherInfo().school_admin,
                            teacher_id: storageUtil.readTeacherInfo().id
                        })
                    )
                        .then(res => {
                            if (res.code == SUCCESS_CODE) {
                                if (res.data && res.data != '[]') {
                                    this.queryFromServer = res.data;
                                } else {
                                    this.inputQueryInfo = "";
                                    this.currentPage = 1;
                                    this.queryFromServer = [];
                                }
                                this.tableData = this.queryFromServer.slice(
                                    (this.currentPage - 1) * this.pageSize,
                                    this.pageSize + (this.currentPage - 1) * this.pageSize
                                );
                                this.getTableContentTimeoutId = null;
                            } else {
                                promptUtil.wait(this);
                            }
                            loading.close();
                        })
                        .catch(err => {
                            loading.close();
                            promptUtil.LOG("getStudentList-err", err);
                        });
                }
            },
            // 查询触发函数
            queryClassInfo() {
                const loading = promptUtil.loading(this);
                getStudentList(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        teacher_id: storageUtil.readTeacherInfo().id,
                        role_id: storageUtil.readTeacherInfo().school_admin,
                        class_id: this.currentSelectClassRoom,
                        stu_name: this.inputQueryInfo.trim()
                    })
                )
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.inputQueryInfo = "";
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
                        promptUtil.LOG("queryStudentsByName-err", err);
                    });
            },
            // 重置编辑学生对话框
            resetFormWithDialog() {
                this.ruleFormWithStudent.name = "";
                this.ruleFormWithStudent.birth = "";
                this.ruleFormWithStudent.phone = "";
                this.ruleFormWithStudent.school = "";
                this.ruleFormWithStudent.classes = "";
                this.$refs.ruleFormWithStudent.resetFields();
                this.studentEditDialogVisible = false;
            },
            // 重置添加学生对话框
            resetAddStuWithDialog() {
                this.addStudentFromTextarea = "";
                this.isLoadingWithAdd = false;
                this.addDialogVisible = false;
                this.isLoadingWithCon = false;
                this.addStudentDivDisplayStatus = 0;
                this.fromTreeSelectClassName = "";
                this.studentsWithClassData = [];
                this.conSelectStudent = [];
                this.currentSelectStudentWithCon = [];
                this.multipleStudentSelection = [];
            },
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * 10;
            },
            // 当前页触发函数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                );
            },
            // 生成班级班级信息数据结构
            genStudentInfoStruct(classname) {
                let studentInfo = {className: "", classOwn: []};
                const classInfoItem = this.allClassNames.filter(object => {
                    return object.className === classname;
                });
                studentInfo.classOwn.push(classInfoItem[0]);
                studentInfo.className = classname;
                return studentInfo;
            },
            getClassIdByName(className) {
                const classItem = this.allClassNames.find(item => {
                    return item.className == className;
                });
                return classItem.classId;
            },
            // 将转化的学生姓名进行处理
            genStudentIdsFromCon() {
                let studentsArray = []
                studentsArray = this.currentSelectStudentWithCon.map(item => {
                    return item.id
                })
                return studentsArray
            },
            // 将新添加的学生姓名进行处理
            genStudentNamesFromTextArea() {
                let studentNames = "";
                function trims(str) {
                    return str.replace(/[ ]/g, "");
                }

                const studentsArray = this.addStudentFromTextarea
                    .split("\n")
                    .map(item => {
                        return trims(item).trim();
                    });
                studentsArray.forEach(item => {
                    if (item && item != "") { // 屏蔽掉回车的空行
                        studentNames = studentNames + item + ",";
                    }
                });
                return studentNames.substr(0, studentNames.length - 1);
            },
            // 导出学生
            exportStudent() {
                if (this.queryFromServer.length == 0) {
                    promptUtil.warning(this, '当前无学生信息')
                } else {
                    const targetParams = []
                    const params = {head: [], body: [], name: ''}
                    params.head = ['登录账号', '默认密码', '学生姓名', '学生性别', '出生日期', '家长电话', '班级', '学校']
                    params.name = storageUtil.readTeacherInfo().school_name + '—学生数据'
                    this.queryFromServer.map(item => {
                        const tmpArr = []
                        tmpArr.push(item.account)
                        tmpArr.push('111000')
                        tmpArr.push(item.name && item.name != '' ? item.name : "--")
                        if (item.sex == 1) { //
                            tmpArr.push('男')
                        } else if (item.sex == 2) {
                            tmpArr.push('女')
                        } else {
                            tmpArr.push('保密')
                        }
                        tmpArr.push(item.birth && item.birth != '' ? item.birth : "--")
                        tmpArr.push(item.phone && item.phone != '' ? item.phone : "--")
                        tmpArr.push(item.classes && item.classes.className && item.classes.className != '' ? item.classes.className : '--')
                        tmpArr.push(item.school && item.school != '' ? item.school : "--")
                        targetParams.push(tmpArr)
                    })
                    params.body = targetParams
                    exportExcel(qs.stringify({data: JSON.stringify(params)})).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, '数据准备完毕,等待下载中')
                            window.open(res.data, "_self")
                        }
                    }).catch(err => {
                        promptUtil.LOG('exportExcel-err', err)
                    })
                }
            },
            onClickGotoClassMan(){
              this.$router.push({path:'/classMan'})
            }
        },
        computed: {
            studentInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            },
            currentClassName: {
                get() {
                    const content = "当前班级 : ";
                    const className = this.allClassNames.filter(object => {
                        return object.classId === this.currentSelectClassRoom;
                    });
                    if (className.length === 0) {
                        return "";
                    } else {
                        return content + className[0].className;
                    }
                }
            }
        },
        watch: {
            // 控制添加学生是否可用
            currentSelectClassRoom: function (newVal) {
                if (newVal && newVal != null) {
                    this.isAddStudentHandle = false;
                } else {
                    this.isAddStudentHandle = true;
                }
                this.queryClassInfoByClass();
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
</style>
