/**
 * API 工厂测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCrudApi, createApiWithStats } from '../../lib/api-factory';
import { http } from '../../lib/http';

// Mock http 模块
vi.mock('../../lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
    HttpError: class HttpError extends Error {
        constructor(public status: number, message: string) {
            super(message);
        }
    },
}));

interface TestEntity {
    id: string;
    name: string;
    status: string;
}

interface TestStats {
    total: number;
    active: number;
}

describe('createCrudApi', () => {
    const api = createCrudApi<TestEntity>('/test-entities');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('list', () => {
        it('应该调用 GET 请求获取列表', async () => {
            const mockData: TestEntity[] = [
                { id: '1', name: 'Entity 1', status: 'active' },
                { id: '2', name: 'Entity 2', status: 'inactive' },
            ];
            (http.get as any).mockResolvedValueOnce(mockData);

            const result = await api.list();

            expect(http.get).toHaveBeenCalledWith('/test-entities', { params: undefined });
            expect(result).toEqual(mockData);
        });

        it('应该传递筛选参数', async () => {
            (http.get as any).mockResolvedValueOnce([]);

            await api.list({ page: 1, limit: 20, search: 'test' });

            expect(http.get).toHaveBeenCalledWith('/test-entities', {
                params: { page: 1, limit: 20, search: 'test' },
            });
        });
    });

    describe('listPaginated', () => {
        it('应该返回分页响应格式', async () => {
            const mockResponse = {
                data: [{ id: '1', name: 'Entity 1', status: 'active' }],
                pagination: { page: 1, limit: 20, total: 100, totalPages: 5 },
            };
            (http.get as any).mockResolvedValueOnce(mockResponse);

            const result = await api.listPaginated({ page: 1, limit: 20 });

            expect(result.data).toHaveLength(1);
            expect(result.pagination.total).toBe(100);
        });

        it('应该处理数组响应格式', async () => {
            const mockData: TestEntity[] = [{ id: '1', name: 'Entity 1', status: 'active' }];
            (http.get as any).mockResolvedValueOnce(mockData);

            const result = await api.listPaginated();

            expect(result.data).toEqual(mockData);
            expect(result.pagination.total).toBe(1);
        });
    });

    describe('get', () => {
        it('应该调用 GET 请求获取单条记录', async () => {
            const mockData: TestEntity = { id: '1', name: 'Entity 1', status: 'active' };
            (http.get as any).mockResolvedValueOnce(mockData);

            const result = await api.get('1');

            expect(http.get).toHaveBeenCalledWith('/test-entities/1');
            expect(result).toEqual(mockData);
        });
    });

    describe('create', () => {
        it('应该调用 POST 请求创建记录', async () => {
            const newData = { name: 'New Entity', status: 'active' };
            const mockResult: TestEntity = { id: '3', ...newData };
            (http.post as any).mockResolvedValueOnce(mockResult);

            const result = await api.create(newData);

            expect(http.post).toHaveBeenCalledWith('/test-entities', newData);
            expect(result).toEqual(mockResult);
        });
    });

    describe('update', () => {
        it('应该调用 PATCH 请求更新记录', async () => {
            const updates = { name: 'Updated Name' };
            const mockResult: TestEntity = { id: '1', name: 'Updated Name', status: 'active' };
            (http.patch as any).mockResolvedValueOnce(mockResult);

            const result = await api.update('1', updates);

            expect(http.patch).toHaveBeenCalledWith('/test-entities/1', updates);
            expect(result).toEqual(mockResult);
        });
    });

    describe('delete', () => {
        it('应该调用 DELETE 请求删除记录', async () => {
            (http.delete as any).mockResolvedValueOnce(undefined);

            await api.delete('1');

            expect(http.delete).toHaveBeenCalledWith('/test-entities/1');
        });
    });
});

describe('createApiWithStats', () => {
    const api = createApiWithStats<TestEntity, TestStats>('/test-entities');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('应该继承 CRUD 操作', async () => {
        const mockData: TestEntity[] = [{ id: '1', name: 'Entity 1', status: 'active' }];
        (http.get as any).mockResolvedValueOnce(mockData);

        const result = await api.list();

        expect(result).toEqual(mockData);
    });

    it('应该提供 getStats 方法', async () => {
        const mockStats: TestStats = { total: 100, active: 80 };
        (http.get as any).mockResolvedValueOnce(mockStats);

        const result = await api.getStats();

        expect(http.get).toHaveBeenCalledWith('/test-entities/stats');
        expect(result).toEqual(mockStats);
    });
});
