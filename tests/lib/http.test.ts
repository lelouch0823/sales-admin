/**
 * HTTP 客户端测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpError, tokenManager } from '../../lib/http';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('http 客户端', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        localStorageMock.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('GET 请求', () => {
        it('应该发送 GET 请求并返回数据', async () => {
            const mockData = { id: '1', name: 'Test' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: mockData }),
            });

            const result = await http.get<typeof mockData>('/test');

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockData);
        });

        it('应该携带查询参数', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: [] }),
            });

            await http.get('/users', { params: { page: 1, limit: 20 } });

            const calledUrl = mockFetch.mock.calls[0][0];
            expect(calledUrl).toContain('page=1');
            expect(calledUrl).toContain('limit=20');
        });

        it('应该过滤 undefined 参数', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: [] }),
            });

            await http.get('/users', { params: { page: 1, status: undefined } });

            const calledUrl = mockFetch.mock.calls[0][0];
            expect(calledUrl).toContain('page=1');
            expect(calledUrl).not.toContain('status');
        });
    });

    describe('POST 请求', () => {
        it('应该发送 POST 请求并携带请求体', async () => {
            const mockData = { id: '1', name: 'Created' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: mockData }),
            });

            const result = await http.post<typeof mockData>('/users', { name: 'Test' });

            expect(result).toEqual(mockData);
            const [url, options] = mockFetch.mock.calls[0];
            expect(options.method).toBe('POST');
            expect(options.body).toBe(JSON.stringify({ name: 'Test' }));
        });
    });

    describe('Token 管理', () => {
        it('应该自动添加 Authorization header', async () => {
            tokenManager.setAccessToken('test-token');
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: {} }),
            });

            await http.get('/protected');

            const [, options] = mockFetch.mock.calls[0];
            expect(options.headers.get('Authorization')).toBe('Bearer test-token');
        });

        it('skipAuth 选项应该跳过认证', async () => {
            tokenManager.setAccessToken('test-token');
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: {} }),
            });

            await http.get('/public', { skipAuth: true });

            const [, options] = mockFetch.mock.calls[0];
            expect(options.headers.get('Authorization')).toBeNull();
        });
    });

    describe('错误处理', () => {
        it('应该抛出 HttpError 当响应不成功时', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: false, message: 'Resource not found' }),
            });

            await expect(http.get('/not-found')).rejects.toThrow(HttpError);
        });

        it('应该包含正确的错误状态码', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: false, message: 'Resource not found' }),
            });

            try {
                await http.get('/not-found');
            } catch (e) {
                expect(e).toBeInstanceOf(HttpError);
                expect((e as HttpError).status).toBe(404);
            }
        });

        it('应该抛出 HttpError 当 success: false 时', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: false, message: '业务错误' }),
            });

            await expect(http.get('/business-error')).rejects.toThrow('业务错误');
        });
    });

    describe('响应解包', () => {
        it('应该解包标准 API 响应格式', async () => {
            const mockData = { users: [{ id: '1' }] };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: mockData }),
            });

            const result = await http.get('/users');
            expect(result).toEqual(mockData);
        });

        it('应该处理非标准响应格式', async () => {
            const mockData = { items: [1, 2, 3] };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => mockData,
            });

            const result = await http.get('/legacy');
            expect(result).toEqual(mockData);
        });
    });
});

describe('tokenManager', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('应该存储和获取 access token', () => {
        tokenManager.setAccessToken('access-123');
        expect(tokenManager.getAccessToken()).toBe('access-123');
    });

    it('应该存储和获取 refresh token', () => {
        tokenManager.setRefreshToken('refresh-456');
        expect(tokenManager.getRefreshToken()).toBe('refresh-456');
    });

    it('应该清除所有 tokens', () => {
        tokenManager.setAccessToken('access-123');
        tokenManager.setRefreshToken('refresh-456');
        tokenManager.clearTokens();
        expect(tokenManager.getAccessToken()).toBeNull();
        expect(tokenManager.getRefreshToken()).toBeNull();
    });
});

describe('http 重试机制', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        localStorageMock.clear();
    });

    it('应该在配置 retries 时进行重试', async () => {
        // 第一次失败 (500)，第二次成功
        mockFetch
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: false, message: 'Server Error' }),
            })
            .mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: { id: '1' } }),
            });

        const result = await http.get('/test', { retries: 1, retryDelay: 10 });

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ id: '1' });
    });

    it('应该在达到最大重试次数后抛出错误', async () => {
        // 所有请求都失败
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ success: false, message: 'Server Error' }),
        });

        await expect(http.get('/test', { retries: 2, retryDelay: 10 }))
            .rejects.toThrow(HttpError);

        expect(mockFetch).toHaveBeenCalledTimes(3); // 初始 + 2 次重试
    });

    it('不应该重试 4xx 客户端错误', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ success: false, message: 'Invalid input' }),
        });

        await expect(http.get('/test', { retries: 2, retryDelay: 10 }))
            .rejects.toThrow('Invalid input');

        expect(mockFetch).toHaveBeenCalledTimes(1); // 不重试
    });

    it('应该支持自定义 shouldRetry 函数', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: false, message: 'Retry me' }),
            })
            .mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ success: true, data: 'ok' }),
            });

        const result = await http.get('/test', {
            retries: 1,
            retryDelay: 10,
            shouldRetry: (error) => error.message === 'Retry me',
        });

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toBe('ok');
    });
});
