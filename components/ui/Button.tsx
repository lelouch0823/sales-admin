import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

/**
 * Button 变体类型
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
}

/**
 * 变体样式映射
 */
const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
    danger: 'bg-danger text-white hover:bg-red-600',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    link: 'text-primary hover:text-primary-hover underline-offset-4 hover:underline p-0 h-auto',
};

/**
 * 尺寸样式映射
 */
const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
};

/**
 * 统一按钮组件
 * 
 * @example
 * <Button variant="primary">保存</Button>
 * <Button variant="secondary" size="sm">取消</Button>
 * <Button variant="danger" loading>删除中...</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            loading = false,
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                className={cn(
                    // 基础样式
                    'inline-flex items-center justify-center font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    // 变体样式
                    variantStyles[variant],
                    // 尺寸样式 (link 变体忽略)
                    variant !== 'link' && sizeStyles[size],
                    // 全宽
                    fullWidth && 'w-full',
                    // 自定义样式
                    className
                )}
                disabled={isDisabled}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
