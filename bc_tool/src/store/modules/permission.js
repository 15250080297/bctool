import { routerParams, constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
/**
 * 通过meta.privileges 判断是否与当前用户权限匹配
 * @param privileges
 * @param route
 */
function hasPermission(privileges, route) {
  if (route.name) {
    return privileges.filter(privilege => privilege.tail === false).some(privilege => route.name.indexOf(privilege.router) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param privileges
 */
function filterAsyncRouter(asyncRouterMap, privileges) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(privileges, route)) {
      // 子菜单过滤
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, privileges)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 递归：构建menu树对象
 * @param menuList
 */
function generateLeftMenuRoutes(menuList){
  console.info("generateLeftMenuRoutes")
  for (let i = 0; i < menuList.length; i++) {
    let menu = menuList[i]
    menu.component=Layout
    menu.redirect='/plugins/demolist'
    let params = routerParams.filter(router => router.name === menu.name)
    if(params && params.length > 0){
      for(let p in params[0]){
        menu[p]=params[0][p]
      }
    }
    if(menu.children && menu.children.length >0){
      for (let j = 0; j < menu.children.length; j++) {

        let menuc = menu.children[j]

        let params = routerParams.filter(router => router.name === menuc.name)
        if(params && params.length > 0){
          for(let p in params[0]){
            menuc[p]=params[0][p]
          }
        }

        menuList[i].children[j].path = menuList[i].children[j].path.replace("/","")

      }
    }
  }
  return menuList
}



function filterButtons(privileges){
  let buttons = []
  const privTails = privileges.filter(privilege => privilege.tail === true)
  if(!privTails){
    return buttons
  }
  for (let i = 0; i < privTails.length; i++) {
    buttons[i] = privTails[i].router
  }
  return buttons
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      console.log("====constantRouterMap:")
      console.log(constantRouterMap)
      console.log("====addRouters:"+routers)
      console.log(routers)
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_BUTTONS: (state, buttons) =>{
      state.buttons = buttons
    },
    SET_ROUTERNAMES: (state,routernames) =>{
      state.routerNames = routernames
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      console.info("GenerateRoutes  in:"+data);
      return new Promise(resolve => {
        const { privileges,menuList,routerNames } = data
        // const { menuList } = data.menuList
        let accessedRouters
        // TODO: TO DELETE
        // if (store.getters.name === 'admin') {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, privileges)
        // }
        // commit('SET_ROUTERS',accessedRouters)
        let route = generateLeftMenuRoutes(menuList)
        console.log('-----=========')
        console.log(route)
        commit('SET_ROUTERS', generateLeftMenuRoutes(menuList))
        commit('SET_BUTTONS', filterButtons(privileges))
        commit('SET_ROUTERNAMES', routerNames)
        resolve()
      })
    }
  }
}

export default permission
