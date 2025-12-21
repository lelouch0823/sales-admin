/**
 * 系列管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collectionApi } from '../../modules/collections/api';
import { http } from '../../lib/http';
import type { Collection, CollectionStats } from '../../modules/collections/types';

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

const mockCollection: Collection = {
  id: 'collection-1',
  name: '春季新品系列',
  description: '2025年春季新品',
  brand: { id: 'brand-1', name: '品牌A' },
  designer: { id: 'designer-1', name: '设计师A' },
  status: 'active',
  productCount: 15,
};

const mockStats: CollectionStats = {
  totalCollections: 50,
  activeCollections: 42,
};

describe('collectionApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取系列列表', async () => {
      const mockCollections = [mockCollection];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockCollections);

      const result = await collectionApi.list();

      expect(http.get).toHaveBeenCalledWith('/collections', { params: undefined });
      expect(result).toEqual(mockCollections);
    });

    it('应该支持品牌筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await collectionApi.list({ brandId: 'brand-1' });

      expect(http.get).toHaveBeenCalledWith('/collections', { params: { brandId: 'brand-1' } });
    });

    it('应该支持设计师筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await collectionApi.list({ designerId: 'designer-1', status: 'active' });

      expect(http.get).toHaveBeenCalledWith('/collections', {
        params: { designerId: 'designer-1', status: 'active' },
      });
    });
  });

  describe('get', () => {
    it('应该获取系列详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockCollection);

      const result = await collectionApi.get('collection-1');

      expect(http.get).toHaveBeenCalledWith('/collections/collection-1');
      expect(result).toEqual(mockCollection);
    });
  });

  describe('getStats', () => {
    it('应该获取系列统计', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStats);

      const result = await collectionApi.getStats();

      expect(http.get).toHaveBeenCalledWith('/collections/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getActive', () => {
    it('应该获取活跃系列', async () => {
      const activeCollections = [mockCollection];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(activeCollections);

      const result = await collectionApi.getActive();

      expect(http.get).toHaveBeenCalledWith('/collections/active');
      expect(result).toEqual(activeCollections);
    });
  });

  describe('getByBrand', () => {
    it('应该根据品牌获取系列', async () => {
      const brandCollections = [mockCollection];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(brandCollections);

      const result = await collectionApi.getByBrand('brand-1');

      expect(http.get).toHaveBeenCalledWith('/collections/by-brand/brand-1');
      expect(result).toEqual(brandCollections);
    });
  });

  describe('getByDesigner', () => {
    it('应该根据设计师获取系列', async () => {
      const designerCollections = [mockCollection];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(designerCollections);

      const result = await collectionApi.getByDesigner('designer-1');

      expect(http.get).toHaveBeenCalledWith('/collections/by-designer/designer-1');
      expect(result).toEqual(designerCollections);
    });
  });

  describe('create', () => {
    it('应该创建系列', async () => {
      const newCollection = { name: '夏季系列', brandId: 'brand-1' };
      const createdCollection = { id: 'collection-2', ...newCollection, status: 'active' as const };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(createdCollection);

      const result = await collectionApi.create(newCollection);

      expect(http.post).toHaveBeenCalledWith('/collections', newCollection);
      expect(result).toEqual(createdCollection);
    });
  });

  describe('delete', () => {
    it('应该删除系列', async () => {
      (http.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await collectionApi.delete('collection-1');

      expect(http.delete).toHaveBeenCalledWith('/collections/collection-1');
    });
  });

  describe('batchUpdateStatus', () => {
    it('应该批量更新系列状态', async () => {
      const mockResult = { updatedCount: 2, failedCount: 0 };
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

      const result = await collectionApi.batchUpdateStatus({
        collectionIds: ['collection-1', 'collection-2'],
        status: 'inactive',
      });

      expect(http.patch).toHaveBeenCalledWith('/collections/batch-status', {
        collectionIds: ['collection-1', 'collection-2'],
        status: 'inactive',
      });
      expect(result.updatedCount).toBe(2);
    });
  });
});
