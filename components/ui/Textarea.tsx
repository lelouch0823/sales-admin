import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * 统一文本域组件
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
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
        const textareaId = id || label?.replace(/\s/g, '-').toLowerCase();
        const hasError = !!error;

        return (
            <div className={cn('space-y-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-xs font-bold text-gray-500 uppercase"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        // 基础样式
                        'border border-gray-200 outline-none transition-colors resize-none',
                        'focus:border-primary focus:ring-2 focus:ring-primary/20',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
                        'placeholder:text-gray-400',
                        'px-3 py-2 text-sm rounded-lg',
                        // 错误状态
                        hasError && 'border-danger focus:border-danger focus:ring-danger/20',
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

Textarea.displayName = 'Textarea';
