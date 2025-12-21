/**
 * 命令菜单封装层
 *
 * 抽象 cmdk 库，方便未来切换实现
 * 提供统一的命令菜单接口
 */

import React from 'react';
import { Command as CmdkCommand } from 'cmdk';

// ============ 类型定义 ============

/** 命令项 */
export interface CommandItem {
  id: string;
  label: string;
  keywords?: string[];
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
  disabled?: boolean;
}

/** 命令分组 */
export interface CommandGroup {
  id: string;
  heading: string;
  items: CommandItem[];
}

/** 命令菜单 Props */
export interface CommandMenuBaseProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 搜索值变化 */
  onSearchChange?: (value: string) => void;
  /** 命令分组 */
  groups: CommandGroup[];
  /** 搜索占位符 */
  placeholder?: string;
  /** 空状态文本 */
  emptyText?: string;
  /** 自定义类名 */
  className?: string;
}

// ============ 底层组件封装 ============

/**
 * 命令菜单根组件
 * 封装 cmdk 的 Command 组件
 */
export const CommandRoot = CmdkCommand;

/**
 * 命令输入框
 */
export const CommandInput = CmdkCommand.Input;

/**
 * 命令列表
 */
export const CommandList = CmdkCommand.List;

/**
 * 命令分组
 */
export const CommandGroup = CmdkCommand.Group;

/**
 * 命令项
 */
export const CommandItem = CmdkCommand.Item;

/**
 * 空状态
 */
export const CommandEmpty = CmdkCommand.Empty;

/**
 * 分隔符
 */
export const CommandSeparator = CmdkCommand.Separator;

// ============ 高级封装 ============

/**
 * 创建命令菜单 Hook
 * 管理命令菜单的打开/关闭状态
 */
export function useCommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const toggle = React.useCallback(() => setOpen(prev => !prev), []);
  const close = React.useCallback(() => {
    setOpen(false);
    setSearch('');
  }, []);
  const openMenu = React.useCallback(() => setOpen(true), []);

  return {
    open,
    search,
    setSearch,
    toggle,
    close,
    openMenu,
  };
}

/**
 * 命令菜单样式配置
 * 提供一致的样式类名
 */
export const commandMenuStyles = {
  overlay: 'fixed inset-0 bg-black/50 z-[600] animate-in fade-in duration-200',
  container: 'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[601]',
  root: 'bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200',
  inputWrapper: 'flex items-center gap-3 px-4 py-3 border-b border-gray-100',
  input: 'flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400',
  list: 'max-h-80 overflow-y-auto p-2',
  empty: 'py-8 text-center text-sm text-gray-400',
  group:
    'mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500',
  item: 'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary',
  footer: 'px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400',
  kbd: 'px-1.5 py-0.5 bg-gray-100 rounded text-gray-500',
} as const;
