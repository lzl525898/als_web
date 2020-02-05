// 成功状态码
global.SUCCESS_CODE = 1
/* 执行失败错误码*/
global.ERROR_CODE = 0;

/* */
global.ERROR_CODE_ = -1;

/* 参数错误码 */
// 参数无效
global.PAEAM_IS_INVALID = 1001;
// 参数为空
global.PAEAM_IS_BLANK = 1002;
// 参数类型错误
global.PAEAM_TYPE_BIND_ERROR = 1003;
// 参数缺失
global.PAEAM_NOT_COMPLETE = 1004;
/* 用户错误 */
// 用户未登录，访问路径需要验证
global.USER_NOT_LOGGED_IN = 2001;
// 账号不存在或密码错误
global.USER_LOGIN_ERROR = 2002;
// 账号已被禁用
global.USER_ACCOUNT_FORBIDDEN = 2003;
// 用户不存在
global.USER_NOT_EXIST = 2004;
// 用户已存在
global.USER_HAS_EXISTED = 2005;
// 用户过期,需要重新登录
global.LOGIN_TIME_OUT = 2006;
// 用户过期，需要续费
global.USER_NOT_OVERDUE = 3001;
