import axios from 'axios'
import qs from 'qs'
import storageUtil from '../utils/storageUtil'
import promptUtil from '../utils/promptUtil'
import router from '../router'
import './restfulapi'
//const baseURL = 'http://101.200.56.18:9528/als_classroom/public/index.php/index'
// const baseURL = 'https://company.alsrobot.vip/als_classroom/public/index.php/index'
// const baseURL = 'https://www.alsrobot.vip/als_classroom/public/index.php/index'
//const baseURL = 'http://vip.alsrobot.com/als_classroom/public/index.php/index'
//const baseURL = 'http://101.200.56.18:9528/als_classroom/public/index.php/index'
// const baseURL = 'http://192.168.1.177:9527/admin.php/index'
//const baseURL = 'http://101.200.56.18:9528/als_classroom/public/index.php/index'
const baseURL = '/api'
window.baseURL=baseURL
global.DEBUG = true

axios.defaults.baseURL = baseURL
axios.defaults.timeout = 50000

//添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 将token给到一个前后台约定好的key中，作为请求发送
  let token = storageUtil.readToken()
  if (token) { // 字符串中包含 token_userid   当userid为0时表示登陆失败，跳转至login
    config.headers['Authorization'] = token + "_" + (storageUtil.readTeacherInfo() ? storageUtil.readTeacherInfo().id : "0")
  } else {
    // if(config.url.indexOf('return_webconfig')<0){ // 屏蔽招商加盟接口
    //   router.replace({path:'/login'})
    // }
  }
  return config;
}, function (error) {
  //console.log("进入request  error")
  return Promise.reject(error);
});
//添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.code == USER_NOT_LOGGED_IN) {
    storageUtil.logout()
    storageUtil.saveOverdue(1)
    router.replace({path: '/login'})
  } else if (response.data.code == LOGIN_TIME_OUT) {
    storageUtil.logout()
    router.replace({path: '/login'})
  }
  // coding...
  return response;
}, function (error) {
  return Promise.reject(error);
});
const baseUrl = baseURL
//====================================奥松云课堂前台====================================
// 获取地址信息
const getAreaInfoWithIndex = params => {
  return axios.post('index/area3', params).then(res => res.data)
}
// 获取scratch类别
const getScratchCategory = params => {
  return axios.post('scratch/find_category', params).then(res => res.data)
}
// 获取scratch作品列表
const getScratchWorksList = params => {
  return axios.post('scratch/get_scratch_all', params).then(res => res.data)
}
// 检验作品是否存在
const checkWorksExist = params => {
  return axios.post('scratch/worksurl_to_userinfo', params).then(res => res.data)
}
// scratch作品发布
const publishScratchWorks = params => {
  return axios.post('scratch/publish_scratch', params).then(res => res.data)
}
// 删除scratch作品
const deleteScratchWorks = params => {
  return axios.post('scratch/del_works', params).then(res => res.data)
}
// 获取平台已发布scratch作品
const getPublishedScratchWorksList = params => {
  return axios.post('scratch/get_scratch_all_student', params).then(res => res.data)
}
// 作品点赞
const likeOperation = params => {
  return axios.post('scratch/scratch_zan', params).then(res => res.data)
}
// 进入scratch作品详情页
const getScratchDetail = params => {
  return axios.post('scratch/scratch_info', params).then(res => res.data)
}
// 添加评论
const addCommentWithWorks = params => {
  return axios.post('scratch/add_comment', params).then(res => res.data)
}
// 获取评论
const getCommentWithWorks = params => {
  return axios.post('scratch/get_comment', params).then(res => res.data)
}
// 删除评论
const delCommentWithWorks = params => {
  return axios.post('scratch/del_comment', params).then(res => res.data)
}
// 举报评论
const worksTipoffs = params => {
  return axios.post('scratch/tip_offs', params).then(res => res.data)
}
//======================================viewIndex=======================================
// 获取静态页首页产品中心与课程信息
const getViewIndexInformation = params => {
  return axios.post('Page/index', params).then(res => res.data)
}
//======================================相关统计=======================================
// 获取登录日志
const getLogInfo = params => {
  return axios.post('note/login_log', params).then(res => res.data)
}
// 获取操作日志
const getHandleLogInfo = params => {
  return axios.post('note/note_log', params).then(res => res.data)
}

//我的课堂统计流量图
const indexFlowStatistics = params => {
  return axios.post('report/oss_biao', params).then(res => res.data)
}
//流量统计
const flowStatistics = params => {
  return axios.post('report/surplus_flow', params).then(res => res.data)
}
//操作日誌统计列表
const getUploadLogTableList = params => {
  return axios.post('report/kongjian_use', params).then(res => res.data)
}
//流量统计列表
const getFlowTableList = params => {
  return axios.post('report/oss_note', params).then(res => res.data)
}
// 统计机构统计数据
const businessAnalysis = params => {
  return axios.post('report/businessAnalysis', params).then(res => res.data)
}
// 统计教务统计数据—教师
const eduReporterTeacher = params => {
  return axios.post('report/eduReporterTeacher', params).then(res => res.data)
}
// 统计教务统计数据—班级
const eduReporterClass = params => {
  return axios.post('report/eduReporterClass', params).then(res => res.data)
}
// 统计教务统计数据—上课记录
const eduReporterRecord = params => {
  return axios.post('report/eduReporterRecord', params).then(res => res.data)
}
// 统计教务数据—班级明细
const eduReportClassDetail = params => {
  return axios.post('report/eduReportClassDetail', params).then(res => res.data)
}
// 统计教务数据—上课记录明细
const eduReporterRecordDetail = params => {
  return axios.post('report/eduReporterRecordDetail', params).then(res => res.data)
}
// 导出excel
const exportExcel = params => {
  return axios.post('index/return_excel', params).then(res => res.data)
}
//======================================编程吧=======================================
// 用户绑定编程吧
const bindUserWithSuperBlockly = params => {
  return axios.post('index/bian_cheng_ba', params).then(res => res.data)
}
// 修改编程吧信息
const updateUserWithSuperBlockly = params => {
  return axios.post('index/bian_cheng_ba', params).then(res => res.data)
}
//=====================================基本功能======================================
// 获取用户角色来判断用户是否过期
const getUserRoleWithOverdue = params => {
  return axios.post('index/get_role', params).then(res => res.data)
}
// 获取学校信息
const getSchoolDueInfo = params => {
  return axios.post('index/get_school_config', params).then(res => res.data)
}
//登录验证
const userLogin = params => {
  return axios.post('index/login', params).then(res => res.data)
}
//获取banner图
const getBannerImage = params => {
  return axios.post('index/return_banner', params).then(res => res.data)
}

