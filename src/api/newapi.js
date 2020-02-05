import ajax from './ajax'
import axios from "axios";
import storageUtil from "../utils/storageUtil";
import router from "../router";
const BASE = '/api'

//添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 将token给到一个前后台约定好的key中，作为请求发送
  let token = storageUtil.readToken()
  if (token) {
    config.headers['Authorization'] = token
  }else {
    // router.replace({path:'/login'})
  }
  return config;
}, function (error) {
 // console.log("进入request  error")
  return Promise.reject(error);
});
//添加响应拦截器
axios.interceptors.response.use(function (response) {
  if(response.data.code==USER_NOT_LOGGED_IN){
    // router.replace({path:'/login'})
  }
  // coding...
  return response;
}, function (error) {
  return Promise.reject(error);
});

// 登陆
// export const checkLoginStatus = (token) => ajax(BASE+'/index/loginStatus',{token}, 'POST')

