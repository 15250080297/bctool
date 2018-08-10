import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import demo from './modules/demo'
import requistion from './modules/requistion'
import purchase from './modules/purchase'
import invoice from './modules/invoice'
import voucher from './modules/voucher'
import sales from './modules/sales'
import storage from './modules/storage'
import storageTransfer from './modules/storage-transfer'
import settlement from './modules/settlement'
import conversion from './modules/conversion'
import duty from './modules/duty'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app: app,
    user,
    tagsView,
    permission,
    demo,
    requistion,
    purchase,
    invoice,
    sales,
    voucher,
    storage,
    storageTransfer,
    settlement,
    conversion,
    duty
  },
  getters
})

export default store
