import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag,
  Users,
  Settings,
  History,
  Store,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Boxes,
  X
} from 'lucide-react';
import { NavSection } from '../types';
import { useApp } from '../lib/context';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

/**
 * 侧边栏导航组件 (Sidebar)
 * 职责:
 * 1. 渲染应用的主导航菜单
 * 2. 根据用户角色 (RBAC) 动态过滤菜单项
 * 3. 响应移动端和桌面端的响应式布局
 * 4. 提供快速角色切换功能 (Dev Tool)
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  activeId, 
  onNavigate, 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  closeMobile
}) => {
  const { currentUser, switchUser, users } = useApp();
  const { t } = useTranslation();

  // 定义所有可能的菜单结构 (使用 i18n 翻译 Key)
  const allSections: NavSection[] = [
    {
      title: t('nav.overview'),
      items: [
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      ],
    },
    {
      title: t('nav.catalog_stock'),
      items: [
         { id: 'pim-list', label: t('nav.products'), icon: Package },
         { id: 'inv-explorer', label: t('nav.inventory'), icon: Boxes },
      ]
    },
    {
      title: t('nav.todays_recs'),
      items: [
        { id: 'recs-global', label: t('nav.global_config'), icon: ShoppingBag },
        { id: 'recs-store', label: t('nav.store_config'), icon: Store },
        { id: 'recs-preview', label: t('nav.app_preview'), icon: Eye },
      ],
    },
    {
      title: t('nav.crm'),
      items: [
        { id: 'customers', label: t('nav.customers'), icon: Users },
      ],
    },
    {
      title: t('nav.admin'),
      items: [
        { id: 'users', label: t('nav.users'), icon: Settings },
        { id: 'audit', label: t('nav.audit'), icon: History },
      ],
    },
  ];

  // --- RBAC 权限过滤逻辑 ---
  // 根据 currentUser.role 过滤菜单项
  const filteredSections = allSections.map(section => {
    const filteredItems = section.items.filter(item => {
      const role = currentUser.role;
      
      // 超级管理员可见所有
      if (role === 'SUPER_ADMIN') return true;

      // 总部运营 (OPS_GLOBAL)
      if (role === 'OPS_GLOBAL') {
        if (item.id === 'users') return false; // 无权管理用户
        return true;
      }

      // 门店店长 (STORE_MANAGER)
      if (role === 'STORE_MANAGER') {
        if (item.id === 'users') return false; 
        if (item.id === 'pim-list') return true; // 可见商品列表
        if (item.id === 'inv-explorer') return true; // 可见库存
        return true;
      }
      
      // 默认兜底 (如普通店员)
      return false;
    });

    return { ...section, items: filteredItems };
  }).filter(section => section.items.length > 0); // 移除过滤后为空的 Section

  return (
    <>
      {/* 移动端遮罩层 */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in"
          onClick={closeMobile}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 h-full bg-surface border-r border-gray-100 flex flex-col py-6 z-50 transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo 区域 */}
        <div className={`px-6 mb-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5">
            {/* Logo 图标 */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-tight text-primary animate-in fade-in duration-300">WR.DO</span>
            )}
          </div>
          
          {/* 移动端关闭按钮 */}
          <button 
            onClick={closeMobile}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 导航菜单区域 */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto overflow-x-hidden">
          {filteredSections.map((section, idx) => (
            <div key={idx}>
              {/* Section 标题 */}
              {section.title && !isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-400 tracking-wider mb-2 animate-in fade-in">
                  {section.title}
                </h3>
              )}
              {/* 折叠模式下的分隔线 */}
              {section.title && isCollapsed && (
                 <div className="h-px bg-gray-100 mx-2 my-4"></div>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-brand-light/50 text-brand shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                      >
                        <item.icon size={18} className={`shrink-0 ${isActive ? 'text-brand' : 'text-gray-400 group-hover:text-primary'}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部操作区 */}
        <div className="mt-auto px-4 pt-4 border-t border-gray-100">
           {/* 角色切换器 (仅展开时显示，用于开发调试) */}
           {!isCollapsed && (
             <div className="mb-4 animate-in fade-in">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('header.role_switch')}</p>
                <select 
                  className="w-full text-xs border border-gray-200 rounded p-1 bg-surface"
                  value={currentUser.id}
                  onChange={(e) => switchUser(e.target.value)}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
             </div>
           )}

           {/* 桌面端折叠/展开按钮 */}
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="hidden lg:flex w-full items-center justify-center p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
           >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
           </button>
        </div>
      </aside>
    </>
  );
};