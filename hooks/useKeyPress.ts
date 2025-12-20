/**
 * useKeyPress Hook
 * 监听特定键盘按键
 */
import { useEffect, useCallback } from 'react';

type KeyPressOptions = {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    preventDefault?: boolean;
};

/**
 * 监听单个按键
 * @param targetKey 目标按键 (如 'Escape', 'Enter', 'k')
 * @param handler 按下时的回调
 * @param options 修饰键选项
 */
export function useKeyPress(
    targetKey: string,
    handler: () => void,
    options: KeyPressOptions = {}
): void {
    const { ctrl, shift, alt, meta, preventDefault = true } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // 检查修饰键
            if (ctrl !== undefined && event.ctrlKey !== ctrl) return;
            if (shift !== undefined && event.shiftKey !== shift) return;
            if (alt !== undefined && event.altKey !== alt) return;
            if (meta !== undefined && event.metaKey !== meta) return;

            // 检查目标按键
            if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                if (preventDefault) event.preventDefault();
                handler();
            }
        },
        [targetKey, handler, ctrl, shift, alt, meta, preventDefault]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * 监听 Escape 键 (常用快捷方式)
 */
export function useEscapeKey(handler: () => void): void {
    useKeyPress('Escape', handler);
}

/**
 * 监听 Enter 键
 */
export function useEnterKey(handler: () => void): void {
    useKeyPress('Enter', handler);
}
