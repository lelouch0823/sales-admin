/**
 * 测试工具函数
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// 自定义渲染器，可以包装 Provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    // 可以在这里添加自定义选项
}

/**
 * 带有常用 Provider 的渲染函数
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: CustomRenderOptions
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        // 可以在这里添加 Provider 包装
        return <>{children}</>;
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...options }),
    };
}

// 重新导出 testing-library 的所有方法
export * from '@testing-library/react';
export { renderWithProviders as render };
