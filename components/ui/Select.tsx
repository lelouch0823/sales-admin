import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    helperText?: string;
    fullWidth?: boolean;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    placeholder?: string;
}

/**
 * 统一下拉选择组件
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            className,
            error,
            label,
            helperText,
            fullWidth = true,
            disabled,
            id,
            options,
            placeholder,
            ...props
        },
        ref
    ) => {
        const selectId = id || label?.replace(/\s/g, '-').toLowerCase();
        const hasError = !!error;

        return (
            <div className={cn('space-y-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-xs font-bold text-gray-500 uppercase"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        // 基础样式
                        'border border-gray-200 outline-none transition-colors appearance-none',
                        'focus:border-primary focus:ring-2 focus:ring-primary/20',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
                        'px-3 py-2 text-sm rounded-lg',
                        'bg-white bg-no-repeat bg-right',
                        // 下拉箭头
                        'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")]',
                        'bg-[length:1.25rem] bg-[right_0.5rem_center] pr-8',
                        // 错误状态
                        hasError && 'border-danger focus:border-danger focus:ring-danger/20',
                        // 宽度
                        fullWidth && 'w-full',
                        // 自定义样式
                        className
                    )}
                    disabled={disabled}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {(error || helperText) && (
                    <p
                        className={cn(
                            'text-xs',
                            hasError ? 'text-danger' : 'text-gray-500'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
