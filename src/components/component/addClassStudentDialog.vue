<template>
  <div>
    <el-dialog
      :title="$t(`message.record_detail_add_student`)"
      :visible.sync="dialogVisible"
      width="660px"
      :before-close="handleClose">
      <el-row>
        <el-alert
          :title="$t(`message.record_dialog_current_course`)+'：'+targetCourseName+'；'+$t(`message.record_dialog_support_insert_class`)"
          type="warning"
          :closable="false"
          class="marginTopBottom">
        </el-alert>
      </el-row>
      <el-row :gutter="10" style="margin-top: -10px">
        <el-form>
          <el-col :span="16">
            <el-form-item>
              <el-select v-model="dialogForm.currentClass" clearable :placeholder="$t(`message.consult_select_label_title`)" style="width: 100%"
                         @change="currentClassChange" size="small">
                <el-option
                  v-for="item in dialogForm.selectClassArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="dialogForm.studenName" :placeholder="$t(`message.student_management_enter_student_name`)" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button icon="el-icon-search" style="float: right;margin-top: 5px" @click="searchStudent"
                       size="small"></el-button>
          </el-col>
        </el-form>
      </el-row>
      <el-card>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="30">
          </el-table-column>
          <el-table-column
            :label="$t(`message.string_label_student`)"
            align="center"
            width="120px"
          >
            <template slot-scope="scope">
              <img :src="scope.row.img" alt=""
                   style="width: 16px;height: 16px;border-radius: 50%;float: left;margin-left: 10px;margin-top: 3px">
              <span style="float: left;padding-left: 13px">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="className"
            :label="$t(`message.classroom_table_column_classname`)"
            align="center"
          >
          </el-table-column>
          <el-table-column
            :label="$t(`message.student_management_create_student_phone`)"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.phone }}</template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer" style="display: flex; justify-content: space-between;margin-top: 8px">
          <el-button @click="dialogVisible = false" size="mini">{{$t(`message.button_cancel`)}}</el-button>
        <div v-if="selectStudentNum==0">
             <el-tag :type="selectType" style="margin-top: 10px">{{$t(`message.record_dialog_already_select_student`)}}{{selectStudentNum}}{{$t(`message.record_dialog_already_select_student_sin`)}}<i
               class="el-icon-circle-close" style="padding-left: 3px;cursor: pointer" v-show="showClose"></i></el-tag>
        </div>
        <div v-else>
          <el-tooltip placement="top" effect="light">
            <div v-for="(item,index) in multipleSelection" :key="index" slot="content">{{item.name}}<i
              style="padding-left: 5px;cursor: pointer" class="el-icon-circle-close"
              @click="coloseItemStudent(item.id)"></i><br/><br/></div>
            <el-tag :type="selectType" style="margin-top: 10px">{{$t(`message.record_dialog_already_select_student`)}}{{selectStudentNum}}{{$t(`message.record_dialog_already_select_student_sin`)}}<i
              class="el-icon-circle-close" style="padding-left: 3px;cursor: pointer" v-show="showClose"
              @click="toggleSelection()"></i></el-tag>
          </el-tooltip>
        </div>
        <el-button type="primary" @click="dialogSure" size="mini">{{$t(`message.button_confirm`)}}</el-button>
      </span>

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

    </el-dialog>
  </div>
