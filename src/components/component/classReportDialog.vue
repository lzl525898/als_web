<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center id="classReportDialog">
      <div slot="title" style="background-color:#409EFF;margin:-20px;height:50px;display:flex;justify-content:center;flex:1;align-items:center">
        <div style="color:#fff">{{$t(`message.record_dialog_wait_student`)}}</div>
      </div>
      <div v-if="students.attendance.length>0">
        <div style="background-color:#aabbcc;height:20px;display:flex;flex:1;justify-content:center;align-items:center;color:#333">{{$t(`message.record_dialog_active_student`)}}:{{students.attendance.length}}</div>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" v-for="(stu,index) in students.attendance" :key="index" style="margin-top: 10px;">
            <div style="flex:1;display:flex;justify-content:center;">
              <div style="position:relative">
                <el-avatar style="height:60px;width:60px" :src="stu.avatar"></el-avatar>
                <el-tag v-if="stu.type==1" style="position:absolute;top:40px;left:12px;" size="mini" effect="dark">{{$t(`message.record_dialog_school_read`)}}</el-tag>
                <el-tag v-if="stu.type==0" style="position:absolute;top:40px;left:12px;" size="mini" effect="dark" type="danger">{{$t(`message.record_dialog_school_unread`)}}</el-tag>
              </div>
            </div>
            <div style="text-align:center">{{stu.name}}</div>
          </el-col>
        </el-row>
      </div>
      <div v-if="students.absenceduty.length>0">
        <div style="background-color:#aabbcc;height:20px;display:flex;flex:1;justify-content:center;align-items:center;color:#333">{{$t(`message.record_dialog_school_no_student`)}}:{{students.absenceduty.length}}人</div>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" v-for="(stu,index) in students.absenceduty" :key="index" style="margin-top: 10px;">
            <div style="flex:1;display:flex;justify-content:center;">
              <div style="position:relative">
                <el-avatar style="height:60px;width:60px" :src="stu.avatar"></el-avatar>
                <div v-if="stu.status==0" style="width:20px;height:20px;background-color:#F56C6C;border-radius:20px;position:absolute;left:50px;top:0;text-align:center;border:none;line-height:20px;">{{$t(`message.record_dialog_waiting`)}}</div>
                <div v-if="stu.status==2" style="width:20px;height:20px;background-color:#67C23A;border-radius:20px;position:absolute;left:50px;top:0;text-align:center;border:none;line-height:20px;">{{$t(`message.record_dialog_reset`)}}</div>
                <div v-if="stu.status==3" style="width:20px;height:20px;background-color:#E6A23C;border-radius:20px;position:absolute;left:50px;top:0;text-align:center;border:none;line-height:20px;">{{$t(`message.record_dialog_truancy`)}}</div>
                <el-tag v-if="stu.type==1" style="position:absolute;top:40px;left:12px;" size="mini" effect="dark">{{$t(`message.record_dialog_school_read`)}}</el-tag>
                <el-tag v-if="stu.type==0" style="position:absolute;top:40px;left:12px;" size="mini" effect="dark" type="danger">{{$t(`message.record_dialog_school_unread`)}}</el-tag>
              </div>
            </div>
            <div style="text-align:center">{{stu.name}}</div>
            <div style="text-align:center">{{stu.phone}}</div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" style="display:flex;justify-content:center;margin-top:-30px">
        <el-button @click="centerDialogVisible = false">{{$t(`message.button_cancel`)}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import '../../api/restfulapi'
  import promptUtil from '../../utils/promptUtil'
  import {qs,getRecordStudentInfo} from '../../api/api'
  export default {
    name: "classReportDialog",
    data(){
      return{
        centerDialogVisible: false,
        students:{ // status 1 出勤  2 请假 3 缺勤   type 1在读 0离校
          attendance:[],// 出勤
          absenceduty: [],//缺勤
        },
      }
    },
    methods:{
      show(id){
        const loading = promptUtil.loading(this)
        getRecordStudentInfo(qs.stringify({calendar_id:id})).then(res=>{
          if(res.data && res.data!='[]'){
            this.students.attendance = res.data.attendance
            this.students.absenceduty = res.data.absenceduty
          }
          loading.close()
          this.centerDialogVisible = true
        }).catch(err=>{
          loading.close()
          promptUtil.LOG('getRecordStudentInfo-err',err)
        })
      }
    }
  }
</script>

<style scoped>
</style>
