import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useToast } from '../lib/toast';

/**
 * API 请求抽象层
 *
 * 设计目标:
 * 1. 隐藏 react-query 的具体实现细节
 * 2. 提供统一的错误处理和加载状态
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
  gcTime?: number;
  /** 重试次数 */
  retry?: number | boolean;
  /** 成功回调 */
  onSuccess?: (data: TData) => void;
  /** 错误回调 */
  onError?: (error: TError) => void;
  /** 是否禁用自动错误提示 */
  silent?: boolean;
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
  /** 是否禁用自动错误提示 */
  silent?: boolean;
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
 */
export function useApiQuery<TData, TError = Error>(
  options: ApiQueryOptions<TData, TError>
): ApiQueryResult<TData, TError> {
  const { onSuccess, onError, silent, ...queryOptions } = options;
  const toast = useToast();

  const result = useQuery<TData, TError>({
    queryKey: queryOptions.queryKey,
    queryFn: queryOptions.queryFn,
    enabled: queryOptions.enabled,
    staleTime: queryOptions.staleTime,
    gcTime: queryOptions.gcTime,
    retry: queryOptions.retry,
    initialData: queryOptions.initialData,
    placeholderData: queryOptions.placeholderData,
  } as UseQueryOptions<TData, TError>);

  // 成功回调
  useEffect(() => {
    if (result.isSuccess && onSuccess) {
      onSuccess(result.data as TData);
    }
  }, [result.isSuccess, result.data, onSuccess]);

  // 错误处理 (自动提示 + 回调)
  useEffect(() => {
    if (result.isError) {
      if (onError) {
        onError(result.error as TError);
      }
      if (!silent) {
        const message = (result.error as Error)?.message || '数据加载失败';
        toast.error(message);
      }
    }
  }, [result.isError, result.error, onError, silent, toast]);

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
 */
export function useApiMutation<TData, TVariables, TError = Error>(
  options: ApiMutationOptions<TData, TVariables, TError>
): ApiMutationResult<TData, TVariables, TError> {
  const { silent, onError, ...mutationOptions } = options;
  const toast = useToast();

  const result = useMutation<TData, TError, TVariables>({
    ...mutationOptions,
    onError: (error, variables, _context) => {
      if (onError) {
        onError(error, variables);
      }
      if (!silent) {
        const message = (error as Error)?.message || '操作执行失败';
        toast.error(message);
      }
    },
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
 * useInvalidateQueries
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  return (queryKey: QueryKey) => {
    queryClient.invalidateQueries({ queryKey });
  };
}

/**
 * usePrefetchQuery
 */
export function usePrefetchQuery() {
  const queryClient = useQueryClient();
  return <TData>(options: { queryKey: QueryKey; queryFn: () => Promise<TData> }) => {
    queryClient.prefetchQuery(options);
  };
}