</template>
<script>
    import '../../api/restfulapi'
    import promptUtil from '../../utils/promptUtil'
    import stringUtil from '../../utils/stringUtil'
    import storageUtil from '../../utils/storageUtil'
    import {qs, getAddClassData, saveAddClassStudentData} from '../../api/api'

    export default {
        name: "addClassStudentDialog",
        data() {
            return {
                targetCourseName: '',
                num: "",
                dialogVisible: false,//添加上课学生dialog
                dialogForm: {
                    studenName: '',
                    currentClass: '',//dialog当前选择的班级
                    selectClassArray: [{label: '', value: 0}],
                },
                tableData: [],
                queryFromServer: [],// 列表数据从服务器返回
                multipleSelection: [],
                selectType: 'info',//没有选择学生的样式
                showClose: false,//没有选择学生隐藏关闭按钮
                selectStudentNum: 0,
                tooltipStudent: [],
                currentSelectStudent: '',
                classId: 0,//class_id
                pageSize: 5, // 分页页码大小
                currentPage: 1, // 分页当前页码
                showType: false, // 是否显示分页
                sendStudentArray: [],//传给后台的学生id数组
                studentInformationArray: []
            }
        },
        watch: {
            '$i18n.locale': function () {
                this.dialogForm.selectClassArray[0].label = this.$t(`message.string_label_all`)
            }
        },
        mounted() {
          this.dialogForm.selectClassArray[0].label = this.$t(`message.string_label_all`)
        },
        methods: {
            start(obj, val, courseName) {
                this.queryFromServer.length = 0
                this.queryFromServer = []
                this.handleCurrentChange(this.currentPage)
                this.dialogForm.currentClass = val.label
                this.dialogVisible = true
                this.targetCourseName = courseName
                obj.unshift({label: this.$t(`message.string_label_all`), value: 0})
                this.dialogForm.selectClassArray = obj
            },
            //关闭dialog
            handleClose(done) {
                done();
            },
            //搜索学生
            searchStudent() {
                this.classStudentData()
            },
            // 选择班级
            currentClassChange(event) {
                this.queryFromServer = []
                this.classId = event
                this.classStudentData()
            },
            // dialog中的确定按钮
            dialogSure() {
                this.sendStudentArray = []
                this.studentInformationArray=[]
                if (this.multipleSelection.length > 0) {
                    this.multipleSelection.forEach(item => {
                        const obj = {student_id: item.id, class_id: this.classId}
                        this.sendStudentArray.push(obj)
                    })
                }else{
                    promptUtil.warning(this,this.$t(`message.record_please_select_student`))
                    return
                }
                saveAddClassStudentData(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    calendar_id: this.$route.params.id,
                    students: this.sendStudentArray
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            if (res.data.length > 0) {
                                res.data.forEach(item => {
                                    const obj = {
                                        id: item.id,
                                        status: item.status,
                                        img: item.img,
                                        studentName: item.studentName,
                                        cs_id:item.cs_id,
                                        num: 1,
                                        itemCheckedBox: [],
                                        checkItemStatus: [
                                            {key: 1, label: this.$t(`message.string_label_start_class`)},
                                            {key: 3, label: this.$t(`message.string_label_class_takeleave`)},
                                            {key: 2, label: this.$t(`message.string_label_class_truancy`)}],
                                    }
                                    this.studentInformationArray.push(obj)
                                })
                                this.$emit('studentUpdate', this.studentInformationArray)
                                this.dialogVisible = false
                            }
                            this.dialogForm.studenName = ''
                            this.dialogForm.currentClass = ''
                            this.queryFromServer = []
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('saveAddClassStudentData-err', err)
                })
            },
            //选择的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.selectStudentNum = this.multipleSelection.length
                if (this.selectStudentNum > 0) {
                    this.selectType = ''
                    this.showClose = true
                    this.multipleSelection.forEach(item => {
                        this.tooltipStudent.push(item)
                    })
                } else {
                    this.selectType = 'info'
                    this.showClose = false
                }
            },
            //点击close图标取消选择学生
            toggleSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            coloseItemStudent(id) {
                if (this.multipleSelection.length > 0) {
                    this.currentSelectStudent = this.multipleSelection.findIndex(item => item.id === id)
                    let temp=[]
                    temp=this.multipleSelection
                    this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[this.currentSelectStudent], false);
                    temp.splice(this.currentSelectStudent, 1)
                    this.multipleSelection=temp
                }
            },
            classStudentData() {
                getAddClassData(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    calendar_id: this.$route.params.id,
                    class_id: this.classId,
                    student_str: this.dialogForm.studenName
                })).then(res => {
                    this.queryFromServer.length=0
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.dialogForm.studenName = ""
                            res.data.forEach(item => {
                                const obj = {
                                    id: item.value,
                                    name: item.label,
                                    phone: item.phone,
                                    img: item.img_head,
                                    className: item.className
                                }
                                this.queryFromServer.push(obj)
                                this.handleCurrentChange(this.currentPage)
                            })
                        }else if(res.data && res.data == '[]'){
                            this.dialogForm.studenName = ""
                            this.queryFromServer.length=0
                            this.handleCurrentChange(this.currentPage)
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getAddClassData-err', err)
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

<style scoped>
  .marginTopBottom {
    margin-top: -20px;
    margin-bottom: 20px;
  }
</style>
