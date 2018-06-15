/**
 * 返回状态码
 *
 */
export default {
  /**  @constant {string}  未知错误 */
  E100_UNKNOW_USER_EXCEPTION: 'E100',
  /** @constant {string} -  未登录 */
  E101_NOT_LOGIN: 'E101',
  /** @constant {string} -  无效的用户名或密码  */
  E102_INVALID_USRENAME_PASSWORD: 'E102',
  /** @constant {string} -  当前账户被锁定 */
  E103_ACCOUNT_IS_LOCK: 'E103',
  /** @constant {string} -  无效的Token */
  E104_INVALID_TOKEN: 'E104',
  /** @constant {string} -  当前账户无对应权限  */
  E105_NO_PERMISSION: 'E105',
  /** @constant {string} -  重复登陆 */
  E106_REPEAT_LOGIN: 'E106',
  /** @constant {string} -  当前账户被强制下线 */
  E107_FORCED_OFF: 'E107',
  /** @constant {string} -  用户本次请求过期 */
  E108_REQUEST_EXPIRED: 'E108',
  /** @constant {string} -  协议不合法（要求必须为https协议的地方，使用了http协议） */
  E109_INVALID_PROTOCOL: 'E109',

  S200_SUCCESS: 'S200',
  /** @constant {string} - 该操做为异步调用，并启动成功  */
  S201_ASYN_SUCCESS: 'S201',
  /** @constant {string} -  当前操作正在执行中 */
  S202_TASK_EXECUTING: 'S202',
  /** @constant {string}  批量操作数据部分成功，无需用户解决异常数据  */
  S203_BATCH_DATA_SUCCESS: 'S203',

  /** @constant {string}  未知的业务异常  */
  S300_UNKNOW_BUSINESS_EXCEPTION: 'E300',
  /** @constant {string}  请求参数类型非法或缺少参数  */
  S301_INVALID_PARAMETER_EXCEPTION: 'E301',
  /** @constant {string}  批量操作数据部分成功，无需用户解决异常数据  */
  S302_INVALID_RESOURCE_EXCEPTION: 'E302',
  /** @constant {string}  访问频率超限  */
  S303_FREQUENCY_TO_HIGH: 'E303',
  /** @constant {string}  没权限  */
  ERR301_ILLEGAL_ENTRY: 'ERR301',
  /**  DB link */
  E307_DB_LINK: 'E307',

  /** @constant {string} -  服务器异常 */
  E500_SERVER_ERROR: 'E500'
}
