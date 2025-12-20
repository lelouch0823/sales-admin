/**
 * cn 工具函数测试
 */
import { describe, it, expect } from 'vitest';
import { cn } from '../../utils/cn';

describe('cn', () => {
    it('应该合并多个字符串类名', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('应该过滤 falsy 值', () => {
        expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
    });

    it('应该处理条件类名', () => {
        const isActive = true;
        const isDisabled = false;
        expect(cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe('btn btn-active');
    });

    it('应该处理对象形式的条件类名', () => {
        expect(cn('btn', { 'btn-active': true, 'btn-disabled': false })).toBe('btn btn-active');
    });

    it('应该处理嵌套数组', () => {
        expect(cn('a', ['b', 'c'])).toBe('a b c');
    });

    it('应该返回空字符串当无有效类名时', () => {
        expect(cn(false, null, undefined)).toBe('');
    });

    it('应该处理数字', () => {
        expect(cn('foo', 123)).toBe('foo 123');
    });
});
