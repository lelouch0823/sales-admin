/**
 * Hooks - 统一导出入口
 * 所有自定义 React Hooks 从此处导出
 */

export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export {
    useMediaQuery,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    usePrefersDarkMode,
    usePrefersReducedMotion
} from './useMediaQuery';
export { useClickOutside } from './useClickOutside';
export { useKeyPress, useEscapeKey, useEnterKey } from './useKeyPress';
