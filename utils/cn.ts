/**
 * cn (className) - 类名合并工具
 *
 * 使用 clsx + tailwind-merge 实现：
 * - clsx: 条件性合并类名
 * - tailwind-merge: 解决 Tailwind 类冲突 (如 p-4 和 p-2)
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并多个类名，支持条件判断，自动解决 Tailwind 冲突
 * @example
 * cn('btn', isActive && 'btn-active', { 'btn-disabled': isDisabled })
 * cn('p-4', 'p-2') // => 'p-2' (tailwind-merge 解决冲突)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
