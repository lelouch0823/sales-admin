/**
 * 全局命令菜单组件
 *
 * 使用封装的 command-menu 和 useHotkey
 * 支持商品、客户、页面跳转等快速操作
 */

import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Package,
  Users,
  LayoutDashboard,
  Settings,
  Box,
  FileText,
  TrendingUp,
} from 'lucide-react';

// 使用封装层
import { useHotkey, HOTKEYS } from '../../hooks/useHotkey';
import {
  CommandRoot,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  useCommandMenu,
  commandMenuStyles,
} from '../../lib/command-menu';

// 页面导航配置
const PAGES = [
  { id: 'dashboard', name: '仪表盘', icon: LayoutDashboard, path: '/' },
  { id: 'pim', name: '商品管理', icon: Package, path: '/pim' },
  { id: 'inventory', name: '库存管理', icon: Box, path: '/inventory' },
  { id: 'crm', name: '客户管理', icon: Users, path: '/crm' },
  { id: 'recommendations', name: '推荐管理', icon: TrendingUp, path: '/recommendations' },
  { id: 'orders', name: '订单管理', icon: FileText, path: '/orders' },
  { id: 'settings', name: '系统设置', icon: Settings, path: '/settings' },
];

interface CommandMenuProps {
  onNavigate?: (path: string) => void;
  onSearch?: (query: string, type: 'product' | 'customer') => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ onNavigate, onSearch }) => {
  const { t } = useTranslation();
  const { open, search, setSearch, toggle, close } = useCommandMenu();

  // Ctrl+K 快捷键（使用封装的 Hook）
  useHotkey(
    HOTKEYS.SEARCH,
    e => {
      e.preventDefault();
      toggle();
    },
    { enableOnFormTags: true }
  );

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  // 导航
  const handleNavigate = useCallback(
    (path: string) => {
      onNavigate?.(path);
      close();
    },
    [onNavigate, close]
  );

  // 搜索
  const handleSearch = useCallback(
    (type: 'product' | 'customer') => {
      if (search.trim()) {
        onSearch?.(search.trim(), type);
        close();
      }
    },
    [search, onSearch, close]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[600]">
      {/* 遮罩层 */}
      <div className={commandMenuStyles.overlay} onClick={close} />

      {/* 命令菜单 */}
      <div className={commandMenuStyles.container}>
        <CommandRoot className={commandMenuStyles.root} loop>
          {/* 搜索框 */}
          <div className={commandMenuStyles.inputWrapper}>
            <Search size={18} className="text-gray-400" />
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={t('common.search_placeholder', '搜索商品、客户或跳转页面...')}
              className={commandMenuStyles.input}
            />
            <kbd className={commandMenuStyles.kbd}>ESC</kbd>
          </div>

          {/* 命令列表 */}
          <CommandList className={commandMenuStyles.list}>
            <CommandEmpty className={commandMenuStyles.empty}>
              {t('common.no_results', '未找到结果')}
            </CommandEmpty>

            {/* 快速搜索 */}
            {search.trim() && (
              <CommandGroup
                heading={t('command.quick_search', '快速搜索')}
                className={commandMenuStyles.group}
              >
                <CommandItem
                  value={`search-product-${search}`}
                  onSelect={() => handleSearch('product')}
                  className={commandMenuStyles.item}
                >
                  <Package size={16} />
                  <span>
                    {t('command.search_product', '搜索商品')}: <strong>{search}</strong>
                  </span>
                </CommandItem>
                <CommandItem
                  value={`search-customer-${search}`}
                  onSelect={() => handleSearch('customer')}
                  className={commandMenuStyles.item}
                >
                  <Users size={16} />
                  <span>
                    {t('command.search_customer', '搜索客户')}: <strong>{search}</strong>
                  </span>
                </CommandItem>
              </CommandGroup>
            )}

            {/* 页面导航 */}
            <CommandGroup
              heading={t('command.navigate', '页面跳转')}
              className={commandMenuStyles.group}
            >
              {PAGES.map(page => {
                const Icon = page.icon;
                return (
                  <CommandItem
                    key={page.id}
                    value={`go-${page.id}-${page.name}`}
                    onSelect={() => handleNavigate(page.path)}
                    className={commandMenuStyles.item}
                  >
                    <Icon size={16} />
                    <span>{t(`nav.${page.id}`, page.name)}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>

          {/* 底部提示 */}
          <div className={commandMenuStyles.footer}>
            <span className="flex items-center gap-1">
              <kbd className={commandMenuStyles.kbd}>↑↓</kbd> {t('command.navigate_hint', '导航')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className={commandMenuStyles.kbd}>Enter</kbd> {t('command.select_hint', '选择')}
            </span>
          </div>
        </CommandRoot>
      </div>
    </div>
  );
};
