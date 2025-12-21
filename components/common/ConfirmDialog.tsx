import { useState } from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/primitives';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

export interface ConfirmDialogProps {
  /** 对话框是否打开 */
  open: boolean;
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void;
  /** 标题 */
  title: string;
  /** 描述文案 */
  description?: string;
  /** 变体类型 */
  variant?: 'danger' | 'warning' | 'info';
  /** 确认按钮文案 */
  confirmText?: string;
  /** 取消按钮文案 */
  cancelText?: string;
  /** 确认回调 (支持异步) */
  onConfirm: () => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
}

const variantConfig = {
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
    buttonVariant: 'primary' as const,
  },
};

/**
 * 确认对话框组件
 * 封装常见的确认场景（删除、提交等）
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'danger',
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // 错误由调用方处理
      console.error('ConfirmDialog onConfirm error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex gap-4">
          {/* 图标区域 */}
          <div
            className={cn(
              'shrink-0 w-10 h-10 flex items-center justify-center rounded-full',
              config.iconBg
            )}
          >
            <Icon size={20} className={config.iconColor} />
          </div>

          {/* 内容区域 */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="secondary" onClick={handleCancel}>
              {cancelText}
            </Button>
          </DialogClose>
          <Button variant={config.buttonVariant} onClick={handleConfirm} loading={isLoading}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
