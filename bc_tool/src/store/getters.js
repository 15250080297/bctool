const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  /**
   *====>>>>>tagsView(记忆导航栏)<<<<<=========
   */
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  /**
   *====>>>>>User(用户信息)<<<<<=========
   */
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menuList: state => state.user.menuList,
  real_name: state => state.user.real_name,
  company_id: state => state.user.company_id,
  privileges: state => state.user.privileges,
  uid: state => state.user.uid,
  /**
   * ====>>>>>Auth(权限信息)<<<<<=========
   */
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  buttons: state => state.permission.buttons,
  routerNames: state => state.permission.routerNames,

  /**
   * ====>>>>>Voucher(凭证信息)<<<<<=========
   */
  showAdd : state => state.voucher.showAdd,
  showEdit : state => state.voucher.showEdit
}
export default getters
