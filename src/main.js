// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './vuex/store'
import router from './router'
import i18n from './i18n/i18n'
// import ElementUI from 'element-ui'
import ElementLocale from 'element-ui/lib/locale'
import storageUtil from './utils/storageUtil'
import stringUtil from './utils/stringUtil'
import './assets/myfonts/iconfont.css'
import $ from 'jquery';
import 'element-ui/lib/theme-chalk/index.css'
// 引入echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts
import moment from 'moment'//导入文件
Vue.prototype.$moment = moment;//赋值使用
import VueQr from 'vue-qr'
 //滚动条
import {HappyScroll} from 'vue-happy-scroll'
Vue.component('happy-scroll',HappyScroll)
//引入css
// import 'Vue-happy-scroll/docs/happy-scroll.css'
//引入懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload);
// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
import Print from 'vue-print-nb'
import {
  Backtop,
  PageHeader,
  Pagination,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Badge,
  Card,
  Rate,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Image,
  Calendar,
  Loading,
  MessageBox,
  Message,
  Avatar,
  Divider,
  Notification,
  Step,
  Steps,
} from 'element-ui';
Vue.use(Backtop);
Vue.use(Print);
Vue.use(PageHeader);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Rate);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(ColorPicker);
Vue.use(Transfer);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Link);
Vue.use(Image);
Vue.use(Avatar);
Vue.use(Calendar);
Vue.use(Divider);
Vue.use(Loading.directive);
Vue.use(Step);
Vue.use(Steps);


Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.config.productionTip = false

ElementLocale.i18n((key, value) => i18n.t(key, value))

//自定义弹出框组件
import reportDialog from '@/components/teachers/report/reportDialog.vue'
const dialogComponents={}
dialogComponents.install=function(Vue){
  Vue.component('reportDialog',reportDialog)
}
export default dialogComponents

router.beforeEach((to, from, next) =>{//如果未匹配到路由 如果上级也未匹配到路由则跳转error页面，如果上级能匹配到则转上级路由
  if (to.matched.length === 0) {
    if(from.name){
      next({
        name : from.name
      })
    }else {
      if (storageUtil.getLoginStatus() == 1) {
        next('/error')
      } else {
        next({
          path: '/login'
        })
      }
    }
  } else {
    if (to.meta.requireAuth){  // 需要进行认证的 requireAuth: true
      if(storageUtil.getLoginStatus()==1){
        if (storageUtil.readUserRole()==1) { // 机构管理员
          if (to.fullPath==="/onlineEducation" || to.fullPath==="/dashboard" || to.fullPath==="/student" || to.fullPath==='/sturep' ||to.fullPath==='/liveManagement'|| stringUtil.searchString(to.fullPath,"/admin")) { // 防止跳转到学生页面
            if (from.name==null) { // 防止直接从项目外路径跳转
              next({ name : 'user'})
            } else {
              next({ name : from.name })
            }
          } else {
            next()
          }
        } else if (storageUtil.readUserRole()==2) { // 教师
          if (to.fullPath==="/teacherMan" || to.fullPath==="/liveManagement" || to.fullPath==="/student" || to.fullPath==="/dashboard" || to.fullPath==="/onlineEducation"
            || to.fullPath==='/sturep'|| to.fullPath==='/onlineEducation' || stringUtil.searchString(to.fullPath,"/admin")) {// 防止跳转到学生、教师管理页面
            if (from.name==null) {
              next({ name : 'user'})
            } else {
              next({ name : from.name })
            }
          } else {
            next()
          }
        } else if( storageUtil.readUserRole()==4){ // 直播管理员
        // console.log("直播管理员to.fullPath",to.fullPath)
          if (to.fullPath==="/teacherMan" || to.fullPath==="/student" || to.fullPath==="/index"
            || to.fullPath==='/sturep'||stringUtil.searchString(to.fullPath,"/admin")) {// 防止跳转到学生、教师管理页面
            if (from.name==null) {
              next({ name : 'liveManagement'})
            } else {
              if(to.fullPath==="/index"){
                next({ name : 'liveManagement'})
              }else{
                next({ name : from.name })
              }
            }
          } else {
            next()
          }
        }
        else { // 学生
          if ( to.fullPath!='/mail' && to.fullPath!='/dashboard' && to.fullPath!='/student' && to.fullPath!='/sturep'&& to.fullPath!='/stuLiveManage' && to.fullPath.indexOf("/create") == -1 && to.fullPath!='/onlineEducation'
            && to.fullPath.indexOf("/resourcesLiveList/") == -1 && to.fullPath.indexOf("/create?id") == -1 && to.fullPath.indexOf("/workContent") == -1 && to.fullPath!='/personCenter') {
            next('/dashboard')
          } else {
            next()
          }
        }
      } else {
        next({
          path: '/login'
        })
      }
    } else { // 不需认证的 requireAuth: false
      next()
    }
    if (to.fullPath === "/login") {
      if (storageUtil.getLoginStatus()==1) {
        if (from.fullPath=='/home' || from.fullPath=='/about' || from.fullPath=='/join' || from.fullPath=='/discover' || from.fullPath=='/personCenter' || from.fullPath.indexOf("/workContent")>=0){
          if (storageUtil.readUserRole()==1 || storageUtil.readUserRole()==2) { // 教师身份
            next({
              path: '/index'
            })
          } else if (storageUtil.readUserRole()==3) { // 学生身份
            next({
              path: '/dashboard'
            })
          } else if(storageUtil.readUserRole()==4){
            next({
              path: '/liveManagement'
            })
          }
          else {
            storageUtil.logout()
            next({
              path: '/login'
            })
          }
        } else {
          if(from.fullPath.indexOf('workContent')>=0){
            if (storageUtil.readUserRole()==1 || storageUtil.readUserRole()==2) { // 教师身份
              next({
                path: '/index'
              })
            }else if (storageUtil.readUserRole()==3) { // 学生身份
              next({
                path: '/dashboard'
              })
            }
          }else{
            next({
              path: from.fullPath
            })
          }
        }
      } else {
        next()
      }
    }
    // else if (to.fullPath === "/admin/login") {
    //   if(storageUtil.getLoginStatus()==1){ // 表示已经登陆
    //     if (storageUtil.readUserRole()==110){ // 管理员身份
    //
    //     } else {
    //
    //     }
    //     next({
    //       path: '/admin'
    //     })
    //   } else { // 没有登陆
    //     console.log("/admin/login 没有登陆")
    //     next()
    //   }
    // }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App ,VueQr},
  template: '<App/>',
  store, // 所有的组件对象有个属性 $store
  i18n
})
