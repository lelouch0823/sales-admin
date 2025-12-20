import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

/**
 * React Query 客户端配置
 * 全局查询默认值：
 * - staleTime: 5分钟（数据被视为新鲜的时间）
 * - gcTime: 10分钟（缓存保留时间）
 * - retry: 3次（失败重试次数）
 * - refetchOnWindowFocus: false（窗口聚焦时不自动刷新）
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});

interface QueryProviderProps {
    children: React.ReactNode;
}

/**
 * QueryProvider 组件
 * 包装应用提供 react-query 功能
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
