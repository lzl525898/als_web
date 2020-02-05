<template>
  <div>
    <el-page-header @back="goBack">
      <div slot="content" style="margin-top:5px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!--          <el-breadcrumb-item :to="goRouter">记上课</el-breadcrumb-item>-->
          <el-breadcrumb-item :to="{name:'classRecord', params: { tabs: currentTabs,item: currentItem}}">记上课
          </el-breadcrumb-item>
          <el-breadcrumb-item>记上课详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-page-header>
    <!--    firstCard-->
    <el-card class="box-card margin_top">
      <div class="showInformation">
        <div class="showInformationText">
          <p>
            <span>班级：{{basicCourse}}</span>
            <span class="padding_left20">校区：{{currentSchool}}</span>
            <span class="padding_left20">课程：{{currentCourse}}</span>
          </p>
        </div>
        <div class="showInformationSearch">
          <span>上课日期：{{classTime}}</span>
          <span class="padding_left20">
            <template>
              教师课时：<el-input-number v-model="teacherClass" @change="handleChange" size="small" :min="1" :max="10"
                                    label="描述文字" :disabled="disabled"></el-input-number>
            </template>
          </span>
          <span class="padding_left20">
            <template>
             教师：<el-select v-model="currentTeacher" clearable placeholder="请选择" size="small"
                           @change="selectTeacherChange" :disabled="reverseDisabled">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </span>
        </div>
      </div>

    </el-card>
    <!--    secondCard-->
    <el-card class="box-card margin_top">
      <el-row class="person">
        <span class="float_left">班级应到人数：<b class="b_text">{{comePeople}}</b>人</span>
        <span class="padding_left20 float_left">实到人数：<b class="b_text">{{comeNum}}</b>人</span>
        <span class="float_right"> <el-button type="primary" size="small"
                                              @click="addClassStudent" :disabled="disabled">添加上课学员</el-button></span>
      </el-row>
      <el-row>
        <div class="bgColor">
          <el-row style="height: 60px;line-height: 60px">
            <el-col :span="8">
              <span style="display: block;float: left">&nbsp&nbsp批量操作&nbsp&nbsp</span>
              <el-checkbox-group v-model="checkedBox" @change="handleCheckedStatusChange">
                <el-checkbox v-for="item in checkItem" :label="item.label" :key="item.key" :disabled="batchOperation">
                  {{item.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="12">
                <span style="padding-left: 80px;float: left;text-align: left">扣除课时
                 <el-input-number v-model="totalNum" @change="totalHandleChange" size="small" :min="1" :max="10"
                                  label="描述文字" :disabled="disabled"></el-input-number>
                 <span
                   style="width: 5px;height: 5px;background-color: #00a2ff;border-radius: 50%;display: inline-block"></span>
                 <b style="font-weight: normal;font-size: 14px;color:rgb(121, 134, 141)">可填小数，如0.5</b>
               </span>
            </el-col>

          </el-row>
          <!--          <p style="line-height: 60px">-->
          <!--           <span style="padding-left: 10px">批量操作&nbsp&nbsp-->
          <!--             <el-checkbox-group v-model="checkedBox" @change="handleCheckedStatusChange">-->
          <!--                <el-checkbox v-for="item in checkItem" :label="item.label" :key="item.key">{{item.label}}</el-checkbox>-->
          <!--              </el-checkbox-group>-->
          <!--           </span>-->
          <!--            <span style="padding-left: 80px">扣除课时-->
          <!--             <el-input-number v-model="num" @change="handleChange" size="small" :min="1" :max="10"-->
          <!--                              label="描述文字"></el-input-number>-->
          <!--            </span>-->
          <!--            <span-->
          <!--              style="width: 5px;height: 5px;background-color: #00a2ff;border-radius: 50%;display: inline-block"></span>-->
          <!--            <b style="font-weight: normal;font-size: 14px;color:rgb(121, 134, 141)">可填小数，如0.5</b>-->
          <!--          </p>-->
        </div>
      </el-row>
      <el-row>
        <template>
          <el-table
            :data="tableData"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column>
              <template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col :span="2" style="text-align: center;">
                    <div style="margin: 0 auto">
                      <div class="imgBox">
                        <img :src="scope.row.img" alt=""
                             style="width: 100%;height: 100%;border-radius: 50%">
                      </div>
                      <el-tag size="small" style="margin-left: 5px;margin-top: 5px" effect="dark">{{scope.row.status}}
                      </el-tag>
                      <span style="display:block;padding-top: 5px;padding-left: 5px">{{scope.row.studentName}}</span>
                    </div>
                  </el-col>
                  <el-col :span="22">
                    <el-row>
                      <div style="margin-top: 15px">
                        <div @click="handleCheckedItemStatusClick(scope.row)">
                          <el-checkbox-group v-model="scope.row.itemCheckedBox" @change="handleCheckedItemStatusChange"
                                             style="display: block;float: left">
                            <el-checkbox v-for="item in scope.row.checkItemStatus" :label="item.label" :key="item.key"
                                         :disabled="disabled">
                              {{item.label}}
                            </el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <span style="padding-left: 80px;float: left;display: block">扣除课时
                        <el-input-number v-model="scope.row.num" @change="handleChange" size="small" :min="0"
                                         :max="10"
                                         label="描述文字" :disabled="disabled"></el-input-number>
                    </span>
                      </div>
                    </el-row>
                    <el-row style="margin-top: 21px">
                      <span style="line-height: 50px">教师留言：</span>
                      <el-input type="textarea" v-model="scope.row.teacherMessage" style="width: 60%"
                                :disabled="disabled"></el-input>
                    </el-row>
                  </el-col>
                </el-row>
                <div v-show="delButton">
                    <span style="display: inline-block;color: red;position: absolute;top: 2px;right: -1px"><i
                      class="el-icon-circle-close" style="font-size: 25px;cursor: pointer"
                      @click="handleDelete(scope.$index, scope.row)"></i></span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>
      <!-- 分页 -->
      <el-row type="flex" justify="center" class="mt" v-show="showType" style="margin-top: 20px">
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
    <!--    添加上课学员dialog-->
    <addClassStudentDialog ref="addStudentDialog" @studentUpdate="studentInformationClick"></addClassStudentDialog>
    <!--    thired-->
    <!--   删除dialog开始-->
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
        <el-button type="primary" @click="handleDelStudent" :loading="isLoadingWithDel">确 定</el-button>
      </span>
    </el-dialog>
    <!--   删除dialog结束-->

    <el-card class="box-card margin_top">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col>
            <el-form-item label="活动形式:" prop="desc">
              <el-input type="textarea" v-model="ruleForm.desc" style="width: 50%" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="创建人:" prop="person">
              <el-input v-model="ruleForm.person" :disabled="reverseDisabled" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间:" prop="time">
              <el-input v-model="ruleForm.time" :disabled="reverseDisabled" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </el-card>
    <!--    button-->
    <el-card class="box-card margin_top ">
      <el-row>
        <div class="float_right">
          <el-button size="small" @click="cancelClick">取消</el-button>
          <el-button type="primary" size="small" @click="saveClick" :disabled="disabled">保存</el-button>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
    import '../../../router/router'
    import promptUtil from "../../../utils/promptUtil";
    import storageUtil from "../../../utils/storageUtil";
    import stringUtil from "../../../utils/stringUtil";
    import PubSub from 'pubsub-js'
    import {
        qs,
        getIntoAddClassData,
        saveStudentInformation,
        getAddClassData,
        saveRememberAddClass,
        batchSelection,
        updateManageDetailData
    } from "../../../api/api";
    import addClassStudentDialog from "../../component/addClassStudentDialog.vue";

    export default {
        components: {
            addClassStudentDialog
        },
        data() {
            return {
                // goRouter: ROUTER_RECORD_CLASS,
                currentTabs: '',
                currentItem: '',
                goRouter: '',
                basicCourse: '',//班级
                currentSchool: '',//校区
                currentCourse: '',//课程
                classTime: '',//上课时间
                teacherClass: 1,//教师课时
                totalNum: 1,//批量操作扣除课时
                comeNum: 0,//实到人数
                comeArray: [],//应到人数数组
                personArray: [],
                options: [],
                currentTeacher: '',//当前选择的教师
                ruleForm: {
                    desc: '',
                    person: '',
                    time: '',
                },
                comePeople: 0,//班级应到人数
                disabled: true,
                tableData: [],
                // teacherMessage: '',//教师留言
                dialogVisible: false,//添加上课学生dialog
                studentChildData: {},//接受子组件数据
                checkedBox: [],//当前选中的批量状态
                itemStatusArray: [],
                itemNum: '',//点击单个的计数器数据
                come: false,
                checked: false,
                checkItem: [{key: 1, label: '上课'}, {key: 2, label: '请假'}, {key: 3, label: '旷课'}],
                rowInformation: {},
                pageSize: 5, // 分页页码大小
                currentPage: 1, // 分页当前页码
                showType: false, // 是否显示分页
                queryFromServer: [],// 列表数据从服务器返回
                currentDelStudentIndex: 0, // 当前要删除的学生index
                delDialogContent: "", // 删除对话框中显示的内容
                isLoadingWithDel: false, // 删除确认对话框中确认按钮加载状态
                delDialogVisible: false, // 删除确认对话框显示状态
                currentIndex: '',//当前索引
                targetCurrentClass: {},//当前已经选择的班级
                currentStudentId: '',//记录要删除的学生id
                csId: '',//记录要删除的学生cs_id
                studentListArray: [],//保存获取回来的学生学生信息
                sendStudentHourArray: [],//学生的课时数组
                studentAddClasssStatus: '',//批量选择时的状态
                disabled: false,
                batchOperation: false,//批量操作复选框
                reverseDisabled: true,//创建时间创建人disable
                delButton: true,//删除按钮
                comeInitArray: [],
                comeArrayMouted: [],
                copyQueryFromServer: [],
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            if (this.$store.state.todayEnterStudentInformation == '') {
                this.$router.push({path: `/classRecord`})
                return
            }
            this.currentTabs = this.$route.params.tabs
            this.currentItem = this.$route.params.item
            PubSub.publish("currentMenuIndex", ROUTER_RECORD_CLASS);
            const moment = require("moment")
            getIntoAddClassData(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                calendar_id: this.$route.params.id
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        if (res.data.target.course_end > 0 && this.$store.state.todayEnterStudentInformation != 1) {
                            this.disabled = true
                            this.batchOperation = true
                            this.delButton = false
                        }
                        this.options = []
                        this.ruleForm.desc = res.data.target.desc
                        this.teacherClass = res.data.target.class_hour
                        this.basicCourse = res.data.target.classRoom.label
                        this.targetCurrentClass = res.data.target.classRoom
                        this.currentSchool = res.data.target.schoolName
                        this.currentCourse = res.data.target.courseId.name
                        this.ruleForm.person = res.data.target.create.name
                        this.ruleForm.time = res.data.target.create.date
                        this.classTime = moment(res.data.target.timestamp).format('YYYY-MM-DD hh:mm:ss')
                        this.studentListArray = res.data.studentArray
                        if (res.data.teacherArray.length > 0) {
                            res.data.teacherArray.forEach(item => {
                                const obj = {value: item.value, label: item.label}
                                this.options.push(obj)
                            })
                        }
                        this.currentTeacher = res.data.target.teacherObj.label
                        //渲染学生列表
                        if (res.data.studentArray.length > 0) {
                            res.data.studentArray.forEach(item => {
                                if (item.status == 1) {
                                    this.itemNum = 1
                                    this.comeInitArray.push(item.status)
                                    const val = {
                                        name: item.label,
                                        id: item.value,
                                        status: item.status
                                    }
                                    this.comeArrayMouted.push(val)
                                }
                                this.comeNum = this.comeInitArray.length

                                const obj = {
                                    id: item.value,
                                    status: item.ben_class,
                                    img: item.img_head,
                                    studentName: item.label,
                                    num: item.student_hour,
                                    cs_id: item.cs_id,
                                    itemCheckedBox: [item.status == 1 ? '上课' : (item.status == 3 ? '请假' : (item.status == 0 ? '' : '旷课'))],
                                    teacherMessage: item.con,
                                    checkItemStatus: [{key: 1, label: '上课'}, {key: 3, label: '请假'}, {
                                        key: 2,
                                        label: '旷课'
                                    }],
                                }
                                this.queryFromServer.push(obj)
                                this.copyQueryFromServer = this.queryFromServer
                                this.handleCurrentChange(this.currentPage)
                            })
                            this.comePeople = this.queryFromServer.length
                        }
                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            }).catch(err => {
                promptUtil.LOG('getClassDetailData-err', err)
            })
        },
        methods: {
            goBack() {
                this.$router.push({path: '/'})
            },
            selectTeacherChange(val) {
                // console.log("vallll", val)
            },
            //总体计数器
            totalHandleChange(val) {
                this.queryFromServer.forEach(item => {
                    item.num = val
                })
            },
            //每个个计数器
            handleChange(value) {
                this.itemNum = value
            },
            tableRowClassName({row, rowIndex}) {
                if (this.$route.params.tabs == 'record_2' && this.$route.params.item == 2) {
                    let currentSelectStudent = this.queryFromServer.findIndex(item => item.id === this.$store.state.enterStudentInformation.studentId)
                    if (rowIndex === currentSelectStudent) {
                        return 'success-row';
                    }
                    return '';
                }

            },
            //添加上课学员按钮
            addClassStudent() {
                this.dialogVisible = true
                getIntoAddClassData(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    calendar_id: this.$route.params.id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.$refs.addStudentDialog.start(res.data.classRoomArray, this.targetCurrentClass);
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getIntoAddSchedulesData-err', err)
                })

            },
            //从子组件取回的数据
            studentInformationClick(data) {
                this.studentChildData = data
                if (this.studentChildData.length > 0) {
                    this.studentChildData.forEach(item => {
                        this.queryFromServer.push(item)
                        this.handleCurrentChange(this.currentPage)
                    })
                }
                this.comePeople = this.queryFromServer.length
                if (this.queryFromServer.length > 0) {
                    this.batchOperation = false
                }
            },
            //批量操作上课状态 单选
            handleCheckedStatusChange(status) {
                if (status.length > 0) {
                    this.checkedBox = []
                    this.checkedBox.push(status[status.length - 1])
                    this.studentAddClasssStatus = this.checkedBox[0]
                } else {
                    this.studentAddClasssStatus = 0
                }
                if (this.queryFromServer.length > 0) {
                    let sendcsIdArray = []
                    this.queryFromServer.forEach(item => {
                        sendcsIdArray.push(item.cs_id)
                    })
                    batchSelection(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        calendar_id: this.$route.params.id,
                        cs_ids: sendcsIdArray,
                        //  status: this.studentAddClasssStatus == '上课' ? 1 : (this.studentAddClasssStatus == '请假' ? 3 : 2)
                        status: this.studentAddClasssStatus == '上课' ? 1 : (this.studentAddClasssStatus == '请假' ? 3 : (this.studentAddClasssStatus == '旷课' ? 2 : 0))
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data != '[]') {
                            }
                        } else if (res.code == ERROR_CODE) {
                            promptUtil.error(this, res.msg)
                        } else {
                            promptUtil.wait(this)
                        }
                    }).catch(err => {
                        promptUtil.LOG('batchSelection-err', err)
                    })
                }
                this.queryFromServer.forEach(item => {
                    item.itemCheckedBox = []
                    item.itemCheckedBox = this.checkedBox
                    item.itemCheckedBox.forEach(val => {
                        if (val == '请假') {
                            // this.queryFromServer.forEach(value => {
                            //     value.num = 0
                            // })
                            this.comeInitArray = []
                            this.comeInitArray.length = 0
                            this.comeNum = 0  //实到人数为0
                        } else if (val == '上课') {
                            this.comeInitArray = []
                            this.comeArrayMouted = []
                            this.queryFromServer.forEach(value => {
                                value.num = 1
                                if (value.itemCheckedBox[0] == '上课') {
                                    this.itemNum = 1
                                    this.comeInitArray.push(value.itemCheckedBox[0])
                                    const val = {
                                        name: value.studentName,
                                        id: value.id,
                                        status: value.itemCheckedBox[0]
                                    }
                                    this.comeArrayMouted.push(val)
                                }
                                this.comeNum = this.comeInitArray.length
                            })
                            if (this.comeNum === 0) {
                                this.comeArray.length = 0
                            }
                            if (this.queryFromServer.length == this.comeNum) {
                                // this.comeNum = 0
                                this.comeNum = this.queryFromServer.length
                            } else {
                                const obj = {
                                    name: item.studentName,
                                    id: item.id,
                                    status: '上课'
                                }
                                this.comeArray.push(obj)
                                // this.comeArray.push(val)
                                this.comeNum = this.comeArray.length
                            }
                        } else if (val == undefined) {
                            this.comeNum = 0
                        }
                    })
                })
            },
            //每个框中的单选
            handleCheckedItemStatusChange(val) {
                this.itemStatusArray = val
                this.queryFromServer.forEach(item => {
                    if (item.id === this.rowInformation.id) {
                        item.itemCheckedBox = []
                        item.itemCheckedBox.push(val[val.length - 1])
                        this.personArray = item.itemCheckedBox
                        this.personArray.forEach(value => {
                            this.studentAddClasssStatus = value
                            saveStudentInformation(qs.stringify({
                                school_id: storageUtil.readTeacherInfo().school_id,
                                calendar_id: this.$route.params.id,
                                student_id: this.rowInformation.id,
                                cs_id: this.rowInformation.cs_id,
                                status: this.studentAddClasssStatus == '上课' ? 1 : (this.studentAddClasssStatus == '请假' ? 3 : (this.studentAddClasssStatus == '旷课' ? 2 : 0))
                            })).then(res => {
                                if (res.code == SUCCESS_CODE) {
                                    if (res.data && res.data != '[]') {
                                    }
                                } else if (res.code == ERROR_CODE) {
                                    promptUtil.error(this, res.msg)
                                } else {
                                    promptUtil.wait(this)
                                }
                            }).catch(err => {
                                promptUtil.LOG('getSystematicStatistics-err', err)
                            })
                            if (value == '上课') {
                                this.rowInformation.num = 1
                                if (this.comeNum === 0) {
                                    this.comeArray = []
                                }
                                const obj = {
                                    name: this.rowInformation.studentName,
                                    id: this.rowInformation.id,
                                    status: this.rowInformation.itemCheckedBox[0]
                                }
                                this.comeArrayMouted.push(obj)
                                this.comeNum = this.comeArrayMouted.length
                            }
                            this.comeArray = this.comeArrayMouted
                            if (this.comeArray.length > 0) {
                                this.comeArray.forEach(studentId => {
                                    if (item.id === studentId.id) {
                                        if (value == '请假' || value == '旷课') {
                                            // this.rowInformation.num = 0
                                            let currentIndex = this.comeArray.findIndex(item => item.id === this.rowInformation.id)
                                            this.comeArray.splice(currentIndex, 1)
                                            this.comeNum = this.comeArray.length
                                        } else if (value == undefined) {
                                            let currentIndex = this.comeArray.findIndex(item => item.id === this.rowInformation.id)
                                            this.comeArray.splice(currentIndex, 1)
                                            this.comeNum = this.comeArray.length
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            },
            handleCheckedItemStatusClick(row) {
                this.rowInformation = row
            },
            //取消按钮
            cancelClick() {
                this.$router.push({
                    name: 'classRecord',
                    params: {
                        tabs: this.$route.params.tabs,
                        item: this.$route.params.item,
                    }
                })
            },
            //保存按钮
            saveClick() {
                if (this.studentListArray.length === 0 && this.queryFromServer.length === 0) {
                    promptUtil.warning(this, '请添加上课学员')
                    return
                }
                if (this.queryFromServer.length > 0) {
                    this.sendStudentHourArray = []
                    this.queryFromServer.forEach(item => {
                        const obj = {
                            id: item.cs_id,
                            student_id: item.id,
                            class_hour: item.num,
                            con: item.teacherMessage
                        }
                        this.sendStudentHourArray.push(obj)
                    })
                }
                saveRememberAddClass(qs.stringify({
                    calendar_id: this.$route.params.id,
                    class_hour: this.teacherClass,
                    student_hour: JSON.stringify(this.sendStudentHourArray),
                    desc: this.ruleForm.desc,
                    type: 1
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data) {
                            promptUtil.success(this, '保存成功')
                            this.$router.push({path: `/classRecord`})
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
            //删除column
            handleDelete(index, row) {
                this.delDialogVisible = true
                this.currentStudentId = row.id
                this.csId = row.cs_id
                this.currentIndex = index
                this.delDialogContent = "您确定要删除 【 " + row.studentName + " 】 吗？"
            },
            //删除dialog中的确定按钮
            handleDelStudent() {
                this.isLoadingWithDel = true;
                this.queryFromServer.forEach(item => {
                    if (item.id === this.currentStudentId && item.itemCheckedBox[0] == '上课') {
                        let currentDelStudentIndex = ""
                        currentDelStudentIndex = this.comeArrayMouted.findIndex(val => val.id === item.id)
                        this.comeArrayMouted.splice(currentDelStudentIndex, 1)
                        this.comeNum = this.comeArrayMouted.length
                    }
                })
                saveStudentInformation(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    calendar_id: this.$route.params.id,
                    student_id: this.currentStudentId,
                    cs_id: this.csId,
                    del: 1,
                    status: 1,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.isLoadingWithDel = false;
                            this.currentDelStudentIndex = this.currentIndex + (this.currentPage - 1) * this.pageSize; // 为学生索引，不是学生id
                            this.queryFromServer.splice(this.currentDelStudentIndex, 1)
                            this.handleCurrentChange(this.currentPage)
                            this.delDialogVisible = false;
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('saveStudentInformation-err', err)
                })
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
<style>
  .el-table .warning-row {
    background: oldlace !important;
  }

  .el-table .success-row {
    background: oldlace !important;
  }
</style>
<style scoped>


  .el-card {
    font-size: 14px !important;
  }

  .margin_top {
    margin-top: 20px;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .showInformationText {
    padding-left: 10px;
    padding-right: 10px;

  }

  .padding_left20 {
    padding-left: 40px;
  }

  .showInformationSearch {
    border-top: 1px #eee solid;
    line-height: 43px;
    padding-top: 20px;
    padding-left: 10px;
  }

  .b_text {
    font-weight: normal;
    color: red;
  }

  .person {
    padding-left: 10px;
    padding-bottom: 15px;
    border-bottom: 1px #eee solid;
    line-height: 40px;
  }

  .float_left {
    float: left;
  }

  .float_right {
    float: right;
  }

  .bgColor {
    background-color: rgb(243, 248, 253);
  }

  .imgBox {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 0 auto;

    /*background-color: red;*/
  }

  .deletedBtn {
    position: relative;
    overflow: hidden;
  }

  .deletedBtn span {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
  }

  .el-icon-circle-close {
    font-size: 10px;
    color: red;
  }

  .el-table thead {
    position: absolute !important;
  }

</style>
