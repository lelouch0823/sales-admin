/**
 * 数据转换器（Normalizers）
 * 
 * 负责将后端 API 响应类型转换为前端业务类型
 * 
 * 设计原则：
 * 1. 单向转换：API 类型 -> 前端类型
 * 2. 容错处理：字段缺失时提供合理默认值
 * 3. 类型安全：输入输出类型明确
 */

import { User, Role } from './user';
import {
    ApiUser,
    ApiRole,
    ApiProduct,
    ApiInventory,
    ApiInventoryMovement,
    ApiLoginResponse
} from './api';
import { Product } from '../modules/pim/types';
import { InventoryBalance, InventoryMovement } from '../modules/inventory/types';

// ============ 角色映射 ============

/** 后端角色到前端角色的映射 */
const ROLE_MAP: Record<ApiRole, Role> = {
    'super_admin': 'SUPER_ADMIN',
    'admin': 'SUPER_ADMIN',  // admin 映射为超级管理员
    'manager': 'OPS_GLOBAL',
    'user': 'STORE_STAFF',
    'moderator': 'STORE_MANAGER',
    'guest': 'STORE_STAFF',
};

/** 转换角色 */
function normalizeRole(apiRole: ApiRole): Role {
    return ROLE_MAP[apiRole] || 'STORE_STAFF';
}

// ============ 用户转换 ============

/**
 * 将 API User 转换为前端 User
 */
export function normalizeUser(apiUser: ApiUser): User {
    return {
        id: apiUser.id,
        name: apiUser.fullName || apiUser.username || apiUser.email.split('@')[0],
        email: apiUser.email,
        role: normalizeRole(apiUser.role),
        status: apiUser.status === 'active' ? 'ACTIVE' : 'DISABLED',
        tenantId: undefined, // 后端暂无此字段，需要根据业务逻辑设置
        avatarUrl: undefined,
    };
}

/**
 * 将 API 登录响应转换为前端格式
 */
export function normalizeLoginResponse(response: ApiLoginResponse): {
    user: User;
    token: string;
    expiresAt: number;
} {
    return {
        user: normalizeUser(response.user),
        token: response.accessToken,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 默认 24 小时过期
    };
}

// ============ 产品转换 ============

/**
 * 将 API Product 转换为前端 Product
 */
export function normalizeProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        sku: apiProduct.sku,
        name: apiProduct.name,
        description: apiProduct.description,
        category: apiProduct.category || 'Uncategorized',
        brand: apiProduct.brand || '',
        price: apiProduct.price,
        originalPrice: apiProduct.price * 1.2, // 默认原价为售价的 120%
        imageUrl: apiProduct.mainImageUrl || '',
        status: apiProduct.status === 'active' ? 'PUBLISHED' : 'DRAFT',
        tags: [],
        globalStatus: apiProduct.status === 'active' ? 'ON_SHELF' : 'OFF_SHELF',
        allowBackorder: false,
        allowTransfer: true,
        mediaAssets: apiProduct.mainImageUrl ? [{
            id: '1',
            type: 'IMAGE' as const,
            url: apiProduct.mainImageUrl,
            isMain: true,
        }] : [],
        updatedAt: apiProduct.updatedAt || new Date().toISOString(),
        updatedBy: '',
    };
}

/**
 * 批量转换产品
 */
export function normalizeProducts(apiProducts: ApiProduct[]): Product[] {
    return apiProducts.map(normalizeProduct);
}

// ============ 库存转换 ============

/**
 * 将 API Inventory 转换为前端 InventoryBalance
 */
export function normalizeInventory(apiInventory: ApiInventory): InventoryBalance {
    return {
        id: apiInventory.id,
        sku: apiInventory.product.sku,
        warehouseId: apiInventory.warehouse.id,
        onHand: apiInventory.quantity,
        reserved: apiInventory.reservedQuantity,
        inTransitIn: 0,
        inTransitOut: 0,
    };
}

/**
 * 批量转换库存
 */
export function normalizeInventoryList(apiList: ApiInventory[]): InventoryBalance[] {
    return apiList.map(normalizeInventory);
}

/**
 * 将 API InventoryMovement 转换为前端 InventoryMovement
 */
export function normalizeMovement(apiMovement: ApiInventoryMovement): InventoryMovement {
    // 映射变动类型
    const typeMap: Record<string, InventoryMovement['type']> = {
        'stock_in': 'RECEIVE',
        'stock_out': 'ISSUE',
        'reserve': 'RESERVE',
        'transfer_out': 'TRANSFER_OUT',
        'transfer_in': 'TRANSFER_IN',
        'transfer': 'TRANSFER_OUT',
        'adjustment': 'ADJUST',
        'manual_adjustment': 'ADJUST',
    };

    return {
        id: apiMovement.id,
        sku: apiMovement.sku || '',
        warehouseId: apiMovement.inventoryId,
        type: typeMap[apiMovement.type] || 'ADJUST',
        quantity: Math.abs(apiMovement.quantityChange),
        operatorId: '',
        timestamp: apiMovement.createdAt,
    };
}

// ============ 通用工具 ============

/**
 * 安全获取显示名称
 * 用于 user.name 可能为 undefined 的场景
 */
export function getDisplayName(user: User | null | undefined): string {
    if (!user) return 'Unknown';
    return user.name || user.email?.split('@')[0] || 'Unknown';
}
