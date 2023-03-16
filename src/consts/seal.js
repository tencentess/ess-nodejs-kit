// 印章状态
/* CHECKING（审核中）SUCCESS（已启用）FAIL（审核拒绝）CHECKING-SADM（待超管审核）DISABLE（已停用）STOPPED（已终止）*/
export const SEAL_STATUS = [{
  value: 'SUCCESS',
  label: '已启用',
}, {
  value: 'CHECKING',
  label: '审核中',
}, {
  value: 'CHECKING-SADM',
  label: '待超管审核',
}, {
  value: 'FAIL',
  label: '审核拒绝',
}, {
  value: 'REJECTED',
  label: '已拒绝',
},
{
  value: 'DISABLE',
  label: '已停用',
}, {
  value: 'STOPPED',
  label: '已终止',
}];
