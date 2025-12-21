import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface AlertProps {
  /** 警告类型 */
  variant?: 'success' | 'warning' | 'error' | 'info';
  /** 标题 */
  title?: string;
  /** 内容 */
  children: React.ReactNode;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 操作按钮 */
  action?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-500',
    titleClass: 'text-green-800',
    textClass: 'text-green-700',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-50 border-amber-200',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-800',
    textClass: 'text-amber-700',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-500',
    titleClass: 'text-red-800',
    textClass: 'text-red-700',
  },
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-800',
    textClass: 'text-blue-700',
  },
};

/**
 * 警告横幅组件
 */
export function Alert({
  variant = 'info',
  title,
  children,
  closable = false,
  onClose,
  action,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn('flex gap-3 p-4 rounded-lg border', config.containerClass, className)}
      role="alert"
    >
      {/* 图标 */}
      <div className="shrink-0">
        <Icon size={20} className={config.iconClass} />
      </div>

      {/* 内容区 */}
      <div className="flex-1 min-w-0">
        {title && <h4 className={cn('text-sm font-semibold', config.titleClass)}>{title}</h4>}
        <div className={cn('text-sm', config.textClass, title && 'mt-1')}>{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>

      {/* 关闭按钮 */}
      {closable && (
        <button
          onClick={onClose}
          className={cn(
            'shrink-0 p-1 rounded hover:bg-black/5 transition-colors',
            config.textClass
          )}
          aria-label="关闭"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;
