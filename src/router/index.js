import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/home/index'

import reportDialog from '@/components/teachers/report/reportDialog'

import './router'
// 使用这种方法可以实现按需加载，一个组件生成一个js文件
const onlineEducation = resolve => require(['@/components/students/onlineEducation'], resolve)
const dashboard = resolve => require(['@/components/students/dashboard'], resolve)
const classMan = resolve => require(['@/components/teachers/classroom/classMan'], resolve)
const classRoom = resolve => require(['@/components/teachers/classroom/classRoom'], resolve)
const teacherMan = resolve => require(['@/components/teachers/teacher/teacherMan'], resolve)
const studyMan = resolve => require(['@/components/teachers/student/studyMan'], resolve)
const taskMan = resolve => require(['@/components/teachers/task/taskMan'], resolve)
const database = resolve => require(['@/components/teachers/resource/database'], resolve)
const user = resolve => require(['@/components/home/user'], resolve)
const mbx = resolve => require(['@/components/home/mbx'], resolve)
const help = resolve => require(['@/components/home/help'], resolve)
const agencyInformation = resolve => require(['@/components/home/agencyInformation'], resolve)
const contactUs = resolve => require(['@/components/home/contactUs'], resolve)
const resources = resolve => require(['@/components/teachers/course/resources'], resolve)
const resourcesList = resolve => require(['@/components/teachers/course/resourcesList'], resolve)
const resourcesLiveList = resolve => require(['@/components/teachers/course/resourcesLiveList'], resolve)
const resourcesListShow = resolve => require(['@/components/teachers/course/resourcesListShow'], resolve)
const equipment= resolve => require(['@/components/teachers/course/equipment'], resolve)
const equipmentDes= resolve => require(['@/components/teachers/course/equipmentDes'], resolve)
const doubleTeaching = resolve => require(['@/components/teachers/doubleTeachers/doubleTeaching'], resolve)
const doubleTeachingList= resolve => require(['@/components/teachers/doubleTeachers/doubleTeachingList'], resolve)
const doubleTeachingListShow= resolve => require(['@/components/teachers/doubleTeachers/doubleTeachingListShow'], resolve)
const report = resolve => require(['@/components/teachers/report/report'], resolve)
const reportMan = resolve => require(['@/components/teachers/report/reportMan'], resolve)
const reportCreate = resolve => require(['@/components/teachers/report/reportCreate'], resolve)
const reportEdit = resolve => require(['@/components/teachers/report/reportEdit'], resolve)
const taskEdit = resolve => require(['@/components/teachers/task/taskEdit'], resolve)
const taskSee = resolve => require(['@/components/teachers/task/taskSee'], resolve)
const taskDetail = resolve => require(['@/components/teachers/task/taskDetail'], resolve)
const loginIndex = resolve => require(['@/components/view/loginIndex'], resolve)
const viewIndex = resolve => require(['@/components/view/viewIndex'], resolve)
const callUs = resolve => require(['@/components/view/callUs'], resolve)
const joinIn = resolve => require(['@/components/view/joinIn'], resolve)
const students = resolve => require(['@/components/students/home/student'], resolve)
const studentInfo = resolve => require(['@/components/students/home/studentInfo'], resolve)
const error = resolve => require(['@/components/view/error'], resolve)
const helpDocs = resolve => require(['@/components/view/helpDocs'], resolve)
const loginHeader = resolve => require(['@/components/home/loginHeader'], resolve)
const stuLiveManage = resolve => require(['@/components/students/home/stuLiveManage'], resolve)
const liveManagement = resolve => require(['@/components/teachers/liveManagement/liveManage'], resolve)
const liveClass = resolve => require(['@/components/teachers/liveManagement/liveClass'], resolve)
const editliveClass = resolve => require(['@/components/teachers/liveManagement/editliveClass'], resolve)
const addLiveClass = resolve => require(['@/components/teachers/liveManagement/addLiveClass'], resolve)
const editAddLiveClass = resolve => require(['@/components/teachers/liveManagement/editAddLiveClass'], resolve)
const consult = resolve => require(["@/components/teachers/consult/consult"],resolve)
const collectionList = resolve => require(["@/components/teachers/consult/collectionList"],resolve)
const collectionDialog = resolve => require(["@/components/teachers/consult/collectionDialog"],resolve)
const institutionDialog = resolve => require(["@/components/teachers/consult/institutionDialog"],resolve)
const calendar = resolve => require(["@/components/teachers/calendar/calendar"],resolve)
const studentReport = resolve => require(['@/components/students/home/sturep'], resolve)
const notice = resolve => require(['@/components/home/notice'], resolve)
const remind = resolve => require(['@/components/home/remind'], resolve)
const permission = resolve => require(['@/components/teachers/permission/permission'], resolve)
const custom = resolve => require(['@/components/teachers/custom/custom'], resolve)
const addCustom = resolve => require(['@/components/teachers/custom/add'], resolve)
const seeCustom = resolve => require(['@/components/teachers/custom/customList'], resolve)
const editCustom = resolve => require(['@/components/teachers/custom/edit'], resolve)
const itemCustom = resolve => require(['@/components/teachers/custom/customItem'], resolve)
const seeItemDetail = resolve => require(['@/components/teachers/custom/detail'], resolve)
const feedback = resolve => require(['@/components/teachers/feedback/feedback'], resolve)
const addFeedback = resolve => require(['@/components/teachers/feedback/add'], resolve)
const seeFeedback = resolve => require(['@/components/teachers/feedback/detail'], resolve)
const classRecord = resolve => require(['@/components/teachers/record/course'], resolve)
const recordDetail = resolve => require(['@/components/teachers/record/recordDetail'], resolve)
const businessAnalysis = resolve => require(['@/components/teachers/report/businessAnalysis'], resolve)
const eduReporter = resolve => require(['@/components/teachers/report/eduReporter'], resolve)
const flowStatistics = resolve => require(['@/components/teachers/report/flowStatistics'], resolve)
const reportDetailList = resolve => require(['@/components/teachers/report/recordListDetail'],resolve)
const logInfo = resolve => require(['@/components/home/logInfo'],resolve)
const cert = resolve => require(['@/components/home/cert'],resolve)
const examManage = resolve => require(['@/components/teachers/exam/examManage'],resolve)
const analysisExam = resolve => require(['@/components/teachers/exam/examAnalysis'],resolve)
const examResult = resolve => require(['@/components/teachers/exam/examResult'],resolve)
const examDetail = resolve => require(['@/components/teachers/exam/examDetail'],resolve)
const tools = resolve => require(['@/components/home/tool'],resolve)
const scratch = resolve => require(['@/components/home/scratch'],resolve)
const discover = resolve => require(['@/components/view/discover'],resolve)
const workContent = resolve => require(['@/components/view/workContent'],resolve)
const personCenter = resolve => require(['@/components/view/personCenter'],resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: { requireAuth: true },
      redirect: '/index',  // user
      children: [{
        path: '/user', //课堂首页
        name: 'user',
        meta: { requireAuth: true },
        component: user,
      },{
        path: '/help', //课堂首页
        name: 'help',
        meta: { requireAuth: true },
        component: help,
      },{
        path: '/eduinfo', //机构信息
        name: ' agencyInformation',
        meta: { requireAuth: true },
        component:  agencyInformation,
      },{
        path: CONTACT_US, //联系我们
        name: ' contactUs',
        meta: { requireAuth: true },
        component:  contactUs,
      },{
        path: ROUTER_CLASS_MAN, // 班级管理
        name: 'classMan',
        meta: { requireAuth: true },
        component: classMan
      },{
        path: ROUTER_CLASS_ROOM+':id', // 班级详情
        name: 'classRoom',
        meta: { requireAuth: true},
        component: classRoom
      },{
        path: '/teacherMan', // 教师管理
        name: 'teacherMan',
        meta: { requireAuth: true },
        component: teacherMan
      },{
        path: ROUTER_STUDENT_MAN, // 学生管理
        name: 'studyMan',
        meta: { requireAuth: true },
        component: studyMan,
      },{
        path: ROUTER_REPORT_INFO+':id', // 学情报告
        name: 'reportMan',
        meta: { requireAuth: true },
        component: reportMan,
      },{
        path: ROUTER_REPORT_CREATE+':id', // 创建报告
        name: 'reportCreate',
        meta: { requireAuth: true },
        component: reportCreate,
      },{
        path: ROUTER_REPORT_EDIT+':id/:report', // 编辑报告
        name: 'reportEdit',
        meta: { requireAuth: true },
        component: reportEdit,
      },{
        path: ROUTER_BUSINESS_ANALYSIS, // 机构统计
        name: 'businessAnalysis',
        meta: { requireAuth: true },
        component: businessAnalysis,
      },{
        path: ROUTER_EDU_REPORT, // 教务统计
        name: 'eduReporter',
        meta: { requireAuth: true },
        component: eduReporter,
      }, {
          path: ROUTER_FLOW_STATISTICS, // 流量统计
          name: 'flowStatistics',
          meta: { requireAuth: true },
          component: flowStatistics,
        },{
        path: ROUTER_RECORD_LIST+':type/:info', // 报告列表统计（1.class 班级详情、2.record 上课记录）
        name: 'reportDetailList',
        meta: { requireAuth: true },
        component: reportDetailList,
      },{
        path: ROUTER_REPORT, // 学情报告
        name: 'report',
        meta: { requireAuth: true },
        component: report,
      },{
        path: ROUTER_TASK, // 任务管理
        name: 'taskMan',
        meta: { requireAuth: true },
        component: taskMan
      },{
        path: '/taskMan/edit/:id', // 编辑任务
        name: 'taskEdit',
        meta: { requireAuth: true },
        component: taskEdit
      },{
        path: '/taskMan/see/:id', // 编辑任务
        name: 'taskSee',
        meta: { requireAuth: true },
        component: taskSee
      },{
        path: '/taskMan/detail/:id', // 查看任务
        name: 'taskDetail',
        meta: { requireAuth: true },
        component: taskDetail
      },{
        path: '/resources', // 课程资源
        name: 'resources',
        meta: { requireAuth: true },
        component: resources
      },{
        path: ROUTER_CUSTOM, // 自定义课程
        name: 'custom',
        meta: { requireAuth: true },
        component: custom
      },{
        path: ROUTER_CUSTOM_ADD, // 添加自定义课程
        name: 'add',
        meta: { requireAuth: true },
        component: addCustom
      },{
        path: ROUTER_CUSTOM_SEE+"/:id", // 查看自定义课程
        name: 'ROUTER_CUSTOM_SEE',
        meta: { requireAuth: true },
        component: seeCustom
      },{
        path: ROUTER_CUSTOM_EDIT+"/:id", // 编辑自定义课程
        name: 'editCustom',
        meta: { requireAuth: true },
        component: editCustom
      },{
        path: ROUTER_CUSTOM_ITEM+ "/:id",
        name: 'itemCustom',
        meta: { requireAuth: true },
        component: itemCustom
      },
        {
        path: ROUTER_CUSTOM_ITEM_SEE+ "/:id",  // 查看自定义课时详情
        name: 'seeDetail',
        meta: { requireAuth: true},
        component: seeItemDetail,
      },
        {
        path: '/resourcesList/:id', // 课程列表
        name: 'resourcesList',
        meta: { requireAuth: true },
        component: resourcesList
      },
        {
          path: '/resourcesLiveList/:id', // 课程列表
          name: 'resourcesLiveList',
          meta: { requireAuth: true },
          component: resourcesLiveList
        },
        {
          path: '/resourcesListShow/:id', // 课程列表详情
          name: 'resourcesListShow',
          meta: { requireAuth: true },
          component: resourcesListShow
        },
        {
          path: ROUTER_EQUIPMENT_CENTER, // 器材中心
          name: 'equipment',
          meta: { requireAuth: true },
          component: equipment
        },
        {
          path: ROUTER_EQUIPMENT_CENTERDETAILS, // 器材中心
          name: 'equipmentDes',
          meta: { requireAuth: true },
          component: equipmentDes
        },
        {
          path: '/liveManagement', // 直播管理
          name: 'liveManagement',
          meta: { requireAuth: true },
          component: liveManagement
        },
        {
          path: '/liveManagement/add/:id', // 新建直播课时
          name: 'addLiveClass',
          // meta: { requireAuth: true },
          component: addLiveClass,
        },
        {
          path: '/liveManagement/editAdd/:id', // 新建直播课时
          name: 'editAddLiveClass',
          // meta: { requireAuth: true },
          component: editAddLiveClass,
        },
        {
          path: '/liveManagement/liveClass/:id', // 直播课时
          name: 'liveClass',
          //  meta: { requireAuth: true },
          component: liveClass,
        },
        {
          path: '/liveManagement/edit/:id', // 编辑课程信息
          name: 'editliveClass',
          // meta: { requireAuth: true },
          component: editliveClass,
        },
        {
          path: ROUTER_CALENDAR, // 排课管理
          name: 'calendar',
          meta: { requireAuth: true },
          component: calendar
        },
        {
          path: ROUTER_CONSULT, // 咨询管理
          name: 'consult',
          meta: { requireAuth: true },
          component: consult
        },
        {
          path: ROUTER_COLLECTION, // 定制采单
          name: 'collectionList',
          meta: { requireAuth: true },
          component: collectionList
        },
        {
          path: ROUTER_DOUBLETEACHING, // 双师教学
          name: 'doubleTeaching',
          meta: { requireAuth: true },
          component: doubleTeaching
        },
        {
          path: ROUTER_DOUBLETEACHINGLIST, // 双师教学列表
          name: 'doubleTeachingList',
          meta: { requireAuth: true },
          component: doubleTeachingList
        },
        {
          path: ROUTER_DOUBLETEACHINGLISTSHOW, // 双师教学点击列表展示
          name: 'doubleTeachingListshow',
          meta: { requireAuth: true },
          component: doubleTeachingListShow
        },
        {
          path: '/database', // 资料库
          name: 'database',
          meta: { requireAuth: true },
          component: database
        },
        {
          path: '/index',  // 跳转至index页，所有功能的集合
          name: 'mbx',
          meta: { requireAuth: true },
          component: mbx
        }, {
          path: '/notice',  // 公告页面
          name: 'notice',
          meta: { requireAuth: true },
          component: notice
        },{
          path: '/remind',  // 提醒页面
          name: 'remind',
          meta: { requireAuth: true },
          component: remind
        },{
          path: '/student', // 学生页面
          name: 'students',
          meta: { requireAuth: true },
          component: students
        },{
          path: ROUTER_STUDENT_INDEX, //教室首页
          name: 'dashboard',
          meta: { requireAuth: true},
          component: dashboard
        },{
          path: ROUTER_STUDENT_ONLINE, // 学生直播
          name: 'onlineEducation',
          meta: { requireAuth: true},
          component: onlineEducation
        },{
          path: '/sturep', //学生学情报告
          name: 'studentReport',
          meta: { requireAuth: true},
          component: studentReport
        },{
          path:ROUTER_STULIVE_MANAGE,//学生直播课
          name:'stuLiveManage',
          meta: { requireAuth: true},
          component: stuLiveManage
        },{
          path:ROUTER_PERMISSION,//许可分配
          name:'permission',
          meta: { requireAuth: true},
          component: permission
        },{
          path: ROUTER_FEEDBACK, // 问题反馈
          name: 'feedback',
          meta: { requireAuth: true},
          component: feedback
        },{
          path: ROUTER_FEEDBACK_ADD, // 问题反馈
          name: 'addFeedback',
          meta: { requireAuth: true},
          component: addFeedback
        },{
          path: ROUTER_FEEDBACK_SEE + '/:id', // 查看问题反馈
          name: 'seeFeedback',
          meta: { requireAuth: true},
          component: seeFeedback
        },{
          path: ROUTER_RECORD_CLASS, // 记上课
          name: 'classRecord',
          meta: { requireAuth: true},
          component: classRecord
        },{
          path: ROUTER_RECORD_CLASS_DETAIL, // 记上课详情
          name: 'recordDetail',
          meta: { requireAuth: true},
          component: recordDetail
        },{
          path: ROUTER_LOG_INFO, // 日志信息
          name: 'logInfo',
          meta: { requireAuth: true},
          component: logInfo
        },{
          path: ROUTER_CERT, // 证书制作
          name: 'cert',
          meta: { requireAuth: true},
          component: cert
        },{
          path: ROUTER_TOOL, // 创作中心
          name: 'tool',
          meta: { requireAuth: true},
          component: tools
        },{
          path: ROUTER_EXAM_MANAGE, // 考试信息管理
          name: 'examManage',
          meta: { requireAuth: true},
          component: examManage
        },{
          path: ROUTER_EXAM_RESULT, // 成绩查询
          name: 'examResult',
          meta: { requireAuth: true},
          component: examResult
        },{
          path: ROUTER_EXAM_ANALYSIS, // 考试分析
          name: 'examAnalysis',
          meta: { requireAuth: true},
          component: analysisExam
        }],
    },{
      path: ROUTER_SCRATCH, // scratch编辑
      name: 'scratch',
      meta: { requireAuth: true},
      component: scratch
    },{  // 登录页面
      path: '/login',
      name: 'loginIndex',
      meta: { requireAuth: false },
      component: loginIndex
   },
    {
      path: ROUTER_EXAM_DETAIL+":id", // 学生考试详情  id=>试卷id
      name: 'examDetail',
      meta: { requireAuth: true},
      component: examDetail
    },
    { // 招商加盟
      path: '/join',
      name: 'joinIn',
      meta: { requireAuth: false },
      component: joinIn
    },{ // 关于页面
      path: '/about',
      name: 'callUs',
      meta: { requireAuth: false },
      component: callUs
    }, { // 云课堂首页
      path: '/home',
      name: 'viewIndex',
      meta: { requireAuth: false },
      component: viewIndex
    },{ // 作品中心
      path: ROUTER_INDEX_DISCOVER,
      name: 'discover',
      meta: { requireAuth: false },
      component: discover
    },{ // 更多作品
      path: ROUTER_INDEX_WORKS+"/:id",
      name: 'workContent',
      meta: { requireAuth: false },
      component: workContent
    },{ // 个人中心
      path: ROUTER_INDEX_CENTER,
      name: 'personCenter',
      meta: { requireAuth: true },
      component: personCenter
    },{
      path: '/collectionDialog' ,// 定制采单
      name: 'collectionDialog',
      meta: { requireAuth: true },
      component: collectionDialog
    },
    {
      path: '/institutionDialog/:id' ,// 定制采单
      name: 'institutionDialog',
      meta: { requireAuth: false },
      component: institutionDialog
    },{ // 404页面
      path: '/error',
      name: 'error',
      meta: { requireAuth: false},
      component: error
    }, { // 帮助文档
      path: '/helpDocs',
      name: 'helpDocs',
      meta: { requireAuth: false},
      component: helpDocs
    }, { // 编辑任务中的查看作品
      path: '/taskMan/see/view/:taskId/:id',
      name: 'taskDetail',
      meta: { requireAuth: true },
      component: taskDetail
    },
    {
      path: '/student/task', // 学生页面查看详情
      name: 'studentInfo',
      component: studentInfo
    }, {
      path: '/reportDialog', // 学生页面查看详情
      name: 'reportDialog',
      component: reportDialog
    }, {  // header组件
      path: '/loginHeader',
      name: 'loginHeader',
      meta: { requireAuth: false },
      component: loginHeader
    }]
})




