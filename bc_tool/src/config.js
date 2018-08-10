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
  DUTY_LIST:'/duty/list',
  DUTY_ACTION:'/duty/action',
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
  RECONCILIATION_PAY:'批量支付对账'
}
