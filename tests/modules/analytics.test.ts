/**
 * 数据分析 API 测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsApi } from '../../modules/analytics/api';
import { http } from '../../lib/http';
import type {
  DashboardData,
  TrendsData,
  RealtimeData,
  Metrics,
} from '../../modules/analytics/types';

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

const mockDashboard: DashboardData = {
  overview: {
    totalRevenue: 100000,
    totalOrders: 500,
    totalCustomers: 200,
    totalProducts: 100,
    revenueGrowth: 15,
    orderGrowth: 10,
    customerGrowth: 8,
    conversionRate: 3.5,
    averageOrderValue: 200,
    customerLifetimeValue: 1000,
  },
  recentOrders: [],
  topProducts: [],
  alerts: [],
  charts: {
    salesTrend: [],
    userGrowth: [],
    topCategories: [],
    revenueByChannel: [],
    inventoryStatus: {},
    customerSegments: [],
  },
};

const mockMetrics: Metrics = {
  revenue: { total: 100000, growth: 15, target: 120000, achievement: 83.3 },
  orders: { total: 500, growth: 10, averageValue: 200, conversionRate: 3.5 },
  customers: { total: 200, new: 30, returning: 170, retentionRate: 0.85 },
  products: { total: 100, active: 90, topPerformer: {}, lowPerformer: {} },
  generatedAt: '2025-01-01T00:00:00Z',
};

describe('analyticsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('应该获取仪表板数据', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockDashboard);

      const result = await analyticsApi.getDashboard();

      expect(http.get).toHaveBeenCalledWith('/analytics/dashboard', { params: undefined });
      expect(result).toEqual(mockDashboard);
    });

    it('应该支持时间范围参数', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockDashboard);

      await analyticsApi.getDashboard({ timeRange: 'LAST_7_DAYS' });

      expect(http.get).toHaveBeenCalledWith('/analytics/dashboard', {
        params: { timeRange: 'LAST_7_DAYS' },
      });
    });

    it('应该支持自定义日期范围', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockDashboard);

      await analyticsApi.getDashboard({
        timeRange: 'CUSTOM',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      });

      expect(http.get).toHaveBeenCalledWith('/analytics/dashboard', {
        params: { timeRange: 'CUSTOM', startDate: '2025-01-01', endDate: '2025-01-31' },
      });
    });
  });

  describe('getComprehensive', () => {
    it('应该获取综合分析报告', async () => {
      const mockReport = {
        sales: {},
        users: {},
        products: {},
        summary: {},
        insights: [],
        generatedAt: '',
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockReport);

      const result = await analyticsApi.getComprehensive();

      expect(http.get).toHaveBeenCalledWith('/analytics/comprehensive');
      expect(result).toEqual(mockReport);
    });
  });

  describe('getTrends', () => {
    it('应该获取趋势分析', async () => {
      const mockTrends: TrendsData = {
        salesTrend: [],
        userGrowthTrend: [],
        productPerformanceTrend: [],
        seasonalPatterns: {
          hasSeasonality: false,
          pattern: 'stable',
          averageRevenue: 10000,
          recentAverageRevenue: 12000,
        },
        predictions: {
          available: true,
          nextDayRevenue: 15000,
          nextDayOrders: 50,
          confidence: 0.8,
          method: 'moving_average',
        },
        analysisDate: '2025-01-01T00:00:00Z',
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTrends);

      const result = await analyticsApi.getTrends();

      expect(http.get).toHaveBeenCalledWith('/analytics/trends');
      expect(result).toEqual(mockTrends);
    });
  });

  describe('getRealtime', () => {
    it('应该获取实时数据', async () => {
      const mockRealtime: RealtimeData = {
        onlineUsers: 150,
        todayRevenue: 25000,
        todayOrders: 80,
        todayNewUsers: 25,
        averageOrderValue: 312.5,
        conversionRate: 3.5,
        recentActivities: [],
        liveOrders: [],
        lastUpdated: '2025-01-01T12:00:00Z',
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockRealtime);

      const result = await analyticsApi.getRealtime();

      expect(http.get).toHaveBeenCalledWith('/analytics/realtime');
      expect(result).toEqual(mockRealtime);
    });
  });

  describe('getMetrics', () => {
    it('应该获取关键指标', async () => {
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockMetrics);

      const result = await analyticsApi.getMetrics();

      expect(http.get).toHaveBeenCalledWith('/analytics/metrics');
      expect(result).toEqual(mockMetrics);
    });
  });

  describe('getComparison', () => {
    it('应该获取对比分析', async () => {
      const mockComparison = {
        current: { sales: {}, users: {}, products: {}, summary: {} },
        comparison: { sales: {}, users: {}, products: {}, summary: {} },
        changes: { revenue: 15, orders: 10, customers: 8, averageOrderValue: 5 },
        insights: ['收入增长显著'],
        period: { current: 'LAST_30_DAYS' as const, comparison: 'LAST_MONTH' as const },
        generatedAt: '2025-01-01T00:00:00Z',
      };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockComparison);

      const result = await analyticsApi.getComparison({ compareWith: 'LAST_MONTH' });

      expect(http.get).toHaveBeenCalledWith('/analytics/comparison', {
        params: { compareWith: 'LAST_MONTH' },
      });
      expect(result).toEqual(mockComparison);
    });
  });

  describe('getSales', () => {
    it('应该获取销售报表', async () => {
      const mockSales = { summary: { totalSales: 100000 }, salesData: [], topPerformers: {} };
      (http.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSales);

      const result = await analyticsApi.getSales({ period: 'monthly' });

      expect(http.get).toHaveBeenCalledWith('/analytics/sales', {
        params: { period: 'monthly' },
      });
      expect(result).toEqual(mockSales);
    });
  });
});
