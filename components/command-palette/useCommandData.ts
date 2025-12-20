import { useMemo } from 'react';
import { LayoutDashboard, Package, Users, ShoppingBag, Settings, History, Box, RotateCcw, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../lib/context';
import { useAuth } from '../../lib/auth';
import { SearchResult } from './types';

/**
 * Hook: useCommandData
 * 职责: 
 * 1. 聚合应用内所有可搜索资源 (页面导航、商品、客户、全局动作)
 * 2. 根据用户输入的 query 进行实时过滤
 * 3. 返回标准化的 SearchResult 数组供 CommandPalette 渲染
 */
export const useCommandData = (query: string) => {
  const { t } = useTranslation();
  const { products, customers, resetDemoData } = useApp();
  const { logout } = useAuth();

  return useMemo(() => {
    // A. 定义静态导航项 (Navigation Items)
    const navItems: SearchResult[] = [
      { id: 'dashboard', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.dashboard'), icon: LayoutDashboard },
      { id: 'pim-list', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.products'), icon: Package },
      { id: 'inv-explorer', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.inventory'), icon: Box },
      { id: 'customers', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.customers'), icon: Users },
      { id: 'recs-global', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.global_config'), icon: ShoppingBag },
      { id: 'audit', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.audit'), icon: History },
      { id: 'users', type: 'NAV', section: t('cmd.section_nav'), label: t('nav.users'), icon: Settings },
    ];

    // B. 定义全局动作 (Global Actions)
    const actionItems: SearchResult[] = [
      { 
        id: 'reset-data', 
        type: 'ACTION', 
        section: t('cmd.section_actions'), 
        label: t('cmd.actions.reset_data'), 
        icon: RotateCcw, 
        action: () => { if(confirm('Reset all demo data?')) { resetDemoData(); window.location.reload(); } } 
      },
      { 
        id: 'logout', 
        type: 'ACTION', 
        section: t('cmd.section_actions'), 
        label: t('cmd.actions.logout'), 
        icon: LogOut,
        action: () => logout() 
      }
    ];

    // C. 过滤逻辑 (Filter Logic)
    if (!query.trim()) {
      // 默认视图: 显示常用导航和动作
      return [...navItems.slice(0, 4), ...actionItems];
    }

    const lowerQuery = query.toLowerCase();

    // 1. 过滤导航
    const filteredNav = navItems.filter(n => n.label.toLowerCase().includes(lowerQuery));
    
    // 2. 过滤商品 (PIM) - 限制返回前 5 条
    const filteredProducts = products
      .filter(p => p.name.toLowerCase().includes(lowerQuery) || p.sku.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map(p => ({ 
        id: p.id, 
        type: 'PRODUCT' as const, 
        section: t('cmd.section_products'), 
        label: p.name, 
        sub: p.sku, 
        icon: Package 
      }));

    // 3. 过滤客户 (CRM) - 限制返回前 5 条
    const filteredCustomers = customers
      .filter(c => c.name.toLowerCase().includes(lowerQuery) || c.phone.includes(lowerQuery))
      .slice(0, 5)
      .map(c => ({ 
        id: c.id, 
        type: 'CUSTOMER' as const, 
        section: t('cmd.section_customers'), 
        label: c.name, 
        sub: c.phone, 
        icon: Users 
      }));

    // 4. 过滤动作
    const filteredActions = actionItems.filter(a => a.label.toLowerCase().includes(lowerQuery));

    // 合并所有结果
    return [...filteredNav, ...filteredProducts, ...filteredCustomers, ...filteredActions];
  }, [query, products, customers, t, resetDemoData, logout]);
};