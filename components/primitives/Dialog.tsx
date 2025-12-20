import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Dialog 组件抽象层
 * 
 * 设计目标:
 * 1. 封装 Radix UI Dialog 的实现细节
 * 2. 提供简洁的 API
 * 3. 方便未来切换到 HeadlessUI 或其他库
 */

interface DialogProps {
    /** 是否打开 */
    open: boolean;
    /** 关闭回调 */
    onOpenChange: (open: boolean) => void;
    /** 对话框内容 */
    children: React.ReactNode;
}

interface DialogContentProps {
    /** 标题 */
    title?: string;
    /** 描述 */
    description?: string;
    /** 内容 */
    children: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 是否显示关闭按钮 */
    showCloseButton?: boolean;
    /** 最大宽度 */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
};

/**
 * Dialog 根组件
 */
export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </DialogPrimitive.Root>
    );
};

/**
 * Dialog 触发器
 */
export const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Dialog 内容
 */
export const DialogContent: React.FC<DialogContentProps> = ({
    title,
    description,
    children,
    className,
    showCloseButton = true,
    maxWidth = 'md',
}) => {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
                    'w-full p-6 bg-white rounded-xl shadow-2xl',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out',
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
                    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
                    'duration-200',
                    maxWidthMap[maxWidth],
                    className
                )}
            >
                {title && (
                    <DialogPrimitive.Title className="text-lg font-bold text-primary mb-2">
                        {title}
                    </DialogPrimitive.Title>
                )}
                {description && (
                    <DialogPrimitive.Description className="text-sm text-muted mb-4">
                        {description}
                    </DialogPrimitive.Description>
                )}
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <X size={18} />
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
};

/**
 * Dialog 页脚
 */
export const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    return (
        <div className={cn('flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100', className)}>
            {children}
        </div>
    );
};

/**
 * Dialog 关闭按钮 (用于自定义关闭按钮)
 */
export const DialogClose = DialogPrimitive.Close;
