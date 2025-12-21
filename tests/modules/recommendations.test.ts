/**
 * Recommendations API 测试
 */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { recsApi } from '../../modules/recommendations/api';
import { http } from '../../lib/http';

// Mock http 模块
vi.mock('../../lib/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Type-safe mock helpers
const mockHttpGet = http.get as Mock;
const mockHttpPost = http.post as Mock;
const mockHttpPatch = http.patch as Mock;
const mockHttpDelete = http.delete as Mock;

describe('recsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该调用 GET 请求获取推荐列表', async () => {
      const mockData = [
        { id: '1', productId: 'p1', tenantId: null, priority: 1, isEnabled: true },
        { id: '2', productId: 'p2', tenantId: 't1', priority: 2, isEnabled: false },
      ];
      mockHttpGet.mockResolvedValueOnce(mockData);

      const result = await recsApi.list();

      expect(http.get).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('应该传递筛选参数', async () => {
      mockHttpGet.mockResolvedValueOnce([]);

      await recsApi.list({ tenantId: 't1', isEnabled: true });

      expect(http.get).toHaveBeenCalledWith('/recommendations', {
        params: { tenantId: 't1', isEnabled: true },
      });
    });
  });

  describe('create', () => {
    it('应该调用 POST 请求创建推荐', async () => {
      const newRec = {
        productId: 'p3',
        tenantId: null,
        priority: 1,
        startAt: '2024-01-01',
        endAt: '2024-12-31',
        isEnabled: true,
      };
      const mockResult = { id: '3', ...newRec };
      mockHttpPost.mockResolvedValueOnce(mockResult);

      const result = await recsApi.create(newRec);

      expect(http.post).toHaveBeenCalledWith('/recommendations', newRec);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('应该调用 PATCH 请求更新推荐', async () => {
      const updates = { priority: 5 };
      mockHttpPatch.mockResolvedValueOnce({ id: '1', priority: 5 });

      await recsApi.update('1', updates);

      expect(http.patch).toHaveBeenCalledWith('/recommendations/1', updates);
    });
  });

  describe('delete', () => {
    it('应该调用 DELETE 请求删除推荐', async () => {
      mockHttpDelete.mockResolvedValueOnce(undefined);

      await recsApi.delete('1');

      expect(http.delete).toHaveBeenCalledWith('/recommendations/1');
    });
  });
});
