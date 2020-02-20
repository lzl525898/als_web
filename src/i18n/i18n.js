import Vue from 'vue'
import I18n from 'vue-i18n'
import messages from './langs/index'
import storageUtil from '../utils/storageUtil'
Vue.use(I18n)
const i18n = new I18n({
  locale: storageUtil.getLang(),
  messages,
});
export default i18n;
