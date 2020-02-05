/*
使用stringUtil转化字符串的工具模块
 */
export default {
  // 随机生成指定长度的字符串
  randomString(n){
    let str = 'abcdefghijkmnopqrstuvwxyz9876543210';
    let tmp = '',
      i = 0,
      l = str.length;
    for (i = 0; i < n; i++) {
      tmp += str.charAt(Math.floor(Math.random() * l));
    }
    return tmp;
  },
  // 正则匹配对应字符串
  searchString(data, reg){
    return data.search(reg)>=0 ? true : false
  },

  array2String(arr,separator){
    let text = ''
    if(arr.length==0){
      return text
    }else{
      arr.forEach(item=>{
        text=text+item+separator
      })
      return text.substr(0, text.length - 1)
    }
  },
  string2IntArray(str, reg) {
    if(str && str!=""){
      const arr = str.split(reg)
      const newArr = arr.map(item=> parseInt(item))
      return  newArr
    } else {
      return []
    }
  },
  strArr2IntArr(strArr){
    if(strArr==""){
      return []
    }
      return strArr.map(item=>{
        return parseInt(item)
      })
  },
  stringShuffle(data,se){
    return data.replace(se,"");
  },
  getEvaluateArray(){
    return ['加把劲','再认真一点','不错','给力','惊喜很棒']
  }
}
