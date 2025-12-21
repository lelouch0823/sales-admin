/**
 * 仓库管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { warehouseApi, transferOrderApi } from '../../modules/warehouse/api';
import { http } from '../../lib/http';
import type { Warehouse, TransferOrder } from '../../modules/warehouse/types';

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

const mockWarehouse: Warehouse = {
  id: 'wh-1',
  code: 'WH-BJ-001',
  name: '北京总仓',
  type: 'CENTRAL',
  level: 0,
  isActive: true,
  isTransferSource: true,
};

const mockTransferOrder: TransferOrder = {
  id: 'to-1',
  orderNumber: 'TO-20250101-001',
  sourceWarehouse: { id: 'wh-1', name: '北京总仓' },
  targetWarehouse: { id: 'wh-2', name: '上海区域仓' },
  items: [{ productId: 'prod-1', quantity: 10 }],
  status: 'pending',
  priority: 'normal',
  createdAt: '2025-01-01T00:00:00Z',
};

describe('warehouseApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取仓库列表', async () => {
      const mockWarehouses = [mockWarehouse];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockWarehouses);

      const result = await warehouseApi.list();

      expect(http.get).toHaveBeenCalledWith('/admin/warehouses', { params: undefined });
      expect(result).toEqual(mockWarehouses);
    });

    it('应该支持类型筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await warehouseApi.list({ type: 'REGIONAL' });

      expect(http.get).toHaveBeenCalledWith('/admin/warehouses', { params: { type: 'REGIONAL' } });
    });

    it('应该支持关键词搜索', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await warehouseApi.list({ keyword: '北京', isActive: true });

      expect(http.get).toHaveBeenCalledWith('/admin/warehouses', {
        params: { keyword: '北京', isActive: true },
      });
    });
  });

  describe('listPaginated', () => {
    it('应该获取分页仓库列表', async () => {
      const mockResponse = {
        items: [mockWarehouse],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await warehouseApi.listPaginated({ page: 1, limit: 20 });

      expect(result.data).toEqual([mockWarehouse]);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('get', () => {
    it('应该获取仓库详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockWarehouse);

      const result = await warehouseApi.get('wh-1');

      expect(http.get).toHaveBeenCalledWith('/admin/warehouses/wh-1');
      expect(result).toEqual(mockWarehouse);
    });
  });

  describe('getTree', () => {
    it('应该获取仓库层级树', async () => {
      const mockTree = [{ ...mockWarehouse, children: [{ id: 'wh-2', name: '子仓库' }] }];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTree);

      const result = await warehouseApi.getTree();

      expect(http.get).toHaveBeenCalledWith('/admin/warehouses/tree');
      expect(result).toEqual(mockTree);
    });
  });

  describe('getTransferSources', () => {
    it('应该获取可调货源仓库', async () => {
      const mockSources = [mockWarehouse];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSources);

      const result = await warehouseApi.getTransferSources('wh-2');

      expect(http.get).toHaveBeenCalledWith('/admin/warehouses/wh-2/transfer-sources');
      expect(result).toEqual(mockSources);
    });
  });

  describe('create', () => {
    it('应该创建仓库', async () => {
      const newWarehouse = { code: 'WH-SH-001', name: '上海区域仓', type: 'REGIONAL' as const };
      const createdWarehouse = {
        id: 'wh-2',
        ...newWarehouse,
        level: 1,
        isActive: true,
        isTransferSource: false,
      };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(createdWarehouse);

      const result = await warehouseApi.create(newWarehouse);

      expect(http.post).toHaveBeenCalledWith('/admin/warehouses', newWarehouse);
      expect(result).toEqual(createdWarehouse);
    });
  });
});

describe('transferOrderApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取调货单列表', async () => {
      const mockOrders = [mockTransferOrder];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrders);

      const result = await transferOrderApi.list();

      expect(http.get).toHaveBeenCalledWith('/admin/transfer-orders', { params: undefined });
      expect(result).toEqual(mockOrders);
    });

    it('应该支持状态筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await transferOrderApi.list({ status: 'approved', priority: 'high' });

      expect(http.get).toHaveBeenCalledWith('/admin/transfer-orders', {
        params: { status: 'approved', priority: 'high' },
      });
    });
  });

  describe('listPaginated', () => {
    it('应该获取分页调货单列表', async () => {
      const mockResponse = {
        data: [mockTransferOrder],
        pagination: { page: 1, limit: 20, total: 50, totalPages: 3 },
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await transferOrderApi.listPaginated({ page: 1, limit: 20 });

      expect(result.data).toEqual([mockTransferOrder]);
      expect(result.pagination.total).toBe(50);
    });
  });

  describe('get', () => {
    it('应该获取调货单详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTransferOrder);

      const result = await transferOrderApi.get('to-1');

      expect(http.get).toHaveBeenCalledWith('/admin/transfer-orders/to-1');
      expect(result).toEqual(mockTransferOrder);
    });
  });

  describe('create', () => {
    it('应该创建调货单', async () => {
      const request = {
        sourceWarehouseId: 'wh-1',
        targetWarehouseId: 'wh-2',
        items: [{ productId: 'prod-1', quantity: 10 }],
        priority: 'high' as const,
      };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTransferOrder);

      const result = await transferOrderApi.create(request);

      expect(http.post).toHaveBeenCalledWith('/admin/transfer-orders', request);
      expect(result).toEqual(mockTransferOrder);
    });
  });

  describe('submit', () => {
    it('应该提交调货单审批', async () => {
      const submittedOrder = { ...mockTransferOrder, status: 'pending' as const };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(submittedOrder);

      const result = await transferOrderApi.submit('to-1');

      expect(http.post).toHaveBeenCalledWith('/admin/transfer-orders/to-1/submit');
      expect(result).toEqual(submittedOrder);
    });
  });

  describe('approve', () => {
    it('应该审批通过调货单', async () => {
      const approvedOrder = { ...mockTransferOrder, status: 'approved' as const };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(approvedOrder);

      const result = await transferOrderApi.approve('to-1');

      expect(http.post).toHaveBeenCalledWith('/admin/transfer-orders/to-1/approve');
      expect(result.status).toBe('approved');
    });
  });

  describe('ship', () => {
    it('应该发货调货单', async () => {
      const shippedOrder = { ...mockTransferOrder, status: 'shipped' as const };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(shippedOrder);

      const result = await transferOrderApi.ship('to-1');

      expect(http.post).toHaveBeenCalledWith('/admin/transfer-orders/to-1/ship');
      expect(result.status).toBe('shipped');
    });
  });

  describe('receive', () => {
    it('应该确认收货', async () => {
      const receiveRequest = {
        items: [{ productId: 'prod-1', receivedQuantity: 10, notes: '完好' }],
      };
      const receivedOrder = { ...mockTransferOrder, status: 'received' as const };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(receivedOrder);

      const result = await transferOrderApi.receive('to-1', receiveRequest);

      expect(http.post).toHaveBeenCalledWith('/admin/transfer-orders/to-1/receive', receiveRequest);
      expect(result.status).toBe('received');
    });
  });
});
