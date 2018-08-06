import request from '@/utils/request'
import config from '@/config'

export function findCategoryList() {
  return request({
    url: config.ApiURL.database_allcategory,
    method: 'post',
    data: null
  })
}
export function getProduct(data) {
  return request({
    url: config.ApiURL.database_getproduct,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function searchPro(data) {
  return request({
    url: config.ApiURL.database_findproduct,
    method: 'post',
    data: JSON.parse(data)
  })
}