//招商加盟表单
const indexForm = params => {
  return axios.post('question/people_seek', params).then(res => res.data)
}
//招商加盟表单
const getTelAddress = params => {
  return axios.post('index/return_webconfig', params).then(res => res.data)
}
// 验证手机并获取验证码
const smsCode = params => {
  return axios.post('sms/index', params).then(res => res.data)
}
// 验证获取的手机验证码
const smsVerify = params => {
  return axios.post('sms/yz', params).then(res => res.data)
}
//通过短信找回密码
const forgetPasswordBySMS = params => {
  return axios.post('index/user_forget_password', params).then(res => res.data)
}
//登录状态验证
const loginStatus = params => {
  return axios.post('index/loginStatus', params).then(res => res.data)
}
//退出验证
const loginOut = params => {
  return axios.post('index/logout', params).then(res => res.data)
}

//验证是否存在账号
const checkAccountExist = params => {
  return axios.post('index/verify_account', params).then(res => res.data)
}

//修改用户信息
const updateUserInfo = params => {
  return axios.post('index/updateInfo', params).then(res => res.data)
}

//修改用户密码
const updateUserPassword = params => {
  return axios.post('index/user_update_pass', params).then(res => res.data)
}

//获取帮助页面的地址
const getHelpImageUrl = params => {
  return axios.post('index/help_pic', params).then(res => res.data)
}

//获取学校首页信息
const getSchoolInfo = params => {
  return axios.post(`school/index`, params).then(res => res.data)
}

//导出咨询管理
const exportConsult = params => {
  return axios.post(`school/school_get_msg_out`, params).then(res => res.data)
}
//保存定制采单选择的表单
const saveCollectionForm = params => {
  return axios.post(`page/seek_teacher`, params).then(res => res.data)
}
//获取采单列表信息
const getCollectionTableList = params => {
  return axios.post(`page/institutionDialog_list`, params).then(res => res.data)
}
//获取采单列表信息
const delCollectionTableList = params => {
  return axios.post(`page/seek_teacher_del`, params).then(res => res.data)
}
//获取采单列表信息
const submitCollectionForm = params => {
  return axios.post(`page/get_msg_add`, params).then(res => res.data)
}
//返回采单信息
const  getCollectionFormInformation= params => {
  return axios.post(`page/institutionDialog`, params).then(res => res.data)
}
//获取导航菜单 index/menu
const getmenu = params => {
  return axios.post(`index/menu`, params).then(res => res.data)
}


//mbx获取系统统计数据
const getSystematicStatistics = params => {
  return axios.post(`school/statistics`, params).then(res => res.data)
}


//mbx获取上课统计数据
const getBeginClassStatistics = params => {
  return axios.post(`school/statistics_class`, params).then(res => res.data)
}

//mbx获取课时内容统计数据
const getclassHourStatistics = params => {
  return axios.post(`school/get_calendar_num`, params).then(res => res.data)
}


//首页获取课程人数 calendar_today_select
const getClassNumber = params => {
  return axios.post(`calendar/calendar_today_select`, params).then(res => res.data)
}

//获取课程信息
const getClassContent = params => {
  return axios.post(`calendar/calendar_a_select`, params).then(res => res.data)
}
//获取学生列表
const getTeacherAllStudent = params => {
  return axios.post(`calendar/calendar_student_no_list `, params).then(res => res.data)
}
//保存学生信息calendar_student_up_one
const saveStudentInformation = params => {
  return axios.post(`calendar/calendar_student_up_one `, params).then(res => res.data)
}


//=======================================班级管理====================================
//获取当前学校的所有班级列表（老师名下的）
const getAllClass = params => {
  return axios.post(`classone/index`, params).then(res => res.data)
}

//按照班级名称关键字搜索班级
const filterClassByKeyWords = params => {
  return axios.post(`classone/search`, params).then(res => res.data)
}

//添加班级
const addClass = params => {
  return axios.post(`classone/add`, params).then(res => res.data)
}

//删除班级
const delClassById = params => {
  return axios.post(`classone/class_del`, params).then(res => res.data)
}

//编辑班级
const editClassById = params => {
  return axios.post(`classone/class_edit`, params).then(res => res.data)
}
//查看班级
const seeClass = params => {
  return axios.post(`classone/class_report`, params).then(res => res.data)
}
//操作统计 近一周 近一个月
const searchWeekMonth = params => {
  return axios.post(`classone/class_report_num`, params).then(res => res.data)
}
//许可状态表格
const permitStatusTableList = params => {
  return axios.post(`classone/class_report_student`, params).then(res => res.data)
}
//获取dialog中的列表
const dislogTableList = params => {
  return axios.post(`code/code_list`, params).then(res => res.data)
}

