/**
 * @return {string}
 */
// module.exports.Domain = function() {
//   if (process.env.NODE_ENV === 'development') {
//     return 'http://localhost:8008/sc-api'
//   } else {
//     return 'https://api.xluomao.com/supply-chain/api'
//   }
// }

module.exports.ApiURL = {
  auth_login: '/auth/login',
  getInfo: 'GET_LOGIN_AUTHINFO',
  LUCENE_RENEW: '/lucene/renew',
  BUSINESS_BALANCE_LIST:'/bussiness/list',
  BUSINESS_BALANCE_DEDUCT:'/bussiness/deduct',
  BUSINESS_BALANCE_DEDUCTLIST:'/bussiness/deductlist',
  BUSINESS_BALANCE_DEDUCTCANCEL:'/bussiness/deductcancel',
  BUSINESS_BALANCE_DRAW:'/bussiness/draw',
  DUTY_LIST:'/duty/list',
  DUTY_ACTION:'/duty/action',
  COMMON_APPS:'/common/apps',
  RECONCILIATION_FILES:'RECONCILITION_FILES',
  RECONCILIATION_DELFILE:'RECONCILITION_DELFILE',
  RECONCILIATION_GENERATE:'RECONCILITION_GENERATE',
  SPAY_LIST:'/spay/list',
  SPAY_RESET:'/spay/reset',
  COINS_USER_LIST:'/coins/user/list',
  COINS_USER_SERVICEINFO:'/coins/user/serviceinfo',
  COINS_USER_BALANCES:'/coins/user/balances',
  COINS_SUBUSER_LIST:'/coins/subuser/list',
  COINS_SUBUSER_ACCOUNTS:'/coins/subuser/accounts',
  COINS_CHARGEBILL_LIST:'/coins/bill/chargelist',
  COINS_TRANSFERBILL_LIST:'/coins/bill/transferlist',


}
module.exports.routerMap = {


}
module.exports.Messages = {
  createSuccess: '添加成功',
  editSuccess: '修改成功',
  changeSuccess: '切换成功',
  delSuccess: '删除成功',
  operateSuccess: '操作成功',
  saveSuccess: '保存成功',
  deleteConfirm: '您确定删除?',

}

module.exports.ActionEnum ={
  RECONCILIATION_PAY:'批量支付对账',
  WEBHOOK_REPAIRE:'批量Webhook补发'
}
