import promptUtil from '../utils/promptUtil'
import '../api/restfulapi'
import {
  qs,
  exportExcel
} from  '../api/api'

export default {
  excelExport(that,name,head,data){ // head=>array name=>string data=>array(array)
    const targetParams = data
    const params = {head:head,body:[],name:''}
    params.name = name
    params.body = targetParams
    exportExcel(qs.stringify({data:JSON.stringify(params)})).then(res=>{
      if(res.code==SUCCESS_CODE){
        promptUtil.success(that, '数据准备完毕,等待下载中')
        window.open(res.data, "_self")
      }
    }).catch(err=>{
      promptUtil.LOG('exportExcel-err',err)
    })
  },
}
