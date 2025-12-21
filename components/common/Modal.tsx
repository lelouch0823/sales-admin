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
 * - 使用 Flexbox 居中（Tailwind v4 最佳实践）
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  noPadding = false
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* 背景遮罩层 + 居中容器（合并为一个元素） */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          {/* 模态框主体 */}
          <DialogPrimitive.Content
            className={cn(
              'relative w-full max-h-[90vh] flex flex-col',
              'bg-white rounded-xl shadow-2xl',
              className
            )}
            onClick={(e) => e.stopPropagation()}
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
            <div className={cn('overflow-y-auto flex-1', !noPadding && 'p-6')}>
              {children}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};