//获取dialog中select值
const savedialogSelect = params => {
  return axios.post(`code/code_list_teacher_group`, params).then(res => res.data)
}

//dialog中应用许可按钮
const saveApplicationPermit = params => {
  return axios.post(`code/teacher_student`, params).then(res => res.data)
}

//dialog中禁用许可按钮
const disableApplicationPermit = params => {
  return axios.post(`code/teacher_student_no`, params).then(res => res.data)
}

//=======================================教师管理=====================================
//获取可添加教师数量
const getTeacherCount = params => {
  return axios.post(`teacher/teacher_count`, params).then(res => res.data)
}

//教师列表
const getTeacherList = params => {
  return axios.post(`teacher/teacher_list`, params).then(res => res.data)
}

//教师查询
const queryTeacherList = params => {
  return axios.post(`teacher/teacher_search`, params).then(res => res.data)
}

// 添加教师
const addTeacher = params => {
  return axios.post(`teacher/teacher_add`, params).then(res => res.data)
}

const editTeacher = params => {
  return axios.post(`teacher/teacher_edit`, params).then(res => res.data)
}

// 删除教师
const delTeacherById = params => {
  return axios.post(`teacher/teacher_del`, params).then(res => res.data)
}

// 教师密码重置
const resetTeacherPwd = params => {
  return axios.post(`teacher/reset_pass`, params).then(res => res.data)
}

//通过id获取教师个人信息
const getTeacherInfoById = params => {
  return axios.post(`teacher/searchid`, params).then(res => res.data)
}
//=====================================学生管理=====================================
// 学生列表有班级信息
const getStuDetailList = params => {
  return axios.post(`student/stu_detail_list`, params).then(res => res.data)
}
// 学生查询
const getStudentList = params => {
  return axios.post(`student/student_list`, params).then(res => res.data)
}

// 根据班级查询学生
const queryStudentsByClass = params => {
  return axios.post(`student/search_class`, params).then(res => res.data)
}

// 根据班级、学生姓名查询学生
const queryStudentsByName = params => {
  return axios.post(`student/search_student`, params).then(res => res.data)
}

// 学生密码重置
const resetStudentPwd = params => {
  return axios.post(`student/reset_pass`, params).then(res => res.data)
}

// 删除学生
const delStudentById = params => {
  return axios.post(`student/student_del`, params).then(res => res.data)
}

// 添加学生
const addStudent = params => {
  return axios.post(`student/student_add`, params).then(res => res.data)
}

// 学生批量更换班级
const batchChangeClass = params => {
  return axios.post(`student/schstu_add`, params).then(res => res.data)
}

// 编辑学生
const editStudentById = params => {
  return axios.post(`student/stu_up`, params).then(res => res.data)
}

//指定教师拥有的班级
const teachOwnClass = params => {
  return axios.post(`task/teacher_class`, params).then(res => res.data)
}
//指定教师拥有的班级
const authorization = params => {
  return axios.post(`common/get_user_role`, params).then(res => res.data)
}
//=====================================任务管理======================================
// 获取老师名下所有班级以及学生
const getClassAndStudentByTeacher = params => {
  return axios.post(`classone/class_children`, params).then(res => res.data)
}
//获取任务列表
const getTaskList = params => {
  return axios.post(`task/task_list`, params).then(res => res.data)
}
//任务详情
const detailTask = params => {
  return axios.post(`task/detail_task`, params).then(res => res.data)
}
//查看任务
const taskSee = params => {
  return axios.post(`task/task_see`, params).then(res => res.data)
}
//获取任务分配的所有班级
const detailClass = params => {
  return axios.post(`task/detail_class`, params).then(res => res.data)
}

// 添加任务
const addTask = params => {
  return axios.post(`task/task_add`, params).then(res => res.data)
}

// 删除任务
const delTask = params => {
  return axios.post(`task/task_del`, params).then(res => res.data)
}

//编辑保存任务
const editTask = params => {
  return axios.post(`task/task_save`, params).then(res => res.data)
}

//发布任务
const releaseTask = params => {
  return axios.post(`task/task_release`, params).then(res => res.data)
}

//通过任务id获取任务信息
const getTaskById = params => {
  return axios.post(`task/task_detail`, params).then(res => res.data)
}

//查询任务列表
const queryTaskList = params => {
  return axios.post(`task/task_search`, params).then(res => res.data)
}

//查询任务下符合条件的学生列表
const queryTaskSeeList = params => {
  return axios.post(`task/search`, params).then(res => res.data)
}

//获取类型 3D贴纸
const getTaskType = params => {
  return axios.post(`task/mission_select`, params).then(res => res.data)
}

//获取添加D打印电子贴纸后的信息
const getTaskTypeInformation = params => {
  return axios.post(`task/find_task2`, params).then(res => res.data)
}


//====================================直播管理=======================================
//获取直播信息列表
const getLiveManagementList = params => {
  return axios.post(`live/select_subject `, params).then(res => res.data)
}

