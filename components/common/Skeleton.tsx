import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

/**
 * 骨架屏组件 (Skeleton)
 * 用于内容加载时的占位显示
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    lines = 1,
}) => {
    const baseClass = 'animate-pulse bg-gray-200';

    const variantClass = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    }[variant];

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    // 多行文本骨架
    if (variant === 'text' && lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClass} ${variantClass} h-4 ${className}`}
                        style={{
                            ...style,
                            width: i === lines - 1 ? '60%' : '100%' // 最后一行短一点
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClass} ${variantClass} ${className}`}
            style={style}
        />
    );
};

/**
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`p-6 bg-white rounded-xl border border-gray-100 ${className}`}>
        <div className="flex items-center gap-4 mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
                <Skeleton variant="text" height={16} className="w-1/3 mb-2" />
                <Skeleton variant="text" height={12} className="w-1/2" />
            </div>
        </div>
        <Skeleton variant="text" lines={3} />
    </div>
);

/**
 * 表格行骨架屏
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
    <tr>
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="py-4 px-6">
                <Skeleton variant="text" height={16} />
            </td>
        ))}
    </tr>
);
