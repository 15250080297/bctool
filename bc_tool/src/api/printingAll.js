import request from '@/utils/request'
import config from '@/config'


export function purchaseWarehousingPrintingPDF(data) {
  return request({
    url: config.ApiURL.purchase_warehousing_printing,
    method: 'post',
    data: JSON.parse(data)
  })
}
