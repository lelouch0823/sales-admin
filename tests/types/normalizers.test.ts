/**
 * Normalizers 类型转换器测试
 */
import { describe, it, expect } from 'vitest';
import {
    normalizeUser,
    normalizeProduct,
    normalizeInventory,
    normalizeMovement,
    normalizeLoginResponse,
    getDisplayName,
} from '../../types/normalizers';
import { ApiUser, ApiProduct, ApiInventory, ApiInventoryMovement, ApiLoginResponse } from '../../types/api';

describe('normalizeUser', () => {
    const mockApiUser: ApiUser = {
        id: 'user-123',
        username: 'johndoe',
        email: 'john@example.com',
        fullName: 'John Doe',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-06-01T12:00:00Z',
    };

    it('应该正确转换 API User 到前端 User', () => {
        const user = normalizeUser(mockApiUser);

        expect(user.id).toBe('user-123');
        expect(user.email).toBe('john@example.com');
        expect(user.name).toBe('John Doe');
        expect(user.role).toBe('SUPER_ADMIN'); // admin -> SUPER_ADMIN
        expect(user.status).toBe('ACTIVE');
    });

    it('应该使用 username 当 fullName 为空时', () => {
        const apiUser: ApiUser = {
            ...mockApiUser,
            fullName: '',
        };
        const user = normalizeUser(apiUser);
        expect(user.name).toBe('johndoe');
    });

    it('应该使用 email 前缀当 fullName 和 username 都为空时', () => {
        const apiUser: ApiUser = {
            ...mockApiUser,
            fullName: '',
            username: '',
        };
        const user = normalizeUser(apiUser);
        expect(user.name).toBe('john');
    });

    it('应该正确映射角色', () => {
        const testCases: Array<{ apiRole: ApiUser['role']; expectedRole: string }> = [
            { apiRole: 'admin', expectedRole: 'SUPER_ADMIN' },
            { apiRole: 'super_admin', expectedRole: 'SUPER_ADMIN' },
            { apiRole: 'manager', expectedRole: 'OPS_GLOBAL' },
            { apiRole: 'user', expectedRole: 'STORE_STAFF' },
            { apiRole: 'moderator', expectedRole: 'STORE_MANAGER' },
            { apiRole: 'guest', expectedRole: 'STORE_STAFF' },
        ];

        testCases.forEach(({ apiRole, expectedRole }) => {
            const user = normalizeUser({ ...mockApiUser, role: apiRole });
            expect(user.role).toBe(expectedRole);
        });
    });

    it('应该正确映射状态', () => {
        const activeUser = normalizeUser({ ...mockApiUser, status: 'active' });
        expect(activeUser.status).toBe('ACTIVE');

        const inactiveUser = normalizeUser({ ...mockApiUser, status: 'inactive' });
        expect(inactiveUser.status).toBe('DISABLED');
    });
});

describe('normalizeProduct', () => {
    const mockApiProduct: ApiProduct = {
        id: 'prod-123',
        sku: 'SKU-001',
        name: 'Test Product',
        description: 'A test product',
        category: 'Electronics',
        brand: 'TestBrand',
        price: 99.99,
        stockQuantity: 100,
        status: 'active',
        mainImageUrl: 'https://example.com/image.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-06-01T00:00:00Z',
    };

    it('应该正确转换 API Product 到前端 Product', () => {
        const product = normalizeProduct(mockApiProduct);

        expect(product.id).toBe('prod-123');
        expect(product.sku).toBe('SKU-001');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(99.99);
        expect(product.brand).toBe('TestBrand');
        expect(product.category).toBe('Electronics');
        expect(product.status).toBe('PUBLISHED');
        expect(product.globalStatus).toBe('ON_SHELF');
    });

    it('应该处理缺失的可选字段', () => {
        const apiProduct: ApiProduct = {
            id: 'prod-456',
            sku: 'SKU-002',
            name: 'Minimal Product',
            price: 50,
            stockQuantity: 10,
            status: 'inactive',
        };

        const product = normalizeProduct(apiProduct);

        expect(product.brand).toBe('');
        expect(product.category).toBe('Uncategorized');
        expect(product.imageUrl).toBe('');
        expect(product.status).toBe('DRAFT');
        expect(product.globalStatus).toBe('OFF_SHELF');
    });

    it('应该创建 mediaAssets 当有主图时', () => {
        const product = normalizeProduct(mockApiProduct);
        expect(product.mediaAssets).toHaveLength(1);
        expect(product.mediaAssets[0].url).toBe('https://example.com/image.jpg');
        expect(product.mediaAssets[0].isMain).toBe(true);
    });
});

