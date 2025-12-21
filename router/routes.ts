/**
 * 路由定义
 * 配置式路由，包含权限控制
 */
import React from 'react';
import { ROUTES, RouteId } from '../constants/routes';
import { RoleId } from '../constants/roles';

// 视图组件懒加载导入
const PIMView = React.lazy(() =>
  import('../modules/pim/PIMView').then(m => ({ default: m.PIMView }))
);
const InventoryView = React.lazy(() =>
  import('../modules/inventory/InventoryView').then(m => ({ default: m.InventoryView }))
);
const CustomersView = React.lazy(() =>
  import('../modules/crm/CustomersView').then(m => ({ default: m.CustomersView }))
);
const RecommendationsView = React.lazy(() =>
  import('../modules/recommendations/RecommendationsView').then(m => ({
    default: m.RecommendationsView,
  }))
);
const DashboardView = React.lazy(() =>
  import('../views/Dashboard').then(m => ({ default: m.DashboardView }))
);
const UsersView = React.lazy(() => import('../views/Users').then(m => ({ default: m.UsersView })));
const AuditLogView = React.lazy(() =>
  import('../views/AuditLog').then(m => ({ default: m.AuditLogView }))
);
const OrdersView = React.lazy(() =>
  import('../modules/orders/OrdersView').then(m => ({ default: m.OrdersView }))
);

/**
 * 路由配置类型
 */
export interface Route {
  id: RouteId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  allowedRoles?: RoleId[];
  requiresAuth: boolean;
}

/**
 * 路由表
 */
export const routes: Route[] = [
  {
    id: ROUTES.DASHBOARD,
    component: DashboardView,
    requiresAuth: true,
  },
  {
    id: ROUTES.PIM_LIST,
    component: PIMView,
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
    requiresAuth: true,
  },
  {
    id: ROUTES.INVENTORY_EXPLORER,
    component: InventoryView,
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER', 'STORE_STAFF'],
    requiresAuth: true,
  },
  {
    id: ROUTES.RECS_GLOBAL,
    component: RecommendationsView,
    props: { mode: 'GLOBAL' },
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL'],
    requiresAuth: true,
  },
  {
    id: ROUTES.RECS_STORE,
    component: RecommendationsView,
    props: { mode: 'STORE' },
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
    requiresAuth: true,
  },
  {
    id: ROUTES.RECS_PREVIEW,
    component: RecommendationsView,
    props: { mode: 'PREVIEW' },
    requiresAuth: true,
  },
  {
    id: ROUTES.CUSTOMERS,
    component: CustomersView,
    requiresAuth: true,
  },
  {
    id: ROUTES.USERS,
    component: UsersView,
    allowedRoles: ['SUPER_ADMIN'],
    requiresAuth: true,
  },
  {
    id: ROUTES.AUDIT,
    component: AuditLogView,
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
    requiresAuth: true,
  },
  {
    id: ROUTES.ORDERS,
    component: OrdersView,
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER', 'STORE_STAFF'],
    requiresAuth: true,
  },
];

/**
 * 根据路由 ID 获取路由配置
 */
export const getRouteById = (id: RouteId): Route | undefined => {
  return routes.find(route => route.id === id);
};

/**
 * 获取用户有权限访问的路由列表
 */
export const getAccessibleRoutes = (userRole: RoleId): Route[] => {
  return routes.filter(route => {
    if (!route.allowedRoles) return true;
    return route.allowedRoles.includes(userRole);
  });
};

/**
 * 检查用户是否有权访问指定路由
 */
export const canAccessRoute = (routeId: RouteId, userRole: RoleId): boolean => {
  const route = getRouteById(routeId);
  if (!route) return false;
  if (!route.allowedRoles) return true;
  return route.allowedRoles.includes(userRole);
};
