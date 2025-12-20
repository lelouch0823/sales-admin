/**
 * format 工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
    formatCurrency,
    formatNumber,
    formatPercent,
    formatFileSize,
    truncate
} from '../../utils/format';

describe('formatCurrency', () => {
    it('应该格式化金额为人民币', () => {
        expect(formatCurrency(1234.56)).toBe('¥1,234.56');
    });

    it('应该支持自定义货币符号', () => {
        expect(formatCurrency(100, '$')).toBe('$100.00');
    });

    it('应该支持自定义小数位', () => {
        expect(formatCurrency(99.9, '¥', 0)).toBe('¥100');
    });
});

describe('formatNumber', () => {
    it('应该添加千分位分隔符', () => {
        expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('应该支持指定小数位', () => {
        expect(formatNumber(1234.5, 2)).toBe('1,234.50');
    });
});

describe('formatPercent', () => {
    it('应该格式化为百分比', () => {
        expect(formatPercent(0.1234)).toBe('12.3%');
    });

    it('应该支持自定义小数位', () => {
        expect(formatPercent(0.12345, 2)).toBe('12.35%');
    });
});

describe('formatFileSize', () => {
    it('应该格式化字节大小', () => {
        expect(formatFileSize(0)).toBe('0 B');
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1048576)).toBe('1 MB');
        expect(formatFileSize(1073741824)).toBe('1 GB');
    });
});

describe('truncate', () => {
    it('应该截断长文本', () => {
        expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('不应该截断短文本', () => {
        expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('应该支持自定义后缀', () => {
        expect(truncate('Hello World', 8, '…')).toBe('Hello W…');
    });
});
