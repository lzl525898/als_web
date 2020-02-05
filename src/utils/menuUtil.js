import vuexUtils from './vuexUtils'
const MENU_ROUTER_CONFIG = {}
const ROUTER_CONFIG = {
  'user' : [{name:'',to:''}],
}
export default {
  getRouterConfig(that,url){
    if(vuexUtils.getMenuArray(that).length>0){
      vuexUtils.getMenuArray(that).map(item=>{
        MENU_ROUTER_CONFIG[item.url] = item
      })
      ROUTER_CONFIG[url][0].name = MENU_ROUTER_CONFIG[item.url].name
      return ROUTER_CONFIG[url]
    }else{
      return null
    }
  }
}
