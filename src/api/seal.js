import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/seal/list',
    method: 'post',
    data: params,
  });
}
