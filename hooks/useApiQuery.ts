import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
    QueryKey,
} from '@tanstack/react-query';

/**
 * API 请求抽象层
 * 
 * 设计目标:
 * 1. 隐藏 react-query 的具体实现细节
 * 2. 提供统一的错误处理和加载状态
 * 3. 方便未来切换到 SWR 或其他数据请求库
 * 
 * @example
 * // 查询
 * const { data, isLoading, error } = useApiQuery({
 *   queryKey: ['users'],
 *   queryFn: () => api.getUsers()
 * });
 * 
 * // 变更
 * const { mutate, isPending } = useApiMutation({
 *   mutationFn: (data) => api.createUser(data),
 *   onSuccess: () => invalidate(['users'])
 * });
 */

// --- 类型定义 ---

export interface ApiQueryOptions<TData, TError = Error> {
    /** 查询键，用于缓存标识 */
    queryKey: QueryKey;
    /** 查询函数 */
    queryFn: () => Promise<TData>;
    /** 是否启用查询 */
    enabled?: boolean;
    /** 数据过期时间 (毫秒) */
    staleTime?: number;
    /** 缓存时间 (毫秒) */
    cacheTime?: number;
    /** 重试次数 */
    retry?: number | boolean;
    /** 成功回调 */
    onSuccess?: (data: TData) => void;
    /** 错误回调 */
    onError?: (error: TError) => void;
    /** 初始数据 */
    initialData?: TData;
    /** 占位数据 */
    placeholderData?: TData;
}

export interface ApiMutationOptions<TData, TVariables, TError = Error> {
    /** 变更函数 */
    mutationFn: (variables: TVariables) => Promise<TData>;
    /** 成功回调 */
    onSuccess?: (data: TData, variables: TVariables) => void;
    /** 错误回调 */
    onError?: (error: TError, variables: TVariables) => void;
    /** 完成回调 (无论成功失败) */
    onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
    /** 重试次数 */
    retry?: number | boolean;
}

export interface ApiQueryResult<TData, TError = Error> {
    data: TData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: TError | null;
    isFetching: boolean;
    isSuccess: boolean;
    refetch: () => void;
}

export interface ApiMutationResult<TData, TVariables, TError = Error> {
    mutate: (variables: TVariables) => void;
    mutateAsync: (variables: TVariables) => Promise<TData>;
    isPending: boolean;
    isError: boolean;
    error: TError | null;
    isSuccess: boolean;
    data: TData | undefined;
    reset: () => void;
}

// --- Hooks ---

/**
 * useApiQuery - 数据查询 Hook
 * 
 * 封装 react-query 的 useQuery，提供统一的 API
 */
export function useApiQuery<TData, TError = Error>(
    options: ApiQueryOptions<TData, TError>
): ApiQueryResult<TData, TError> {
    const result = useQuery<TData, TError>({
        queryKey: options.queryKey,
        queryFn: options.queryFn,
        enabled: options.enabled,
        staleTime: options.staleTime,
        gcTime: options.cacheTime,
        retry: options.retry,
        initialData: options.initialData,
        placeholderData: options.placeholderData,
    } as UseQueryOptions<TData, TError>);

    // 调用成功/失败回调
    if (result.isSuccess && options.onSuccess) {
        options.onSuccess(result.data as TData);
    }
    if (result.isError && options.onError) {
        options.onError(result.error as TError);
    }

    return {
        data: result.data,
        isLoading: result.isLoading,
        isError: result.isError,
        error: result.error,
        isFetching: result.isFetching,
        isSuccess: result.isSuccess,
        refetch: result.refetch,
    };
}

/**
 * useApiMutation - 数据变更 Hook
 * 
 * 封装 react-query 的 useMutation，提供统一的 API
 */
export function useApiMutation<TData, TVariables, TError = Error>(
    options: ApiMutationOptions<TData, TVariables, TError>
): ApiMutationResult<TData, TVariables, TError> {
    const result = useMutation<TData, TError, TVariables>({
        mutationFn: options.mutationFn,
        onSuccess: options.onSuccess,
        onError: options.onError,
        onSettled: options.onSettled,
        retry: options.retry,
    } as UseMutationOptions<TData, TError, TVariables>);

    return {
        mutate: result.mutate,
        mutateAsync: result.mutateAsync,
        isPending: result.isPending,
        isError: result.isError,
        error: result.error,
        isSuccess: result.isSuccess,
        data: result.data,
        reset: result.reset,
    };
}

/**
 * useInvalidateQueries - 使查询缓存失效
 * 
 * 返回一个函数用于使指定查询键的缓存失效
 */
export function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return (queryKey: QueryKey) => {
        queryClient.invalidateQueries({ queryKey });
    };
}

/**
 * usePrefetchQuery - 预取查询数据
 * 
 * 返回一个函数用于预取指定查询
 */
export function usePrefetchQuery() {
    const queryClient = useQueryClient();

    return <TData>(options: { queryKey: QueryKey; queryFn: () => Promise<TData> }) => {
        queryClient.prefetchQuery(options);
    };
}
