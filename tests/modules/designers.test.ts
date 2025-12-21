/**
 * 设计师管理 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { designerApi } from '../../modules/designers/api';
import { http } from '../../lib/http';
import type { Designer, DesignerStats, PortfolioItem } from '../../modules/designers/types';

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

const mockDesigner: Designer = {
  id: 'designer-1',
  name: '张设计师',
  email: 'zhang@example.com',
  bio: '资深产品设计师',
  level: 'senior',
  skills: ['产品设计', '视觉设计'],
  status: 'active',
  totalProjects: 25,
};

const mockStats: DesignerStats = {
  totalDesigners: 20,
  activeDesigners: 18,
  byLevel: { junior: 5, mid: 8, senior: 5, lead: 2 },
};

const mockPortfolio: PortfolioItem[] = [
  {
    id: 'portfolio-1',
    title: '项目A',
    description: '产品设计项目',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'portfolio-2',
    title: '项目B',
    description: '视觉设计项目',
    createdAt: '2025-02-01T00:00:00Z',
  },
];

describe('designerApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('应该获取设计师列表', async () => {
      const mockDesigners = [mockDesigner];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockDesigners);

      const result = await designerApi.list();

      expect(http.get).toHaveBeenCalledWith('/designers', { params: undefined });
      expect(result).toEqual(mockDesigners);
    });

    it('应该支持级别筛选', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

      await designerApi.list({ level: 'senior' });

      expect(http.get).toHaveBeenCalledWith('/designers', { params: { level: 'senior' } });
    });
  });

  describe('get', () => {
    it('应该获取设计师详情', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockDesigner);

      const result = await designerApi.get('designer-1');

      expect(http.get).toHaveBeenCalledWith('/designers/designer-1');
      expect(result).toEqual(mockDesigner);
    });
  });

  describe('getStats', () => {
    it('应该获取设计师统计', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStats);

      const result = await designerApi.getStats();

      expect(http.get).toHaveBeenCalledWith('/designers/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getActive', () => {
    it('应该获取活跃设计师', async () => {
      const activeDesigners = [mockDesigner];
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(activeDesigners);

      const result = await designerApi.getActive();

      expect(http.get).toHaveBeenCalledWith('/designers/active');
      expect(result).toEqual(activeDesigners);
    });
  });

  describe('getPortfolio', () => {
    it('应该获取设计师作品集', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockPortfolio);

      const result = await designerApi.getPortfolio('designer-1');

      expect(http.get).toHaveBeenCalledWith('/designers/designer-1/portfolio');
      expect(result).toEqual(mockPortfolio);
      expect(result).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('应该创建设计师', async () => {
      const newDesigner = { name: '李设计师', email: 'li@example.com', level: 'mid' as const };
      const createdDesigner = { id: 'designer-2', ...newDesigner };
      (http.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(createdDesigner);

      const result = await designerApi.create(newDesigner);

      expect(http.post).toHaveBeenCalledWith('/designers', newDesigner);
      expect(result).toEqual(createdDesigner);
    });
  });

  describe('update', () => {
    it('应该更新设计师', async () => {
      const updates = { level: 'lead' as const, bio: '首席设计师' };
      const updatedDesigner = { ...mockDesigner, ...updates };
      (http.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(updatedDesigner);

      const result = await designerApi.update('designer-1', updates);

      expect(http.patch).toHaveBeenCalledWith('/designers/designer-1', updates);
      expect(result.level).toBe('lead');
    });
  });

  describe('delete', () => {
    it('应该删除设计师', async () => {
      (http.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      await designerApi.delete('designer-1');

      expect(http.delete).toHaveBeenCalledWith('/designers/designer-1');
    });
  });
});
