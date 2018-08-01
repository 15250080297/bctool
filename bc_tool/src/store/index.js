import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import getters from './getters'
import demo from './modules/demo'
import user from './modules/user'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app: app,
    user,
    demo,
  },
  getters
})

export default store
