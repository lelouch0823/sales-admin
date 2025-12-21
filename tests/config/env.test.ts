/**
 * 环境配置模块测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 注意：由于模块缓存，这些测试需要谨慎处理
describe('env 模块', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('应该导出环境配置对象', async () => {
        const { env } = await import('../../config/env');

        expect(env).toBeDefined();
        expect(typeof env.apiBaseUrl).toBe('string');
        expect(typeof env.isDevelopment).toBe('boolean');
        expect(typeof env.isProduction).toBe('boolean');
        expect(typeof env.useMock).toBe('boolean');
        expect(typeof env.apiTimeout).toBe('number');
    });

    it('apiBaseUrl 应该包含 localhost 或有效 URL', async () => {
        const { env } = await import('../../config/env');

        // 应该是有效的 URL 格式
        expect(env.apiBaseUrl).toMatch(/^https?:\/\//);
    });

    it('apiTimeout 应该是合理的数值', async () => {
        const { env } = await import('../../config/env');

        expect(env.apiTimeout).toBeGreaterThan(0);
        expect(env.apiTimeout).toBeLessThanOrEqual(60000); // 最大 60 秒
    });

    it('isDevelopment 和 isProduction 应该互斥', async () => {
        const { env } = await import('../../config/env');

        // 不能同时为 true
        expect(env.isDevelopment && env.isProduction).toBe(false);
    });

    it('应该导出 logEnvInfo 函数', async () => {
        const { logEnvInfo } = await import('../../config/env');

        expect(typeof logEnvInfo).toBe('function');
        // 调用不应抛出错误
        expect(() => logEnvInfo()).not.toThrow();
    });

    it('应该导出 ENV 常量', async () => {
        const { ENV } = await import('../../config/env');

        expect(['development', 'test', 'staging', 'production']).toContain(ENV);
    });
});