//保存添加信息
const saveAddInformation = params => {
  return axios.post(`live/subject_create `, params).then(res => res.data)
}
//获取所有学校
const getAllSchool = params => {
  return axios.post(`school/select_allschool `, params).then(res => res.data)
}
//保存新建课时信息
const saveCreateClassInformation = params => {
  return axios.post(`live/room_create`, params).then(res => res.data)
}
//获取新建课时信息
const getCreateClassInformation = params => {
  return axios.post(`live/select_room`, params).then(res => res.data)
}
//禁用加入回收站
const disableAddRecycleBin = params => {
  return axios.post(`live/waste_in`, params).then(res => res.data)
}
//回收站解除禁用
const removeDisable = params => {
  return axios.post(`live/waste_out`, params).then(res => res.data)
}
//删除回收站的课程信息
const deleteTableListCourseInformation = params => {
  return axios.post(`live/waste_delete`, params).then(res => res.data)
}
//编辑回显数据
const editInformation = params => {
  return axios.post(`live/subject_info`, params).then(res => res.data)
}
//编辑  保存添加信息
const editSaveAddInformation = params => {
  return axios.post(`live/subject_update`, params).then(res => res.data)
}

// 获取保存新建课时信息
const getSaveCreateClassInformation = params => {
  return axios.post(`live/room_info`, params).then(res => res.data)
}

// 编辑 保存新建课时信息
const editSaveCreateClassInformation = params => {
  return axios.post(`live/room_update`, params).then(res => res.data)
}

//列表禁用直播课时
const disableTableListLiveClass = params => {
  return axios.post(`live/room_waste_in`, params).then(res => res.data)
}

// 获取课时信息
const getTableListLiveClass = params => {
  return axios.post(`live/user_room_list`, params).then(res => res.data)
}

//获取直播状态以及url live_url
const getLiveClassUrl = params => {
  return axios.post(`live/live_url`, params).then(res => res.data)
}


//获取直播帮助图片url
const getLiveHelpImageUrl = params => {
  return axios.post(`index/help_live_pic`, params).then(res => res.data)
}

//====================================资料库=======================================
//查询资源列表
const getResourceList = params => {
  return axios.post(`resource/file_see`, params).then(res => res.data)
}
// 获取资源分类
const getResourceCategory = params => {
  return axios.post(`resource/category`, params).then(res => res.data)
}
// 按照类别过滤资源
const filterResourceByTag = params => {
  return axios.post(`resource/category_search`, params).then(res => res.data)
}
// 按照类别过滤资源
const queryResourceByKeys = params => {
  return axios.post(`resource/search`, params).then(res => res.data)
}
//====================================学情报告=======================================
// 上传文件至服务器
const uploadLocal = baseURL + "/index/upload_local"
//上传文件接口地址
const uploadFileUrl = baseURL + "/index/upload"

//上传头像接口地址
const uploadAvatarUrl = baseURL + "/index/upload_header"

//上传裁剪头像base64
const uploadBase64 = params => {
  return axios.post(`/index/header_make`, params).then(res => res.data)
}
//上传裁剪机构logo base64
const uploadOriginBase64 = params => {
  return axios.post(`/index/upload_base64_load`, params).then(res => res.data)
}
//保存结业证书
const saveEduReporter = params => {
  return axios.post(`/certificate/save`, params).then(res => res.data)
}
//删除结业证书
const delEduReporter = params => {
  return axios.post(`/certificate/del`, params).then(res => res.data)
}
// 获取结业证书列表
const getCertList = params => {
  return axios.post(`/certificate/list_certificate`, params).then(res => res.data)
}
//获取学情报告基本信息
const getReportAnalysis = params => {
  return axios.post(`report/index`, params).then(res => res.data)
}

//删除已上传的资源文件
const delUploadFileByUrl = params => {
  return axios.post(`index/del_file`, params).then(res => res.data)
}

//进入学清报告，获取头信息
const intoReportBaseInfo = params => {
  return axios.post(`student/learn_stu`, params).then(res => res.data)
}

//进入学清报告，获取学情列表
const getReportList = params => {
  return axios.post(`student/learn_list`, params).then(res => res.data)
}

//通过id删除报告
const delReportById = params => {
  return axios.post(`student/del_report`, params).then(res => res.data)
}

//创建课程报告
const createCourseReport = params => {
  return axios.post(`student/save_learn`, params).then(res => res.data)
}

//获取指定学生未创建报告的任务列表
const getStudentReportListWithNoCreat = params => {
  return axios.post(`student/stu_task`, params).then(res => res.data)
}
//获取指定学生未创建报告的任务列表与课程列表
const getStudentReportListWithNoCreatCourse = params => {
  return axios.post(`student/task_and_course`, params).then(res => res.data)
}


//获取指定学生学情报告详情
const getStudentReportDetail = params => {
  return axios.post(`student/see_report`, params).then(res => res.data)
}

//通过报告id获取待编辑的报告内容
const getStudentReportWithEdit = params => {
  return axios.post(`student/edit_learn`, params).then(res => res.data)
}

