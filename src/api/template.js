import request from '@/utils/request';

// 获取模版列表
export function getTemplateList(params) {
  return request({
    url: '/template/list',
    method: 'post',
    data: params,
  });
}
