/**
 * 角色和权限常量
 * 集中管理系统角色定义
 */

export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',      // 超级管理员
    OPS_GLOBAL: 'OPS_GLOBAL',        // 总部运营
    STORE_MANAGER: 'STORE_MANAGER',  // 门店店长
    STORE_STAFF: 'STORE_STAFF',      // 门店店员
} as const;

export type RoleId = typeof ROLES[keyof typeof ROLES];

// 角色显示名称 (中文)
export const ROLE_LABELS: Record<RoleId, string> = {
    [ROLES.SUPER_ADMIN]: '超级管理员',
    [ROLES.OPS_GLOBAL]: '总部运营',
    [ROLES.STORE_MANAGER]: '门店店长',
    [ROLES.STORE_STAFF]: '门店店员',
};

// 角色权限级别 (数字越大权限越高)
export const ROLE_LEVELS: Record<RoleId, number> = {
    [ROLES.SUPER_ADMIN]: 100,
    [ROLES.OPS_GLOBAL]: 80,
    [ROLES.STORE_MANAGER]: 60,
    [ROLES.STORE_STAFF]: 40,
};

// 权限检查工具函数
export const hasRole = (userRole: RoleId, requiredRoles: RoleId[]): boolean => {
    return requiredRoles.includes(userRole);
};

export const hasMinLevel = (userRole: RoleId, minLevel: number): boolean => {
    return ROLE_LEVELS[userRole] >= minLevel;
};

export const isAdmin = (role: RoleId): boolean => {
    return role === ROLES.SUPER_ADMIN || role === ROLES.OPS_GLOBAL;
};

export const isStoreLevel = (role: RoleId): boolean => {
    return role === ROLES.STORE_MANAGER || role === ROLES.STORE_STAFF;
};