//编辑中的保存学情报告
const saveCourseReport = params => {
  return axios.post(`student/save_learn_edit`, params).then(res => res.data)
}
//创建中的发布学情报告
const releaseCreateCourseReport = params => {
  return axios.post(`student/release_learn`, params).then(res => res.data)
}
//编辑中的发布学情报告
const releaseEditCourseReport = params => {
  return axios.post(`student/release_learn_edit`, params).then(res => res.data)
}
//================================自定义课程资源=====================================
// 获取自定义课程类别
const getCustomCategorySelf = params => {
  return axios.post(`courses_self/category`, params).then(res => res.data)
}
// 根据关键字、类别id过滤自定义课程类别
const filterCustomByWordsSelf = params => {
  return axios.post(`courses_self/index_select`, params).then(res => res.data)
}
// 添加自定义课程包
const addCustomSelf = params => {
  return axios.post(`courses_self/course_add`, params).then(res => res.data)
}
// 删除自定义课程包
const delCustomSelf = params => {
  return axios.post(`courses_self/course_del`, params).then(res => res.data)
}
// 通过id查找自定义课程包
const findCustomSelfById = params => {
  return axios.post(`courses_self/course_self_one`, params).then(res => res.data)
}
// 添加、编辑课时
const handleCustomItemSelf = params => {
  return axios.post(`courses_self/recycle_add`, params).then(res => res.data)
}
// 进入课时列表页面获取基础信息
const intoCourseBaseInfo = params => {
  return axios.post(`courses_self/courses_detail`, params).then(res => res.data)
}
// 根据id删除课时
const delCourseItemById = params => {
  return axios.post(`courses_self/recycle_del`, params).then(res => res.data)
}
// 根据id获取课时
const getCourseItemById = params => {
  return axios.post(`courses_self/recycle_one`, params).then(res => res.data)
}
//====================================课程资源=======================================
// 获取该学校应该具有的课程资源
const getCoursesPackage = params => {
  return axios.post(`courses/index`, params).then(res => res.data)
}
// 获取该学校直播课程资源
const getCoursesLivePackage = params => {
  return axios.post(`live/user_subject_list`, params).then(res => res.data)
}
// 获取分类
// 课程资源 1  资料库 2  课程包 3
const getCoursesCategory = params => {
  return axios.post(`courses/category`, params).then(res => res.data)
}
// 获取课程包中详细章节
const getCoursesPackageDetail = params => {
  return axios.post(`courses/courses_detail`, params).then(res => res.data)
}
// 查询课程包中详细章节
const searchCoursesPackageDetail = params => {
  return axios.post(`courses/courses_search`, params).then(res => res.data)
}
// 进入课程包中详细章节
const intoCoursesPackageDetailById = params => {
  return axios.post(`courses/see_file`, params).then(res => res.data)
}
// 按照类别过滤资源
const filterCoursesDetailByTag = params => {
  return axios.post(`courses/category_search_old`, params).then(res => res.data)
}
// 按照类别过滤资源
const filterCoursesDetailBatch = params => {
  return axios.post(`courses/category_search`, params).then(res => res.data)
}
// 查询课程包，通过tag和字符串
const filterPackage = params => {
  return axios.post(`courses/index_select_old`, params).then(res => res.data)
}
const filterPackageBatch = params => {
  return axios.post(`courses/index_select`, params).then(res => res.data)
}
const equipmentList = params => {
  return axios.post(`equipment/equipment_list`, params).then(res => res.data)
}
const equipmentDesc = params => {
  return axios.post(`equipment/equipment_con`, params).then(res => res.data)
}
//====================================我的任务=======================================
// 检验学生密码是否过于简单
const checkStudentPwd = params => {
  return axios.post(`student/pwd_so_easy`, params).then(res => res.data)
}
// 获取当前学生首页数据分析
const getStudentStatistics = params => {
  return axios.post(`student/classroom_statistics`, params).then(res => res.data)
}
// 查找学生当前所有任务
const getStudentTaskList = params => {
  return axios.post(`student/get_stutask`, params).then(res => res.data)
}
//进入查看性情页面
const saveSeedDtailsInformation = params => {
  return axios.post(`student/stu_task_select`, params).then(res => res.data)
}

// 学生发布作品
const publishWorksByStudent = params => {
  return axios.post(`student/publish_works`, params).then(res => res.data)
}

//通过id获取学生个人信息
const getStudentInfoById = params => {
  return axios.post(`student/getStuInfoById`, params).then(res => res.data)
}
//保存3d打印 电子贴纸
const saveStudentTypeInformation = params => {
  return axios.post(`student/stu_task_add2`, params).then(res => res.data)
}
//获取作品名称与保存发布信息
const publishingWorks = params => {
  return axios.post(`task/get_student_submit_info`, params).then(res => res.data)
}
//获取学生作品数据echart
const statisticsWorks = params => {
  return axios.post(`student/statistics_works`, params).then(res => res.data)
}
//====================================机构信息=======================================
//机构更新信息接口
const organUpdate = params => {
  return axios.post(`school/edit`, params).then(res => res.data)
}
//获取机构信息接口
const getOrganUpdate = params => {
  return axios.post(`school/get_info`, params).then(res => res.data)
}
//机构更新信息接口
const classUpdate = params => {
  return axios.post(`school/addClass`, params).then(res => res.data)
}

//课程信息删除接口
const delClassUpdate = params => {
  return axios.post(`school/delClass`, params).then(res => res.data)
}

//教师信息保存接口
const saveTeacherInformation = params => {
  return axios.post('school/addTeacher ', params).then(res => res.data)
}

//删除教师信息接口
const delTeacherUpdate = params => {
  return axios.post('school/delTeacher ', params).then(res => res.data)
}

//保存关于我们信息接口
const saveAboutUsInformation = params => {
  return axios.post('school/edit_about ', params).then(res => res.data)
}
//====================================许可分配=======================================
//获取分配许可数据
const codeAllocate = params => {
  return axios.post('code/code_fenpei', params).then(res => res.data)
}
//取消许可
const cancelPermit = params => {
  return axios.post('code/teacher_student_no', params).then(res => res.data)
}
//使用许可
const permit = params => {
  return axios.post('code/teacher_student', params).then(res => res.data)
}
//管理员分配许可码
const teacherAllocate = params => {
  return axios.post('code/admin_teacher', params).then(res => res.data)
}
//管理员验证许可码
const permitStudents = params => {
  return axios.post('code/student_list', params).then(res => res.data)
}
//验证许可文件接口地址
const testCodeFile = baseURL + "/code/school_add"

