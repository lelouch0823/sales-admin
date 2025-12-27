/**
 * 格式化工具函数
 */

/**
 * 格式化金额
 * @param amount 金额数字
 * @param currency 货币符号，默认 ¥
 * @param decimals 小数位数，默认 2
 */
export function formatCurrency(
  amount: number,
  currency: string = '¥',
  decimals: number = 2
): string {
  const formatted = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${currency}${formatted}`;
}

/**
 * 格式化数字 (千分位分隔)
 */
export function formatNumber(num: number, decimals?: number): string {
  const options: Intl.NumberFormatOptions = {};
  if (decimals !== undefined) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  }
  return num.toLocaleString('zh-CN', options);
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 截断文本
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}
