/*
各种验证数据的工具方法
 */
import promptUtil from "./promptUtil";
import '../api/restfulapi'
import storageUtil from "./storageUtil";

export default {
  // 六维图像配置信息
  genECharts(valueArr,echarts){
    var option = {
      radar: [
        {
          axisLine: {lineStyle: {color: 'rgba(255, 255, 255, 0.5)'}},
          splitLine: {lineStyle: {color: 'rgba(255, 255, 255, 0.5)'}}
        },
        {
          indicator: [
            { text: '逻辑思维', max: 5, color:'rgba(0, 0, 0, 1)'},
            { text: '专注力', max: 5, color:'rgba(0, 0, 0, 1)'},
            { text: '思考力', max: 5, color:'rgba(0, 0, 0, 1)'},
            { text: '沟通力', max: 5, color:'rgba(0, 0, 0, 1)'},
            { text: '创造力', max: 5, color:'rgba(0, 0, 0, 1)'},
            { text: '创新力', max: 5, color:'rgba(0, 0, 0, 1)'}
          ], center: ['50%', '50%'], radius: 110
        }
      ],
      series: [{
        type: 'radar', radarIndex: 1,
        data: [
          {value: valueArr,
            areaStyle: {
              normal: {
                opacity: 0.9,
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  {color: '#02a2ff', offset: 0},
                  {color: '#fff', offset: 1}
                ])
              }
            }
          }
        ]
      }
      ]
    }
    return option
  },

  // 通过value查找数组中的值
  // [{value:1,label:''}]
  findValueFromArray(val,arr){
    const type = this.isRealNum(val)
    let result = type ? '' : 0
    if(arr && arr.length>0){
      if(type){ // id 返回id
        const obj = arr.find(item=> item.value==val)
        result = obj.value
      } else { // 字符 返回id
        const obj = arr.find(item=> item.label==val)
        result = obj.value
      }
    }
    return result
  },

  findLabelFromArray(val,arr){
    const type = this.isRealNum(val)
    let result = type ? '' : 0
    if(arr && arr.length>0){
      if(type){ // id 返回id
        const obj = arr.find(item=> item.value==val)
        result = obj.label
      } else { // 字符 返回id
        const obj = arr.find(item=> item.label==val)
        result = obj.label
      }
    }
    return result
  },

  // 克隆对象
  clone(origin) {
    let originProto = Object.getPrototypeOf(origin);
    return Object.assign(Object.create(originProto), origin);
  },
  // 判断是否是数字
  isRealNum(val){
    if(val === "" || val ==null){
      return false;
    }
    if(!isNaN(val)){
      return true;
    }
    else{
      return false;
    }
  },

  // 对比对象是否相同
  objectCompare(x, y) {
    let cmp = ( x, y ) => {
      if ( x === y ) {
        return true;
      }
      if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
        return false;
      }
      if ( x.constructor !== y.constructor ) {
        return false;
      }
      for ( var p in x ) {
        if ( x.hasOwnProperty( p ) ) {
          if ( ! y.hasOwnProperty( p ) ) {
            return false;
          }
          if ( x[ p ] === y[ p ] ) {
            continue;
          }
          if ( typeof( x[ p ] ) !== "object" ) {
            return false;
          }
          if ( ! Object.equals( x[ p ], y[ p ] ) ) {
            return false;
          }
        }
      }
      for ( p in y ) {
        // allows x[ p ] to be set to undefined
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
          return false;
        }
      }
      return true;
    }
  },

  // dom加载完毕
  domLoaded(callback, id){
    var $dom=document.getElementById(id)
    if($dom.attachEvent){
      $dom.attachEvent("onload",function(){
        callback()
      })
    } else {
      $dom.onload = function(){
        callback()
      }
    }
  },
  // 返回请求头
  headers(){
    let token = storageUtil.readToken()
    const obj = {
      "Authorization": token + "_" + (storageUtil.readTeacherInfo() ? storageUtil.readTeacherInfo().id : "0")
    }
    return obj
  },
  isMobile() {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    return flag;
  }
}
