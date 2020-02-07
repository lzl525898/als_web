/*
使用promptUtil提示信息的工具模块
*/
import '../api/api'
import '../api/restfulapi'
import {qs, getUserRoleWithOverdue,getNoReadCount} from '../api/api'
const PROGRAM_STATUS='release' // release  debug
const TIME_OUT=2000
const MESSAGE_TYPE={
  SUCCESS:'success',
  WARNING:'warning',
  ERROR:'error',
  INFO:'info'
}
export default {
  wait(that){
    // return that.$message({
    //   message: '请稍后再试...',
    //   center: true,
    //   type: MESSAGE_TYPE.ERROR,
    //   duration: TIME_OUT});
  },
  timeout(that){
    if (PROGRAM_STATUS=='debug') {
      return that.$message({
        message: '出现异常，查看console',
        center: true,
        type: MESSAGE_TYPE.ERROR,
        duration: TIME_OUT});
    } else {
      return that.$message({
        message: '哪里出现了问题...',
        center: true,
        type: MESSAGE_TYPE.ERROR,
        duration: TIME_OUT});
    }
  },
  success(that,msg){
    return that.$message({
      message: msg,
      center: true,
      type: MESSAGE_TYPE.SUCCESS,
      duration: TIME_OUT});
  },
  error(that,msg){
    return that.$message({
      message: msg,
      center: true,
      type: MESSAGE_TYPE.ERROR,
      duration: TIME_OUT});
  },
  warning(that,msg){
    return that.$message({
      message: msg,
      center: true,
      type: MESSAGE_TYPE.WARNING,
      duration: TIME_OUT});
  },
  loading(that){
    const loading = that.$loading({
      lock: true,
      text: '玩命加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return loading
  },
  // 打印日志
  LOG(info,obj,status=true){
    if(DEBUG){
      if(status){
        console.info("==========>>>")
        console.info(`%s \n %o`,info,obj)
        console.info("==========END")
      } else {
        console.error("==========>>>")
        console.error(`%s \n %o`,info,obj)
        console.error("==========END")
      }
    }
  },
  checkOverdue(that,uid) { // 检验是否过期
    const _that = that
    getUserRoleWithOverdue(qs.stringify({user_id:uid})).then(res=>{
      getNoReadCount(qs.stringify({user_id:uid})).then(res=>{
        if(res.code==1 && res.data){
          _that.$store.dispatch('setMailCount',res.data)
        }
      }).catch(err=>console.log("getNoReadCount-ERR",err))
      let status = false
      if(res.code==USER_NOT_OVERDUE){ // 证明已经过期
        status = true
      }
      _that.$store.dispatch('updateOverdue',status)
    })
  }
}
