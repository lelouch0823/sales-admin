/**
 * API 服务工厂
 *
 * 提供通用的 CRUD API 生成函数，避免重复代码
 *
 * @example
 * const productApi = createCrudApi<Product>('/products');
 * const users = await productApi.list({ page: 1, limit: 20 });
 */

import { http, HttpError } from './http';

// ============ 类型定义 ============

/** 分页参数 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** 通用筛选参数（可被具体模块扩展） */
export interface BaseFilterParams extends PaginationParams {
  search?: string;
  status?: string;
}

/** CRUD API 接口 */
export interface CrudApi<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  FilterParams = BaseFilterParams,
> {
  /** 获取列表 */
  list: (params?: FilterParams) => Promise<T[]>;
  /** 获取分页列表 */
  listPaginated: (params?: FilterParams) => Promise<PaginatedResponse<T>>;
  /** 获取详情 */
  get: (id: string) => Promise<T>;
  /** 创建 */
  create: (data: CreateDto) => Promise<T>;
  /** 更新 */
  update: (id: string, data: UpdateDto) => Promise<T>;
  /** 删除 */
  delete: (id: string) => Promise<void>;
}

// ============ 工厂函数 ============

/**
 * 创建通用 CRUD API
 *
 * @param basePath - API 基础路径，如 '/products'
 * @returns CRUD API 对象
 */
import { db } from './db';

// 临时全局开关，实际应放入环境变量
export const USE_MOCK_API = true;

/**
 * 创建通用 CRUD API
 *
 * @param basePath - API 基础路径，如 '/products'
 * @param mockKey - (可选) 对应的 Mock DB 集合名称，如 'products'
 * @returns CRUD API 对象
 */
export function createCrudApi<
  T extends { id: string },
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  FilterParams extends BaseFilterParams = BaseFilterParams,
>(
  basePath: string,
  mockKey?: keyof (typeof db)['data']
): CrudApi<T, CreateDto, UpdateDto, FilterParams> {
  return {
    list: async (params?: FilterParams) => {
      if (USE_MOCK_API && mockKey) {
        // 简单的 Mock 实现：直接返回所有数据 (忽略筛选)
        await new Promise(r => setTimeout(r, 400));
        return db.get(mockKey) as unknown as T[];
      }
      return http.get<T[]>(basePath, {
        params: params as unknown as Record<string, string | number | boolean | undefined>,
      });
    },

    listPaginated: async (params?: FilterParams) => {
      if (USE_MOCK_API && mockKey) {
        await new Promise(r => setTimeout(r, 400));
        const all = db.get(mockKey) as unknown as T[];
        return {
          data: all,
          pagination: {
            page: 1,
            limit: 100,
            total: all.length,
            totalPages: 1,
          },
        };
      }
      // 后端返回带分页信息的响应
      const response = await http.get<T[] | PaginatedResponse<T>>(basePath, {
        params: params as unknown as Record<string, string | number | boolean | undefined>,
      });

      // 处理不同的响应格式
      if (Array.isArray(response)) {
        return {
          data: response,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.length,
            totalPages: 1,
          },
        };
      }
      return response;
    },

    get: async (id: string) => {
      if (USE_MOCK_API && mockKey) {
        await new Promise(r => setTimeout(r, 200));
        const item = (db.get(mockKey) as unknown as T[]).find(i => i.id === id);
        if (!item) throw new Error('Not found');
        return item;
      }
      return http.get<T>(`${basePath}/${id}`);
    },

    create: async (data: CreateDto) => {
      if (USE_MOCK_API && mockKey) {
        await new Promise(r => setTimeout(r, 600));
        const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) } as unknown as T;
        const list = db.get(mockKey) as unknown as T[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        db.set(mockKey, [...list, newItem] as any);
        return newItem;
      }
      return http.post<T>(basePath, data);
    },

    update: async (id: string, data: UpdateDto) => {
      if (USE_MOCK_API && mockKey) {
        await new Promise(r => setTimeout(r, 400));
        const list = db.get(mockKey) as unknown as T[];
        const index = list.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Not found');

        const updated = { ...list[index], ...data };
        list[index] = updated;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        db.set(mockKey, list as any);
        return updated;
      }
      return http.patch<T>(`${basePath}/${id}`, data);
    },

    delete: async (id: string) => {
      if (USE_MOCK_API && mockKey) {
        await new Promise(r => setTimeout(r, 400));
        const list = db.get(mockKey) as unknown as T[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        db.set(mockKey, list.filter(i => i.id !== id) as any);
        return;
      }
      return http.delete(`${basePath}/${id}`);
    },
  };
}

/**
 * 创建带统计的 API
 *
 * 扩展 CRUD API，添加统计接口
 */
export function createApiWithStats<
  T extends { id: string },
  Stats,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  FilterParams extends BaseFilterParams = BaseFilterParams,
>(basePath: string, mockKey?: keyof (typeof db)['data']) {
  const crud = createCrudApi<T, CreateDto, UpdateDto, FilterParams>(basePath, mockKey);

  return {
    ...crud,

    /** 获取统计数据 */
    getStats: async () => {
      if (USE_MOCK_API && mockKey) {
        await new Promise(r => setTimeout(r, 300));
        // Mock 简单的空统计数据，实际可根据 list 计算
        return {} as Stats;
      }
      return http.get<Stats>(`${basePath}/stats`);
    },
  };
}

// 导出 HttpError 供模块使用
export { HttpError };
