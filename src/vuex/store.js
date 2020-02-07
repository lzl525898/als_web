/*
vuex的核心管理对象模块
 */
import Vue from 'vue'
import Vuex from 'vuex'
import staticUtil from '../utils/staticUtil'

Vue.use(Vuex)

// 状态对象
const state = { // 初始化状态
  mailCount: 0, // 通知数
  userAvatar:'', //头像地址
  userName: '',
  schoolName:'',
  taskDetail: '',
  studentTaskId:'',
  createRate: '',
  currentStudentName: '',
  currentCoursePackageId: '',
  helpPageType: '',  // 2表示直播帮助
  currentClassRoomName: '', // 当前班级名称
  systemInfo: {
    startTime: '',
    endTime: '',
    tel: '',
    qrcode: '',
    authorizationCode: 0
  }, // 系统信息 包括开通时间、到期时间、剩余激活码
  systemMenu: '', // 系统菜单
  isShowTodaySchedules: false, // 是否显示今日课程
  isOverdue: false , // 是否过期  false 未过期  true 已过期
  customCourseHandle: { type: '',course:0}, // 自定义课程操作
  customCourseDetail: { id: '', name: ''}, //自定义课程内容
  enterStudentInformation:{},//按学员查看学生信息
  todayEnterStudentInformation:'',//1表示从今日上课进入记上课页面
  eduReportRefresh: {
    teacher: true,record:true
  }, // 是否需要刷新 true 需要清空数据 false 回显以前数据
  examInfo:{}, // 考试详情
  examId: 0, // 考试id
}

// 包含多个更新state函数的对象
const mutations = {
  // 设置未阅读通知总数
  SET_MAIL_COUNT(state, count) {
    state.mailCount = count
  },
  // 设置考试id进入分析考试
  SET_EXAM_ID(state, examId) {
    state.examId = examId
  },
  // 设置考试详情信息
  SET_EXAM_INFO(state, examInfo) {
    state.examInfo = examInfo
  },
  // 刷新教务报告
  EDU_REPORT_REFRESH(state, status) {
    state.eduReportRefresh = status
  },
  // 自定义课程内容
  CUSTOM_COURSE_DETAIL(state, custom) {
    state.customCourseDetail = custom
  },
  // 自定义课程相关操作
  CUSTOM_COURSE_INFO(state, custom) {
    state.customCourseHandle = custom
  },
  // 修改机构状态是否过期
  UPDATE_OVERDUE(state, overdue){
    state.isOverdue = overdue
  },
  // 修改用户头像
  UPDATE_USER_AVATAR(state, avatar){
    state.userAvatar = avatar
  },
  // 修改用户名mutation
  UPDATE_USER_NAME(state, userName){
    state.userName = userName
  },
  // 修改机构名mutation
  UPDATE_SCHOOL_NAME(state, schoolName){
    state.schoolName = schoolName
  },
  // 设置进入任务详情信息mutation
  SET_TASK_DETAIL(state,taskDetail){
    state.taskDetail = taskDetail
  },
   // 设置进入任务详情信息mutation
   SAVE_STUDENT_TASK_ID(state,studentTaskId){
    state.studentTaskId = studentTaskId
  },
  //设置创建任务详情信息mutation
  SAVE_CREATERATE_RATE_ID(state,createRate){
    state.createRate = createRate
  },
  //设置当前学情报告中学生姓名展示
  SET_STUDENT_WITH_REPORT(state,currentStudentName){
    state.currentStudentName = currentStudentName
  },
  //设置进入课程目录的课程id，面包屑使用
  SET_COURSE_LIST_ID(state, currentCoursePackageId) {
    state.currentCoursePackageId = currentCoursePackageId
  },
  //设置help页面类别（目前机构和直播管理）
  SET_HELP_PAGE_TYPE(state, type) {
    state.helpPageType = type
  },
  // 设置当前班级名称
  SET_CURRENT_CLASS_NAME(state, name) {
    state.currentClassRoomName = name
  },
  // 设置系统信息
  SET_SYSTEM_INFO(state, systemInfo) {
    state.systemInfo = systemInfo
  },
  // 设置系统菜单
  SET_SYSTEM_MENU(state, systemMenu) {
    state.systemMenu = systemMenu
  },
  // 设置是否显示今日课程
  SET_TODAY_SCHEDULE_STATUS(state, status) {
    state.isShowTodaySchedules = status
  },
  // 设置进入按照学院查看的学生信息
  SET_ENTER_CLASS_STATUS(state, information) {
    state.enterStudentInformation = information
  },
  // 设置设置从今日上课点击进入记上课状态为1
  SET_TODAY_ENTER_CLASS_STATUS(state, type) {
    state.todayEnterStudentInformation = type
  },

}

