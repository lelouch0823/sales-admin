import React from 'react';
import { X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * 通用模态框组件 (Modal)
 * 
 * 使用封装:
 * - Radix UI Dialog 作为底层实现
 * - 保持与原有 API 兼容
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = 'max-w-md',
  noPadding = false
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* 背景遮罩层 */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* 模态框主体 */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2',
            'bg-surface rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
            className
          )}
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
            <DialogPrimitive.Title className="font-bold text-lg text-primary">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors">
              <X size={20} />
            </DialogPrimitive.Close>
          </div>

          {/* 内容区域 */}
          <div className={`overflow-y-auto ${noPadding ? '' : 'p-6'}`}>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};