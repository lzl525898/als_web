<template>
  <div>
    <el-dialog :title="$t(`message.record_edit_day`)" :visible.sync="dialogVisible" width="840px" :before-close="beforeCloseDialog">
      <el-form :model="classEditorForm" :rules="classEditorRules" ref="classEditorForm" label-width="100px">
        <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
          <el-col :span="8">
            <el-form-item :label="$t(`message.calendar_dialog_class_category`)" prop="coursePackage" size="mini" class="fontWeight">
              <el-select v-model="classEditorForm.coursePackage" :placeholder="$t(`message.calendar_dialog_class_category_warning`)" style="width: 150px" @change="onChangeCoursePackage">
                  <el-option
                    v-for="item in addSchedulesInfo.courseArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t(`message.index_course_class_type`)" prop="courseType" size="mini" class="fontWeight">
              <el-select v-model="classEditorForm.courseType" :placeholder="$t(`message.calendar_dialog_class_type_warning`)" style="width: 150px" @change="onChangeCourseType">
                <el-option v-for="item in addSchedulesInfo.courseTypeArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="isShowCourseStage">
            <el-form-item :label="$t(`message.calendar_dialog_class_stage`)" prop="courseStage" size="mini" class="fontWeight">
              <el-select v-model="classEditorForm.courseStage" :placeholder="$t(`message.calendar_dialog_class_stage_warning`)" style="width: 150px" @change="onChangeCourseStage">
                <el-option v-for="item in addSchedulesInfo.courseStageArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
          <el-col :span="8">
            <el-form-item :label="$t(`message.calendar_filter_teacher`)" prop="teacher" size="mini" class="fontWeight">
              <el-select v-model="classEditorForm.teacher.id" :placeholder="$t(`message.calendar_filter_select_teacher`)" style="width: 150px" @change="onChangeTeacher">
                <el-option
                  v-for="item in addSchedulesInfo.teacherArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <div style="display: flex;align-items: center">
                    <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                    <div style="margin-left: 40px">{{ item.label }}</div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t(`message.user_system_school_student_count`)" prop="student" size="mini" class="fontWeight">
              <el-input-number v-model="classEditorForm.student" :min="1" :max="100" :label="$t(`message.user_system_school_student_count`)" style="width: 150px" @change="onChangeStudent"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="isShowClassRoom">
            <el-form-item :label="$t(`message.calendar_filter_class`)" prop="classroom" size="mini" class="fontWeight">
              <el-select v-model="classEditorForm.classroom" :placeholder="$t(`message.calendar_filter_select_class_point`)" style="width: 150px">
                <el-option v-for="item in addSchedulesInfo.classroomArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
          <el-col :span="8">
            <el-form-item :label="$t(`message.index_course_class_type`)" prop="classType" size="mini" class="fontWeight">
              <el-switch
                :disabled="true"
                style="margin-top: -4px;"
                v-model="classEditorForm.classType"
                :active-text="$t(`message.string_label_course_cycle`)"
                :inactive-text="$t(`message.string_label_course_temporary`)">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
          <el-col :span="24">
            <el-form-item :label="$t(`message.calendar_dialog_course_time`)" prop="schedules" size="mini" class="fontWeight">
              <div v-show="!classEditorForm.classType">
                <div class="class-hours" v-for="item in classEditorForm.schedulesTmp" :key="item.id">
                  <el-date-picker v-model="item.day" type="date" :placeholder="$t(`message.picker_date_day_placeholder`)" value-format="yyyy-MM-dd"></el-date-picker>
                  <el-time-select
                    :placeholder="$t(`message.picker_time_start_placeholder`)"
                    v-model="item.startTime"
                    :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                  </el-time-select>
                  <el-time-select
                    :placeholder="$t(`message.picker_time_end_placeholder`)"
                    v-model="item.endTime"
                    :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                  </el-time-select>
                </div>
              </div>
              <div v-show="classEditorForm.classType">
                <div class="class-hours" v-for="item in classEditorForm.schedulesCycle" :key="item.id">
                  <el-select v-model="item.week" :placeholder="$t(`message.calendar_dialog_course_weeks`)" style="width: 220px">
                    <el-option v-for="weekItem in weeksArray" :key="weekItem.value" :label="weekItem.label" :value="weekItem.value"></el-option>
                  </el-select>
                  <el-time-select
                    :placeholder="$t(`message.picker_time_start_placeholder`)"
                    v-model="item.startTime"
                    :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                  </el-time-select>
                  <el-time-select
                    :placeholder="$t(`message.picker_time_end_placeholder`)"
                    v-model="item.endTime"
                    :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                  </el-time-select>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
          <el-col :span="24">
            <el-form-item :label="$t(`message.string_label_remark`)" prop="desc" size="mini" class="fontWeight">
              <el-input type="textarea" v-model="classEditorForm.desc" :rows="2" :placeholder="$t(`message.calendar_dialog_course_cycle_placeholder`)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="display:flex;justify-content:flex-end;padding:0;margin: 0 10px 0 0;">
          <el-button @click="beforeCloseDialog" size="small">{{$t(`message.button_cancel`)}}</el-button>
          <el-button type="primary" @click="editClassEditorSchedules" size="small" :loading="isUpdateLoading">{{$t(`message.button_confirm`)}}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  const moment = require('moment')
  import '../../api/restfulapi'
  import PubSub from 'pubsub-js'
  import { qs, updateSchedule, getClassByTeacher, getIntoAddSchedulesData } from '../../api/api'
  import promptUtil from '../../utils/promptUtil'
  import staticUtil from '../../utils/staticUtil'
  import storageUtil from '../../utils/storageUtil'
  export default {
    name: "classEditorDialog",
    data(){
      return{
        weeksArray: [
          {label:'',value:1},
          {label:'',value:2},
          {label:'',value:3},
          {label:'',value:4},
          {label:'',value:5},
          {label:'',value:6},
          {label:'',value:7}
        ],
        dialogVisible: false,
        isShowCourseStage: true,
        isShowClassRoom: true,
        classEditorForm: {
          coursePackage: '', // 课程分类
          courseType: '', // 课程类型
          courseStage: '', // 课程阶段
          courseCycle: 1, // 课程周期
          teacher:{color:'',id:''}, // 教师
          student: 8, // 学生数量
          classroom: '', // 授课班级
          classType: false, // 课程类型 true-周期课 false-临时课
          schedulesCycle: [{day:'', startTime:'', endTime:'', startRuleTime:'', endRuleTime:'', timestamp:'', week:''}],// 周期课
          schedulesTmp: [{day:'', startTime:'', endTime:'', startRuleTime:'', endRuleTime:'', timestamp:''}],// 临时课
          desc: '', // 备注
        },
        classEditorRules: {
          coursePackage: [
            { required: true, message: '', trigger: 'blur' }
          ],
          courseType: [
            { required: true, message: '', trigger: 'blur' }
          ],
          courseStage: [
            { required: true, message: '', trigger: 'blur' }
          ],
          teacher: [
            { required: true, message: '', trigger: 'blur' }
          ],
          classroom: [
            { required: true, message: '', trigger: 'blur' }
          ],
          courseCycle: [
            { required: true, message: '', trigger: 'blur' },
            {pattern: /^\+?[1-9][0-9]*$/, message: ''}
          ],
          student: [
            {pattern: /^\+?[1-9][0-9]*$/, message: ''}
          ]
        },
        addSchedulesInfo: { // 添加新课程时需要从服务器获取的数据
          courseArray: [], // 课程分类
          courseTypeArray: [], // 课程类型
          courseStageArray: [], // 课程阶段
          teacherArray: [], // 授课教师
          classroomArray: [], // 选择班级
        },
        updateScheduleObj: '',
        isUpdateLoading: false,
      }
    },
    watch: {
        '$i18n.locale': function () {
            this.initLangData()
        }
    },
    mounted() {
      this.initLangData()
      this.isUpdateLoading = false
    },
    methods:{
      initLangData(){
          this.weeksArray = [
              {label:this.$t(`message.string_label_mon`),value:1},
              {label:this.$t(`message.string_label_tue`),value:2},
              {label:this.$t(`message.string_label_wed`),value:3},
              {label:this.$t(`message.string_label_thur`),value:4},
              {label:this.$t(`message.string_label_fri`),value:5},
              {label:this.$t(`message.string_label_sat`),value:6},
              {label:this.$t(`message.string_label_sun`),value:7}
          ]
          this.classEditorRules.coursePackage[0].message = this.$t(`message.calendar_dialog_class_category_warning`)
          this.classEditorRules.courseType[0].message = this.$t(`message.calendar_dialog_class_type_warning`)
          this.classEditorRules.courseStage[0].message = this.$t(`message.calendar_dialog_class_stage_warning`)
          this.classEditorRules.teacher[0].message = this.$t(`message.calendar_filter_select_teacher`)
          this.classEditorRules.classroom[0].message = this.$t(`message.calendar_filter_select_class_point`)
          this.classEditorRules.courseCycle[0].message = this.$t(`message.calendar_filter_select_course_week`)
          this.classEditorRules.courseCycle[1].message = this.$t(`message.calendar_filter_input_about_zero`)
          this.classEditorRules.student[0].message = this.$t(`message.calendar_filter_input_about_zero`)
      },
      editClassEditorSchedules(){
        // packageId 表示的时calendarid
        this.isUpdateLoading = true
        const obj = staticUtil.clone(this.classEditorForm)
        obj.desc = obj.desc ? obj.desc : ""
        obj.id = this.updateScheduleObj.packageId
        obj.classType = obj.classType ? 1: 0
        obj.courseType = (this.getTargetObjByString(obj.courseType,4)).value
        obj.classroom = (this.getTargetObjByString(obj.classroom,1)).value
        obj.courseStage = (this.getTargetObjByString(obj.courseStage,3)).value
        obj.coursePackage = (this.getTargetObjByString(obj.coursePackage,2)).value
        if(obj.classType==1){ // 周期课
          obj.schedulesTmp = ""
          obj.schedulesCycle = obj.schedulesCycle[0]
        }else{
          obj.schedulesCycle = ""
          obj.schedulesTmp = obj.schedulesTmp[0]
        }
        obj.teacher = this.getTargetObjByString(obj.teacher.label,5)
        obj.teacher.id = obj.teacher.value
        obj.courseTable = this.updateScheduleObj.courseId.table
        updateSchedule(qs.stringify({
          schedule: obj
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            promptUtil.success(this,this.$t(`message.string_label_update_success`))
            PubSub.publish("REFRESH_COURSE_RECORD", 'ok');
          } else {
            promptUtil.warning(this, res.msg)
          }
          this.isUpdateLoading = false
          this.beforeCloseDialog()
        }).catch(err=>{
          this.isUpdateLoading = false
            promptUtil.LOG("updateSchedule-err",err)
        })
      },
      beforeCloseDialog(done){
        this.isUpdateLoading = false
        try{
          this.classEditorForm.teacher.id = "";
          this.$refs['classEditorForm'].resetFields();
          if(done){
            done()
          }
        }catch (e) {}finally {
          this.dialogVisible = false
        }
      },
      initDate(data, info){
        if(info.tableName=='related_courses_self'){ // 自定义课程
          this.addSchedulesInfo.courseArray = data.courseSelfArray
        } else if(info.tableName=='related_courses'){ // 系统课程
          const selfCourseArray = []
          const courseArray = data.courseArray
          courseArray.map(course=>{
            course.options.map(item=>selfCourseArray.push(item))
          })
          this.addSchedulesInfo.courseArray = selfCourseArray
        }
        this.addSchedulesInfo.teacherArray = data.teacherArray
        this.addSchedulesInfo.classroomArray = data.classRoomArray
        this.addSchedulesInfo.courseTypeArray = data.courseTypeArray
        this.addSchedulesInfo.courseStageArray = data.courseStageArray
        this.updateScheduleObj = data.target
      },
      getTargetObjByString(value, type){
        if(this.addSchedulesInfo){
          if(type==1){ // classroomArray
            let classObj = this.addSchedulesInfo.classroomArray.find(item=> item.label==value)
            if(!classObj || classObj==null || classObj==[]){
              classObj = this.addSchedulesInfo.classroomArray.find(item=> item.value==value)
            }
            return classObj
          } else if (type==2){ // courseArray
            let teaObj = this.addSchedulesInfo.courseArray.find(item=> item.label==value)
            if(!teaObj || teaObj==null || teaObj==[]){
              teaObj = this.addSchedulesInfo.courseArray.find(item=> item.value==value)
            }
            return teaObj
          } else if (type==3){ // courseStageArray
            let courseObj = this.addSchedulesInfo.courseStageArray.find(item=> item.label==value)
            if(!courseObj || courseObj==null || courseObj==[]){
              courseObj = this.addSchedulesInfo.courseStageArray.find(item=> item.value==value)
            }
            return courseObj
          } else if (type==4){ // courseTypeArray
            let typeObj = this.addSchedulesInfo.courseTypeArray.find(item=> item.label==value)
            if(!typeObj || typeObj==null || typeObj==[]){
              typeObj = this.addSchedulesInfo.courseTypeArray.find(item=> item.value==value)
            }
            return typeObj
          } else if (type==5){ // teacherArray
            let teachObj = this.addSchedulesInfo.teacherArray.find(item=> item.label==value)
            if(!teachObj || teachObj==null || teachObj==[]){
              teachObj = this.addSchedulesInfo.teacherArray.find(item=> item.value==value)
            }
            return teachObj
          }
        }else{
          return {value:0}
        }
      },
      showOrHideDialog(status, info=null){
        try{
          this.classEditorForm.teacher.id = "";
          this.$refs['classEditorForm'].resetFields();
        }catch (e) {} finally {
          if(status && info!=null){
            const loading = promptUtil.loading(this)
            getIntoAddSchedulesData(qs.stringify({
              school_id : storageUtil.readTeacherInfo().school_id,
              calendar_id: info.id
            })).then(res=>{
              this.initDate(res.data, info)
              this.classEditorForm.coursePackage = this.getPackageObjById(this.updateScheduleObj.courseId.id * 1).label
              this.classEditorForm.courseType = this.getCourseTypeInfo(this.updateScheduleObj.courseTypeId * 1).label
              this.classEditorForm.courseStage = this.getCourseStageById(this.updateScheduleObj.courseStage.value * 1).label
              this.classEditorForm.student = this.updateScheduleObj.maxStudent * 1
              this.classEditorForm.teacher = {
                id: this.getTeacherObjById(this.updateScheduleObj.teacherObj.value * 1).label,
                label:this.getTeacherObjById(this.updateScheduleObj.teacherObj.value * 1).label,
                color:this.getColorByTeacherId(this.updateScheduleObj.teacherObj.value)
              }
              this.classEditorForm.classType = this.updateScheduleObj.cycle * 1 == 1 ? true : false
              this.classEditorForm.desc = this.updateScheduleObj.desc
              if (this.classEditorForm.classType) {
                this.classEditorForm.schedulesCycle[0].day = moment(this.updateScheduleObj.timestamp).format("YYYY-MM-DD")
                this.classEditorForm.schedulesCycle[0].startTime = this.updateScheduleObj.startTime
                this.classEditorForm.schedulesCycle[0].endTime = this.updateScheduleObj.endTime
                this.classEditorForm.schedulesCycle[0].startRuleTime = "08:00"
                this.classEditorForm.schedulesCycle[0].endRuleTime = "08:00"
                this.classEditorForm.schedulesCycle[0].timestamp = this.updateScheduleObj.timestamp
                this.classEditorForm.schedulesCycle[0].week = this.getWeekValueWithString(this.getWeekWithString(moment(this.updateScheduleObj.timestamp).format("dddd")))
              } else {
                this.classEditorForm.schedulesTmp[0].day = moment(this.updateScheduleObj.timestamp).format("YYYY-MM-DD")
                this.classEditorForm.schedulesTmp[0].startTime = this.updateScheduleObj.startTime
                this.classEditorForm.schedulesTmp[0].endTime = this.updateScheduleObj.endTime
                this.classEditorForm.schedulesTmp[0].startRuleTime = "08:00"
                this.classEditorForm.schedulesTmp[0].endRuleTime = "08:00"
                this.classEditorForm.schedulesTmp[0].timestamp = this.updateScheduleObj.timestamp
              }
              getClassByTeacher(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                teacher_id: this.updateScheduleObj.teacherObj.value * 1//this.ruleForm.teacher.id
              })).then(res => {
                if (res.code == SUCCESS_CODE) {
                  if (res.data && res.data != '[]') {
                    this.addSchedulesInfo.classroomArray = this.getDataReturnArray(res.data)
                    this.classEditorForm.classroom = this.getClassRoomObjById(this.updateScheduleObj.classRoom.value * 1).label
                  }
                }
                this.dialogVisible = status
                loading.close()
              }).catch(err => {
                loading.close()
                promptUtil.LOG("getClassByTeacher-err",err)
              })
            }).catch(err=>{
              loading.close()
              promptUtil.LOG('getIntoAddSchedulesData-err',err)
            })
          }
        }
      },
      // 根据班级id返回班级对象
      getClassRoomObjById(id){
        const obj = this.addSchedulesInfo.classroomArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据教师id返回教师对象
      getTeacherObjById(id){
        const obj = this.addSchedulesInfo.teacherArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据阶段id返回阶段对象
      getCourseStageById(id){
        const obj = this.addSchedulesInfo.courseStageArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      getCourseTypeInfo(data){
        if(Number.isInteger(data)){ // 通过id查
          return this.addSchedulesInfo.courseTypeArray.find(item=>item.value==data)
        }else{ // 通过名字查
          return this.addSchedulesInfo.courseTypeArray.find(item=>item.label==data)
        }
      },
      getPackageObjById(id){
        const objArray = []
        const tmpObj = this.addSchedulesInfo.courseArray[0]
        let obj = ''
        if(tmpObj.options){ // 系统课程
          this.addSchedulesInfo.courseArray.map(item=>{
            item.options.map(itemOpt=>{
              objArray.push(itemOpt)
            })
          })
          obj = objArray.find(item => item.value == id)
        }else{ // 自定义课程
          obj = this.addSchedulesInfo.courseArray.find(item => item.value == id)
        }
        return obj
      },
      // 选择自定义授课教师时返回数据
      onChangeTeacher(val) {
        this.classEditorForm.teacher.color = this.getColorByTeacherId(val)
        getClassByTeacher(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          teacher_id: val
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.addSchedulesInfo.classroomArray = this.getDataReturnArray(res.data)
            }
          }
          this.isShowClassRoom = true
        }).catch(err=>{
          promptUtil.LOG("getClassByTeacher-err",err)
        })
      },
      getDataReturnArray(data){
        return (data && data.length>0) ? data : []
      },
      // 修改自定义学生个数时返回数据
      onChangeStudent(val){
        this.classEditorForm.student = val
      },
      // 根据teacherId返回教师颜色
      getColorByTeacherId(id){
        const obj = this.addSchedulesInfo.teacherArray.find(item => item.value == id)
        return obj.color
      },
      // 重置dialog对话框
      resetClassEditorDialog(status=false){
        this.showOrHideDialog(status)
      },
      // 选择自定义课程分类时返回数据
      onChangeCoursePackage(val) {
        this.isShowCourseStage = true
      },
      // 选择课程类别时返回数据
      onChangeCourseType(val){
        this.classEditorForm.courseType = val
      },
      // 选择自定义课程阶段时返回数据
      onChangeCourseStage(val){
        this.classEditorForm.courseStage = val
      },
      // 根据字符串返回星期
      getWeekWithString(str){
        switch (str) {
          case 'Monday':
                return this.$t(`message.string_label_mon`)
            case 'Tuesday':
                return this.$t(`message.string_label_tue`)
            case 'Wednesday':
                return this.$t(`message.string_label_wed`)
            case 'Thursday':
                return this.$t(`message.string_label_thur`)
            case 'Friday':
                return this.$t(`message.string_label_fri`)
            case 'Saturday':
                return this.$t(`message.string_label_sat`)
            case 'Sunday':
                return this.$t(`message.string_label_sun`)
        }
      },
      // 根据字符串返回周几的值1~7
      getWeekValueWithString(str){
          const mon = this.$t(`message.string_label_mon`)   // Monday
          const tue = this.$t(`message.string_label_tue`)   // Tuesday
          const wed = this.$t(`message.string_label_wed`)   // Wednesday
          const thur = this.$t(`message.string_label_thur`) // Thursday
          const fri = this.$t(`message.string_label_fri`)   // Friday
          const sat = this.$t(`message.string_label_sat`)   // Saturday
          const sun = this.$t(`message.string_label_sun`)   // Sunday
          switch (str) {
              case mon:
                  return 1
              case tue:
                  return 2
              case wed:
                  return 3
              case thur:
                  return 4
              case fri:
                  return 5
              case sat:
                  return 6
              case sun:
                  return 7
              default:
                  return str
          }
      },
    }
  }
</script>

<style scoped>

</style>