describe('normalizeInventory', () => {
    const mockApiInventory: ApiInventory = {
        id: 'inv-123',
        product: { id: 'prod-1', name: 'Product A', sku: 'SKU-A' },
        quantity: 100,
        availableQuantity: 80,
        reservedQuantity: 20,
        status: 'in_stock',
        warehouse: { id: 'wh-1', name: 'Main Warehouse' },
    };

    it('应该正确转换 API Inventory 到前端 InventoryBalance', () => {
        const balance = normalizeInventory(mockApiInventory);

        expect(balance.id).toBe('inv-123');
        expect(balance.sku).toBe('SKU-A');
        expect(balance.warehouseId).toBe('wh-1');
        expect(balance.onHand).toBe(100);
        expect(balance.reserved).toBe(20);
        expect(balance.inTransitIn).toBe(0);
        expect(balance.inTransitOut).toBe(0);
    });
});

describe('normalizeMovement', () => {
    const mockApiMovement: ApiInventoryMovement = {
        id: 'mov-123',
        inventoryId: 'inv-1',
        type: 'stock_in',
        quantityChange: 50,
        quantityBefore: 100,
        quantityAfter: 150,
        reason: '采购入库',
        createdAt: '2024-06-01T12:00:00Z',
        sku: 'SKU-A',
    };

    it('应该正确转换 API Movement 到前端 InventoryMovement', () => {
        const movement = normalizeMovement(mockApiMovement);

        expect(movement.id).toBe('mov-123');
        expect(movement.sku).toBe('SKU-A');
        expect(movement.type).toBe('RECEIVE');
        expect(movement.quantity).toBe(50);
    });

    it('应该正确映射变动类型', () => {
        const testCases = [
            { apiType: 'stock_in', expectedType: 'RECEIVE' },
            { apiType: 'stock_out', expectedType: 'ISSUE' },
            { apiType: 'reserve', expectedType: 'RESERVE' },
            { apiType: 'transfer_out', expectedType: 'TRANSFER_OUT' },
            { apiType: 'transfer_in', expectedType: 'TRANSFER_IN' },
            { apiType: 'adjustment', expectedType: 'ADJUST' },
        ];

        testCases.forEach(({ apiType, expectedType }) => {
            const movement = normalizeMovement({ ...mockApiMovement, type: apiType });
            expect(movement.type).toBe(expectedType);
        });
    });

    it('应该处理负数量变动', () => {
        const movement = normalizeMovement({ ...mockApiMovement, quantityChange: -30 });
        expect(movement.quantity).toBe(30); // 应该取绝对值
    });
});

describe('normalizeLoginResponse', () => {
    it('应该正确转换登录响应', () => {
        const apiResponse: ApiLoginResponse = {
            accessToken: 'access-token-123',
            refreshToken: 'refresh-token-456',
            user: {
                id: 'user-1',
                username: 'admin',
                email: 'admin@example.com',
                fullName: 'Admin User',
                role: 'admin',
                status: 'active',
                createdAt: '2024-01-01T00:00:00Z',
            },
        };

        const result = normalizeLoginResponse(apiResponse);

        expect(result.token).toBe('access-token-123');
        expect(result.user.name).toBe('Admin User');
        expect(result.user.role).toBe('SUPER_ADMIN');
        expect(result.expiresAt).toBeGreaterThan(Date.now());
    });
});

describe('getDisplayName', () => {
    it('应该返回用户名称', () => {
        expect(getDisplayName({ id: '1', name: 'John', email: 'j@e.com', role: 'SUPER_ADMIN', status: 'ACTIVE' }))
            .toBe('John');
    });

    it('应该返回 Unknown 当用户为 null 时', () => {
        expect(getDisplayName(null)).toBe('Unknown');
        expect(getDisplayName(undefined)).toBe('Unknown');
    });
});
