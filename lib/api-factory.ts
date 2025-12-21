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
export interface CrudApi<T, CreateDto = Partial<T>, UpdateDto = Partial<T>, FilterParams = BaseFilterParams> {
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
export function createCrudApi<
    T,
    CreateDto = Partial<T>,
    UpdateDto = Partial<T>,
    FilterParams extends BaseFilterParams = BaseFilterParams
>(basePath: string): CrudApi<T, CreateDto, UpdateDto, FilterParams> {
    return {
        list: async (params?: FilterParams) => {
            return http.get<T[]>(basePath, {
                params: params as unknown as Record<string, string | number | boolean | undefined>
            });
        },

        listPaginated: async (params?: FilterParams) => {
            // 后端返回带分页信息的响应
            const response = await http.get<T[] | PaginatedResponse<T>>(basePath, {
                params: params as unknown as Record<string, string | number | boolean | undefined>
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
            return http.get<T>(`${basePath}/${id}`);
        },

        create: async (data: CreateDto) => {
            return http.post<T>(basePath, data);
        },

        update: async (id: string, data: UpdateDto) => {
            return http.patch<T>(`${basePath}/${id}`, data);
        },

        delete: async (id: string) => {
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
    T,
    Stats,
    CreateDto = Partial<T>,
    UpdateDto = Partial<T>,
    FilterParams extends BaseFilterParams = BaseFilterParams
>(basePath: string) {
    const crud = createCrudApi<T, CreateDto, UpdateDto, FilterParams>(basePath);

    return {
        ...crud,

        /** 获取统计数据 */
        getStats: async () => {
            return http.get<Stats>(`${basePath}/stats`);
        },
    };
}

// 导出 HttpError 供模块使用
export { HttpError };
