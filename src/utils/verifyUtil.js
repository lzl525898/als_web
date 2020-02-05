/*
各种验证数据的工具方法
 */
export default {
  isPhone(tel){ // 验证是否未手机号
    var mobile_mode=/^1[3456789]\d{9}$/;
    if(!mobile_mode.test(tel)){
      return false
    }
    return true
  },
}
