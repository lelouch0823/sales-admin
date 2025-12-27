import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AppProvider } from './lib/context';
import { ToastProvider } from './lib/toast';
import { AuthProvider, useAuth } from './lib/auth';
import { QueryProvider } from './lib/query';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/command-palette';
import { Toaster } from 'react-hot-toast';

// 视图组件 - 从各自的业务模块导入
import { PIMView } from './modules/pim/PIMView';
import { InventoryView } from './modules/inventory/InventoryView';
import { CustomersView } from './modules/crm/CustomersView';
import { RecommendationsView } from './modules/recommendations/RecommendationsView';
import { OrdersView } from './modules/orders/OrdersView';
import { AnalyticsView } from './modules/analytics/AnalyticsView';
import { WarehouseView } from './modules/warehouse/WarehouseView';

import { DashboardView } from './views/Dashboard';
import { UsersView } from './views/Users';
import { AuditLogView } from './views/AuditLog';
import { LoginView } from './views/Login';
import { ProtectedView } from './components/auth/ProtectedView';

/**
 * 主布局组件 (MainLayout)
 * 职责:
 * 1. 管理侧边栏的折叠/展开状态
 * 2. 处理全局导航逻辑 (模拟路由)
 * 3. 渲染顶部 Header 和侧边 Sidebar
 * 4. 根据 currentView 渲染对应的内容区域
 * 5. 处理全局快捷键 (如 Cmd+K 唤起命令面板)
 */
const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 路由状态管理 (由于是单页应用 SPA 且为了演示简洁未引入 React Router，这里使用简单的 state 路由)
  const [currentView, setCurrentView] = useState('dashboard');

  // UI 状态
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // 桌面端侧边栏折叠状态
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // 移动端侧边栏开关状态
  const [isCmdOpen, setIsCmdOpen] = useState(false); // 全局命令面板开关状态

  // --- 全局键盘监听 (Cmd+K / Ctrl+K) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 导航处理函数：切换视图并关闭移动端侧边栏
  const handleNavigate = (id: string) => {
    setCurrentView(id);
    setIsMobileSidebarOpen(false); // 移动端导航后自动关闭侧边栏，提升体验
  };

  // --- 认证状态检查 ---

  // 1. 加载中状态：显示全局 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-gray-300" />
      </div>
    );
  }

  // 2. 未登录状态 -> 渲染登录页
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // 3. 已登录状态 -> 渲染主布局
  return (
    // AppProvider (数据层) 嵌套在 AuthProvider 内部，以便访问当前用户信息
    <AppProvider>
      <div className="min-h-screen bg-page text-primary font-sans flex animate-fade-in">
        {/* 左侧导航栏 */}
        <Sidebar
          activeId={currentView}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          closeMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 右侧主内容区域 */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* 顶部 Header */}
          <Header
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onOpenCommand={() => setIsCmdOpen(true)}
          />

          {/* 页面内容容器 */}
          <main className="flex-1 px-4 sm:px-8 py-8 w-full max-w-7xl mx-auto">
            {/* 仪表盘 */}
            {currentView === 'dashboard' && <DashboardView />}

            {/* 商品管理 (PIM) - 受保护视图: 仅管理员、运营和店长可见 */}
            {currentView === 'pim-list' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER']}
                onBack={() => handleNavigate('dashboard')}
              >
                <PIMView />
              </ProtectedView>
            )}

            {/* 库存查询 - 受保护视图: 店员也可见 */}
            {currentView === 'inv-explorer' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER', 'STORE_STAFF']}
                onBack={() => handleNavigate('dashboard')}
              >
                <InventoryView />
              </ProtectedView>
            )}

            {/* 全局推荐配置: 仅总部角色可见 */}
            {currentView === 'recs-global' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL']}
                onBack={() => handleNavigate('dashboard')}
              >
                <RecommendationsView mode="GLOBAL" />
              </ProtectedView>
            )}

            {/* 门店推荐配置: 店长可见 */}
            {currentView === 'recs-store' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER']}
                onBack={() => handleNavigate('dashboard')}
              >
                <RecommendationsView mode="STORE" />
              </ProtectedView>
            )}

            {/* App 效果预览: 所有登录用户可见 */}
            {currentView === 'recs-preview' && <RecommendationsView mode="PREVIEW" />}

            {/* 客户管理 (CRM): 所有登录用户可见，但在内部会做数据隔离 */}
            {currentView === 'customers' && <CustomersView />}

            {/* 用户管理: 仅超级管理员可见 */}
            {currentView === 'users' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN']}
                onBack={() => handleNavigate('dashboard')}
              >
                <UsersView />
              </ProtectedView>
            )}

            {/* 审计日志: 管理层可见 */}
            {currentView === 'audit' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER']}
                onBack={() => handleNavigate('dashboard')}
              >
                <AuditLogView />
              </ProtectedView>
            )}
            {/* 订单管理 */}
            {currentView === 'orders' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER', 'STORE_STAFF']}
                onBack={() => handleNavigate('dashboard')}
              >
                <OrdersView />
              </ProtectedView>
            )}

            {/* 数据分析 */}
            {currentView === 'analytics' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL']}
                onBack={() => handleNavigate('dashboard')}
              >
                <AnalyticsView />
              </ProtectedView>
            )}

            {/* 仓库管理 */}
            {currentView === 'warehouse' && (
              <ProtectedView
                allowedRoles={['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER']}
                onBack={() => handleNavigate('dashboard')}
              >
                <WarehouseView />
              </ProtectedView>
            )}
          </main>
        </div>

        {/* 全局命令面板 (Cmd+K) */}
        <CommandPalette
          isOpen={isCmdOpen}
          onClose={() => setIsCmdOpen(false)}
          onNavigate={handleNavigate}
        />
      </div>
    </AppProvider>
  );
};

/**
 * 应用根组件 (App)
 * 职责: 初始化全局 Provider (Toast, Auth)
 * 注意: AppProvider 放在 MainLayout 内部，因为它依赖 AuthProvider 提供的 currentUser
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>
            <MainLayout />
            <Toaster position="top-right" />
          </AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
