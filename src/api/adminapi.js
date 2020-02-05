import axios from 'axios'
import qs from 'qs'
import storageUtil from '../utils/storageUtil'
import router from '../router'

const baseURL = 'http://192.168.1.177:9527/als_classroom/public/index.php/adminapi'
import './restfulapi'
//const baseURL = '/api'

axios.defaults.baseURL = baseURL
axios.defaults.timeout = 5000

//登录验证
// const adminLogin = params => {
//   return axios.post('admin/login', params).then(res => res.data)
// }

const adminLogin = params => {
  // return axios.post('index/admin/login', params).then(res => res.data)

  return axios.post('login/login', params).then(res => res.data)
}

const getMenu = params => {
  return axios.post('index/admin/getMenu', params).then(res => res.data)
}
// 获取权限菜单列表
const getAllMenu = params => {
  return axios.post('adminapi/menu/getMenu', params).then(res => res.data)
}

//上传文件接口地址
const uploadFileUrl = baseURL + "/index/upload"

//用户组管理添加
const userGroupAdd = params => {
  return axios.post('admin/level_add ', params).then(res => res.data)
}

// 用户组管理 编辑
const userGroupEditAdd = params => {
  return axios.post('admin/level_edit ', params).then(res => res.data)
}

//获取用户组管理列表
const getUserGroupTableList = params => {
  return axios.post('admin/level', params).then(res => res.data)
}

export {
  qs,
  uploadFileUrl,
  adminLogin,
  getMenu,
  getAllMenu,
  userGroupAdd,
  userGroupEditAdd,
  getUserGroupTableList
}
