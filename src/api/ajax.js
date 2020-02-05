import axios from 'axios'
import promptUtil from '../utils/promptUtil'

export default function ajax(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    // 1.执行异步请求
    if (method==='GET'){
      promise = axios.get(url, {
        params: data
      })
    } else if (method==='POST'){
      promise = axios.post(url, data)
    }
    // 2.如果成功了，调用resolve
    promise.then(res => {
      // 直接获取response的data
      resolve(res.data)
    }).catch(err => {
      // 3.失败后不调用reject
      promptUtil.LOG("ALS_ERR",err.message)
    })
  })
}
