import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  console.log("router data")
  console.log(store.getters)
  NProgress.start()
  // 有token 检验并直接跳转  否则  去登陆
  if (getToken()) {
    console.log(store)
    // console.log(store.getters.privileges)
    // console.log(router)
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      /**
       * 1.判断跳转页面是否需要权限
       *  1.1 需要权限 => 校验权限
       *  1.2 不需要权限 => 直接跳转
       */
      // if (to.meta && to.meta.privileges) { // 如果访问url无权限限制
      //   if (store.getters.privileges.length !== 0) {
      //     router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      //     next() // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //   }
      // }
      console.log('======check store.getters')
      console.log(store.getters)
      // TODO 有token的情况下 直接进入相关页面 实现GetInfo
      if (!store.getters.addRouters || store.getters.addRouters.length === 0) { //判断获取登陆
        store.dispatch('GetInfo',store.getters.id).then(res => { // 拉取用户信息
          console.log("log:=====/user/info => response:")
          console.log(res)
          const respData= res.data
          // const privileges = res.data.privileges // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes',  respData ).then(() => { // 根据roles权限生成可访问的路由表
            console.log(store)
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 无权限访问该菜单
        // 访问的菜单 是无权限的
        // TODO： 用户判断404 还是权限不够
        // if(!store.getters.addRouters.some(router => router.name === to.name) && store.getters.routerNames.some(name => name === to.name)){
        //     next('/403')
        // }else{
          next()
        // }

        // console.log('==-=-=--=-=-=-=-=-==-=')
        // console.log(store)
        // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        // // next() // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
