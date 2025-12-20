import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn';

/**
 * Tooltip 组件抽象层
 * 
 * 设计目标:
 * 1. 封装 Radix UI Tooltip 的实现细节
 * 2. 提供简洁的 API
 * 3. 方便未来切换到其他 Tooltip 库
 */

interface TooltipProps {
    /** 触发元素 */
    children: React.ReactNode;
    /** 提示内容 */
    content: React.ReactNode;
    /** 位置 */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** 对齐方式 */
    align?: 'start' | 'center' | 'end';
    /** 偏移量 */
    sideOffset?: number;
    /** 延迟显示时间 (毫秒) */
    delayDuration?: number;
    /** 自定义类名 */
    className?: string;
}

/**
 * TooltipProvider - Tooltip 上下文提供者
 * 
 * 需要在应用根部包裹一次
 */
export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip - 简单提示组件
 * 
 * @example
 * <Tooltip content="这是提示内容">
 *   <Button>悬停查看</Button>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    side = 'top',
    align = 'center',
    sideOffset = 4,
    delayDuration = 200,
    className,
}) => {
    return (
        <TooltipPrimitive.Root delayDuration={delayDuration}>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    className={cn(
                        'z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md',
                        'animate-in fade-in-0 zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'data-[side=bottom]:slide-in-from-top-2',
                        'data-[side=left]:slide-in-from-right-2',
                        'data-[side=right]:slide-in-from-left-2',
                        'data-[side=top]:slide-in-from-bottom-2',
                        className
                    )}
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-gray-900" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
};

// 导出原始组件供高级用户使用
export {
    TooltipPrimitive as TooltipRoot,
};
