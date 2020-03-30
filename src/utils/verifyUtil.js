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
  isOfficeSuffix(name) { // 检验是否office后缀
    const targets = ['doc','docx','ppt','pptx','xls','xlsx']
    let names = name.split('.')
    let suffix = names[names.length-1]
    let index = targets.findIndex(item=>item===suffix)
    return index>=0 ? true : false
  }
}
