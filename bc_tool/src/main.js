import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from './lang' // Internationalization
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control


import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css";


// const globalConfig = requirexx('./config')
// Vue.use(ElementUI, { locale })

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

Vue.use({
  install(Vue, options){


    Vue.prototype.$clone = function (src) {
      let target = JSON.parse(JSON.stringify(src));
      return target;
    }
    Vue.prototype.$notNumber = function (val) {
      // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
      if(val === "" || val ==null){
        return true;
      }
      if(!isNaN(val)){
        return false;
      }else{
        return true;
      }
    }
    Vue.prototype.$isRealNum = function(val){
      // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
      if(val === "" || val ==null){
        return false;
      }
      if(!isNaN(val)){
        return true;
      }else{
        return false;
      }
    }

  }

});

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
