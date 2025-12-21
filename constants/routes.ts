/**
 * 路由路径常量
 * 集中管理所有页面路由标识符
 */

export const ROUTES = {
  // 仪表盘
  DASHBOARD: 'dashboard',

  // PIM (商品信息管理)
  PIM_LIST: 'pim-list',

  // 库存管理
  INVENTORY_EXPLORER: 'inv-explorer',

  // 推荐系统
  RECS_GLOBAL: 'recs-global',
  RECS_STORE: 'recs-store',
  RECS_PREVIEW: 'recs-preview',

  // CRM (客户管理)
  CUSTOMERS: 'customers',

  // 系统管理
  USERS: 'users',
  AUDIT: 'audit',

  // 订单管理
  ORDERS: 'orders',

  // 数据分析
  ANALYTICS: 'analytics',

  // 仓库管理
  WAREHOUSE: 'warehouse',
} as const;

// 路由类型
export type RouteId = (typeof ROUTES)[keyof typeof ROUTES];

// 路由元信息
export interface RouteConfig {
  id: RouteId;
  label: string;
  labelKey: string; // i18n key
  icon?: string;
  allowedRoles?: string[];
}

// 路由配置表
export const ROUTE_CONFIGS: RouteConfig[] = [
  { id: ROUTES.DASHBOARD, label: '仪表盘', labelKey: 'nav.dashboard' },
  {
    id: ROUTES.PIM_LIST,
    label: '商品管理',
    labelKey: 'nav.pim',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
  },
  {
    id: ROUTES.INVENTORY_EXPLORER,
    label: '库存查询',
    labelKey: 'nav.inventory',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER', 'STORE_STAFF'],
  },
  {
    id: ROUTES.RECS_GLOBAL,
    label: '全局推荐',
    labelKey: 'nav.recsGlobal',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL'],
  },
  {
    id: ROUTES.RECS_STORE,
    label: '门店推荐',
    labelKey: 'nav.recsStore',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
  },
  { id: ROUTES.RECS_PREVIEW, label: 'App预览', labelKey: 'nav.recsPreview' },
  { id: ROUTES.CUSTOMERS, label: '客户管理', labelKey: 'nav.customers' },
  { id: ROUTES.USERS, label: '用户管理', labelKey: 'nav.users', allowedRoles: ['SUPER_ADMIN'] },
  {
    id: ROUTES.AUDIT,
    label: '审计日志',
    labelKey: 'nav.audit',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
  },
  {
    id: ROUTES.ORDERS,
    label: '订单管理',
    labelKey: 'nav.orders',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER', 'STORE_STAFF'],
  },
  {
    id: ROUTES.ANALYTICS,
    label: '数据分析',
    labelKey: 'nav.analytics',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL'],
  },
  {
    id: ROUTES.WAREHOUSE,
    label: '仓库管理',
    labelKey: 'nav.warehouse',
    allowedRoles: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'],
  },
];
