/**
 * 键盘快捷键 Hook 封装
 *
 * 抽象 react-hotkeys-hook，方便未来切换实现
 *
 * @example
 * // 单个快捷键
 * useHotkey('ctrl+s', () => handleSave(), { enableOnFormTags: true });
 *
 * // 多个快捷键
 * useHotkey(['ctrl+s', 'meta+s'], () => handleSave());
 */

import { useHotkeys, Options as HotkeyOptions } from 'react-hotkeys-hook';
import type { RefObject } from 'react';

// ============ 类型定义 ============

/** 快捷键配置选项 */
export interface HotkeyConfig {
  /** 在表单元素中也生效 */
  enableOnFormTags?: boolean;
  /** 在 contentEditable 中也生效 */
  enableOnContentEditable?: boolean;
  /** 是否启用 */
  enabled?: boolean;
  /** 作用域 */
  scopes?: string | string[];
  /** 阻止默认行为 */
  preventDefault?: boolean;
  /** 按键抬起时触发 */
  keyup?: boolean;
  /** 按键按下时触发 */
  keydown?: boolean;
}

/** 快捷键回调 */
export type HotkeyCallback = (event: KeyboardEvent) => void;

// ============ Hook 封装 ============

/**
 * 快捷键 Hook
 * @param keys 快捷键组合，如 'ctrl+s' 或 ['ctrl+s', 'meta+s']
 * @param callback 回调函数
 * @param options 配置选项
 * @param deps 依赖数组
 */
export function useHotkey<T extends HTMLElement = HTMLElement>(
  keys: string | string[],
  callback: HotkeyCallback,
  options: HotkeyConfig = {},
  deps: unknown[] = []
): RefObject<T> {
  const hotkeyOptions: HotkeyOptions = {
    enableOnFormTags: options.enableOnFormTags,
    enableOnContentEditable: options.enableOnContentEditable,
    enabled: options.enabled ?? true,
    scopes: options.scopes,
    preventDefault: options.preventDefault ?? true,
    keyup: options.keyup,
    keydown: options.keydown ?? true,
  };

  return useHotkeys<T>(Array.isArray(keys) ? keys.join(', ') : keys, callback, hotkeyOptions, deps);
}

// ============ 预定义快捷键常量 ============

/** 常用快捷键定义 */
export const HOTKEYS = {
  /** 保存 */
  SAVE: 'mod+s',
  /** 新建 */
  NEW: 'mod+n',
  /** 搜索 */
  SEARCH: 'mod+k',
  /** 关闭 */
  CLOSE: 'escape',
  /** 复制 */
  COPY: 'mod+c',
  /** 粘贴 */
  PASTE: 'mod+v',
  /** 撤销 */
  UNDO: 'mod+z',
  /** 重做 */
  REDO: 'mod+shift+z',
  /** 删除 */
  DELETE: 'delete',
  /** 全选 */
  SELECT_ALL: 'mod+a',
} as const;

/**
 * 快捷键描述（用于显示提示）
 * mod 在 Mac 上显示为 ⌘，在 Windows 上显示为 Ctrl
 */
export function formatHotkeyDisplay(key: string): string {
  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  return key
    .replace(/mod/gi, isMac ? '⌘' : 'Ctrl')
    .replace(/alt/gi, isMac ? '⌥' : 'Alt')
    .replace(/shift/gi, isMac ? '⇧' : 'Shift')
    .replace(/\+/g, ' + ')
    .replace(/escape/gi, 'Esc');
}
