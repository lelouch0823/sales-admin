/**
 * cn (className) - 类名合并工具
 * 类似 clsx/classnames，用于条件性合并 CSS 类名
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];
type ClassObject = Record<string, boolean | undefined | null>;

/**
 * 合并多个类名，支持条件判断
 * @example
 * cn('btn', isActive && 'btn-active', { 'btn-disabled': isDisabled })
 * // => 'btn btn-active' (if isActive=true, isDisabled=false)
 */
export function cn(...inputs: (ClassValue | ClassObject)[]): string {
    const classes: string[] = [];

    for (const input of inputs) {
        if (!input) continue;

        if (typeof input === 'string' || typeof input === 'number') {
            classes.push(String(input));
        } else if (Array.isArray(input)) {
            const nested = cn(...input);
            if (nested) classes.push(nested);
        } else if (typeof input === 'object') {
            for (const [key, value] of Object.entries(input)) {
                if (value) classes.push(key);
            }
        }
    }

    return classes.join(' ');
}
