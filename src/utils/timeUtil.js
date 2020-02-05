const moment = require("moment")
export default {
  getTimestamp2String(offset){
    let h = (Math.floor((offset / 1000 / 60 / 60) % 24))/10 >= 1 ? Math.floor((offset / 1000 / 60 / 60) % 24) : '0' + Math.floor((offset / 1000 / 60 / 60) % 24)
    let m = (Math.floor((offset / 1000 / 60) % 60))/10 >= 1 ? Math.floor((offset / 1000 / 60) % 60) : '0' + Math.floor((offset / 1000 / 60) % 60)
    let s = (Math.floor((offset / 1000) % 60))/10 >= 1 ? Math.floor((offset / 1000) % 60) : '0'+ Math.floor((offset / 1000) % 60)
    return {hour:h,minute:m,second:s}
  },
  // 获取当天开始结束时间
  getCurrDays(separate="-"){
    let date = []
    date.push(moment().format('YYYY'+separate+'MM'+separate+'DD'))
    date.push(moment().format('YYYY'+separate+'MM'+separate+'DD'))
    return date[0]+'-'+date[1]
  },
  // 获取昨天的开始结束时间
  getYesterday(separate="-"){
    let date = []
    date.push(moment().subtract('days',1).format('YYYY'+separate+'MM'+separate+'DD'))
    date.push(moment().subtract('days',1).format('YYYY'+separate+'MM'+separate+'DD'))
    // 获取昨天的开始结束时间，精确到时分秒
    // moment().subtract('days',1).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    // moment().subtract('days',1).endOf('days').format('YYYY-MM-DD HH:mm:ss')
    return date[0]+'-'+date[1]
  },
  // 获取指定月的开始结束时间
  getTargetMonthDays(num,separate="-"){
    let date = []
    let start = moment().month(num - 1).startOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().month(num - 1).endOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 获取当前月的开始结束时间
  getCurrMonthDays(separate="-"){
    let date = []
    let start = moment().startOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().endOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 获取上一月的开始结束时间
  getLastMonthDays(separate="-"){
    let date = []
    let start = moment().month(moment().month() - 1).startOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().month(moment().month() - 1).endOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  getPreMonthDays(offset=1,separate="-"){
    let date = []
    let start = moment().month(moment().month() - offset).startOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().month(moment().month() - offset).endOf('month').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 获取当前周的开始结束时间，周日到周六
  getCurrWeekDays(separate="-"){
    let date = []
    let start = moment().startOf('week').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().endOf('week').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 获取上一周的开始结束时间，周日到周六
  getLastWeekDays(separate="-"){
    let date = []
    let start = moment().week(moment().week() - 1).startOf('week').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().week(moment().week() - 1).endOf('week').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 获取今年开始结束时间
  getCurrYearDays(separate="-"){
    let date = []
    let start = moment().startOf('year').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().endOf('year').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 获取上一年的开始结束时间，周日到周六
  getLastYearDays(separate="-"){
    let date = []
    let start = moment().year(moment().year()-1).startOf('year').format('YYYY'+separate+'MM'+separate+'DD')
    let end = moment().year(moment().year()-1).endOf('year').format('YYYY'+separate+'MM'+separate+'DD')
    date.push(start)
    date.push(end)
    return date[0]+'-'+date[1]
  },
  // 生成时间范围
  genTimeFrameByDataPicker(timestamp=new Date().getTime()){
    // weekValue  1~7 星期一~星期日
    const {startTimestamp, endTimestamp} = this.genStartAndEndTimestamp(timestamp)
    this.genTimeFrameStringWithTime(startTimestamp,endTimestamp)
  },
  // 根据起始时间和结束时间生成字符串
  genTimeFrameStringWithTime(startTimestamp,endTimestamp){
    const startTime = moment(startTimestamp).format("YYYY/MM/DD")
    const endTime = moment(endTimestamp).format("YYYY/MM/DD")
    this.filter.timeFrame = []
    this.filter.timeFrame.push(startTime)
    this.filter.timeFrame.push(endTime)
    this.classRecordFilter.timeFrame = []
    this.classRecordFilter.timeFrame.push(startTime)
    this.classRecordFilter.timeFrame.push(endTime)
    this.classHourRecordFilter.timeFrame = []
    this.classHourRecordFilter.timeFrame.push(startTime)
    this.classHourRecordFilter.timeFrame.push(endTime)
  },
  // 根据时间戳生成起始和结束时间戳
  genStartAndEndTimestamp(timestamp){
    const currentTimestamp = new Date(timestamp).getTime()
    const weekValue = this.getWeekValueWithString(this.getWeekWithString(moment(currentTimestamp).format("dddd")))
    const startTimestamp = currentTimestamp - (weekValue-1)*24*3600*1000
    const endTimestamp = currentTimestamp + (7-weekValue)*24*3600*1000
    return {startTimestamp:startTimestamp, endTimestamp:endTimestamp}
  },
  // 根据字符串返回星期
  getWeekWithString(str){
    switch (str) {
      case 'Monday':
        return '星期一'
      case 'Tuesday':
        return '星期二'
      case 'Wednesday':
        return '星期三'
      case 'Thursday':
        return '星期四'
      case 'Friday':
        return '星期五'
      case 'Saturday':
        return '星期六'
      case 'Sunday':
        return '星期日'
    }
  },
  // 根据字符串返回周几的值1~7
  getWeekValueWithString(str){
    switch (str) {
      case '星期一':
        return 1
      case '星期二':
        return 2
      case '星期三':
        return 3
      case '星期四':
        return 4
      case '星期五':
        return 5
      case '星期六':
        return 6
      case '星期日':
        return 7
      default:
        return str
    }
  },
}