//====================================记上课=======================================
//记上课详情页面获取信息
// const getClassDetailData = params => {
//   return axios.post('calendar/select_calendar_one',params).then(res=>res.data)
// }

// 获取记上课过滤基础信息
const getRecordClassFilterData = params => {
  return axios.post('calendar/calendar_over_term', params).then(res => res.data)
}
// 获取记上课数据列表
const getRecordClassList = params => {
  return axios.post('calendar/calendar_over_list', params).then(res => res.data)
}
// 获取已记课程数据列表
const getRecordAlreadyClassList = params => {
  return axios.post('calendar/calendar_jishangke_list', params).then(res => res.data)
}
// 通过id获取应到/实到学员
const getRecordStudentInfo = params => {
  return axios.post('calendar/calendar_student_info', params).then(res => res.data)
}
// 获取课时汇总过滤基础信息
const getAllHourFilterData = params => {
  return axios.post('calendar/class_hour_filter', params).then(res => res.data)
}
// 获取课时汇总教师列表
const getAllHourTeacherList = params => {
  return axios.post('calendar/teacher_calendar', params).then(res => res.data)
}
// 获取课时汇总学生列表
const getAllHourStudentList = params => {
  return axios.post('calendar/student_calendar', params).then(res => res.data)
}
//====================================双师教学=======================================

const getDoubleListShow = params => {
  return axios.post('courses_cooperate/select_one', params).then(res => res.data)
}
//====================================创作工具=======================================
const getTools = params => {
  return axios.post('index/tools', params).then(res => res.data)
}
//====================================联系我们=======================================
//联系我们
const contact = params => {
  return axios.post('index/tel', params).then(res => res.data)
}
//====================================首页=======================================
//获取公告列表
const noticeList = params => {
  return axios.post('notice/notice_list', params).then(res => res.data)
}

//获取提醒列表
const remindList = params => {
  return axios.post('notice/notice_school_list', params).then(res => res.data)
}

//获取公告详情
const noticeDetail = params => {
  return axios.post('notice/notice_con', params).then(res => res.data)
}

//获取提醒详情
const remindDetail = params => {
  return axios.post('notice/notice_school_con', params).then(res => res.data)
}

//====================================咨询管理=======================================
//添加学生
const addConsultingManagement = params => {
  return axios.post('school/get_msg_add', params).then(res => res.data)
}

//获取资讯管理列表 get_msg_list
const getConsultingManagement = params => {
  return axios.post('school/get_msg_list', params).then(res => res.data)
}

//删除咨询学员  get_msg_dels
const delConsultationStudent = params => {
  return axios.post('school/get_msg_del', params).then(res => res.data)
}
//批量删除咨询学员
const batchDelConsultationStudent = params => {
  return axios.post('school/get_msg_dels', params).then(res => res.data)
}
//获取单个学员信息
const getConsultingManagementInformation = params => {
  return axios.post('school/get_msg_one', params).then(res => res.data)
}
//编辑咨询学员
const editConsultingManagement = params => {
  return axios.post('school/get_msg_edit', params).then(res => res.data)
}
// 转化学生操作
const conConsultingManagement = params => {
  return axios.post('school/get_msg_use_all', params).then(res => res.data)
}

//====================================排课管理=======================================

//添加上课学员
const getClassStudentData = params => {
  return axios.post('calendar/student_obj_calendar_one', params).then(res => res.data)
}
// 获取添加上课学生班级信息
const getAddClassData = params => {
  return axios.post('calendar/calendar_student_no_list', params).then(res => res.data)
}
// 获取进入排课页面获取初始化信息
const getCalendarInitData = params => {
  return axios.post('calendar/index', params).then(res => res.data)
}
// 获取进入添加排课时初始化信息
const getIntoAddSchedulesData = params => {
  return axios.post('calendar/index2', params).then(res => res.data)
}

// 获取进入记上课数据
const getIntoAddClassData = params => {
  return axios.post('calendar/index3', params).then(res => res.data)
}
// 批量保存记上课数据
const batchSelection = params => {
  return axios.post('calendar/calendar_student_up_all', params).then(res => res.data)
}

// 保存记上课
const saveRememberAddClass = params => {
  return axios.post('calendar/calendar_end_course ', params).then(res => res.data)
}

//保存记上课添加学生
const saveAddClassStudentData = params => {
  return axios.post('calendar/calendar_student_into', params).then(res => res.data)
}
// 通过点选教师获取教师所拥有的班级
const getClassByTeacher = params => {
  return axios.post('calendar/teacher_class', params).then(res => res.data)
}
// 按照时间查询添加课时
const querySchedulesByTimestamp = params => {
  return axios.post('calendar/calendar_select', params).then(res => res.data)
}
// 添加课时
const addSchedules = params => {
  return axios.post('calendar/calendar_add', params).then(res => res.data)
}
// 进入管理页面后获取管理页面基本信息
const getIntoManageDetailData = params => {
  return axios.post('calendar/calendar_student_select', params).then(res => res.data)
}
// 进入管理页面后修改时触发
const updateManageDetailData = params => {
  return axios.post('calendar/calendar_student_update', params).then(res => res.data)
}
// 通过id删除Schedules课时
const delScheduleById = params => {
  return axios.post('calendar/calendar_del', params).then(res => res.data)
}
// 更改指定Schedules课时
const updateSchedule = params => {
  return axios.post('calendar/calendar_update', params).then(res => res.data)
}
// 更改指定Schedules按日期修改课时
const updateScheduleByDate = params => {
  return axios.post('calendar/calendar_time_update', params).then(res => res.data)
}
// 获取学校内所有课程列表
const getSchoolAllSchedules = params => {
  return axios.post('calendar/calendar_zb_list', params).then(res => res.data)
}
// 学生转班
const studentChangeClassroom = params => {
  return axios.post('calendar/change_class', params).then(res => res.data)
}
// 教师上课,结课
const changeTeacherCourseStatus = params => {
  return axios.post('calendar/calendar_course_start', params).then(res => res.data)
}
//====================================反馈管理=======================================
// 获取问题类型
const getCategory = params => {
  return axios.post('question/category', params).then(res => res.data)
}
// 添加问题反馈
const addFeedbackItem = params => {
  return axios.post('question/add', params).then(res => res.data)
}
// 删除问题反馈
const delFeedbackItem = params => {
  return axios.post('question/del', params).then(res => res.data)
}
// 获取问题列表
const getFeedbackList = params => {
  return axios.post('question/get_list', params).then(res => res.data)
}
// 通过id获取问题
const getFeedbackById = params => {
  return axios.post('question/get_one', params).then(res => res.data)
}

