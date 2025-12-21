/**
 * 品牌管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { brandApi } from '../../modules/brands/api';
import { http } from '../../lib/http';
import type { Brand } from '../../modules/brands/types';

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

const mockBrand: Brand = {
  id: 'brand-1',
  name: '品牌A',
  nameEn: 'Brand A',
  description: '品牌描述',
  country: '意大利',
  foundedYear: 1980,
  productCount: 50,
};

describe('brandApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取品牌列表', async () => {
      const mockBrands = [mockBrand];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBrands);

      const result = await brandApi.list();

      expect(http.get).toHaveBeenCalledWith('/brands', { params: undefined });
      expect(result).toEqual(mockBrands);
    });

    it('应该支持国家筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await brandApi.list({ country: '德国' });

      expect(http.get).toHaveBeenCalledWith('/brands', { params: { country: '德国' } });
    });

    it('应该支持搜索和分页', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await brandApi.list({ search: '品牌', page: 1, limit: 20 });

      expect(http.get).toHaveBeenCalledWith('/brands', {
        params: { search: '品牌', page: 1, limit: 20 },
      });
    });
  });

  describe('get', () => {
    it('应该获取品牌详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBrand);

      const result = await brandApi.get('brand-1');

      expect(http.get).toHaveBeenCalledWith('/brands/brand-1');
      expect(result).toEqual(mockBrand);
    });
  });

  describe('create', () => {
    it('应该创建品牌', async () => {
      const newBrand = { name: '新品牌', nameEn: 'New Brand', country: '法国' };
      const createdBrand = { id: 'brand-2', ...newBrand };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(createdBrand);

      const result = await brandApi.create(newBrand);

      expect(http.post).toHaveBeenCalledWith('/brands', newBrand);
      expect(result).toEqual(createdBrand);
    });
  });

  describe('update', () => {
    it('应该更新品牌', async () => {
      const updates = { description: '更新后的描述' };
      const updatedBrand = { ...mockBrand, ...updates };
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(updatedBrand);

      const result = await brandApi.update('brand-1', updates);

      expect(http.patch).toHaveBeenCalledWith('/brands/brand-1', updates);
      expect(result.description).toBe('更新后的描述');
    });
  });

  describe('delete', () => {
    it('应该删除品牌', async () => {
      (http.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await brandApi.delete('brand-1');

      expect(http.delete).toHaveBeenCalledWith('/brands/brand-1');
    });
  });

  describe('getStats', () => {
    it('应该获取品牌统计', async () => {
      const mockStats = {
        totalBrands: 50,
        activeBrands: 45,
        inactiveBrands: 5,
        byCountry: [{ country: '意大利', count: 15 }],
        topBrands: [{ id: 'brand-1', name: '品牌A', productCount: 125 }],
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStats);

      const result = await brandApi.getStats();

      expect(http.get).toHaveBeenCalledWith('/brands/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('batchDelete', () => {
    it('应该批量删除品牌', async () => {
      const mockResult = { deletedCount: 3, failedCount: 0 };
      (http.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

      const result = await brandApi.batchDelete({ brandIds: ['brand-1', 'brand-2', 'brand-3'] });

      expect(http.delete).toHaveBeenCalledWith('/brands/batch', {
        data: { brandIds: ['brand-1', 'brand-2', 'brand-3'] },
      });
      expect(result.deletedCount).toBe(3);
    });
  });
});
