/**
 * API 配置常量
 */

// API 基础配置
export const API_CONFIG = {
    BASE_URL: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '/api',
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
} as const;

// API 端点
export const API_ENDPOINTS = {
    // 认证
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
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
