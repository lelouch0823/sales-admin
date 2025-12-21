/**
 * 后端 API 响应类型定义
 * 
 * 这些类型与后端 API 文档 1:1 对应
 * 前端业务代码不应直接使用这些类型，而应使用 types/ 中的业务类型
 * 
 * 转换关系：API 响应 -> normalizers.ts 转换 -> 前端业务类型
 */

// ============ 通用响应格式 ============

/** 后端标准响应包装器 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: ApiPagination;
}

/** 分页信息 */
export interface ApiPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ============ 认证 API ============

/** 登录请求 */
export interface ApiLoginRequest {
    usernameOrEmail: string;
    password: string;
}

/** 登录响应 */
export interface ApiLoginResponse {
    accessToken: string;
    refreshToken: string;
    user: ApiUser;
}

// ============ 用户 API ============

/** 后端 User 角色类型 */
export type ApiRole =
    | 'admin'
    | 'manager'
    | 'user'
    | 'moderator'
    | 'guest'
    | 'super_admin';

/** 后端 User 状态类型 */
export type ApiUserStatus =
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'pending'
    | 'banned'
    | 'deleted';

/** 后端 User 实体 */
export interface ApiUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: ApiRole;
    status: ApiUserStatus;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt?: string;
}

// ============ 产品 API ============

/** 后端 Product 状态 */
export type ApiProductStatus = 'active' | 'inactive' | 'discontinued';

/** 后端 Product 实体 */
export interface ApiProduct {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    price: number;
    stockQuantity: number;
    status: ApiProductStatus;
    mainImageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ============ 库存 API ============

/** 后端库存状态 */
export type ApiStockStatus =
    | 'available'
    | 'reserved'
    | 'out_of_stock'
    | 'low_stock'
    | 'discontinued'
    | 'damaged'
    | 'expired'
    | 'in_stock'
    | 'backorder'
    | 'pre_order'
    | 'unknown';

/** 后端库存实体 */
export interface ApiInventory {
    id: string;
    product: {
        id: string;
        name: string;
        sku: string;
    };
    quantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    status: ApiStockStatus;
    warehouse: {
        id: string;
        name: string;
    };
    location?: string;
    batchNumber?: string;
    expiryDate?: string;
}

/** 后端库存变动 */
export interface ApiInventoryMovement {
    id: string;
    inventoryId: string;
    type: string;
    quantityChange: number;
    quantityBefore: number;
    quantityAfter: number;
    reason: string;
    notes?: string;
    createdAt: string;
    productName?: string;
    sku?: string;
}

// ============ 统计 API ============

/** 用户统计 */
export interface ApiUserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminUsers: number;
    managerUsers: number;
    userGrowthRate: number;
}

/** 产品统计 */
export interface ApiProductStats {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    lowStockProducts: number;
}

/** 库存统计 */
export interface ApiInventoryStats {
    totalProducts: number;
    totalQuantity: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiringSoonItems: number;
    damagedItems: number;
    byStatus: Record<string, number>;
    activeAlerts: number;
    alertsByType: Record<string, number>;
}
