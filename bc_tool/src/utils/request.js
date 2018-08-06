import axios from 'axios'
import {Message, MessageBox, Loading} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000000, // 请求超时时间
  Accept:'application/json',
  ContentType: 'application/json'

})
let loadingInstance;
// request拦截器
service.interceptors.request.use(config => {

  loadingInstance = Loading.service({fullscreen: true});

  if (getToken()) {
    console.info("getToken ok  >>"+ getToken())

    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  let data = config.data;
  let key = Object.keys(data);
  // 重写data，由{"name":"name","password":"password"} 改为 name=name&password=password
  config.data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&')) // 设置Content-Type
  config.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }

  return config
}, error => {

  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if(loadingInstance){
      loadingInstance.close();
    }

    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 1101:非法的token;
      if (res.code === 1101) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }

      //1005:授权错误 重新登陆
      if (res.code === 1005) {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      }
      return response.data
    } else {
      return response.data
    }
  },
  error => {
    if(loadingInstance){
      loadingInstance.close();
    }
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
