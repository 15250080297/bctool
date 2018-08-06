import request from '@/utils/request'
import config from '@/config'

//查询科目
export function getAccountList() {
  return request({
    url: config.ApiURL.voucher_getAccountList,
    method: 'post'
  })
}

//輔助核算
export function getAuxiliaryList(data) {
  return request({
    url: config.ApiURL.voucher_getAuxiliaryList,
    method: 'post',
    data: data
  })
}

//现金流数据
export function getCashFlow(){
  return request({
    url: config.ApiURL.voucher_getCashFlow,
    method: 'post'
  })
}

// 查询凭证列表
export function getVoucherList(data){
  return request({
    url: config.ApiURL.voucher_getVoucherList,
    method: 'post',
    data: data
  })
}

//查询凭证详情
export function getVoucherDetail(data) {
  return request({
    url: config.ApiURL.voucher_getVoucherDetail,
    method: 'post',
    data: data
  })
}

//新增凭证
export function addVoucher(data){
  console.log('data of addVoucher: data=')
  console.log(data)
  return request({
    url: config.ApiURL.voucher_addVoucher,
    method: 'post',
    data: data
  })
}

//保存凭证前
export function beforeAddVoucher(){
  return request({
    url: config.ApiURL.voucher_beforeAddVoucher,
    method: 'post'
  })
}

export function updatevoucher(data) {
  return request({
    url: config.ApiURL.voucher_updatevoucher,
    method: 'post',
    data: data
  })
}

export function beforeCashFlow(data){
  return request({
    url: config.ApiURL.voucher_beforeCashFlow,
    method: 'post',
    data: data
  })
}
