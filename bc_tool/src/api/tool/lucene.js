import request from '@/utils/request'
import config from '@/config'

export function renew(keyspace, table,objectid) {

  var obj={
    keyspace:keyspace,
    table:table,
    objectid:objectid
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.LUCENE_RENEW,
      param: JSON.stringify(obj),
    }
  })
}
