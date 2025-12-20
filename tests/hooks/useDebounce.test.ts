/**
 * useDebounce Hook 单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('应该立即返回初始值', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        expect(result.current).toBe('initial');
    });

    it('应该在延迟后更新值', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        // 初始值
        expect(result.current).toBe('initial');

        // 更新值
        rerender({ value: 'updated', delay: 500 });

        // 在延迟时间内，值不应该改变
        expect(result.current).toBe('initial');

        // 快进定时器
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // 现在值应该更新了
        expect(result.current).toBe('updated');
    });

    it('应该在连续更新时重置定时器', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        // 第一次更新
        rerender({ value: 'first', delay: 500 });

        // 等待 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // 第二次更新（应该重置定时器）
        rerender({ value: 'second', delay: 500 });

        // 再等待 300ms（总共 600ms，但定时器被重置）
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // 值还是初始值，因为定时器被重置了
        expect(result.current).toBe('initial');

        // 再等待 200ms（现在总共 500ms 从第二次更新开始）
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // 现在应该是第二次更新的值
        expect(result.current).toBe('second');
    });

    it('应该支持自定义延迟时间', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 1000 } }
        );

        rerender({ value: 'updated', delay: 1000 });

        // 500ms 后值不应该改变
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current).toBe('initial');

        // 再过 500ms（总共 1000ms）值应该更新
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current).toBe('updated');
    });
});
