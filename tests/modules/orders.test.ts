/**
 * 订单管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderApi } from '../../modules/orders/api';
import { http } from '../../lib/http';
import type { Order, OrderStats } from '../../modules/orders/types';

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

const mockOrder: Order = {
  id: 'order-1',
  orderNumber: 'ORD-20250101-001',
  customerId: 'customer-1',
  customerName: '张三',
  status: 'pending',
  items: [
    { productId: 'prod-1', productName: '产品A', quantity: 2, unitPrice: 100, totalPrice: 200 },
  ],
  totalAmount: 200,
  createdAt: '2025-01-01T00:00:00Z',
};

const mockStats: OrderStats = {
  totalOrders: 100,
  total: 100,
  totalRevenue: 50000,
  averageOrderValue: 500,
  todayOrders: 10,
  weekOrders: 50,
  monthOrders: 100,
  byStatus: {
    pending: 10,
    confirmed: 20,
    processing: 15,
    shipped: 25,
    delivered: 20,
    cancelled: 5,
    refunded: 3,
    failed: 1,
    returned: 1,
  },
  byPaymentStatus: { pending: 10, paid: 85, refunded: 5 },
  byShippingStatus: { pending: 15, shipped: 30, delivered: 50, returned: 5 },
  recentOrders: [],
  topCustomers: [],
};

describe('orderApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取订单列表', async () => {
      const mockOrders = [mockOrder];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrders);

      const result = await orderApi.list();

      expect(http.get).toHaveBeenCalledWith('/orders', { params: undefined });
      expect(result).toEqual(mockOrders);
    });

    it('应该支持筛选参数', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await orderApi.list({ status: 'pending', customerId: 'customer-1' });

      expect(http.get).toHaveBeenCalledWith('/orders', {
        params: { status: 'pending', customerId: 'customer-1' },
      });
    });
  });

  describe('get', () => {
    it('应该获取订单详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

      const result = await orderApi.get('order-1');

      expect(http.get).toHaveBeenCalledWith('/orders/order-1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getStats', () => {
    it('应该获取订单统计', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStats);

      const result = await orderApi.getStats();

      expect(http.get).toHaveBeenCalledWith('/orders/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('updateStatus', () => {
    it('应该更新订单状态', async () => {
      const updatedOrder = { ...mockOrder, status: 'confirmed' as const };
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(updatedOrder);

      const result = await orderApi.updateStatus('order-1', { status: 'confirmed' });

      expect(http.patch).toHaveBeenCalledWith('/orders/order-1/status', { status: 'confirmed' });
      expect(result.status).toBe('confirmed');
    });

    it('应该支持备注参数', async () => {
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

      await orderApi.updateStatus('order-1', { status: 'processing', notes: '开始处理' });

      expect(http.patch).toHaveBeenCalledWith('/orders/order-1/status', {
        status: 'processing',
        notes: '开始处理',
      });
    });
  });

  describe('batchUpdateStatus', () => {
    it('应该批量更新订单状态', async () => {
      const mockResult = { updatedCount: 3, failedCount: 0 };
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

      const result = await orderApi.batchUpdateStatus({
        orderIds: ['order-1', 'order-2', 'order-3'],
        status: 'processing',
        notes: '批量处理',
      });

      expect(http.patch).toHaveBeenCalledWith('/orders/batch-status', {
        orderIds: ['order-1', 'order-2', 'order-3'],
        status: 'processing',
        notes: '批量处理',
      });
      expect(result.updatedCount).toBe(3);
    });
  });

  describe('getItems', () => {
    it('应该获取订单商品明细', async () => {
      const mockItems = [
        { productId: 'prod-1', productName: '产品A', quantity: 2, unitPrice: 100, totalPrice: 200 },
      ];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockItems);

      const result = await orderApi.getItems('order-1');

      expect(http.get).toHaveBeenCalledWith('/orders/order-1/items');
      expect(result).toEqual(mockItems);
    });
  });

  describe('getLogs', () => {
    it('应该获取订单操作日志', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          action: 'status_change',
          fromStatus: 'pending',
          toStatus: 'confirmed',
          operator: { id: 'user-1', name: '管理员' },
          createdAt: '2025-01-01T12:30:00Z',
        },
      ];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockLogs);

      const result = await orderApi.getLogs('order-1');

      expect(http.get).toHaveBeenCalledWith('/orders/order-1/logs');
      expect(result).toEqual(mockLogs);
    });
  });

  describe('create', () => {
    it('应该创建订单', async () => {
      const createRequest = {
        customerId: 'customer-1',
        items: [{ productId: 'prod-1', quantity: 2 }],
        shippingAddress: {
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: 'xxx街道',
          receiverName: '张三',
          receiverPhone: '13800138000',
        },
      };
      const createdOrder = { id: 'order-2', orderNumber: 'ORD-20250101-002', status: 'pending' };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(createdOrder);

      const result = await orderApi.create(createRequest);

      expect(http.post).toHaveBeenCalledWith('/orders', createRequest);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('delete', () => {
    it('应该删除订单', async () => {
      (http.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await orderApi.delete('order-1');

      expect(http.delete).toHaveBeenCalledWith('/orders/order-1');
    });
  });
});