//=====================================双师教学======================================
// 获取最外层课程包
const getDoubleCoursePackage = params => {
  return axios.post('courses_cooperate/index_select', params).then(res => res.data)
}
//获取查询头
const getDoubleClickSearch = params => {
  return axios.post('courses_cooperate/category', params).then(res => res.data)
}
// 获取课程包中详细章节
const getDoubleCoursesPackageDetail = params => {
  return axios.post(`courses_cooperate/courses_detail`, params).then(res => res.data)
}
// 搜索列表类别过滤资源
const filterDoubleCoursesDetailBatch = params => {
  return axios.post(`courses_cooperate/category_search`, params).then(res => res.data)
}
//=====================================考试系统======================================
// 创建考试
const createExam = params => {
  return axios.post(`kaoshi/paper_add`, params).then(res => res.data)
}
// 查询考试列表
const queryExamList = params => {
  return axios.post(`kaoshi/paper_list`, params).then(res => res.data)
}
// 通过id删除考试
const delExamByIds = params => {
  return axios.post(`kaoshi/paper_del`, params).then(res => res.data)
}
// 通过id查询考试
const getExamById = params => {
  return axios.post(`kaoshi/paper`, params).then(res => res.data)
}
// 修改考试
const updateExam = params => {
  return axios.post(`kaoshi/paper_edit`, params).then(res => res.data)
}

//=======================================流量统计=====================================
//统计流量
const trafficStatistics = params => {
  return axios.post(`index/oss_note`, params).then(res => res.data)
}

// 查询学生考试列表
const getExamStudentList = params => {
  return axios.post(`kaoshi/paper_student_list`, params).then(res => res.data)
}
// 学生考试获取考试信息
const getStudentExam = params => {
  return axios.post(`kaoshi/student_paper`, params).then(res => res.data)
}
// 获取试题解析
const getExamAnalysis = params => {
  return axios.post(`kaoshi/student_over_paper`, params).then(res => res.data)
}
// 学生操作试卷并保存
const handleExam = params => {
  return axios.post(`kaoshi/handle_exam`, params).then(res => res.data)
}
// 学生提交试卷，返回评分
const submitPapers = params => {
  return axios.post(`kaoshi/submit_papers`, params).then(res => res.data)
}
// 开始考试
const startExam = params => {
  return axios.post(`kaoshi/start_paper`, params).then(res => res.data)
}
// 按考试查询学生列表
const studentWithExamList = params => {
  return axios.post(`kaoshi/student_with_exam_list`, params).then(res => res.data)
}
// 按学生查询考试列表
const examWithStudentList = params => {
  return axios.post(`kaoshi/exam_with_student_list`, params).then(res => res.data)
}
// 删除学生考试数据
const delStudentExamData = params => {
  return axios.post(`kaoshi/paper_student_del`, params).then(res => res.data)
}
// 获取考试分析
const getAnalysisExam = params => {
  return axios.post(`kaoshi/get_exam_analysis`, params).then(res => res.data)
}
// 指定考试内获取学生列表
const getStudentListFromExam = params => {
  return axios.post(`kaoshi/student_list_paper`, params).then(res => res.data)
}
// 获取试题分析列表
const getQuestionListFromExam = params => {
  return axios.post(`kaoshi/paper_ti`, params).then(res => res.data)
}

