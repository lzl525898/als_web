import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import I18n from 'vue-i18n'
import messages from './langs/index'
import storageUtil from '../utils/storageUtil'
Vue.use(I18n)

const i18n = new I18n({
  locale: storageUtil.getLang(),
  messages,
});
locale.i18n((key,value)=>{i18n.t(key,value)}) // 实现element插件多语言切换
export default i18n;
