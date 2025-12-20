/**
 * useClickOutside Hook
 * 检测点击元素外部，常用于关闭 Modal/Dropdown
 */
import { useEffect, useRef, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
    handler: () => void,
    enabled: boolean = true
): RefObject<T | null> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        // 使用 mousedown 而非 click，响应更快
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [handler, enabled]);

    return ref;
}