export {
  qs,
  baseUrl,
  getLogInfo,
  getHandleLogInfo,
  businessAnalysis,
  eduReporterTeacher,
  eduReporterClass,
  eduReporterRecord,
  eduReportClassDetail,
  eduReporterRecordDetail,
  exportExcel,
  bindUserWithSuperBlockly,
  updateUserWithSuperBlockly,
  getUserRoleWithOverdue,
  getSchoolDueInfo,
  userLogin,
  loginStatus,
  loginOut,
  updateUserInfo,
  updateUserPassword,
  smsVerify,
  smsCode,
  forgetPasswordBySMS,
  getSchoolInfo,
  exportConsult,
  getAllClass,
  addClass,
  delClassById,
  editClassById,
  filterClassByKeyWords,
  addTeacher,
  editTeacher,
  delTeacherById,
  resetTeacherPwd,
  getTeacherList,
  getTeacherCount,
  queryTeacherList,
  getTeacherInfoById,
  addStudent,
  batchChangeClass,
  getStudentList,
  getStuDetailList,
  queryStudentsByClass,
  queryStudentsByName,
  resetStudentPwd,
  delStudentById,
  editStudentById,
  addTask,
  teachOwnClass,
  editTask,
  releaseTask,
  getTaskById,
  getClassAndStudentByTeacher,
  getTaskList,
  delTask,
  queryTaskList,
  queryTaskSeeList,
  getResourceList,
  getResourceCategory,
  filterResourceByTag,
  queryResourceByKeys,
  detailTask,
  taskSee,
  detailClass,
  intoReportBaseInfo,
  getReportList,
  delReportById,
  uploadFileUrl,
  uploadLocal,
  uploadAvatarUrl,
  uploadBase64,
  uploadOriginBase64,
  delUploadFileByUrl,
  getReportAnalysis,
  createCourseReport,
  getStudentReportListWithNoCreat,
  getStudentReportDetail,
  getStudentReportWithEdit,
  saveCourseReport,
  releaseCreateCourseReport,
  releaseEditCourseReport,
  getCoursesPackage,
  getCoursesCategory,
  filterPackageBatch,
  getCoursesPackageDetail,
  getCustomCategorySelf,
  filterCustomByWordsSelf,
  addCustomSelf,
  delCustomSelf,
  findCustomSelfById,
  handleCustomItemSelf,
  intoCourseBaseInfo,
  delCourseItemById,
  getCourseItemById,
  searchCoursesPackageDetail,
  intoCoursesPackageDetailById,
  filterCoursesDetailByTag,
  filterCoursesDetailBatch,
  filterPackage,
  checkStudentPwd,
  getStudentStatistics,
  getStudentTaskList,
  getStudentInfoById,
  publishWorksByStudent,
  organUpdate,
  getOrganUpdate,
  classUpdate,
  delClassUpdate,
  saveTeacherInformation,
  delTeacherUpdate,
  saveAboutUsInformation,
  saveAddInformation,
  getLiveManagementList,
  getAllSchool,
  // searchLiveList,
  disableAddRecycleBin,
  removeDisable,
  deleteTableListCourseInformation,
  saveCreateClassInformation,
  getCreateClassInformation,
  editInformation,
  editSaveAddInformation,
  getSaveCreateClassInformation,
  editSaveCreateClassInformation,
  disableTableListLiveClass,
  getCoursesLivePackage,
  getTableListLiveClass,
  getLiveClassUrl,
  getHelpImageUrl,
  getLiveHelpImageUrl,
  codeAllocate,
  cancelPermit,
  permit,
  teacherAllocate,
  testCodeFile,
  permitStudents,
  seeClass,
  searchWeekMonth,
  permitStatusTableList,
  dislogTableList,
  saveApplicationPermit,
  savedialogSelect,
  disableApplicationPermit,
  getmenu,
  authorization,
  contact,
  noticeList,
  remindList,
  noticeDetail,
  remindDetail,
  addConsultingManagement,
  getConsultingManagement,
  delConsultationStudent,
  batchDelConsultationStudent,
  editConsultingManagement,
  getConsultingManagementInformation,
  conConsultingManagement,
  getCalendarInitData,
  getIntoAddSchedulesData,
  getClassByTeacher,
  addSchedules,
  querySchedulesByTimestamp,
  getIntoManageDetailData,
  updateManageDetailData,
  delScheduleById,
  getClassNumber,
  getClassContent,
  getTeacherAllStudent,
  saveStudentInformation,
  updateSchedule,
  updateScheduleByDate,
  getSchoolAllSchedules,
  studentChangeClassroom,
  changeTeacherCourseStatus,
  getTaskType,
  saveStudentTypeInformation,
  saveSeedDtailsInformation,
  getTaskTypeInformation,
  getSystematicStatistics,
  getBeginClassStatistics,
  getclassHourStatistics,
  publishingWorks,
  statisticsWorks,
  getDoubleCoursePackage,
  getDoubleClickSearch,
  filterDoubleCoursesDetailBatch,
  getDoubleCoursesPackageDetail,
  getCategory,
  addFeedbackItem,
  delFeedbackItem,
  getFeedbackList,
  getFeedbackById,
  indexForm,
  getTelAddress,
  getTools,
  getDoubleListShow,
  getRecordClassFilterData,
  getRecordClassList,
  getRecordAlreadyClassList,
  getRecordStudentInfo,
  getBannerImage,
  getAllHourFilterData,
  getAllHourTeacherList,
  getAllHourStudentList,
  getClassStudentData,
  getAddClassData,
  getIntoAddClassData,
  saveAddClassStudentData,
  saveRememberAddClass,
  batchSelection,
  saveEduReporter,
  getCertList,
  delEduReporter,
  getStudentReportListWithNoCreatCourse,
  createExam,
  queryExamList,
  delExamByIds,
  getExamById,
  updateExam,
  trafficStatistics,
  getExamStudentList,
  getStudentExam,
  flowStatistics,
  getUploadLogTableList,
  getFlowTableList,
  getExamAnalysis,
  handleExam,
  submitPapers,
  startExam,
  studentWithExamList,
  examWithStudentList,
  delStudentExamData,
  getAnalysisExam,
  getStudentListFromExam,
  getQuestionListFromExam,
  indexFlowStatistics,
  getViewIndexInformation,
  getScratchCategory,
  getScratchWorksList,
  checkWorksExist,
  publishScratchWorks,
  deleteScratchWorks,
  getPublishedScratchWorksList,
  likeOperation,
  getScratchDetail,
  addCommentWithWorks,
  getCommentWithWorks,
  delCommentWithWorks,
  getAreaInfoWithIndex,
  worksTipoffs,
  saveCollectionForm,
  getCollectionFormInformation,
  getCollectionTableList,
  delCollectionTableList,
  submitCollectionForm,
  equipmentList,
  equipmentDesc,
  checkAccountExist
}










