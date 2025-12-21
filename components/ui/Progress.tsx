import { cn } from '@/utils/cn';

export interface ProgressProps {
  /** 进度值 (0-100) */
  value: number;
  /** 最大值 (默认 100) */
  max?: number;
  /** 颜色变体 */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示动画 */
  animate?: boolean;
  /** 是否显示进度文字 */
  showLabel?: boolean;
  /** 自定义类名 */
  className?: string;
}

const variantClasses = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * 进度条组件
 */
export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  animate = false,
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">进度</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant],
            animate && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default Progress;
