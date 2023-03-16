import request from '@/utils/request';


// 上传文件并发起合同
export function signContractByFile(params) {
  return request({
    url: '/signContractByFile',
    method: 'post',
    data: params,
  });
}

export function createSchemaUrl(params) {
  return request({
    url: '/createSchemaUrl',
    method: 'post',
    data: params,
  });
}
