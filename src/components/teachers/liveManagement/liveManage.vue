<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>直播管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
    <!--table列表-->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="直播列表" name="first">
        <!--搜索-->
        <transition name="fade">
          <div class="search" v-if="search">
            <el-form :model="searchRuleForm" :rules="rules" ref="searchRuleForm" label-width="180px"
                     class="demo-ruleForm">
              <el-form-item label="id：" prop="searchId">
                <el-input v-model="searchRuleForm.searchId" placeholder="请输入要搜索的id"></el-input>
              </el-form-item>
              <el-form-item label="直播课堂标题：" prop="searchTitle">
                <el-input v-model="searchRuleForm.searchTitle" placeholder="请输入要查询的直播课堂标题"></el-input>
              </el-form-item>
              <el-form-item label="开播时间" prop="searchListShelUnderTime">
                <el-date-picker
                  v-model="searchRuleForm.searchListShelUnderTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="liveSearch('searchRuleForm')">搜索</el-button>
                <el-button size="small" @click="resetSearchRuleForm('searchRuleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <el-row>
          <el-button type="primary" size="medium" @click="showSearchConditionsForm">搜索</el-button>
          <el-button type="primary" size="medium" @click="showDisableDialogVisible">禁用</el-button>
        </el-row>
        <!--        点击禁用按钮提示信息-->
        <el-dialog title="提示" :visible.sync="disableTableListDialogVisible" width="20%">
          <el-row>
            <el-col :span="4">
              <i class="el-icon-question"></i>
            </el-col>
            <el-col :span="20">
              <span>{{dialogDisableContent}}</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button @click="disableTableListDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleDisableTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
        </el-dialog>
        <!--        点击列表禁用按钮提示信息-->
        <el-dialog title="提示" :visible.sync="showRemoveDisableTableList" width="20%">
          <el-row>
            <el-col :span="4">
              <i class="el-icon-question"></i>
            </el-col>
            <el-col :span="20">
              <span>{{dialogDisableContent}}</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button @click="showRemoveDisableTableList = false">取 消</el-button>
              <el-button type="primary" @click="handleRemoveDisableTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
        </el-dialog>


        <!-- 查询 -->
        <!--禁用-->
        <!--列表-->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          border
          :header-row-style="{'color':'#409EFF'}"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
            props="id"
            align="center"
            width="60">
          </el-table-column>
          <el-table-column
            prop="create"
            label="创建者"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="className"
            align="center"
            label="直播课程名称"
          >
          </el-table-column>
          <el-table-column
            prop="speaker"
            label="主讲人"
            align="center">
          </el-table-column>
          <!--封面-->
          <el-table-column label="封面" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.avtar==''">未上传</div>
              <div v-else>
                <img :src="scope.row.avtar" width="40" height="40" class="head_pic"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="shelfTime"
            label="上架时间"
            align="center">
          </el-table-column>
          <!--          <el-table-column-->
          <!--            prop="underTime"-->
          <!--            label="下架时间"-->
          <!--            align="center">-->
          <!--          </el-table-column>-->
          <el-table-column
            prop="maxAmount"
            label="最大并发量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="whetherAudit"
            label="是否审核"
            align="center">
          </el-table-column>
          <!--          <el-table-column-->
          <!--            prop="whetherDisable"-->
          <!--            label="是否禁用"-->
          <!--            align="center">-->
          <!--          </el-table-column>-->
          <el-table-column align="center" label="操作" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click.native="newLiveClass({index: scope.$index, row:scope.row})"
              >新建直播课时
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="liveClass({index: scope.$index, row:scope.row})"
              >直播课时
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="showLiveClassEditDialog({index: scope.$index, row:scope.row})"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="LiveClassDisable({index: scope.$index, row:scope.row})"
              >禁用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" class="mt">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="liveInfoList"
          ></el-pagination>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="回收站" name="second">
        <!--搜索-->
        <!--搜索-->
        <transition name="fade">
          <div class="theRecycleBin" v-if="theRecycleBin">
            <el-form :model="searchTheRecycleBinRuleForm" :rules="rules" ref="searchTheRecycleBinRuleForm"
                     label-width="180px" class="demo-ruleForm">
              <el-form-item label="id：" prop="searchId">
                <el-input v-model="searchTheRecycleBinRuleForm.searchId" placeholder="请输入要搜索的id"></el-input>
              </el-form-item>
              <!--              <el-form-item label="创建者：" prop="searchCreate">-->
              <!--                <el-input v-model="searchTheRecycleBinRuleForm.searchCreate" placeholder="请输入要查询的创建者"></el-input>-->
              <!--              </el-form-item>-->
              <!--              <el-form-item label="主讲人：" prop="searchSpeaker">-->
              <!--                <el-input v-model="searchTheRecycleBinRuleForm.searchSpeaker" placeholder="请输入要查询的创建者"></el-input>-->
              <!--              </el-form-item>-->
              <!--              <el-form-item label="主讲人：" prop="searchSpeaker">-->
              <!--                <el-select v-model="currentSelectTeacher" clearable placeholder="请选择">-->
              <!--                  <el-option-->
              <!--                    v-for="item in getAllTeacher"-->
              <!--                    :key="item.teacherId"-->
              <!--                    :label="item.teacherName"-->
              <!--                    :value="item.teacherId"-->
              <!--                  >-->
              <!--                  </el-option>-->
              <!--                </el-select>-->
              <!--              </el-form-item>-->

              <el-form-item label="直播课堂标题：" prop="searchTitle">
                <el-input v-model="searchTheRecycleBinRuleForm.searchTitle" placeholder="请输入要查询的直播课堂标题"></el-input>
              </el-form-item>
              <el-form-item label="开播时间" prop="searchShelUnderTime">
                <el-date-picker
                  v-model="searchTheRecycleBinRuleForm.searchShelUnderTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="theRecycleBinSearch('searchRuleForm')">搜索</el-button>
                <el-button size="small" @click="reseTheRecycleBinSearchRuleForm('searchTheRecycleBinRuleForm')">重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <el-row>
          <el-button type="primary" size="medium" @click="showSearchTheRecycleBinForm">搜索</el-button>
          <el-button type="success" size="medium" @click="showDisableTheRecycleBinDialogVisible">解除禁用</el-button>
          <el-button type="danger" size="medium" @click="showDelTheRecycleBinDialogVisible">删除</el-button>
        </el-row>
        <!--        解除禁用dialog-->
        <el-dialog title="提示" :visible.sync="removeDisableDialogVisible" width="20%">
          <el-row>
            <el-col :span="4">
              <i class="el-icon-question"></i>
            </el-col>
            <el-col :span="20">
              <span>{{dialogDisableContent}}</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button @click="removeDisableDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleremoveDisable"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
        </el-dialog>
        <!--        删除多项dialog-->
        <el-dialog title="提示" :visible.sync="deleteMultipleDialogVisible" width="20%">
          <el-row>
            <el-col :span="4">
              <i class="el-icon-question"></i>
            </el-col>
            <el-col :span="20">
              <span>{{dialogDisableContent}}</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button @click="deleteMultipleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleDelteTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
        </el-dialog>
        <!--        表格中解除禁用dialog-->
        <el-dialog title="提示" :visible.sync="removeDisableTableListDialogVisible" width="20%">
          <el-row>
            <el-col :span="4">
              <i class="el-icon-question"></i>
            </el-col>
            <el-col :span="20">
              <span>{{dialogDisableContent}}</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button @click="removeDisableTableListDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handRemoveDisableTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
        </el-dialog>

        <!--列表-->
        <el-table
          ref="multipleTable"
          :data="theRecycleBinTableData"
          tooltip-effect="dark"
          border
          :header-row-style="{'color':'#409EFF'}"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
            props="id"
            align="center"
            width="60">
          </el-table-column>
          <el-table-column
            prop="create"
            label="创建者"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="className"
            align="center"
            label="直播课程名称"
          >
          </el-table-column>
          <el-table-column
            prop="speaker"
            label="主讲人"
            align="center">
          </el-table-column>
          <!--封面-->
          <el-table-column label="教师头像" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.avtar==''">未上传</div>
              <div v-else>
                <img :src="scope.row.avtar" width="40" height="40" class="head_pic"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="shelfTime"
            label="上架时间"
            align="center">
          </el-table-column>
          <!--          <el-table-column-->
          <!--            prop="underTime"-->
          <!--            label="下架时间"-->
          <!--            align="center">-->
          <!--          </el-table-column>-->
          <el-table-column
            prop="maxAmount"
            label="最大并发量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="whetherAudit"
            label="是否审核"
            align="center">
          </el-table-column>
          <!--          <el-table-column-->
          <!--            prop="whetherDisable"-->
          <!--            label="是否禁用"-->
          <!--            align="center">-->
          <!--          </el-table-column>-->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <!--                <el-button-->
              <!--                  size="mini"-->
              <!--                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
              <el-button
                size="mini"
                type="danger"
                @click="showDisableTheRecycleBinDialog(scope.$index, scope.row)">解除禁用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" class="mt">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="recycleBinInfoList"
          ></el-pagination>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="添加" name="third">
        <!--       表单信息-->
        <div class="theRecycleBinBox">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="直播课堂标题：" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入直播课堂标题"></el-input>
            </el-form-item>
            <el-form-item label="直播课堂分类：" prop="classification">
              <el-input v-model="ruleForm.classification" placeholder="请输入直播课堂分类"></el-input>
            </el-form-item>
            <!--            <el-form-item label="主讲人：" prop="create">-->
            <!--              <el-input v-model="ruleForm.create" placeholder="请输入主讲人"></el-input>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="主讲人：" prop="create">-->
            <!--              <el-select v-model="currentSelectTeacher" clearable placeholder="请选择">-->
            <!--                <el-option-->
            <!--                  v-for="item in getAllTeacher"-->
            <!--                  :key="item.teacherId"-->
            <!--                  :label="item.teacherName"-->
            <!--                  :value="item.teacherId"-->
            <!--                >-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="选择学校：" :required="true">-->
            <!--              <el-checkbox-group v-model="ruleForm.selectSchool">-->
            <!--                <el-checkbox-->
            <!--                  v-for="item in allSchool"-->
            <!--                  :key="item.addSchoolId"-->
            <!--                  :label="item.addSchoolName"-->
            <!--                  :value="item.addSchoolId"-->
            <!--                ></el-checkbox>-->
            <!--              </el-checkbox-group>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="选择学校：" :required="true">-->
            <!--              <el-checkbox-group v-model="currentCheckBox">-->
            <!--                <el-checkbox-->
            <!--                  v-for="item in allSchool"-->
            <!--                  :key="item.addSchoolId"-->
            <!--                  :label="item.addSchoolId"-->
            <!--                  :value="item.addSchoolId"-->
            <!--                >{{item.addSchoolName}}-->
            <!--                </el-checkbox>-->
            <!--              </el-checkbox-group>-->
            <!--            </el-form-item>-->


            <el-form-item label="选择学校：" :required="true">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
              </el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="currentCheckBox" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="item in allSchool"
                  :key="item.addSchoolId"
                  :label="item.addSchoolId"
                  :value="item.addSchoolId"
                >{{item.addSchoolName}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>


            <!-- 封面-->
            <!--            <el-form-item label="封面：" :required="true">-->
            <!--              <el-upload-->
            <!--                :action="uploadPictureAction"-->
            <!--                list-type="picture-card"-->
            <!--                :limit="1"-->
            <!--                :on-remove="handlePictureRemove"-->
            <!--                :on-preview="handlePictureCardPreview"-->
            <!--                :before-upload="handlePictureBeforeUpload"-->
            <!--                :on-success="handleSuccessUploadImage"-->
            <!--                :on-error="handleErrorUpload"-->
            <!--                :on-progress="handleRrogress"-->
            <!--                ref="delClassUpload"-->
            <!--                :file-list="ruleForm.liveUsPictureList"-->
            <!--              >-->
            <!--                <div slot="trigger">-->
            <!--                  <span style="color:#888888">添加图片【必填】</span>-->
            <!--                </div>-->
            <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>-->
            <!--              </el-upload>-->
            <!--              <el-dialog :visible.sync="dialogImageVisibleAdd" size="tiny">-->
            <!--                <img width="100%" :src="dialogImageUrl" alt="">-->
            <!--              </el-dialog>-->
            <!--            </el-form-item>-->

            <el-form-item label="直播简介：" prop="liveDescribed">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入信息"
                v-model="ruleForm.liveDescribed">
              </el-input>
            </el-form-item>
            <!--            <el-form-item label="上架时间" prop="shelfTimeData">-->
            <!--              <el-date-picker-->
            <!--                v-model="ruleForm.shelfTimeData"-->
            <!--                type="datetime"-->
            <!--                placeholder="选择日期时间"-->
            <!--                :picker-options="pickerOptions"-->
            <!--              ></el-date-picker>-->
            <!--            </el-form-item>-->

            <!--            <el-form-item label="下架时间" prop="underTimeData">-->
            <!--              <el-date-picker-->
            <!--                v-model="ruleForm.underTimeData"-->
            <!--                type="datetime"-->
            <!--                placeholder="选择日期时间"-->
            <!--                :picker-options="pickerOptions"-->
            <!--              ></el-date-picker>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="开播时间" prop="shelfUnderTimeData" :required="true">-->
            <!--              <el-date-picker-->
            <!--                v-model="ruleForm.shelfUnderTimeData"-->
            <!--                type="datetimerange"-->
            <!--                @change="liveTimeChange"-->
            <!--                range-separator="至"-->
            <!--                start-placeholder="开始日期"-->
            <!--                end-placeholder="结束日期">-->
            <!--              </el-date-picker>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item>-->
            <!--              <span style="font-size: 12px;color: #606266">结束时间与开始时间间隔需大于15分钟并小于24小时</span>-->
            <!--            </el-form-item>-->
<!--            <el-form-item label="最大并发量：" prop="maxAmount">-->
              <!--              <el-input v-model="ruleForm.maxAmount" placeholder="请输入最大并发量"></el-input>-->
<!--              <el-slider v-model="ruleForm.maxAmount" :max="10" :min="1"></el-slider>-->
<!--            </el-form-item>-->

            <el-form-item>
              <el-button type="primary" @click="saveAddLiveInformation" :disabled="saveAddInfoDisabled">保存</el-button>
              <!--<el-button type="primary" @click="editAgencyInfo" v-if="editAgencyInfoBtn">编辑</el-button>-->
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
    import '../../../api/restfulapi';
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import {
        qs,
        uploadFileUrl,
        getTeacherList,
        getLiveManagementList,
        saveAddInformation,
        getAllSchool,
        searchLiveList,
        disableAddRecycleBin,
        removeDisable,
        deleteTableListCourseInformation

    } from "@/api/api.js";

    export default {
        data() {
            return {
                allSchoolLable: [],
                isIndeterminate: true,
                checkAll: false,
                currentCheckBox: [],
                sendDisableTableListArrayId: [],//传给后台表格中的禁用ID
                saveDisableTableListArrayIndex: '',
                saveDisableTableListArrayId: '',//表格中禁用row.id
                showRemoveDisableTableList: false,
                sendRemoveDisableTableListArrayId: [],//传给后台表格中的解除禁用ID
                sendDisableArrayId: [],//传给后台的要禁用的arrayId数组
                sendRemoveDisableArrayId: [],//传给后台的解除禁用的arrayId数组
                sendDeleteArrayId: [],//传给后台的要删除的arrayId数组
                sendSchoolId: [],//传给后台的schoolId数组
                allSchool: [],//所有学校
                search: false,//搜索条件是否显示
                theRecycleBin: false,//回收站搜索条件是否显示
                currentSelectTeacher: '',//当前选中的教师
                multipleSelection: [],//checkBox选中的数组
                disableTableListDialogVisible: false,//直播列表是否显示禁用提示dialog
                dialogDisableContent: '',// 直播列表对话框中显示要禁用的内容
                isLoadingDisableWithDel: false, // 直播列表禁用确认对话框中确认按钮加载状态
                removeDisableDialogVisible: false,//回收站是否显示禁用提示dialog
                deleteMultipleDialogVisible: false,//回收站显示删除dialog
                removeDisableTableListDialogVisible: false,//回收站表格中是否显示解除禁用提示dialog
                removeDisableIndex: '',//页面需要的id
                removeDisableId: '',//传给后台的id
                // currentSelectClassRoom: null, // 当前选中的班级
                activeName: 'first',
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                queryFromServer: [],//服务器返回直播列表数据的数据
                recycleBinQueryFromServer: [],//服务器返回回收站列表数据的数据
                uploadPictureAction: uploadFileUrl, // 上传图片action地址
                dialogImageVisibleAdd: false,//显示添加图片组件对话框
                saveAddInfoDisabled: false,//图片未上传成功disabled保存机构信息按钮
                dialogImageUrl: "", // 上传图片组件中图片地址
                liveUsPictureList: [],//添加信息图片地址
                liveData: {data: ""}, // 本地任务信息数据
                tableData: [],
                //回收站table
                theRecycleBinTableData: [],

                // active=third  form表单
                ruleForm: {
                    title: '',
                    classification: '',
                    create: '',
                    maxAmount: 1,
                    picture: [], // 上传图片信息
                    liveDescribed: '',//直播简介
                    shelfTime: '',
                    underTime: '',
                    shelfUnderTimeData: [],
                    searchShelUnderTime: [],
                    pictureList: [], // 上传图片信息
                    selectSchool: [],//获取所有学校
                },
                getAllTeacher: [],
                //验证规则
                rules: {
                    title: [
                        {required: true, message: '请输入直播课堂标题', trigger: 'blur'},
                    ],
                    classification: [
                        {required: true, message: '请输入直播课堂分类', trigger: 'blur'},
                    ],
                    create: [
                        {required: true, message: '请输入主讲人', trigger: 'blur'},
                    ],
                    liveDescribed: [
                        {required: true, message: '请输入直播简介', trigger: 'blur'},
                    ]
                },
                searchRuleForm: {
                    searchId: '',
                    searchCreate: '',
                    searchSpeaker: '',
                    searchTitle: '',
                    searchShelfTime: '',
                    searchUnderTime: '',
                    searchListShelUnderTime: []
                },
                //回收站搜索表单
                searchTheRecycleBinRuleForm: {
                    searchId: '',
                    searchCreate: '',
                    searchSpeaker: '',
                    searchTitle: '',
                    searchShelfTime: '',
                    searchUnderTime: '',
                    searchShelUnderTime: []
                },

            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", "/liveManagement");
            // this.getDateStr('10000',10000)
            // console.log('this.userRole', this.userRole)
            //获取所有的教师
            // getTeacherList(qs.stringify({
            //   school_id: storageUtil.readTeacherInfo().school_id,
            // })).then(res => {
            //   console.log('getTeacherList', res)
            //   if (res.code == SUCCESS_CODE) {
            //     if (res.data != '[]') {
            //       res.data.forEach(item => {
            //         const classObj = {teacherId: item.id, teacherName: item.nick};
            //         this.getAllTeacher.push(classObj);
            //       });
            //     } else {
            //       promptUtil.wait(this);
            //     }
            //   }
            // }).catch(error => {
            //
            //   PubSub.publish("currentMenuIndex", "/liveManage");
            //   promptUtil.timeout(this);
            // })
            //获取所有的学校
            getAllSchool(qs.stringify({})).then(res => {
                // console.log('getAllSchool', res)
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        // promptUtil.LOG(res.data,res.data)
                        res.data.forEach(item => {
                            const classObj = {addSchoolId: item.id, addSchoolName: item.school_name};
                            this.allSchool.push(classObj);
                        });
                        //  console.log('this.currentCheckBox',this.currentCheckBox)
                        this.allSchool.forEach(item => {
                            this.allSchoolLable.push(item.addSchoolId)
                        })

                    } else {
                        promptUtil.wait(this);
                    }
                }
            }).catch(error => {
                PubSub.publish("currentMenuIndex", "/liveManage");
                promptUtil.LOG('getAllSchool-err', error);
            })

            //获取直播列表
            const moment = require("moment");
            getLiveManagementList(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                status: 0
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        for (var i = 0; i < res.data.length; i++) {
                            const obj = {
                                id: res.data[i].id,
                                avtar: res.data[i].img,
                                create: res.data[i].create_name,
                                className: res.data[i].title,
                                speaker: res.data[i].teacher_name,
                                shelfTime: res.data[i].starttime,
                                underTime: res.data[i].endtime,
                                maxAmount: res.data[i].max_users,
                                whetherAudit: "审核通过", //res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",//= 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败"
                                whetherDisable: res.data[i].status,
                            }
                            this.tableData.push(obj)
                        }
                        this.queryFromServer = this.tableData;
                        this.handleCurrentChange(1)
                    }
                } else {
                    promptUtil.wait(this);
                }
            }).catch(error => {
                promptUtil.LOG('getLiveManagementList-err', error);
            })

            //获取回收站列表
            getLiveManagementList(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                status: 1
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        for (var i = 0; i < res.data.length; i++) {
                            const obj = {
                                id: res.data[i].id,
                                avtar: res.data[i].img,
                                create: res.data[i].create_name,
                                className: res.data[i].title,
                                speaker: res.data[i].teacher_name,
                                shelfTime: res.data[i].starttime,
                                underTime: res.data[i].endtime,
                                maxAmount: res.data[i].max_users,
                                whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",// = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败"
                                whetherDisable: res.data[i].status,
                            }
                            this.theRecycleBinTableData.push(obj)
                        }
                        // 回收站
                        this.recycleBinQueryFromServer = this.theRecycleBinTableData;
                        this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                    }
                } else {
                    promptUtil.wait(this);
                }
            }).catch(error => {
                promptUtil.LOG('getLiveManagementList-err', error);
            })
        },
        methods: {
            handleClick(tab, event) {
                if (tab.name == 'first') {
                    //调用直播列表get接口
                    getLiveManagementList(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data != '[]') {
                                this.tableData = []
                                this.currentPage = 1
                                for (var i = 0; i < res.data.length; i++) {
                                    const obj = {
                                        id: res.data[i].id,
                                        avtar: res.data[i].img,
                                        create: res.data[i].create_name,
                                        className: res.data[i].title,
                                        speaker: res.data[i].teacher_name,
                                        shelfTime: res.data[i].starttime,
                                        underTime: res.data[i].endtime,
                                        maxAmount: res.data[i].max_users,
                                        whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",
                                        whetherDisable: res.data[i].status,
                                    }
                                    this.tableData.push(obj)
                                }
                                // 回收站
                                this.queryFromServer = this.tableData;
                                this.tableData = this.queryFromServer.slice(
                                    (this.currentPage - 1) * this.pageSize,
                                    this.pageSize + (this.currentPage - 1) * this.pageSize
                                );
                            }
                        } else {
                            promptUtil.wait(this);
                        }
                    }).catch(error => {
                        promptUtil.LOG('getLiveManagementList-err', error);
                    })

                }
                if (tab.name == 'second') {
                    //调用回收站get接口
                    getLiveManagementList(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        status: 1
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data != '[]') {
                                this.theRecycleBinTableData = []
                                for (var i = 0; i < res.data.length; i++) {
                                    const obj = {
                                        id: res.data[i].id,
                                        avtar: res.data[i].img,
                                        create: res.data[i].create_name,
                                        className: res.data[i].title,
                                        speaker: res.data[i].teacher_name,
                                        shelfTime: res.data[i].starttime,
                                        underTime: res.data[i].endtime,
                                        maxAmount: res.data[i].max_users,
                                        whetherAudit: res.data[i].sh = "审核通过",//= 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败"
                                        whetherDisable: res.data[i].status,
                                    }
                                    this.theRecycleBinTableData.push(obj)
                                }
                                // 回收站
                                this.recycleBinQueryFromServer = this.theRecycleBinTableData;
                                this.currentPage = 1
                                this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                                    (this.currentPage - 1) * this.pageSize,
                                    this.pageSize + (this.currentPage - 1) * this.pageSize
                                );

                            }
                        } else {
                            promptUtil.wait(this);
                        }
                    }).catch(error => {
                        promptUtil.LOG('getLiveManagementList-err', error);
                    })

                }
            },
            // =========直播列表============
            //显示搜索条件表单
            showSearchConditionsForm() {
                this.search = !this.search
            },
            //按照搜索条件搜索
            liveSearch() {
                const moment = require("moment");
                if (this.searchRuleForm.searchId.trim() !== "") {
                    let valdate = /^[1-9]\d*$/;
                    if (!valdate.test(this.searchRuleForm.searchId.trim())) {
                        promptUtil.warning(this, "请输入数字");
                        return;
                    }
                }
                var selectJson = {};
                if (this.searchRuleForm.searchId != "") selectJson['course_id'] = this.searchRuleForm.searchId;
                if (this.searchRuleForm.searchCreate != "") selectJson['create_id'] = this.searchRuleForm.searchCreate;
                if (this.searchRuleForm.searchListShelUnderTime != null&& this.searchRuleForm.searchListShelUnderTime.length != 0) selectJson['starttime'] = moment(this.searchRuleForm.searchListShelUnderTime[0]).format("YYYY-MM-DD HH:mm:ss");
                if (this.searchRuleForm.searchListShelUnderTime != null && this.searchRuleForm.searchListShelUnderTime.length != 0) selectJson['endtime'] = moment(this.searchRuleForm.searchListShelUnderTime[1]).format("YYYY-MM-DD HH:mm:ss");
                if (this.currentSelectTeacher != "") selectJson['teacher_id'] = this.currentSelectTeacher;
                if (this.searchRuleForm.searchTitle != "") selectJson['title'] = this.searchRuleForm.searchTitle;
                getLiveManagementList(qs.stringify(selectJson)).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        // 重置当前页为1
                        this.tableData = []
                        this.currentPage = 1;
                        this.queryFromServer = [];
                        if (res.data != '[]') {
                            for (var i = 0; i < res.data.length; i++) {
                                const obj = {
                                    id: res.data[i].id,
                                    avtar: res.data[i].img,
                                    create: res.data[i].create_name,
                                    className: res.data[i].title,
                                    speaker: res.data[i].teacher_name,
                                    shelfTime: res.data[i].starttime,
                                    underTime: res.data[i].endtime,
                                    maxAmount: res.data[i].max_users,
                                    whetherAudit: '审核通过',//res.data[i].sh,//= 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败"
                                    whetherDisable: res.data[i].status,
                                }
                                this.tableData.push(obj)
                            }
                            this.queryFromServer = this.tableData;
                            this.handleCurrentChange(1)
                        }
                    } else if (res.code = ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('getLiveManagementList-err', error)
                })

            },
            //点击禁用按钮显示dialog
            showDisableDialogVisible() {
                if (this.multipleSelection == '') {
                    promptUtil.warning(this, '请选择要禁用的课程')
                } else {
                    this.disableTableListDialogVisible = true;
                    this.dialogDisableContent = '确定要禁用此课程么'
                }
            },
            //直播禁用Dialog中的确定按钮
            handleDisableTableList() {
                // sendDisableArrayId
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    this.sendDisableArrayId.push(this.multipleSelection[i].id)
                }
                disableAddRecycleBin(qs.stringify({
                    course_id: this.sendDisableArrayId
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '禁用成功')
                        for (var i = 0; i < this.multipleSelection.length; i++) {
                            const index = this.queryFromServer.findIndex(item => item.id == this.multipleSelection[i].id)
                            this.queryFromServer.splice(index, 1)
                        }
                        if (this.queryFromServer.length % this.pageSize == 0 && this.queryFromServer.length != this.currentPage * this.pageSize) { // 表明当前页面没有数据
                            this.currentPage = this.currentPage - 1
                        }
                        this.tableData = this.queryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('disableAddRecycleBin-err', error)
                })

                this.disableTableListDialogVisible = false;

            },
            //重置搜索表格中的信息
            resetSearchRuleForm(formName) {
                this.$refs[formName].resetFields();
                this.currentSelectTeacher = ""
                // this.searchShelUnderTime=[]
            },
            //新建直播课时
            newLiveClass(obj) {
                this.$router.push({path: `/liveManagement/add/` + obj.row.id});
            },
            //直播课时
            liveClass(obj) {
                this.$router.push({path: `/liveManagement/liveClass/` + obj.row.id});
            },
            //编辑
            showLiveClassEditDialog(obj) {
                this.$router.push({path: `/liveManagement/edit/` + obj.row.id});
            },
            //表格中的禁用
            LiveClassDisable(obj) {

                this.saveDisableTableListArrayId = obj.row.id
                this.saveDisableTableListArrayIndex = obj.index
                this.showRemoveDisableTableList = true
                this.dialogDisableContent = '确定要禁用此课程么'
            },
            //表格中的禁用dialog中的确定按钮
            handleRemoveDisableTableList() {
                this.sendDisableTableListArrayId.push(this.saveDisableTableListArrayId)
                disableAddRecycleBin(qs.stringify({
                    course_id: this.sendDisableTableListArrayId,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '禁用成功')
                        this.queryFromServer.splice(this.saveDisableTableListArrayIndex, 1)
                        this.tableData = this.queryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                        getLiveManagementList(qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            status: 1
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                                if (res.data && res.data != "") {
                                    this.theRecycleBinTableData = []
                                    for (var i = 0; i < res.data.length; i++) {
                                        const obj = {
                                            id: res.data[i].id,
                                            avtar: res.data[i].img,
                                            create: res.data[i].create_name,
                                            className: res.data[i].title,
                                            speaker: res.data[i].teacher_name,
                                            shelfTime: res.data[i].starttime,
                                            underTime: res.data[i].endtime,
                                            maxAmount: res.data[i].max_users,
                                            whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",
                                            whetherDisable: res.data[i].status,
                                        }
                                        this.theRecycleBinTableData.push(obj)
                                    }
                                    // 回收站
                                    this.recycleBinQueryFromServer = this.theRecycleBinTableData;
                                    this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                                        (this.currentPage - 1) * this.pageSize,
                                        this.pageSize + (this.currentPage - 1) * this.pageSize
                                    );
                                }
                            } else {
                                promptUtil.wait(this);
                            }
                        }).catch(error => {
                            promptUtil.LOG("getLiveManagementList-err", error);
                        })
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('disableAddRecycleBin-err', error)
                })
                this.showRemoveDisableTableList = false


            },

            // =========回收站============
            //显示回收站搜索条件表单
            showSearchTheRecycleBinForm() {
                this.theRecycleBin = !this.theRecycleBin
            },
            //回收站搜索
            theRecycleBinSearch() {
                const moment = require("moment");
                if (this.searchTheRecycleBinRuleForm.searchId.trim() !== "") {
                    let valdate = /^[1-9]\d*$/;
                    if (!valdate.test(this.searchTheRecycleBinRuleForm.searchId.trim())) {
                        promptUtil.warning(this, "请输入数字");
                        return;
                    }
                }
                var selectJson = {
                    status: 1
                };
                if (this.searchTheRecycleBinRuleForm.searchId != "") selectJson['course_id'] = this.searchTheRecycleBinRuleForm.searchId;
                if (this.searchTheRecycleBinRuleForm.searchCreate != "") selectJson['create_id'] = this.searchTheRecycleBinRuleForm.searchCreate;
                if (this.searchTheRecycleBinRuleForm.searchShelUnderTime!= null && this.searchTheRecycleBinRuleForm.searchShelUnderTime.length != 0) selectJson['starttime'] = moment(this.searchTheRecycleBinRuleForm.searchShelUnderTime[0]).format("YYYY-MM-DD HH:mm:ss");
                if (this.searchTheRecycleBinRuleForm.searchShelUnderTime != null && this.searchTheRecycleBinRuleForm.searchShelUnderTime.length != 0) selectJson['endtime'] = moment(this.searchTheRecycleBinRuleForm.searchShelUnderTime[1]).format("YYYY-MM-DD HH:mm:ss");
                if (this.currentSelectTeacher != "") selectJson['teacher_id'] = this.currentSelectTeacher;
                if (this.searchTheRecycleBinRuleForm.searchTitle != "") selectJson['title'] = this.searchTheRecycleBinRuleForm.searchTitle;
                getLiveManagementList(qs.stringify(selectJson)).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        // 重置当前页为1
                        this.theRecycleBinTableData = []
                        this.currentPage = 1;
                        this.queryFromServer = [];
                        if (res.data && res.data != '[]') {
                            for (var i = 0; i < res.data.length; i++) {
                                const obj = {
                                    id: res.data[i].id,
                                    avtar: res.data[i].img,
                                    create: res.data[i].create_name,
                                    className: res.data[i].title,
                                    speaker: res.data[i].teacher_name,
                                    shelfTime: res.data[i].starttime,
                                    underTime: res.data[i].endtime,
                                    maxAmount: res.data[i].max_users,
                                    whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",
                                    whetherDisable: res.data[i].status,
                                }
                                this.theRecycleBinTableData.push(obj)
                            }
                            this.recycleBinQueryFromServer = this.theRecycleBinTableData;
                            this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                                (this.currentPage - 1) * this.pageSize,
                                this.pageSize + (this.currentPage - 1) * this.pageSize
                            );
                        }
                    } else if (res.code = ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('getLiveManagementList-err', error)
                })


            },
            //回收站重置
            reseTheRecycleBinSearchRuleForm(formName) {
                this.$refs[formName].resetFields();
                this.currentSelectTeacher = ""
            },
            //回收站 展示解除禁用对话框
            showDisableTheRecycleBinDialogVisible() {
                if (this.multipleSelection == '') {
                    promptUtil.warning(this, '请选择要解除禁用的课程')
                } else {
                    this.removeDisableDialogVisible = true
                    this.dialogDisableContent = '确定要解除禁用此课程么'
                }
            },
            //回收站 解除禁用对话框中的确定按钮
            handleremoveDisable() {
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    this.sendRemoveDisableArrayId.push(this.multipleSelection[i].id)
                }
                removeDisable(qs.stringify({
                    course_id: this.sendRemoveDisableArrayId,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '解除禁用成功')
                        for (var i = 0; i < this.multipleSelection.length; i++) {
                            const index = this.recycleBinQueryFromServer.findIndex(item => item.id == this.multipleSelection[i].id)
                            this.recycleBinQueryFromServer.splice(index, 1)
                        }
                        if (this.recycleBinQueryFromServer.length % this.pageSize == 0 && this.recycleBinQueryFromServer.length != this.currentPage * this.pageSize && this.currentPage != 1) { // 表明当前页面没有数据
                            this.currentPage = this.currentPage - 1
                        }
                        this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('removeDisable-err', error)
                })
                this.removeDisableDialogVisible = false;
            },
            //回收站删除显示提示对话框
            showDelTheRecycleBinDialogVisible() {
                if (this.multipleSelection == '') {
                    promptUtil.warning(this, '请选择要删除的课程')
                } else {
                    this.deleteMultipleDialogVisible = true
                    this.dialogDisableContent = '确定要删除此课程么'
                }
            },
            //删除对话框中的确定按钮
            handleDelteTableList() {
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    this.sendDeleteArrayId.push(this.multipleSelection[i].id)
                }
                deleteTableListCourseInformation(qs.stringify({
                    course_id: this.sendDeleteArrayId,
                    user_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '删除成功')
                        for (var i = 0; i < this.multipleSelection.length; i++) {
                            const index = this.recycleBinQueryFromServer.findIndex(item => item.id == this.multipleSelection[i].id)
                            this.recycleBinQueryFromServer.splice(index, 1)
                        }
                        this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('deleteTableListCourseInformation-err', error)
                })
                this.deleteMultipleDialogVisible = false;
            },
            //回收站列表中解除禁用dialog
            showDisableTheRecycleBinDialog(index, row) {
                this.removeDisableIndex = index
                this.removeDisableId = row.id
                this.removeDisableTableListDialogVisible = true
                this.dialogDisableContent = '确定要解除禁用此课程么'
            },
            //回收站列表中解除禁用确定按钮
            handRemoveDisableTableList() {
                this.sendRemoveDisableTableListArrayId.push(this.removeDisableId)
                removeDisable(qs.stringify({
                    course_id: this.sendRemoveDisableTableListArrayId,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '解除禁用成功')
                        this.recycleBinQueryFromServer.splice(this.removeDisableIndex, 1)
                        this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                        getLiveManagementList(qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                        })).then(res => {
                            if (res.code == SUCCESS_CODE) {
                                if (res.data && res.data != "") {
                                    this.tableData = []
                                    this.currentPage = 1
                                    for (var i = 0; i < res.data.length; i++) {
                                        const obj = {
                                            id: res.data[i].id,
                                            avtar: res.data[i].img,
                                            create: res.data[i].create_name,
                                            className: res.data[i].title,
                                            speaker: res.data[i].teacher_name,
                                            shelfTime: res.data[i].starttime,
                                            underTime: res.data[i].endtime,
                                            maxAmount: res.data[i].max_users,
                                            whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",
                                            whetherDisable: res.data[i].status,
                                        }
                                        this.tableData.push(obj)
                                    }
                                    // 回收站
                                    this.queryFromServer = this.tableData;
                                    this.tableData = this.queryFromServer.slice(
                                        (this.currentPage - 1) * this.pageSize,
                                        this.pageSize + (this.currentPage - 1) * this.pageSize
                                    );
                                }
                            } else {
                                promptUtil.wait(this);
                            }
                        }).catch(error => {
                            promptUtil.LOG('getLiveManagementList-err', error);
                        })
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    promptUtil.LOG('removeDisable-err', error)
                })
                this.removeDisableTableListDialogVisible = false
            },
            //添加页面开播时间校验
            liveTimeChange(event) {
                //结束时间与开始时间间隔需大于15分钟并小于24小时，开始时间和结束时间范围必须在当前时间一年以内
                const now = new Date().getTime()
                let start = event[0]
                let end = event[1]
                let startTime = start.getTime()
                let endTime = end.getTime()
                if (!(startTime > now && endTime - startTime > 60 * 15 * 1000 && endTime - startTime < 24 * 60 * 60 * 1000 && endTime < now + 60 * 60 * 24 * 365 * 1000)) {
                    promptUtil.warning(this, '请选择正确的时间范围')
                    this.ruleForm.shelfUnderTimeData = []
                }
            },

            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allSchool.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allSchool.length;
            },
            //选择所有
            handleCheckAllChange(val) {
                this.currentCheckBox = val ? this.allSchoolLable : [];
                this.isIndeterminate = false;
            },

            //checkBox
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },


            // 解析服务器返回数据并拼装正确格式
            // anysisDataFromServer(data) {
            //   const moment = require("moment");
            //   const dataRaw = data.map(item => {
            //     item.date = moment(parseInt(item.date) * 1000).format(
            //       "YYYY-MM-DD HH:mm:ss"
            //     );
            //     item.remarks = item.remake;
            //     return item;
            //   });
            //   return dataRaw;
            // },
            //========添加=========

            //保存信息按钮
            saveAddLiveInformation() {
                if (this.ruleForm.title.trim() == "" || this.ruleForm.classification.trim() == "" || this.ruleForm.liveDescribed.trim() == ""
                    || this.currentCheckBox.length == 0) { //this.liveUsPictureList.length == 0
                    promptUtil.warning(this, "请填写相应信息");
                    return;
                }
                const moment = require("moment");
                const loading = promptUtil.loading(this);
                saveAddInformation(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    title: this.ruleForm.title,
                    classification: this.ruleForm.classification,
                    teacher_id: this.currentSelectTeacher,
                    school_ids: this.currentCheckBox,
                    max_users: 0, // 不设限制
                    con: this.ruleForm.liveDescribed,
                    // starttime: moment(this.ruleForm.shelfUnderTimeData[0]).format("YYYY-MM-DD HH:mm:ss"),//开播时间
                    // endtime: moment(this.ruleForm.shelfUnderTimeData[1]).format("YYYY-MM-DD HH:mm:ss"),
                    // img: this.liveUsPictureList == 0 ? "" : JSON.stringify(this.liveUsPictureList),
                    create_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        loading.close();
                        promptUtil.success(this, res.msg)
                        this.ruleForm.title = ""
                        this.ruleForm.classification = ""
                        this.ruleForm.liveDescribed = ""
                        this.ruleForm.shelfUnderTimeData = []
                        this.currentSelectTeacher = ""
                        this.ruleForm.selectSchool = []
                        this.currentCheckBox = []
                        //  this.$refs.delClassUpload.clearFiles()//主讲人和时间

                        //获取直播列表
                        const moment = require("moment");
                        getLiveManagementList(qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                        })).then(res => {
                            this.tableData = []
                            for (var i = 0; i < res.data.length; i++) {
                                const obj = {
                                    id: res.data[i].id,
                                    avtar: res.data[i].img,
                                    create: res.data[i].create_name,
                                    className: res.data[i].title,
                                    speaker: res.data[i].teacher_name,
                                    shelfTime: res.data[i].starttime,
                                    underTime: res.data[i].endtime,
                                    maxAmount: res.data[i].max_users,
                                    whetherAudit: res.data[i].sh = 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败",
                                    whetherDisable: res.data[i].status,
                                }
                                this.tableData.push(obj)
                            }
                            this.queryFromServer = this.tableData;
                            this.handleCurrentChange(1)
                        }).catch(error => {
                            promptUtil.LOG('getLiveManagementList-err', error);
                        })
                        this.activeName = 'first'
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg);
                        loading.close();
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(error => {
                    loading.close();
                    promptUtil.LOG('saveAddInformation-err', error);
                })

            },
            // =======分页=========
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * 10;
            },
            // 当前页触发函数
            handleCurrentChange(val) {
                this.currentPage = val;
                if (this.activeName == 'first') {
                    this.tableData = this.queryFromServer.slice(
                        (this.currentPage - 1) * this.pageSize,
                        this.pageSize + (this.currentPage - 1) * this.pageSize
                    );
                } else if (this.activeName == 'second') {
                    this.theRecycleBinTableData = this.recycleBinQueryFromServer.slice(
                        (this.currentPage - 1) * this.pageSize,
                        this.pageSize + (this.currentPage - 1) * this.pageSize
                    );
                }
            },

            // 删除上传的图片监听
            handlePictureRemove(file, fileList) {
                // console.log(file, fileList);
            },
            // 预览机构信息选中上传的图片
            handlePictureCardPreview(file) {
                if (this.activeName == 'third') {
                    this.dialogImageUrl = file.url;
                    this.dialogImageVisibleAdd = true
                }
            },
            // 上传图片监听函数
            handlePictureBeforeUpload(file) {
                const isJPG = file.type === "image/png" || file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message({
                        message: "文件图片超过2MB，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (!isJPG) {
                    this.$message({
                        message: "只能上传jpg/png文件，请重新选择文件",
                        type: "error",
                        duration: 1500
                    });
                }
                if (isJPG && isLt2M) {
                    this.ruleForm.picture.push(file.uid);
                }
                return isJPG && isLt2M;
            },
            // 上传图片时
            handleRrogress(event, file, fileList) {
                this.saveAddInfoDisabled = true

            },
            // 上传图片成功回调
            handleSuccessUploadImage(response, file, fileList) {
                this.saveAddInfoDisabled = false
                if (this.activeName == 'third') {
                    this.liveUsPictureList = []
                    this.liveUsPictureList.push(response)
                } else {
                    promptUtil.warning(this, '上传失败')
                }
            },
            //上传文件失败回调
            handleErrorUpload(err, file, fileList) {
                // console.log('上传文件失败回调')
                promptUtil.wait(this);
            },
            //删除文件回调
            handlePictureRemove(file, fileList) {
                if (this.activeName == 'third') {
                    this.liveUsPictureList.splice(
                        this.liveUsPictureList.findIndex(item => item === file.url),
                        1
                    )
                }
            }
        },
        computed: {
            liveInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            },
            recycleBinInfoList: {
                get() {
                    return this.recycleBinQueryFromServer.length;

                }
            }
        }
    }
</script>

<style scoped>
  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    /*content: "\E634";*/
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

  .mt {
    margin-top: 20px;
  }

  .search {
    width: 50%;
    border-radius: 10px;
    color: #606266;
    margin-right: 10px;
    font-size: 16px;
  }

  .theRecycleBin {
    width: 50%;
    border-radius: 10px;
    color: #606266;
    margin-right: 10px;
    font-size: 16px;
  }

  .theRecycleBinBox {
    width: 50%;
    border-radius: 10px;
    color: #606266;
    margin-right: 10px;
    font-size: 16px;
  }


  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
