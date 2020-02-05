/*
各种验证数据的工具方法
 */
import promptUtil from "./promptUtil";
import storageUtil from "./storageUtil";
import PubSub from "pubsub-js";
import {
  qs,
  bindUserWithSuperBlockly,
  updateUserWithSuperBlockly,
} from '../api/api'
import '../api/restfulapi'

export default {
  // 绑定编程吧用户
  bindAccount(type,that, account, loading = null){
    const {userId} = account
    bindUserWithSuperBlockly(qs.stringify({user_id:userId})).then(res=>{
      if(res.code==SUCCESS_CODE){
        if('stu'==type){ // 学生账号绑定
          PubSub.publish("superblockly_bind", userId+"-bindstu'");
        } else { // 教师账号绑定
          PubSub.publish("superblockly_bind", userId+"-bindtea");
        }
        try{
          const userInfo = storageUtil.readTeacherInfo()
          userInfo.bcb = 1
          storageUtil.saveTeacherInfo(userInfo)
        }catch (e) {
          promptUtil.LOG("绑定成功，信息未改变")
        }
        promptUtil.success(that, res.msg)
      }else{
        promptUtil.warning(that, res.msg)
      }
      loading.close()
    }).catch(err=>{
      promptUtil.warning(that, '请稍后再试...')
      promptUtil.LOG("bindUserWithSuperBlockly-err",err)
      loading.close()
    })
  },
  // 更新账户信息
  updateAccount(user){
    if(storageUtil.readTeacherInfo().bcb==1){// 表明该用户已经绑定，需要进行修改
      updateUserWithSuperBlockly(qs.stringify({

      })).then(res=>{

      }).catch(err=>promptUtil.LOG('updateUserWithSuperBlockly-err',err))
    }
  },
  // 跳转至编程吧
  gotoSuperBlockly(){
    window.open("http://www.superblockly.com",'_blank')
  },
}
