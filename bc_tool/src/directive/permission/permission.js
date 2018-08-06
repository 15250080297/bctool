
import store from '@/store'

/**
 * 按钮权限控制组件
 */
export default{
  inserted(el, binding, vnode) {

    const thisPerm = el.getAttribute('permission')
    let permissionRoles;

    if(thisPerm){
      permissionRoles = thisPerm.split(',')
    }

    const buttons = store.getters && store.getters.buttons
    if (permissionRoles && permissionRoles instanceof Array && permissionRoles.length > 0) {
      const hasPermission = buttons.some(btn => {
        return permissionRoles.includes(btn)
      })
      // TODO: TO DELETE
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! like permission='query'`)
    }
  }
}
