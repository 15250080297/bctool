import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
//import Layout from '../views/layout/Layout'
import Login from '../views/login/index'



// TODO: meta加入权限控制
export const constantRouterMap = [
    { path: '/login', component: () => import('@/views/login/index'), hidden: true },
   /* {
      path: '/',
      component: Layout,
      redirect: '/main/menu1',
      name: 'homepage',
      hidden: true
    },*/
  {
    path:'*',
    component:Login,
    name: 'login',
    hidden : true
  }

  ]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


export const routerParams = [
  /*{name: 'plugins'},
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
  {name: 'salesInvoice',component:() => import('@/views/salesInvoice/SalesInvoice')}*/
]
