import moment from 'moment';
const DISPLAY_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * @param {number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {boolean}
 */
const isMillisecond = timeStamp => String(timeStamp).length > 10;

/**
 * 格式化时间为 'YYYY-MM-DD HH:mm:ss' 格式
 * @param timeStamp 秒 或 毫秒，为 0 时将返回 ‘-’
 * @param options 配置
 * @param options.format 显示格式
 * @param options.placeholder 为空时显示字符
 * @param options.now 是否用当前时间
 */
const formatTime = (timeStamp, { format = DISPLAY_TIME_FORMAT, placeholder = '-', now = false } = {}) => {
  // 未给时间时，显示 ‘-’
  if ((!timeStamp || String(timeStamp) === '0') && now === false) {
    return placeholder;
  }

  let millisecond = timeStamp;
  if (!millisecond && now) {
    millisecond = moment().valueOf();
  }

  if (!isMillisecond(millisecond)) {
    millisecond *= 1000;
  }

  return moment(millisecond).format(format);
};

export { isMillisecond, formatTime, DISPLAY_TIME_FORMAT };
