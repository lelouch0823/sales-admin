/**
 * HTTP 客户端层
 *
 * 统一封装所有 HTTP 请求，提供：
 * 1. 自动添加 Bearer Token
 * 2. 标准化响应解包 ({ success, data } -> data)
 * 3. 统一错误处理
 * 4. Token 自动刷新机制
 *
 * @example
 * const data = await http.get<User[]>('/users');
 * const created = await http.post<User>('/users', { name: 'John' });
 */

import { API_CONFIG, STORAGE_KEYS } from '../constants/api';

// ============ 类型定义 ============

/** 后端标准响应格式 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** HTTP 请求配置 */
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  /** 查询参数 */
  params?: Record<string, string | number | boolean | undefined>;
  /** 请求超时时间 (ms) */
  timeout?: number;
  /** 是否跳过认证 */
  skipAuth?: boolean;
  /** 重试次数 (默认 0，不重试) */
  retries?: number;
  /** 重试延迟 (ms，默认 1000) */
  retryDelay?: number;
  /** 是否重试 (自定义判断逻辑) */
  shouldRetry?: (error: HttpError, attempt: number) => boolean;
}

/** HTTP 错误 */
export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// ============ Token 管理 ============

const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem('refresh_token', token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem('refresh_token');
  }
};

// ============ 核心请求函数 ============

/**
 * 构建完整 URL（包含查询参数）
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * 创建请求 Headers
 */
function createHeaders(config: RequestConfig): Headers {
  const headers = new Headers(config.headers as HeadersInit);

  // 默认 Content-Type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 自动添加 Authorization
  if (!config.skipAuth) {
    const token = tokenManager.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
}

/**
 * 处理响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // 解析响应体
  const contentType = response.headers.get('Content-Type');
  let body: unknown;

  if (contentType?.includes('application/json')) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  // 处理错误响应
  if (!response.ok) {
    const message = (body as ApiResponse<unknown>)?.message || response.statusText || '请求失败';
    throw new HttpError(response.status, message, body);
  }

  // 解包标准响应格式
  const apiResponse = body as ApiResponse<T>;
  if (apiResponse && typeof apiResponse === 'object' && 'success' in apiResponse) {
    if (!apiResponse.success) {
      throw new HttpError(response.status, apiResponse.message || '操作失败', body);
    }
    return apiResponse.data;
  }

  // 非标准格式直接返回
  return body as T;
}

/**
 * 带超时的 fetch
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============ 重试相关 ============

/** 默认重试判断：对网络错误和 5xx 服务器错误重试 */
function defaultShouldRetry(error: HttpError, _attempt: number): boolean {
  // 网络错误 (status = 0) 或服务器错误 (5xx) 可重试
  return error.status === 0 || (error.status >= 500 && error.status < 600);
}

/** 延迟函数 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 核心请求函数（内部实现，不含重试）
 */
async function requestInternal<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  const url = buildUrl(endpoint, config.params);
  const headers = createHeaders(config);
  const timeout = config.timeout || API_CONFIG.TIMEOUT;

  const init: RequestInit = {
    method,
    headers,
    ...config,
  };

  // 添加请求体
  if (data !== undefined && method !== 'GET' && method !== 'HEAD') {
    init.body = JSON.stringify(data);
  }

  try {
    const response = await fetchWithTimeout(url, init, timeout);

    // Token 过期处理 (401)
    if (response.status === 401 && !config.skipAuth) {
      // 尝试刷新 Token
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // 重试请求（不计入重试次数）
        return requestInternal(method, endpoint, data, config);
      }
      // 刷新失败，清除 Token 并抛出错误
      tokenManager.clearTokens();
      throw new HttpError(401, '登录已过期，请重新登录');
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError(408, '请求超时');
    }
    throw new HttpError(0, (error as Error).message || '网络错误');
  }
}

/**
 * 带重试机制的请求函数
 */
async function request<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  const maxRetries = config.retries ?? 0;
  const retryDelay = config.retryDelay ?? API_CONFIG.RETRY_DELAY;
  const shouldRetry = config.shouldRetry ?? defaultShouldRetry;

  let lastError: HttpError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestInternal<T>(method, endpoint, data, config);
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      lastError = error;

      // 判断是否应该重试
      if (attempt < maxRetries && shouldRetry(error, attempt + 1)) {
        // 指数退避
        const backoffDelay = retryDelay * Math.pow(2, attempt);
        await delay(Math.min(backoffDelay, 10000)); // 最大 10 秒
        continue;
      }

      throw error;
    }
  }

  // 理论上不会到达这里，但 TypeScript 需要
  throw lastError || new HttpError(0, '未知错误');
}

/**
 * 尝试刷新 Token
 */
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  // 防止并发刷新
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json() as ApiResponse<{
        accessToken: string;
        refreshToken: string;
      }>;

      if (result.success && result.data) {
        tokenManager.setAccessToken(result.data.accessToken);
        tokenManager.setRefreshToken(result.data.refreshToken);
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ============ 导出 HTTP 客户端 ============

export const http = {
  /**
   * GET 请求
   */
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>('GET', endpoint, undefined, config),

  /**
   * POST 请求
   */
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>('POST', endpoint, data, config),

  /**
   * PUT 请求
   */
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>('PUT', endpoint, data, config),

  /**
   * PATCH 请求
   */
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>('PATCH', endpoint, data, config),

  /**
   * DELETE 请求
   */
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>('DELETE', endpoint, undefined, config),
};

// 导出 Token 管理（供 auth 服务使用）
export { tokenManager };

// 保持向后兼容：导出 ApiError 别名
export { HttpError as ApiError };
