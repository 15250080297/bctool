import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
* group：表示权限组，由后台数据库-权限表 维护
**/
// 动态生成Router 测试
// function genRouter(){
//   let map= []
  //   map[0]={}
//   map[0].path = '/login'
//   map[0].component =  () => import('@/views/login/index')
//   map[0].hidden = true
//
  // map[1]={}
//   map[1].path= '/'
//   map[1].component = Layout
//   map[1].redirect = '/dashboard'
//   map[1].name = 'Dashboard'
//   map[1].hidden = true
//   map[1].children = []
  //   map[1].children[0] ={}
//   map[1].children[0].path='dashboard'
//   map[1].children[0].component=() => import('@/views/dashboard/index')
//   map[1].children[0].meta = { title: 'dashboard', icon: 'dashboard', privilege: 'public' }
//
  // map[2] = {}
//   map[2].path= '/example'
//   map[2].component = Layout
//   map[2].redirect = '/example/table'
//   map[2].name = 'Example'
//   map[2].hidden = true
//   map[2].meta = { title: 'Example', icon: 'example', privilege: 'public' }
//   map[2].children = []
// map[2].children[0]={}
//   map[2].children[0].path='table'
//   map[2].children[0].name='Table'
//   map[2].children[0].component=() => import('@/views/table/index')
//   map[2].children[0].meta = { title: 'Table', icon: 'table', privilege: 'public' }
// }

// TODO: meta加入权限控制
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
    { path: '/403', component: () => import('@/views/403'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/plugins/demolist',
    name: 'homepage',
    hidden: true
  },

]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


export const routerParams = [
  {name: 'plugins'},
  {name: 'unitMgr', component: () => import('@/views/baseInfo/unit/UnitMgr')},
  {name: 'purchase', component: () => import('@/views/purchase/PurchaseOrder')},
  {name: 'prRefund', component: () => import('@/views/prRefund/PrRefundOrder')},
  {name: 'requisition', component: () => import('@/views/requistion/RequistionOrder')},
  {name: 'voucher', redirect: '/voucher/main'},
  {name: 'vouchermain',  component: () => import('@/views/voucher/VoucherList')},
  {name: 'storagePurchase', component: () => import('@/views/storage/PurchaseInList')},
  {name: 'purchaseInvoice', component: () => import('@/views/invoice/Invoice')},
  {name: 'demolist', component: () => import('@/views/demo/DemoList')},
  {name: 'notfound', redirect: '/404'},
  {name: 'salesorder',  component: () => import('@/views/sales/SalesOrder')},
  {name: 'storageTransfer',  component: () => import('@/views/storage/storage-transfer/storage-transfer-list')},
  {name: 'warehouse',  component: () => import ('@/views/baseInfo/goods/warehouse')},
  {name: 'salesorder',  component: () => import('@/views/sales/SalesOrder')},
  {name: 'pcSettle',  component: () => import('@/views/settlement/Settlement')},
  {name: 'storeXTC',component:() => import('@/views/conversion/ConversionList')},
  {name: 'salesInvoice',component:() => import('@/views/salesInvoice/SalesInvoice')}
]
