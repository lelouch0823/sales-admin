import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;
}

const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
};

/**
 * 加载指示器 (Spinner)
 */
export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    className = '',
    label,
}) => {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <Loader2
                size={sizeMap[size]}
                className="animate-spin text-gray-400"
            />
            {label && (
                <span className="text-sm text-gray-500">{label}</span>
            )}
        </div>
    );
};

/**
 * 全屏加载状态
 */
export const FullPageSpinner: React.FC<{ label?: string }> = ({ label = '加载中...' }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <span className="text-sm text-gray-500">{label}</span>
        </div>
    </div>
);

/**
 * 内联加载状态 (用于按钮等)
 */
export const ButtonSpinner: React.FC = () => (
    <Loader2 size={16} className="animate-spin" />
);
