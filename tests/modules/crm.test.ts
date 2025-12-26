/**
 * CRM 客户管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crmApi } from '../../modules/crm/api';
import { http } from '../../lib/http';
import type { Customer } from '../../modules/crm/types';

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

const mockCustomer: Customer = {
  id: 'cust-1',
  name: '张三',
  phone: '13800138000',
  tags: ['VIP', '高价值'],
  ownerUserId: 'user-1',
  tenantId: 'tenant-1',
  lastInteraction: '2025-01-01T00:00:00Z',
  sharedWith: [],
  interactions: [],
};

describe('crmApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取客户列表', async () => {
      const mockCustomers = [mockCustomer];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockCustomers);

      const result = await crmApi.list();

      expect(http.get).toHaveBeenCalledWith('/customers', { params: undefined });
      expect(result).toEqual(mockCustomers);
    });

    it('应该支持关键词搜索', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await crmApi.list({ search: '张三' });

      expect(http.get).toHaveBeenCalledWith('/customers', { params: { search: '张三' } });
    });

    it('应该支持类型筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await crmApi.list({ type: 'VIP', tier: 'gold' });

      expect(http.get).toHaveBeenCalledWith('/customers', {
        params: { type: 'VIP', tier: 'gold' },
      });
    });

    it('应该支持归属人筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await crmApi.list({ assignedTo: 'user-1' });

      expect(http.get).toHaveBeenCalledWith('/customers', { params: { assignedTo: 'user-1' } });
    });
  });

  describe('get', () => {
    it('应该获取客户详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockCustomer);

      const result = await crmApi.get('cust-1');

      expect(http.get).toHaveBeenCalledWith('/customers/cust-1');
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('create', () => {
    it('应该创建客户', async () => {
      const newCustomer = { name: '李四', phone: '13900139000', tags: ['新客'] };
      const createdCustomer = { id: 'cust-2', ...newCustomer, ownerUserId: null, sharedWith: [] };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(createdCustomer);

      const result = await crmApi.create(newCustomer);

      expect(http.post).toHaveBeenCalledWith('/customers', newCustomer);
      expect(result).toEqual(createdCustomer);
    });
  });

  describe('update', () => {
    it('应该更新客户', async () => {
      const updateData = { name: '张三（更新）', tags: ['VIP', '高价值', '重点'] };
      const updatedCustomer = { ...mockCustomer, ...updateData };
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(updatedCustomer);

      const result = await crmApi.update('cust-1', updateData);

      expect(http.patch).toHaveBeenCalledWith('/customers/cust-1', updateData);
      expect(result).toEqual(updatedCustomer);
    });
  });

  describe('delete', () => {
    it('应该删除客户', async () => {
      (http.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await crmApi.delete('cust-1');

      expect(http.delete).toHaveBeenCalledWith('/customers/cust-1');
    });
  });
});
