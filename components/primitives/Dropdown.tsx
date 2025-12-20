import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Dropdown 组件抽象层
 * 
 * 设计目标:
 * 1. 封装 Radix UI DropdownMenu 的实现细节
 * 2. 提供简洁的 API
 * 3. 方便未来切换到 HeadlessUI 或其他库
 */

// --- 根组件 ---

export const Dropdown = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownGroup = DropdownMenuPrimitive.Group;
export const DropdownSub = DropdownMenuPrimitive.Sub;
export const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

// --- 内容组件 ---

interface DropdownContentProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
    className?: string;
    sideOffset?: number;
}

export const DropdownContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    DropdownContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-50 min-w-[180px] overflow-hidden rounded-lg bg-white p-1.5 shadow-lg border border-gray-200',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2',
                'data-[side=left]:slide-in-from-right-2',
                'data-[side=right]:slide-in-from-left-2',
                'data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = 'DropdownContent';

// --- 菜单项组件 ---

interface DropdownItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
    className?: string;
    inset?: boolean;
}

export const DropdownItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    DropdownItemProps
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-2 text-sm outline-none',
            'text-gray-700 hover:bg-gray-50 focus:bg-gray-100',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'transition-colors',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
DropdownItem.displayName = 'DropdownItem';

// --- 分割线 ---

export const DropdownSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn('h-px my-1 bg-gray-100', className)}
        {...props}
    />
));
DropdownSeparator.displayName = 'DropdownSeparator';

// --- 标签 ---

interface DropdownLabelProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
    inset?: boolean;
}

export const DropdownLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    DropdownLabelProps
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            'px-2.5 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
DropdownLabel.displayName = 'DropdownLabel';

// --- 复选框菜单项 ---

export const DropdownCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2.5 text-sm outline-none',
            'text-gray-700 hover:bg-gray-50 focus:bg-gray-100',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'transition-colors',
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check size={14} className="text-primary" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = 'DropdownCheckboxItem';

// --- 单选菜单项 ---

export const DropdownRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2.5 text-sm outline-none',
            'text-gray-700 hover:bg-gray-50 focus:bg-gray-100',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'transition-colors',
            className
        )}
        {...props}
    >
        <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle size={8} className="fill-primary text-primary" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownRadioItem.displayName = 'DropdownRadioItem';

// --- 子菜单触发器 ---

export const DropdownSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            'flex cursor-pointer select-none items-center rounded-md px-2.5 py-2 text-sm outline-none',
            'text-gray-700 hover:bg-gray-50 focus:bg-gray-100',
            'data-[state=open]:bg-gray-100',
            inset && 'pl-8',
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight size={14} className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownSubTrigger.displayName = 'DropdownSubTrigger';

// --- 子菜单内容 ---

export const DropdownSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            'z-50 min-w-[180px] overflow-hidden rounded-lg bg-white p-1.5 shadow-lg border border-gray-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            className
        )}
        {...props}
    />
));
DropdownSubContent.displayName = 'DropdownSubContent';
