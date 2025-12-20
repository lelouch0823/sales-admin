import {
    format,
    formatDistance,
    formatRelative,
    parseISO,
    isValid,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    addDays,
    addWeeks,
    addMonths,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isToday,
    isYesterday,
    isTomorrow,
    isThisWeek,
    isThisMonth,
} from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

// 默认 locale
let currentLocale = zhCN;

/**
 * 设置日期格式化的语言
 */
export const setDateLocale = (locale: 'zh' | 'en') => {
    currentLocale = locale === 'zh' ? zhCN : enUS;
};

/**
 * 格式化日期
 * @param date - 日期字符串或 Date 对象
 * @param formatStr - 格式化模板，默认 'yyyy-MM-dd'
 */
export const formatDate = (date: string | Date, formatStr = 'yyyy-MM-dd'): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return format(d, formatStr, { locale: currentLocale });
};

/**
 * 格式化日期时间
 * @param date - 日期字符串或 Date 对象
 */
export const formatDateTime = (date: string | Date): string => {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * 格式化相对时间 (如 "3 天前")
 */
export const formatRelativeTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return formatDistance(d, new Date(), { addSuffix: true, locale: currentLocale });
};

/**
 * 格式化相对日期 (如 "上周三")
 */
export const formatRelativeDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return formatRelative(d, new Date(), { locale: currentLocale });
};

/**
 * 智能格式化日期
 * - 今天: "今天 14:30"
 * - 昨天: "昨天 14:30"
 * - 本周: "周三 14:30"
 * - 今年: "3月15日"
 * - 其他: "2023年3月15日"
 */
export const formatSmart = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';

    if (isToday(d)) {
        return `今天 ${format(d, 'HH:mm')}`;
    }
    if (isYesterday(d)) {
        return `昨天 ${format(d, 'HH:mm')}`;
    }
    if (isThisWeek(d)) {
        return format(d, 'EEEE HH:mm', { locale: currentLocale });
    }
    if (isThisMonth(d)) {
        return format(d, 'M月d日', { locale: currentLocale });
    }
    return format(d, 'yyyy年M月d日', { locale: currentLocale });
};

// 导出常用函数
export {
    parseISO,
    isValid,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    addDays,
    addWeeks,
    addMonths,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isToday,
    isYesterday,
    isTomorrow,
    isThisWeek,
    isThisMonth,
};
