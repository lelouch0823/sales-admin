/**
 * API 配置常量
 */

import { env } from '../config/env';

// API 基础配置
export const API_CONFIG = {
  /** API 基础 URL (根据环境自动切换) */
  BASE_URL: env.apiBaseUrl,
  /** 请求超时时间 (ms) */
  TIMEOUT: env.apiTimeout,
  /** 重试次数 */
  RETRY_COUNT: 3,
  /** 重试间隔 (ms) */
  RETRY_DELAY: 1000,
} as const;

// API 端点
export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // 用户管理
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // 商品管理 (PIM)
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
  },

  // 库存管理
  INVENTORY: {
    BALANCES: '/inventory/balances',
    MOVEMENTS: '/inventory/movements',
    ADJUST: '/inventory/adjust',
    TRANSFER: '/inventory/transfer',
  },

  // CRM
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
  },

  // 推荐系统
  RECOMMENDATIONS: {
    LIST: '/recommendations',
    CREATE: '/recommendations',
    UPDATE: (id: string) => `/recommendations/${id}`,
    DELETE: (id: string) => `/recommendations/${id}`,
  },

  // 系统
  SYSTEM: {
    TENANTS: '/system/tenants',
    WAREHOUSES: '/system/warehouses',
    LOGS: '/system/logs',
  },

  // 订单管理
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    STATS: '/orders/stats',
  },

  // 数据分析
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    COMPREHENSIVE: '/analytics/comprehensive',
    TRENDS: '/analytics/trends',
    REALTIME: '/analytics/realtime',
    METRICS: '/analytics/metrics',
    COMPARISON: '/analytics/comparison',
    SALES: '/analytics/sales',
  },

  // 品牌管理
  BRANDS: {
    LIST: '/brands',
    DETAIL: (id: string) => `/brands/${id}`,
    CREATE: '/brands',
    UPDATE: (id: string) => `/brands/${id}`,
    DELETE: (id: string) => `/brands/${id}`,
  },

  // 系列管理
  COLLECTIONS: {
    LIST: '/collections',
    DETAIL: (id: string) => `/collections/${id}`,
    ACTIVE: '/collections/active',
    STATS: '/collections/stats',
    BY_BRAND: (brandId: string) => `/collections/by-brand/${brandId}`,
    BY_DESIGNER: (designerId: string) => `/collections/by-designer/${designerId}`,
  },

  // 设计师管理
  DESIGNERS: {
    LIST: '/designers',
    DETAIL: (id: string) => `/designers/${id}`,
    ACTIVE: '/designers/active',
    STATS: '/designers/stats',
    PORTFOLIO: (id: string) => `/designers/${id}/portfolio`,
  },

  // 仓库管理
  WAREHOUSES: {
    LIST: '/admin/warehouses',
    TREE: '/admin/warehouses/tree',
    TRANSFER_SOURCES: (id: string) => `/admin/warehouses/${id}/transfer-sources`,
  },

  // 调货单
  TRANSFER_ORDERS: {
    CREATE: '/admin/transfer-orders',
    SUBMIT: (id: string) => `/admin/transfer-orders/${id}/submit`,
    APPROVE: (id: string) => `/admin/transfer-orders/${id}/approve`,
    SHIP: (id: string) => `/admin/transfer-orders/${id}/ship`,
    RECEIVE: (id: string) => `/admin/transfer-orders/${id}/receive`,
  },
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

// LocalStorage 键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CURRENT_USER: 'current_user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  DB_CACHE: 'WR_DO_DB_V2',
} as const;
