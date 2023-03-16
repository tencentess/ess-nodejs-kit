/**
 * 模板合同状态
 * INIT - 初始化
 * ONLINE - 使用中
 * OFFLINE - 已下线
 * DELETED - 已删除
 * ONLINE_NO_PERMISSION - 使用中但无权限
 */
export const TEMPLATE_STATUS = {
  INIT: 'INIT',
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  DELETED: 'DELETED',
  ONLINE_NO_PERMISSION: 'ONLINE_NO_PERMISSION',
};

/**
 * 合同创建	INIT
 * 合同签署中	PART
 * 合同签署完成	ALL
 * 合同拒签	REJECT
 * 合同撤回	CANCEL
 * 合同即将过期	WILLEXPIRE
 * 合同流签(合同过期)	DEADLINE
 * 合同异常	EXCEPTION
 */

export const FLOW_STATUS = {
  INIT: 'INIT',
  PART: 'PART',
  ALL: 'ALL',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  WILLEXPIRE: 'WILLEXPIRE',
  DEADLINE: 'DEADLINE',
  EXCEPTION: 'EXCEPTION',
};

export const FLOW_STATUS_TEXT = {
  INIT: '创建',
  PART: '签署中',
  ALL: '签署完成',
  REJECT: '拒签',
  CANCEL: '撤回',
  WILLEXPIRE: '即将过期',
  DEADLINE: '流签',
  EXCEPTION: '异常',
};

/**
 * 待签署	PENDING
 * 已签署	ACCEPT
 * 拒绝	REJECT
 * 过期没人处理	DEADLINE
 * 流程已撤回	CANCEL
 * 流程已终止	STOP
 * 待领取	WAITPICKUP
 * 待填写	FILLPENDING
 * 填写完成	FILLACCEPT
 * 拒绝填写	FILLREJECT
 * 异常	EXCEPTION
 */

export const APPROVER_STATUS_TEXT = {
  PENDING: '待签署',
  ACCEPT: '已签署',
  REJECT: '拒绝',
  DEADLINE: '过期没人处理',
  CANCEL: '流程已撤回',
  STOP: '流程已终止',
  WAITPICKUP: '待领取',
  FILLPENDING: '待填写',
  FILLACCEPT: '填写完成',
  FILLREJECT: '拒绝填写',
  EXCEPTION: '异常',
};
