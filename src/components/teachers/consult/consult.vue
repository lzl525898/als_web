<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card class="box-card" style="margin: 0;padding: 0">
      <el-row :gutter="10">
        <el-col :span="12">
          <div style="float: left;">
            {{$t(`message.consult_select_paid_status`)}}&nbsp;&nbsp;
            <el-select v-model="currentStatus" :placeholder="$t(`message.string_label_please_select`)" @change="currentChange" clearable>
              <el-option
                v-for="item in noAddStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <el-input v-model="keyWords" :placeholder="$t(`message.string_label_please_input_keyword`)" style="width: 25%;margin-left: 8px"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="onSearchSubmit">{{$t(`message.string_label_search`)}}</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display: flex;justify-content: flex-end;align-items: center">
            <el-button type="primary" icon="el-icon-sort" @click="conversion">{{$t(`message.string_label_conversion`)}}</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="onAddClick">{{$t(`message.string_label_add`)}}</el-button>
            <el-button type="primary" icon="el-icon-download" @click="onExportClick">{{$t(`message.string_label_export`)}}</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="bachHandDelStudent">{{$t(`message.string_label_delete`)}}</el-button>
            <!--              <el-button type="primary" icon="el-icon-download" @click="onSearchSubmit">导出</el-button>-->
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div style="height: 20px;"></div>
    <el-card class="box-card" style="margin: 0;padding: 0">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        border
        style="width: 100%"
        :header-row-style="{'color':'#409EFF'}"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50"></el-table-column>
        <el-table-column align="center" :label="$t(`message.consult_table_title_student_info`)" width="150" min-width="130">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;justify-content: flex-start">
              <div>
                <el-avatar :src="scope.row.avatarUrl" style="height: 32px;width: 32px;"></el-avatar>
              </div>
              <div
                style="margin-left: 5px;display: flex;flex-direction: column;justify-content: flex-start;text-align: left;width: 100%;">
                <div style="width: 100%;">
                  <div style="float: left">{{scope.row.name}}</div>

                  <div v-if="scope.row.sex==1">
                    <el-image
                      style="height: 16px;width: 12px;float: right;"
                      src="https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/sex/man.png"
                      fit="fill"></el-image>
                  </div>
                  <div v-else>
                    <el-image
                      style="height: 16px;width: 12px;float: right;"
                      src="https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/sex/woman.png"
                      fit="fill"></el-image>
                  </div>
                  <!--<div style="float: right;font-size: 12px;">{{scope.row.sex}}</div>-->
                </div>
                <div style="width: 100%;font-size: 12px;color:#939393">{{(scope.row.birth && scope.row.birth!="" ?
                  scope.row.birth : $t(`message.consult_table_row_not_given`))}}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t(`message.consult_table_title_student_tel`)">
          <template slot-scope="scope">
            <div>{{scope.row.phone1}}</div>
            <div>
              <span style="font-size: 12px;color:#939393">{{scope.row.phone2}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="parent" :label="$t(`message.consult_table_title_parent_name`)"></el-table-column>
        <el-table-column align="center" prop="school" :label="$t(`message.consult_table_title_school`)"></el-table-column>
        <el-table-column align="center" prop="class" :label="$t(`message.consult_table_title_grade`)"></el-table-column>
        <el-table-column align="center" :label="$t(`message.consult_table_title_age`)" min-width="60" width="60">
          <template slot-scope="scope">{{scope.row.age}}</template>
        </el-table-column>
        <el-table-column align="center" prop="source" :label="$t(`message.string_label_source`)"></el-table-column>
        <el-table-column align="center" :label="$t(`message.consult_table_title_intention`)">
          <template slot-scope="scope">
            <span v-if="scope.row.extent=='3'" style="color: #3fe366">{{$t(`message.string_label_high`)}}</span>
            <span v-if="scope.row.extent=='2'" style="color: #ff9900">{{$t(`message.string_label_middle`)}}</span>
            <span v-if="scope.row.extent=='1'" style="color: red">{{$t(`message.string_label_low`)}}</span>
            <span v-if="scope.row.extent=='0'" style="color: #8cc5ff">{{$t(`message.string_label_unclear`)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="collector" :label="$t(`message.consult_table_title_collector`)"></el-table-column>
        <el-table-column align="center" prop="referrer" :label="$t(`message.consult_table_title_referrer`)"></el-table-column>
        <el-table-column align="center" prop="adviser" :label="$t(`message.consult_table_title_adviser`)"></el-table-column>

        <el-table-column align="center" prop="remark" :label="$t(`message.string_label_remark`)"></el-table-column>
        <el-table-column align="center" prop="addStatus" :label="$t(`message.string_label_status`)">
          <template slot-scope="scope">
            <span v-if="scope.row.addStatus==1">{{$t(`message.consult_select_option_paid`)}}</span>
            <span v-else>{{$t(`message.consult_select_option_unpaid`)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t(`message.string_label_handle`)" min-width="140" width="140">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t(`message.string_label_edit`)" placement="bottom">
              <el-button plain size="small" type="primary" icon="el-icon-edit"
                         @click="onEditOneClick(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t(`message.string_label_delete`)" placement="bottom">
              <el-button plain size="small" type="danger" icon="el-icon-delete"
                         @click="onDelOneClick(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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
        <el-button type="primary" @click="handleDelStudentRoom" :loading="isLoadingWithDel">{{$t(`message.button_confirm`)}}</el-button>
      </span>
      </el-dialog>
      <el-dialog :title="$t(`message.dialog_header_title_prompt`)" :visible.sync="bachDelDialogVisible" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-question"></i>
          </el-col>
          <el-col :span="20">
            <span>{{delDialogContent}}</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button @click="bachDelDialogVisible = false">{{$t(`message.button_cancel`)}}</el-button>
        <el-button type="primary" @click="handleDelBachStudentRoom" :loading="isLoadingWithDel">{{$t(`message.button_confirm`)}}</el-button>
      </span>
      </el-dialog>
      <!--      步骤条提示框-->
      <el-dialog :title="$t(`message.consult_dialog_conversion_student`)" :visible.sync="stepDialogVisible" width="50%">
        <el-steps :active="active" finish-status="success" style="width: 80%;margin: 0 auto">
          <el-step :title="$t(`message.consult_dialog_select_class`)">
          </el-step>
          <el-step :title="$t(`message.consult_dialog_add_student`)"></el-step>
          <el-step :title="$t(`message.string_label_finish`)"></el-step>
        </el-steps>
        <el-row>

          <div style="width:100%;height:400px;display: flex; justify-content: center; ">
            <!--              align-items: center;-->
            <div v-show="stepSelectClass" style="margin-top: 150px" required="true">
              {{$t(`message.consult_select_label_title`)}}：
              <el-select v-model="selectAllStudent" clearable :placeholder="$t(`message.consult_select_label_title`)" @change="selectAllStudentChange">
                <el-option
                  v-for="item in selectAllStudentArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-show="stepSelectClassStudent" style="margin-top: 5px">
              <el-alert
                :title="$t(`message.consult_alert_content`)"
                type="warning"
                show-icon
                :closable="false"
                style="margin-top: 20px;margin-bottom: 30px;display: flex; justify-content: center;">
              </el-alert>
              <el-transfer v-model="currentClassStudent" :data="studentData" :titles="disabledcalssName"
                           @right-check-change="selectedStudent" @change="selectedStudentChange"
                           style="display: block !important;"></el-transfer>
            </div>
            <div v-show="submitSuccess">
              <div class="successfulOperation" >
                <p v-if="successOrNotStatus===1"><i class="el-icon-circle-check iconclass" ></i><br><span>{{$t(`message.consult_alert_success`)}}</span></p>
                <p v-if="successOrNotStatus===0"><i class="el-icon-circle-close iconclass" style="color: #f56c6c"></i><br><span style="color: #f56c6c">{{$t(`message.consult_alert_failed`)}}</span></p>
                <p v-if="successOrNotStatus===3"><i class="el-icon-circle-check iconclass" style="color: #e6a23c"></i><br><span style="color: #e6a23c">{{$t(`message.consult_alert_finish`)}}</span></p>
              </div>
              <div style="margin-top: 53px;background-color: #eee;width: 100%;height: 240px;overflow-y:auto">
                <p style="font-size: 18px;font-weight: bold;padding-top: 10px;padding-left: 10px">{{$t(`message.consult_conversion_student_status`)}}：</p>
                <div v-for="item in successStudentStatus">
                  <div class="studentSpan">
                    <p>
                      <span>{{$t(`message.consult_conversion_student_name`)}}：{{item.data.name}}</span>
                      &nbsp&nbsp
                      <span v-if="item.code==0" style="color: red">{{$t(`message.consult_conversion_status`)}}：{{item.msg}}</span>
                      <span v-else>{{$t(`message.consult_conversion_status`)}}：{{item.msg}}</span>
                    </p>
                    <!--                  <span style="font-size: 14px;font-weight: normal;display: block;width: 100%">{{item.data.name}}</span>&nbsp&nbsp<span v-if="item.code==0" style="color: red">{{item.msg}}</span><span v-else></span><br />-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-row>
        <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center;margin-bottom: 10px">
               <div v-if="active==1">
                 <el-button type="primary" @click="nextIconClick">{{$t(`message.string_label_next`)}}</el-button>
               </div>
               <div v-if="active==2">
                  <el-button type="primary" @click="studentSubmit" :disabled="subdisabled">{{$t(`message.string_label_submit`)}}</el-button>
                  <el-button type="primary" @click="preIconClick">{{$t(`message.string_label_previous`)}}</el-button>
               </div>
            <div v-if="active==3">
                  <el-button type="primary" @click="overSuccess">{{$t(`message.string_label_finish`)}}</el-button>
            </div>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-row type="flex" justify="center" class="mt" v-show="showType">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="consultInfoList"
        ></el-pagination>
      </el-row>
    </el-card>
    <el-dialog :title="$t(`message.consult_dialog_consultation_details`)" :visible.sync="showAddItem" width="820px" :before-close="resetAddItemWithDialog">
      <el-form :model="consultForm" :rules="consultRules" ref="consultForm">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item :label="$t(`message.consult_conversion_student_name`)" prop="name" :label-width="formLabelWidth">
              <el-input v-model="consultForm.name" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_name`)"></el-input>
            </el-form-item>
            <el-form-item :label="$t(`message.string_label_sex`)" :label-width="formLabelWidth">
              <el-radio v-model="consultForm.sex" label="1">{{$t(`message.string_label_male`)}}</el-radio>
              <el-radio v-model="consultForm.sex" label="2">{{$t(`message.string_label_female`)}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t(`message.consult_dialog_consultation_student_phone`)" prop="phone1" :label-width="formLabelWidth">
              <el-input v-model="consultForm.phone1" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_student_phone`)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <div style="margin-left: 10px;">
              <el-upload
                class="avatar-uploader"
                :action="postUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="consultForm.avatarUrl" :src="consultForm.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_parent_name`)" :label-width="formLabelWidth">
              <el-input v-model="consultForm.parent" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_parent_phone`)"
                        style="width:280px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_dialog_consultation_backup_phone`)" prop="phone2" :label-width="formLabelWidth">
              <el-input v-model="consultForm.phone2" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_backup_phone`)"
                        style="width:280px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_school`)" :label-width="formLabelWidth" prop="school">
              <el-input v-model="consultForm.school" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_school`)"
                        style="width:280px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_grade`)" :label-width="formLabelWidth">
              <el-input v-model="consultForm.class" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_grade`)"
                        style="width:280px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.string_label_birth`)" :label-width="formLabelWidth">
              <el-date-picker v-model="consultForm.birth" type="date" :placeholder="$t(`message.consult_dialog_please_input_birth`)" style="width: 280px">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.string_label_source`)" :label-width="formLabelWidth">
              <el-select v-model="consultForm.source" :placeholder="$t(`message.consult_dialog_please_input_source`)" style="width:280px">
                <el-option :label="$t(`message.consult_select_option_purchase`)" value="地推采单"></el-option>
                <el-option :label="$t(`message.consult_select_option_visited`)" value="门店到访"></el-option>
                <el-option :label="$t(`message.consult_select_option_intro`)" value="转介绍"></el-option>
                <el-option :label="$t(`message.consult_select_option_activity`)" value="活动转化"></el-option>
                <el-option :label="$t(`message.consult_select_option_Promote`)" value="网络推广"></el-option>
                <el-option :label="$t(`message.user_operational_other`)" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_intention`)" :label-width="formLabelWidth">
              <el-select v-model="consultForm.extent" :placeholder="$t(`message.consult_dialog_please_select_intention`)" style="width:280px">
                <el-option :label="$t(`message.string_label_high`)" value="3"></el-option>
                <el-option :label="$t(`message.string_label_middle`)" value="2"></el-option>
                <el-option :label="$t(`message.string_label_low`)" value="1"></el-option>
                <el-option :label="$t(`message.string_label_unclear`)" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_collector`)" :label-width="formLabelWidth">
              <el-select v-model="consultForm.collector.current" :placeholder="$t(`message.consult_dialog_please_select_collector`)" style="width:280px"
                         :disabled="disabled">
                <el-option
                  v-for="item in consultForm.collector.arrays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_referrer`)" :label-width="formLabelWidth">
              <el-input v-model="consultForm.produce" autocomplete="off" :placeholder="$t(`message.consult_dialog_please_input_referrer`)"
                        style="width:280px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t(`message.consult_table_title_adviser`)" :label-width="formLabelWidth">
              <el-select v-model="consultForm.adviser.current" :placeholder="$t(`message.consult_dialog_please_select_adviser`)" style="width:280px"
                         :disabled="disabled">
                <el-option
                  v-for="item in consultForm.adviser.arrays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t(`message.string_label_remark`)" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="consultForm.desc" :placeholder="$t(`message.consult_dialog_please_input_remark`)" style="width:645px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="18" :span="6">
            <el-button @click="resetAddItemWithDialog">{{$t(`message.button_cancel`)}}</el-button>
            <el-button type="primary" @click="onAddItemSubmit('consultForm')" :loading="isLoadingItem">{{$t(`message.button_confirm`)}}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import staticUtil from "../../../utils/staticUtil";
    import $ from "jquery"
    const moment = require("moment")
    import PubSub from "pubsub-js"
    import promptUtil from '../../../utils/promptUtil'
    import stringUtil from '../../../utils/stringUtil'
    import storageUtil from '../../../utils/storageUtil'
    import {
        qs,
        baseUrl,
        exportConsult,
        uploadAvatarUrl,
        addConsultingManagement,
        getConsultingManagement,
        getTeacherList,
        delConsultationStudent,
        batchDelConsultationStudent,
        editConsultingManagement,
        getConsultingManagementInformation,
        getAllClass,
        getStudentList,
        conConsultingManagement,
    } from '../../../api/api'
    import childHeader from '../../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name: '咨询管理', to: ''}],
                addEditStatus: '',
                disabled: false,
                editObj: {},
                editSendId: '',
                bachDelDialogVisible: false,
                sendDeleteArrayId: [],
                isLoadingWithDel: false, // 删除学员按钮是否为加载状态
                delDialogContent: "", // 删除对话框中显示的内容
                delDialogVisible: false,//删除对话框
                batchDelId: [],//批量删除id
                getClass: [],//获取所有课程顾问
                getAllTeacher: [],//获取所有教师
                postUrl: uploadAvatarUrl, // 提交头像的url
                showAddItem: false, // 是否显示添加/编辑对话框
                isLoadingItem: false, // 添加/编辑响应时状态
                showType: false, // 是否显示分页
                pageSize: 20, // 分页页码大小
                currentPage: 1, // 分页当前页码
                keyWords: '', // 查询关键字
                saveDelStudentId: '',//删除学员id
                saveReceptionId: 0,//删除前台id
                multipleSelection: [], // 选择多个item的内容容器
                tableData: [], // 列表数据
                queryFromServer: [],// 列表数据从服务器返回
                consultForm: {//表单
                    name: '',
                    sex: '1',
                    avatarUrl: '',
                    class: "",
                    birth: '',
                    phone1: '', // 学员电话
                    phone2: '', // 备用电话
                    school: '',
                    parent: '',
                    addStatus: '', // 状态 0表示未转化 1 表示转化
                    produce: '',//介绍人
                    classAdviser: '',//课程顾问
                    // collector: '',// 采单人
                    collector: {current: "", arrays: []}, // 采单人
                    adviser: {current: "", arrays: []}, // 课程顾问
                    source: '', // 1地推采单  2门店到访  3转介绍  4活动转化  5网络推广  0其他
                    extent: '', // 1高2中3低0不明确、
                    desc: '' // 备注
                },
                consultRules: {
                    name: [
                        {required: true, message: this.$t(`message.consult_dialog_please_input_name`), trigger: 'blur'},
                        {min: 2, max: 5, message: this.$t(`message.consult_rules_student_name`)}
                    ],
                    phone1: [
                        {required: true, message: this.$t(`message.consult_rules_phone`)},
                        {pattern: /^1[34578]\d{9}$/, message: this.$t(`message.consult_rules_phone`)}
                    ],
                    phone2: [
                        {required: false, message: this.$t(`message.consult_rules_phone`)},
                        {pattern: /^1[34578]\d{9}$/, message: this.$t(`message.consult_rules_phone`)}
                    ],
                },
                formLabelWidth: '100px',
                noAddStatus: [
                  {value: 'all', label: this.$t(`message.string_label_all`)},
                  {value: '0', label: this.$t(`message.consult_select_option_unpaid`)},
                  {value: '1', label: this.$t(`message.consult_select_option_paid`)}
                ],
                currentStatus: null,
                stepDialogVisible: false,
                active: 1,
                stepSelectClass: true,//select查询班级
                stepSelectClassStudent: false,//穿梭框
                submitSuccess: false,//step第三步完成
                selectAllStudentArray: [],
                selectAllStudent: '',
                currentSelectClass: '',//当前选择的班级
                currentSelectName: '',//当前选择班级的名字
                currentClassStudent: [],//穿梭框中的学生
                disabledcalssName: [this.$t(`message.consult_array_select_student`)],
                studentData: [],
                addStudentArray: [],//右侧框选中的学生
                successStudentStatus: [],
                subdisabled: true,
                successOrNotStatus:'',
            }
        },
        watch:{
          '$i18n.locale': function () {
            this.noAddStatus = [
              {value: 'all', label: this.$t(`message.string_label_all`)},
              {value: '0', label: this.$t(`message.consult_select_option_unpaid`)},
              {value: '1', label: this.$t(`message.consult_select_option_paid`)}
            ]
            this.disabledcalssName = [this.$t(`message.consult_array_select_student`)]
            this.consultRules = {
              name: [
                {required: true, message: this.$t(`message.consult_dialog_please_input_name`), trigger: 'blur'},
                {min: 2, max: 5, message: this.$t(`message.consult_rules_student_name`)}
              ],
                phone1: [
                {required: true, message: this.$t(`message.consult_rules_phone`)},
                {pattern: /^1[34578]\d{9}$/, message: this.$t(`message.consult_rules_phone`)}
              ],
                phone2: [
                {required: false, message: this.$t(`message.consult_rules_phone`)},
                {pattern: /^1[34578]\d{9}$/, message: this.$t(`message.consult_rules_phone`)}
              ],
            }
          },
          addStudentArray(newVal,oldVal){
            this.subdisabled = newVal.length<=0
          },
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/consult");
            this.initData();

        },
        methods: {
            // 初始化数据
            initData() {
                this.getStudentTableList()
            },
            // 点击导出按钮触发
            onExportClick() {
              if(this.multipleSelection.length<=0){
                promptUtil.warning(this,this.$t(`message.consult_prompt_export_result`))
                return
              }
              const ids = []
              this.multipleSelection.map(item => ids.push(item.id))
              const idsString = stringUtil.array2String(ids, ",")
              let url = baseUrl
              url += "/school/school_get_msg_out?"
              url += "file_name=" + storageUtil.readTeacherInfo().school_name + "-" + this.$t(`message.consult_prompt_info`)
              url += "&school_id=" + storageUtil.readTeacherInfo().school_id
              url += "&ids=" + idsString
              // promptUtil.LOG("url", url)
              window.open(url, "_self")
              promptUtil.success(this, this.$t(`message.string_label_export_success`))
            },
            // 点击添加按钮触发
            onAddClick() {
                this.resetAddItemWithDialog()
                try {
                    this.$refs['consultForm'].resetFields();
                } catch (err) {
                }
                this.addEditStatus = false
                this.showAddItem = true
                this.disabled = false
                this.getAllTeacher = []
                this.getClass = []
                //获取所有教师
                getTeacherList(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.getAllTeacher = []
                        if (res.data && res.data != '[]') {
                            res.data.forEach(item => {
                                let teacherObj = {label: item.nick, value: item.id}
                                this.getAllTeacher.push(teacherObj)
                                this.getClass.push(teacherObj)
                            })
                            this.consultForm.collector.arrays = this.getAllTeacher
                            this.consultForm.adviser.arrays = this.getClass
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getTeacherList-err', err)
                })
            },
            //点击转化按钮
            conversion() {
                this.ResetStudentClassInformation()
                this.stepDialogVisible = true
                this.getAllClassMethods()
                this.active = 1
                this.stepSelectClass = true
                this.stepSelectClassStudent = false
                this.submitSuccess = false
            },
            nextIconClick() {
                this.subdisabled=true
                if (this.selectAllStudent == "") {
                    promptUtil.warning(this, this.$t(`message.consult_select_label_title`))
                    return
                }
                this.addStudentArray = []
                this.ResetStudentClassInformation()
                if (this.active++ > 4) this.active = 5;
                this.stepSelectClass = false
                this.stepSelectClassStudent = true
                this.currentShowChangeStudent(this.active)
            },
            preIconClick() {
                this.disabledcalssName = []
                this.disabledcalssName = [this.$t(`message.consult_array_select_student`)]
                this.ResetStudentClassInformation()
                if (this.active-- <= 1) this.active = 1;
                this.stepSelectClass = true
                this.stepSelectClassStudent = false
                this.currentShowChangeStudent(this.active)
            },
            ResetStudentClassInformation() {
                this.selectAllStudent = ''
                this.selectAllStudentArray = []
                this.currentClassStudent = []
                this.studentData = []
            },
            selectedStudentChange(val,direction,arr) {
                if(direction=='left'){
                let leftArray = this.addStudentArray
                let targetArray = arr
                let rightArray = []
                let leg = leftArray.length
                for(let i=leg-1;i>=0;i--){
                  for(let j=0;j<targetArray.length;j++){
                    if(leftArray[i]){
                      if(leftArray[i]==targetArray[j]){
                        rightArray.push(leftArray[i])
                        leftArray.splice(i, 1)
                        continue;
                      }
                    }
                  }
                }
                this.addStudentArray = leftArray
              }
            },
            //选中的学生
            selectedStudent(val) {
              this.addStudentArray = val
                // if (this.addStudentArray && this.addStudentArray.length > 0) {
                //     this.subdisabled = false
                // } else {
                //     this.subdisabled = true
                // }
            },
            //点击select的值
            selectAllStudentChange(val) {
                this.currentSelectClass = val
                if (this.selectAllStudentArray.length != 0) {
                    this.selectAllStudentArray.forEach(item => {
                        if (item.value === this.currentSelectClass) {
                            this.currentSelectName = item.label
                            this.disabledcalssName.push(item.label)
                        }
                    })
                }
            },
            //获取所有班级
            getAllClassMethods() {
                this.selectAllStudentArray = []
                this.selectAllStudent = ""
                getAllClass(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    teacher_id: storageUtil.readTeacherInfo().id,
                    role_id: 1
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            res.data.forEach(item => {
                                const obj = {label: item.class_name, value: item.id}
                                this.selectAllStudentArray.push(obj)
                            })
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getAllClassMethods-err', err)
                })
            },
            //获取所有学生
            getClassAllStudent() {
                getConsultingManagement(qs.stringify({
                    sid: storageUtil.readTeacherInfo().school_id,
                    create_id: storageUtil.readTeacherInfo().id,
                    zh: 0,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            res.data.forEach(item => {
                                const obj = {key: item.id, label: item.name + '　　　　　　'}
                                this.studentData.push(obj)
                            })
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getSystematicStatistics-err', err)
                })
            },
            currentShowChangeStudent(active) {
                switch (active) {
                    case 1:
                        this.getAllClassMethods()
                        break;
                    case 2:
                        this.getClassAllStudent()
                        break;
                    case 3:
                        break;
                    default:
                        this.getAllClassMethods()
                }
            },
            //提交
            studentSubmit() {
                conConsultingManagement(qs.stringify({
                    ids: JSON.stringify(this.addStudentArray),
                    class_id: this.currentSelectClass
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, res.msg)
                        this.stepSelectClassStudent = false
                        this.submitSuccess = true
                        this.active = 3
                        if (res.data && res.data != '[]') {
                            this.successStudentStatus = res.data
                            let successArray=[]
                            let loserArray=[]
                            this.successStudentStatus.forEach(item=>{
                                if(item.code===1){
                                    successArray.push(item)
                                }else if(item.code===0){
                                    loserArray.push(item)
                                }
                            })
                            if(successArray.length=== this.successStudentStatus.length){
                                this.successOrNotStatus=1
                            }else if(loserArray.length=== this.successStudentStatus.length){
                                this.successOrNotStatus=0
                            }else{
                                this.successOrNotStatus=3
                            }
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getSystematicStatistics-err', err)
                })
            },
            //完成
            overSuccess() {
                this.stepDialogVisible = false
                this.queryFromServer = []
                this.handleCurrentChange(1)
                this.getStudentTableList()
            },
            // 编辑单个item
            onEditOneClick(index, row) {
                this.editObj = {index: index, row: row}
                this.editSendId = row.id
                const loading = promptUtil.loading(this)
                getConsultingManagementInformation(qs.stringify({
                    id: this.editSendId
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.consultForm.name = res.data.name,
                                this.consultForm.sex = res.data.sex,
                                this.consultForm.avatarUrl = res.data.header,
                                this.consultForm.class = res.data.class_name,
                                this.consultForm.birth = res.data.birthday === "0000-00-00" ? "" : res.data.birthday,
                                this.consultForm.phone1 = res.data.phone,
                                this.consultForm.phone2 = res.data.phone2,
                                this.consultForm.school = res.data.school_name,
                                this.consultForm.parent = res.data.parent_name,
                                this.consultForm.produce = res.data.jieshao_name,
                                this.consultForm.classAdviser = res.data.teacher_name,
                                this.consultForm.collector.current = res.data.cd_name,
                                this.consultForm.adviser.current = res.data.teacher_name,
                                this.consultForm.source = res.data.comefrom,
                                this.consultForm.addStatus = res.data.zh,
                                this.consultForm.extent = res.data.level == 3 ? this.$t(`message.string_label_high`) : (res.data.level == 2 ? this.$t(`message.string_label_middle`) : (res.data.level == 1 ? this.$t(`message.string_label_low`) : this.$t(`message.string_label_unclear`))),
                                this.consultForm.desc = res.data.beizhu
                            this.disabled = true
                            this.addEditStatus = true
                            this.showAddItem = true
                        } else {
                            promptUtil.warning(this, this.$t(`message.prompt_warn_waiting`))
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                    loading.close()
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG('getConsultingManagementInformation-err', err)
                })
            },
            // 添加项目并提交
            onAddItemSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addEditStatus === false) {
                            this.isLoadingItem = true
                            addConsultingManagement(qs.stringify({
                                    sid: storageUtil.readTeacherInfo().school_id,
                                    create_id: storageUtil.readTeacherInfo().id,
                                    create_name: storageUtil.readTeacherInfo().real_name,
                                    sex: this.consultForm.sex,
                                    name: this.consultForm.name,
                                    phone: this.consultForm.phone1,
                                    phone2: this.consultForm.phone2,
                                    parent_name: this.consultForm.parent,
                                    school_name: this.consultForm.school,
                                    class_name: this.consultForm.class,
                                    beizhu: this.consultForm.desc,
                                    birthday: this.consultForm.birth == '' ? "" : moment(this.consultForm.birth.getTime()).format('YYYY-MM-DD'),
                                    comefrom: this.consultForm.source,
                                    teacher_name: this.consultForm.classAdviser,
                                    jieshao_name: this.consultForm.produce,
                                    header: this.consultForm.avatarUrl,// JSON.stringify(this.consultForm.avatarUrl),
                                    level: this.consultForm.extent,
                                    cd_id: this.consultForm.collector.current,
                                    teacher_id: this.consultForm.adviser.current
                                }
                            )).then(res => {
                                if (res.code == SUCCESS_CODE) {
                                    promptUtil.success(this, this.$t(`message.prompt_add_finish`))
                                    this.isLoadingItem = false
                                    this.showAddItem = false
                                    // this.resetAddItemWithDialog()
                                    this.$refs[formName].resetFields();
                                    this.queryFromServer = []
                                    this.getStudentTableList()
                                } else if (res.code == ERROR_CODE) {
                                    promptUtil.error(this, res.msg)
                                } else {
                                    promptUtil.wait(this)
                                }
                            }).catch(err => {
                                promptUtil.LOG('addConsultingManagement-err', err)
                            })
                        } else {
                            editConsultingManagement(qs.stringify({
                                    id: this.editSendId,
                                    sid: storageUtil.readTeacherInfo().school_id,
                                    create_id: storageUtil.readTeacherInfo().id,
                                    create_name: storageUtil.readTeacherInfo().real_name,
                                    sex: this.consultForm.sex,
                                    name: this.consultForm.name,
                                    phone: this.consultForm.phone1,
                                    phone2: this.consultForm.phone2,
                                    parent_name: this.consultForm.parent,
                                    school_name: this.consultForm.school,
                                    class_name: this.consultForm.class,
                                    beizhu: this.consultForm.desc,
                                    birthday: this.consultForm.birth,
                                    comefrom: this.consultForm.source,
                                    teacher_name: this.consultForm.classAdviser,
                                    jieshao_name: this.consultForm.produce,
                                    header: this.consultForm.avatarUrl,// JSON.stringify(this.consultForm.avatarUrl),
                                    level: this.consultForm.extent,
                                    cd_id: this.consultForm.collector.current,
                                    teacher_id: this.consultForm.adviser.current
                                }
                            )).then(res => {
                                if (res.code == SUCCESS_CODE) {
                                    this.isLoadingItem = false
                                    this.showAddItem = false
                                    const obj = {
                                        name: res.data.name,
                                        sex: res.data.sex,
                                        avatarUrl: res.data.header,
                                        class: res.data.class_name,
                                        birth: res.data.birthday,
                                        phone1: res.data.phone,
                                        phone2: res.data.phone2,
                                        school: res.data.school_name,
                                        parent: res.data.parent_name,
                                        referrer: res.data.jieshao_name,
                                        collector: res.data.cd_name,
                                        adviser: res.data.teacher_name,
                                        source: res.data.comefrom,
                                        extent: res.data.level,
                                        remark: res.data.beizhu,
                                        addStatus: res.data.zh,
                                        age: res.data.age,
                                        id: res.data.id
                                    }
                                    const offset = (this.currentPage - 1) * this.pageSize
                                    this.queryFromServer[this.editObj.index + offset] = obj
                                    this.handleCurrentChange(this.currentPage)
                                } else if (res.code == ERROR_CODE) {
                                    promptUtil.error(this, res.msg)
                                } else {
                                    promptUtil.wait(this)
                                }
                            }).catch(err => {
                                promptUtil.LOG('editConsultingManagement-err', err)
                            })
                        }
                    } else {
                        promptUtil.warning(this, this.$t(`message.prompt_right_input_info`))
                        return false;
                    }
                })
            },
            //查询
            onSearchSubmit() {
                const loading = promptUtil.loading(this);
                getConsultingManagement(qs.stringify({
                    sid: storageUtil.readTeacherInfo().school_id,
                    create_id: storageUtil.readTeacherInfo().id,
                    zh: this.currentStatus,
                    name: this.keyWords
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.queryFromServer = []
                        if (res.data && res.data != '[]') {
                            for (var i = 0; i < res.data.length; i++) {
                                const obj = {
                                    name: res.data[i].name,
                                    sex: res.data[i].sex,
                                    avatarUrl: res.data[i].header,
                                    class: res.data[i].class_name,
                                    birth: res.data[i].birthday,
                                    phone1: res.data[i].phone,
                                    phone2: res.data[i].phone2,
                                    school: res.data[i].school_name,
                                    parent: res.data[i].parent_name,
                                    referrer: res.data[i].jieshao_name,
                                    collector: res.data[i].cd_name,
                                    adviser: res.data[i].teacher_name,
                                    source: res.data[i].comefrom,
                                    extent: res.data[i].level,
                                    remark: res.data[i].beizhu,
                                    age: res.data[i].age,
                                    addStatus: res.data[i].zh,
                                    id: res.data[i].id
                                }
                                this.queryFromServer.push(obj)
                                this.tableData = this.queryFromServer
                            }
                            this.keyWords = ""
                        }
                    } else if (res.code == ERROR_CODE_) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this, res.msg)
                    }
                    loading.close();
                }).catch(err => {
                    promptUtil.timeout(this, res.msg)
                })
            },
            //状态查询
            currentChange(event) {
                this.currentStatus = event
                const loading = promptUtil.loading(this);
                getConsultingManagement(qs.stringify({
                    sid: storageUtil.readTeacherInfo().school_id,
                    create_id: storageUtil.readTeacherInfo().id,
                    zh: this.currentStatus
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.queryFromServer = []
                        if (res.data && res.data != '[]') {
                            this.currentPage = 1
                            this.tableList(res.data)
                        }
                        this.handleCurrentChange(this.currentPage)
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                    loading.close();
                }).catch(err => {
                    promptUtil.LOG('getConsultingManagement-err', err)
                })

            },
            // 删除单个item
            onDelOneClick(index, row) {
                this.saveDelStudentId = row.id;
                this.saveReceptionId = index + (this.currentPage - 1) * this.pageSize;
                this.delDialogVisible = true;
                this.delDialogContent = this.$t(`message.consult_dialog_content_del`) + " 【 " + row.name + " 】？";
            },
            //删除dialog中的确定按钮
            handleDelStudentRoom() {
                this.isLoadingWithDel = true;
                delConsultationStudent(
                    qs.stringify({
                        id: this.saveDelStudentId
                    })
                )
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            this.isLoadingWithDel = false;
                            this.delDialogVisible = false;
                            this.queryFromServer.splice(this.saveReceptionId, 1);
                            if (this.currentPage > Math.ceil(this.queryFromServer.length / this.pageSize)) {
                                this.currentPage--;
                            }
                            this.handleCurrentChange(this.currentPage)
                        } else if (res.code == ERROR_CODE) {
                            promptUtil.error(this, res.msg);
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.isLoadingWithDel = false;
                        this.delDialogVisible = false;
                        promptUtil.LOG('delConsultationStudent-err', err);
                    });

            },
            // 点击批量删除触发函数
            bachHandDelStudent() {
                if (this.multipleSelection.length == 0) {
                    promptUtil.warning(this, this.$t(`message.consult_dialog_content_del_student`))
                } else {
                    this.bachDelDialogVisible = true;
                    this.delDialogContent = this.$t(`message.consult_dialog_content_enter_del_student`);
                }
            },
            //批量删除中dialog中的确定按钮
            handleDelBachStudentRoom() {
                this.isLoadingWithDel = true;
                batchDelConsultationStudent(qs.stringify({
                    id: JSON.stringify(this.sendDeleteArrayId),
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, this.$t(`message.prompt_delete_finish`))
                        this.isLoadingWithDel = false;
                        this.bachDelDialogVisible = false;
                        for (var i = 0; i < this.multipleSelection.length; i++) {
                            const index = this.queryFromServer.findIndex(item => item.id == this.multipleSelection[i].id)
                            this.queryFromServer.splice(index, 1)
                        }
                        this.handleCurrentChange(1)
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    this.isLoadingWithDel = false;
                    this.bachDelDialogVisible = false;
                    promptUtil.LOG('batchDelConsultationStudent-err', error)
                })
            },
            // 接续数据到tabledata中
            readDataToTableData() {
                promptUtil.LOG("this.consultForm", this.consultForm)
            },
            // 根据点选checkbox来获取对应index
            handleSelectionChange(val) {
                this.multipleSelection = []
                this.sendDeleteArrayId = []
                this.multipleSelection = val;
                this.multipleSelection.forEach(item => {
                    this.sendDeleteArrayId.push(item.id)
                })
            },
            handleAvatarSuccess(res, file) {
                this.consultForm.avatarUrl = res //URL.createObjectURL(file.raw);   file.response
            },
            // 限制图片格式
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/png" || file.type === "image/jpeg";
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isJPG) {
                    this.$message.error(this.$t(`message.consult_upload_image_type`));
                }
                if (!isLt1M) {
                    this.$message.error(this.$t(`message.consult_upload_image_size`));
                }
                return isJPG && isLt1M;
            },
            // 重置添加Item对话框
            resetAddItemWithDialog() {
                this.consultForm = {
                    name: '',
                    sex: '1',
                    avatarUrl: '',
                    class: "",
                    birth: '',
                    phone1: '', // 学员电话
                    phone2: '', // 备用电话
                    school: '',
                    parent: '',
                    addStatus: '',
                    produce: '',//介绍人
                    classAdviser: '',//课程顾问
                    // collector: '',// 采单人
                    collector: {current: "", arrays: []}, // 采单人
                    adviser: {current: "", arrays: []}, // 课程顾问
                    source: '', // 1地推采单  2门店到访  3转介绍  4活动转化  5网络推广  0其他
                    extent: '', // 1高2中3低0不明确、
                    desc: '' // 备注
                }
                try {
                    this.$refs['consultForm'].resetFields();
                } catch (err) {
                }
                this.showAddItem = false
            },
            // 根据页码获取table数据
            handleCurrentChange(page) {
                if (this.queryFromServer.length > this.pageSize) {
                    this.showType = true
                } else {
                    this.showType = false
                }
                this.currentPage = page;
                //当前页面需要显示得条数=所有条数
                this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                );
                // console.log(" this.tableData", this.tableData)
            },
            getStudentTableList() {
                //获取表格信息
                getConsultingManagement(qs.stringify({
                    sid: storageUtil.readTeacherInfo().school_id,
                    create_id: storageUtil.readTeacherInfo().id,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.tableList(res.data)
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getConsultingManagement-err', err)
                })
            },
            tableList(val) {
                for (var i = 0; i < val.length; i++) {
                    const obj = {
                        name: val[i].name,
                        sex: val[i].sex,
                        avatarUrl: val[i].header,
                        class: val[i].class_name,
                        birth: val[i].birthday == "0000-00-00" ? "" : val[i].birthday,
                        phone1: val[i].phone,
                        phone2: val[i].phone2,
                        school: val[i].school_name,
                        parent: val[i].parent_name,
                        referrer: val[i].jieshao_name,
                        collector: val[i].cd_name,
                        adviser: val[i].teacher_name,
                        source: val[i].comefrom,
                        extent: val[i].level,
                        remark: val[i].beizhu,
                        age: val[i].age,
                        addStatus: val[i].zh,
                        id: val[i].id,
                    }
                    this.queryFromServer.push(obj)
                    this.handleCurrentChange(this.currentPage)
                }
            },
        },
        computed: {
            consultInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            }
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

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .lh {
    line-height: 50px;
    font-weight: bold;
  }

  .bg-purple-dark {
    background: #eee;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-box {
    margin: 15px 15px;
    float: left;
  }

  .el-card {
    padding: 10px 10px 10px 10px;
  }

  .mt {
    margin-top: 20px;
  }

  .avatar-uploader {
    width: 162px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 162px;
    height: 162px;
    line-height: 162px;
    text-align: center;
  }

  .avatar {
    width: 162px;
    height: 162px;
    display: block;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .preIcon, .nextIcon {
    font-size: 30px;
    cursor: pointer;
    color: #C0C4CC;
    padding-top: 150px;
  }

  .preIcon:active, .preIcon:hover {
    color: #00a2ff;
  }

  .nextIcon:active, .nextIcon:hover {
    color: #00a2ff;
  }

  .el-checkbox:last-of-type {
    margin-left: 0 !important;
  }

  /*.el-icon-circle-check {*/
  /*  color: #3fe366;*/
  /*  font-size: 70px !important;*/
  /*  text-align: center;*/
  /*}*/
  .iconclass{
    color: #3fe366;
    font-size: 70px !important;
    text-align: center;
  }

  .successfulOperation {
    margin-top: 20px;
    margin-left: 230px;
  }

  .successfulOperation span {
    padding-top: 20px;
    color: #3fe366;
    font-size: 20px;
    margin-left: -5px;
  }

  .studentSpan {
    font-size: 14px;
    font-weight: normal;
    padding-left: 10px;
    width: 500px;
    overflow: hidden;
  }

  .el-checkbox:last-of-type {
    margin-left: 0 !important;
    margin-right: 30px !important;
  }

  .el-transfer-panel__item.el-checkbox .el-checkbox__label {
    margin-right: inherit;
    display: block;

  }

  .el-checkbox:last-of-type {
    margin-right: -50px !important;
  }

  .el-checkbox, .el-checkbox__input {

  }

</style>
