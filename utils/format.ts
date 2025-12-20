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
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式模式: 'date' | 'datetime' | 'time' | 'relative'
 */
export function formatDate(
    date: Date | string,
    format: 'date' | 'datetime' | 'time' | 'relative' = 'date'
): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '无效日期';

    if (format === 'relative') {
        return formatRelativeTime(d);
    }

    const options: Intl.DateTimeFormatOptions = {};

    if (format === 'date' || format === 'datetime') {
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
    }

    if (format === 'time' || format === 'datetime') {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return d.toLocaleString('zh-CN', options);
}

/**
 * 格式化相对时间 (几分钟前, 几小时前等)
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 7) return `${diffDay}天前`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}周前`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)}个月前`;
    return `${Math.floor(diffDay / 365)}年前`;
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
