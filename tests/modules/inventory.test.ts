/**
 * 库存管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inventoryApi } from '../../modules/inventory/api';
import { http } from '../../lib/http';
import type { InventoryBalance, InventoryMovement } from '../../modules/inventory/types';

// Mock http 模块
vi.mock('../../lib/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  HttpError: class HttpError extends Error {
    constructor(
      public status: number,
      message: string
    ) {
      super(message);
    }
  },
}));

const mockInventoryBalance: InventoryBalance = {
  id: 'inv-1',
  sku: 'SKU-001',
  warehouseId: 'wh-1',
  onHand: 100,
  reserved: 10,
  inTransitIn: 0,
  inTransitOut: 0,
};

const mockMovement: InventoryMovement = {
  id: 'mov-1',
  sku: 'SKU-001',
  warehouseId: 'wh-1',
  type: 'RECEIVE',
  quantity: 50,
  operatorId: 'user-1',
  timestamp: '2025-01-01T00:00:00Z',
};

describe('inventoryApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取库存列表', async () => {
      const mockBalances = [mockInventoryBalance];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBalances);

      const result = await inventoryApi.list();

      expect(http.get).toHaveBeenCalledWith('/inventory', { params: undefined });
      expect(result).toEqual(mockBalances);
    });

    it('应该支持仓库筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await inventoryApi.list({ warehouseId: 'wh-1' });

      expect(http.get).toHaveBeenCalledWith('/inventory', { params: { warehouseId: 'wh-1' } });
    });

    it('应该支持低库存筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await inventoryApi.list({ lowStock: true });

      expect(http.get).toHaveBeenCalledWith('/inventory', { params: { lowStock: true } });
    });
  });

  describe('getBalances', () => {
    it('应该获取库存余额（list 别名）', async () => {
      const mockBalances = [mockInventoryBalance];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBalances);

      const result = await inventoryApi.getBalances();

      expect(http.get).toHaveBeenCalledWith('/inventory', { params: undefined });
      expect(result).toEqual(mockBalances);
    });
  });

  describe('get', () => {
    it('应该获取库存详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockInventoryBalance);

      const result = await inventoryApi.get('inv-1');

      expect(http.get).toHaveBeenCalledWith('/inventory/inv-1');
      expect(result).toEqual(mockInventoryBalance);
    });
  });

  describe('getStats', () => {
    it('应该获取库存统计', async () => {
      const mockStats = {
        totalProducts: 100,
        totalQuantity: 5000,
        totalValue: 500000,
        lowStockItems: 5,
        outOfStockItems: 2,
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStats);

      const result = await inventoryApi.getStats();

      expect(http.get).toHaveBeenCalledWith('/inventory/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getMovements', () => {
    it('应该获取库存变动记录', async () => {
      const mockMovements = [mockMovement];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockMovements);

      const result = await inventoryApi.getMovements('inv-1');

      expect(http.get).toHaveBeenCalledWith('/inventory/inv-1/movements');
      expect(result).toEqual(mockMovements);
    });

    it('应该获取全部变动记录', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await inventoryApi.getMovements();

      expect(http.get).toHaveBeenCalledWith('/inventory/movements');
    });
  });

  describe('adjust', () => {
    it('应该调整库存', async () => {
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await inventoryApi.adjust({
        inventoryId: 'inv-1',
        newQuantity: 150,
        reason: '盘点调整',
      });

      expect(http.post).toHaveBeenCalledWith('/inventory/adjust', {
        inventoryId: 'inv-1',
        newQuantity: 150,
        reason: '盘点调整',
      });
    });
  });

  describe('transfer', () => {
    it('应该转移库存', async () => {
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await inventoryApi.transfer({
        fromInventoryId: 'inv-1',
        toInventoryId: 'inv-2',
        quantity: 20,
        reason: '仓库调拨',
      });

      expect(http.post).toHaveBeenCalledWith('/inventory/transfer', {
        fromInventoryId: 'inv-1',
        toInventoryId: 'inv-2',
        quantity: 20,
        reason: '仓库调拨',
      });
    });
  });

  describe('reserve', () => {
    it('应该预留库存', async () => {
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await inventoryApi.reserve({
        productId: 'prod-1',
        quantity: 5,
        orderId: 'order-1',
      });

      expect(http.post).toHaveBeenCalledWith('/inventory/reserve', {
        productId: 'prod-1',
        quantity: 5,
        orderId: 'order-1',
      });
    });
  });

  describe('getLowStock', () => {
    it('应该获取低库存列表', async () => {
      const mockLowStock = [{ ...mockInventoryBalance, onHand: 5 }];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockLowStock);

      const result = await inventoryApi.getLowStock();

      expect(http.get).toHaveBeenCalledWith('/inventory/low-stock');
      expect(result).toEqual(mockLowStock);
    });
  });

  describe('getExpiringSoon', () => {
    it('应该获取即将过期商品', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await inventoryApi.getExpiringSoon(7);

      expect(http.get).toHaveBeenCalledWith('/inventory/expiring-soon', { params: { days: 7 } });
    });

    it('应该使用默认 30 天', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await inventoryApi.getExpiringSoon();

      expect(http.get).toHaveBeenCalledWith('/inventory/expiring-soon', { params: { days: 30 } });
    });
  });
});
