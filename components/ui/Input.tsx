import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Input 变体类型
 */
export type InputVariant = 'default' | 'filled' | 'error';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: InputVariant;
    inputSize?: InputSize;
    error?: string;
    label?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * 变体样式映射
 */
const variantStyles: Record<InputVariant, string> = {
    default: 'border-gray-200 focus:border-primary',
    filled: 'border-gray-200 bg-gray-50 focus:bg-white focus:border-primary',
    error: 'border-danger focus:border-danger focus:ring-danger/20',
};

/**
 * 尺寸样式映射
 */
const sizeStyles: Record<InputSize, string> = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md',
    md: 'px-3 py-2 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-lg',
};

/**
 * 统一输入框组件
 * 
 * @example
 * <Input label="邮箱" placeholder="请输入邮箱" />
 * <Input variant="error" error="邮箱格式错误" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            variant = 'default',
            inputSize = 'md',
            error,
            label,
            helperText,
            fullWidth = true,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.replace(/\s/g, '-').toLowerCase();
        const hasError = !!error;

        return (
            <div className={cn('space-y-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-bold text-gray-500 uppercase"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        // 基础样式
                        'border outline-none transition-colors',
                        'focus:ring-2 focus:ring-primary/20',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
                        'placeholder:text-gray-400',
                        // 变体样式
                        hasError ? variantStyles.error : variantStyles[variant],
                        // 尺寸样式
                        sizeStyles[inputSize],
                        // 宽度
                        fullWidth && 'w-full',
                        // 自定义样式
                        className
                    )}
                    disabled={disabled}
                    {...props}
                />
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

Input.displayName = 'Input';
