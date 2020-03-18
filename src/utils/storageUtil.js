/*
使用localStorage存储数据的工具模块
1.函数
2.对象
 */
const USER_ROLE = 'user_role'
const TEACHER_INFO = 'teacher_info'
const LOGIN_STATUS = 'alsrobot'
const STUDENT_PARAMS = 'student_'
const WORKS_DETAIL = 'works_detail'
const TOKEN = 'als_token'
const TASK_ID = 'task_id'
const STU_Id = 'student_id'
const LAT = 'lat'
const LNG = 'lng'
const ADRDRESS = 'adrdress'
const OVERDUE = 'als_overdue'
const TMP_LOGIN = 'als_tmp_login'
const LANG = 'als_local_lang'
const AREA = 'als_user_area'
const MENU_INFO = 'als_menu_info'

export default {
  saveMenu(menu){
    let childMenuArray = []
    menu.map(item=>{
      if(item&&item.children&&item.children.length&&item.children.length>0){
        childMenuArray = childMenuArray.concat(item.children)
      }
    })
    window.sessionStorage.setItem(MENU_INFO,JSON.stringify(childMenuArray))
  },
  getMenu(){
    return JSON.parse(window.sessionStorage.getItem(MENU_INFO) || '[]')
  },
  setAreaContent(area){
    window.sessionStorage.setItem(AREA,JSON.stringify(area))
  },
  getAreaContent(){
    return JSON.parse(window.sessionStorage.getItem(AREA) || '[]')
  },
  // 设置语言
  setLang(lang){
    window.localStorage.setItem(LANG,lang)
  },
  getLang(){
    let localLanguage
    let currentLanguage = navigator.language
    if(currentLanguage.indexOf("zh")!=-1){
      localLanguage = 'zh'
    }else if(currentLanguage.indexOf("en")!=-1){
      localLanguage = 'en'
    }else if(currentLanguage.indexOf("TW")!=-1){
      localLanguage = 'cht'
    }
    return window.localStorage.getItem(LANG) || localLanguage
  },
  // 设置是否提醒重新登录提示
  saveOverdue(status){ // 1 需要 0 不需要
    window.sessionStorage.setItem(OVERDUE, status)
  },
  // 获取是否提醒重新登录提示
  readOverdue(){
    return window.sessionStorage.getItem(OVERDUE)
  },
  // 存储token信息
  saveToken(token) {
    window.localStorage.setItem(TOKEN, token)
  },

  // 读取token信息
  readToken() {
    return window.localStorage.getItem(TOKEN)
  },
  // 存储临时登录信息
  saveTempLogin(info) {
    window.localStorage.setItem(TMP_LOGIN,info)
  },
  // 读取临时登录信息
  readTempLogin(){
    return window.localStorage.getItem(TMP_LOGIN)
  },
  // 存储精度
  saveLat(lat) {
    window.localStorage.setItem(LAT, lat)
  },
  //
  // // 读取精度
  readLat() {
    return window.localStorage.getItem(LAT || '')
  },
  // // 存储纬度
  saveLng(lng) {
    window.localStorage.setItem(LNG, lng)
  },

  // 读取纬度
  readLng() {
    return window.localStorage.getItem(LNG || '')
  },


  // // 存储纬度
  saveOriginAdress(adress) {
    window.localStorage.setItem(ADRDRESS, adress)
  },

  // 读取纬度
  readOriginAdress() {
    return window.localStorage.getItem(ADRDRESS || '')
  },


  // 存储教师信息
  saveTeacherInfo(info) {
    window.localStorage.setItem(TEACHER_INFO, JSON.stringify(info))
  },
  // 读取教师信息
  readTeacherInfo() {
    return JSON.parse(window.localStorage.getItem(TEACHER_INFO) || '[]')
  },
  // 存储用户信息
  saveUserRole(roleStatus) {
    window.localStorage.setItem(USER_ROLE, roleStatus)
  },

  // 读取用户信息
  readUserRole() {
    return JSON.parse(window.localStorage.getItem(USER_ROLE) || '0')
  },
  // 保存作品信息
  saveWorksDetail(worksDetail) {
    window.localStorage.setItem(WORKS_DETAIL, JSON.stringify(worksDetail))
  },

  // 读取作品信息
  readWorksDetail() {
    return JSON.parse(window.localStorage.getItem(WORKS_DETAIL) || '[]')
  },

  //  // 保存任务id
  //  saveTaskId(taskId){
  //   window.localStorage.setItem(TASK_ID,taskId)
  // },

  // // 读取任务id
  // readTaskId() {
  //   return JSON.parse(window.localStorage.getItem(TASK_ID) || '0')
  // },
  //   // 保存学生id
  // saveStudentId(studentId){
  //   window.localStorage.setItem(STU_Id,studentId)
  // },

  // // 读取学生id
  // readTaskId() {
  //   return JSON.parse(window.localStorage.getItem(STU_Id) || '0')
  // },

  // 设置登录状态
  setLoginStatus(roleId) {
    window.localStorage.setItem(LOGIN_STATUS, '1')
    if (roleId == 1) {
      if (this.readTeacherInfo().school_admin == 1) {
        roleId = 1  // 管理员
      } else {
        roleId = 2  // 教师
      }
    } else if (roleId == 0) {//直播管理员
      roleId = 4  // 直播管理员
    } else if (roleId == 110) { // 超级管理员
      roleId = 110
    }else {
      roleId = 3  // 学生
    }
    this.saveUserRole(roleId)
  },
  // 查询登录状态
  getLoginStatus() {
    return JSON.parse(window.localStorage.getItem(LOGIN_STATUS || '0'))
  },

  // 登出
  logout() {
    localStorage.removeItem(TEACHER_INFO)
    localStorage.removeItem(LOGIN_STATUS)
    localStorage.removeItem(USER_ROLE)
    localStorage.removeItem(STUDENT_PARAMS)
    localStorage.removeItem(WORKS_DETAIL)
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(TASK_ID)
    localStorage.removeItem(STU_Id)
    localStorage.removeItem(LAT)
    localStorage.removeItem(LNG)
    localStorage.removeItem(ADRDRESS)
    localStorage.removeItem(AREA)
    localStorage.removeItem(OVERDUE)
  }
}