// 包含多个对应事件回调函数
const actions ={
  setMailCount({commit, state}, count) {
    commit('SET_MAIL_COUNT', count)
  },
  setExamId({commit, state}, examId) {
    commit('SET_EXAM_ID',examId)
  },
  setExamInfo({commit, state}, examInfo) { // 设置考试信息
    commit('SET_EXAM_INFO', examInfo)
  },
  setEduReport({commit, state}, status) {
    commit('EDU_REPORT_REFRESH', status)
  },
  customCourseDetail({commit, state}, custom) {
    commit('CUSTOM_COURSE_DETAIL', custom)
  },
  customCourseInfo({commit, state}, custom) { // 更新自定义课程信息
    commit('CUSTOM_COURSE_INFO', custom)
  },
  updateOverdue({commit,state}, over){ // 修改机构状态是否过期
    commit('UPDATE_OVERDUE', over)
  },
  updateUserAvatar({commit, state}, avatar){// 修改用户头像
    commit('UPDATE_USER_AVATAR',avatar)
  },
  updateUserName({commit, state}, userName){ // 修改用户名
    commit('UPDATE_USER_NAME', userName)
  },
  updateSchoolName({commit, state}, schoolName){ // 修改机构名
    commit('UPDATE_SCHOOL_NAME', schoolName)
  },
  setTaskDetail({commit, state}, taskDetail){ // 设置进入任务详情信息
    commit('SET_TASK_DETAIL', staticUtil.clone(taskDetail))
  },
  saveStudentTaskId({commit, state}, studentTaskId){ // 修改用户名
    commit('SAVE_STUDENT_TASK_ID', staticUtil.clone(studentTaskId))
  },
  saveSCreateRateId({commit, state}, createRate){// 1 表示从任务管理进入创建报告  0 从学情报告进入创建报告
    commit('SAVE_CREATERATE_RATE_ID', staticUtil.clone(createRate))
  },
  setStudentWithReportName({commit, state},studentName) {
    commit('SET_STUDENT_WITH_REPORT', studentName)
  },
  setCoursePackageIdWithList({commit, state},packageId) {
    commit('SET_COURSE_LIST_ID', packageId)
  },
  setHelpPageType({commit, state},type) { // 设置帮助页面类型 2为直播帮助
    commit('SET_HELP_PAGE_TYPE', type)
  },
  setCurrentClassName({commit, state},name) { // 设置当前班级名称
    commit('SET_CURRENT_CLASS_NAME', name)
  },
  setSystemInfo({commit, state}, systemInfo) { // 设置系统信息
    commit('SET_SYSTEM_INFO', systemInfo)
  },
  setSystemMenu({commit, state}, systemMenu) {
    commit('SET_SYSTEM_MENU', systemMenu)
  },
  setTodayScheduleStatus({commit, state}, status) {
    commit('SET_TODAY_SCHEDULE_STATUS', status)
  },
  setEnterStudentInformation({commit, state}, status) {//获取进入记上课详情页面的学生id
    commit('SET_ENTER_CLASS_STATUS', status)
  },
  setTodayEnterStudentInformation({commit, state},type) { // 设置帮助页面类型 2为直播帮助
    commit('SET_TODAY_ENTER_CLASS_STATUS', type)
  },


}

// 包含多个getter计算属性函数的对象
const getters = {

}

export default new Vuex.Store({
  state, // 状态
  mutations, // 包含多个更新state函数的对象
  actions, // 包含多个对应事件回调函数
  getters // 包含多个getter计算属性函数的对象
})
