import en from './en'
import zh from './zh-cn'
import tw from './zh-tw'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'
import enLocale from 'element-ui/lib/locale/lang/en'

const message = {
  "en":Object.assign(en,enLocale),
  "zh":Object.assign(zh,zhLocale),
  "cht":Object.assign(tw,twLocale)
}
export default message;
