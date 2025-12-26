# 🚀 前端接口对接文档

> **KK Backend 前端集成指南** | 最后更新: 2025-07-15 | 维护者: AI Assistant

## 🎯 概述

本文档专为前端开发者设计，提供 KK Backend API 的快速集成指南。包含认证流程、常用接口、错误处理、最佳实践等前端开发必需的信息。

## 📋 目录

- [快速开始](#快速开始)
- [认证集成](#认证集成)
- [核心功能接口](#核心功能接口)
- [错误处理](#错误处理)
- [状态管理](#状态管理)
- [最佳实践](#最佳实践)
- [代码示例](#代码示例)

## 🚀 快速开始

### 环境配置

```typescript
// config/api.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 开发环境
const DEV_CONFIG = {
  ...API_CONFIG,
  baseURL: 'http://localhost:3000/api/v1',
};

// 生产环境
const PROD_CONFIG = {
  ...API_CONFIG,
  baseURL: 'https://api.yourdomain.com/api/v1',
};

export const config = process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;
```

### HTTP 客户端设置

```typescript
// utils/http.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config/api';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器 - 添加认证token
    this.instance.interceptors.request.use(
      config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // 响应拦截器 - 统一错误处理
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async error => {
        if (error.response?.status === 401) {
          // Token过期，尝试刷新
          await this.refreshToken();
          return this.instance.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        this.redirectToLogin();
        return;
      }

      const response = await axios.post(`${config.baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      this.redirectToLogin();
    }
  }

  private redirectToLogin() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  // HTTP 方法封装
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

export const httpClient = new HttpClient();
```

## 🔐 认证集成

### 认证服务

```typescript
// services/auth.ts
import { httpClient } from '../utils/http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

class AuthService {
  // 用户登录
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<{
      success: boolean;
      data: AuthResponse;
    }>('/auth/login', credentials);

    if (response.success) {
      this.setTokens(response.data.tokens);
      return response.data;
    }
    throw new Error('登录失败');
  }

  // 用户注册
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient.post<{
      success: boolean;
      data: AuthResponse;
    }>('/auth/register', userData);

    if (response.success) {
      this.setTokens(response.data.tokens);
      return response.data;
    }
    throw new Error('注册失败');
  }

  // 获取当前用户信息
  async getCurrentUser() {
    return httpClient.get<{
      success: boolean;
      data: AuthResponse['user'];
    }>('/auth/profile');
  }

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string) {
    return httpClient.patch('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  // 登出
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // 获取当前用户角色
  getUserRole(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }

  private setTokens(tokens: AuthResponse['tokens']) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
}

export const authService = new AuthService();
```

### React Hook 集成

```typescript
// hooks/useAuth.ts
import { useState, useEffect, useContext, createContext } from 'react';
import { authService, AuthResponse } from '../services/auth';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 📦 核心功能接口

### 产品管理

```typescript
// services/products.ts
import { httpClient } from '../utils/http';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  brand: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class ProductService {
  // 获取产品列表
  async getProducts(params: ProductSearchParams = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();

    return httpClient.get<{
      success: boolean;
      data: {
        products: Product[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      };
    }>(`/products?${queryString}`);
  }

  // 获取产品详情
  async getProduct(id: string) {
    return httpClient.get<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`);
  }

  // 搜索产品
  async searchProducts(query: string, filters: Partial<ProductSearchParams> = {}) {
    return this.getProducts({ search: query, ...filters });
  }

  // 获取产品分类
  async getCategories() {
    return httpClient.get<{
      success: boolean;
      data: Array<{
        name: string;
        count: number;
      }>;
    }>('/products/categories');
  }

  // 获取品牌列表
  async getBrands() {
    return httpClient.get<{
      success: boolean;
      data: Array<{
        id: string;
        name: string;
        logo: string;
        country: string;
        isActive: boolean;
      }>;
    }>('/brands');
  }
}

export const productService = new ProductService();
```

### 订单管理

```typescript
// services/orders.ts
import { httpClient } from '../utils/http';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  notes?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  totalAmount: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

class OrderService {
  // 创建订单
  async createOrder(orderData: CreateOrderRequest) {
    return httpClient.post<{
      success: boolean;
      data: Order;
    }>('/orders', orderData);
  }

  // 获取我的订单
  async getMyOrders(page = 1, limit = 10) {
    return httpClient.get<{
      success: boolean;
      data: {
        orders: Order[];
        pagination: any;
      };
    }>(`/orders/my-orders?page=${page}&limit=${limit}`);
  }

  // 获取订单详情
  async getOrder(id: string) {
    return httpClient.get<{
      success: boolean;
      data: Order;
    }>(`/orders/${id}`);
  }

  // 根据订单号获取订单
  async getOrderByNumber(orderNumber: string) {
    return httpClient.get<{
      success: boolean;
      data: Order;
    }>(`/orders/number/${orderNumber}`);
  }

  // 取消订单
  async cancelOrder(id: string, reason: string) {
    return httpClient.patch(`/orders/${id}/cancel`, { reason });
  }

  // 确认收货
  async confirmDelivery(id: string) {
    return httpClient.patch(`/orders/${id}/deliver`);
  }

  // 申请退款
  async requestRefund(id: string, amount: number, reason: string) {
    return httpClient.patch(`/orders/${id}/refund`, { amount, reason });
  }
}

export const orderService = new OrderService();
```

## ⚠️ 错误处理

### 错误类型定义

```typescript
// types/errors.ts
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    validation?: Array<{
      field: string;
      message: string;
    }>;
  };
  timestamp: string;
  path: string;
  method: string;
}

export enum ErrorCodes {
  // 认证错误
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // 验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // 业务错误
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  ORDER_CANNOT_BE_CANCELLED = 'ORDER_CANNOT_BE_CANCELLED',

  // 系统错误
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

### 错误处理工具

```typescript
// utils/errorHandler.ts
import { ApiError, ErrorCodes } from '../types/errors';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): AppError => {
  // 网络错误
  if (!error.response) {
    return new AppError('NETWORK_ERROR', '网络连接失败，请检查网络设置', error);
  }

  const apiError: ApiError = error.response.data;

  // 根据错误码返回用户友好的错误信息
  switch (apiError.error.code) {
    case ErrorCodes.UNAUTHORIZED:
      return new AppError(apiError.error.code, '请先登录', apiError.error.details);

    case ErrorCodes.TOKEN_EXPIRED:
      return new AppError(apiError.error.code, '登录已过期，请重新登录', apiError.error.details);

    case ErrorCodes.VALIDATION_ERROR:
      const validationMessages =
        apiError.error.validation?.map(v => v.message).join(', ') || '输入数据格式错误';
      return new AppError(apiError.error.code, validationMessages, apiError.error.validation);

    case ErrorCodes.INSUFFICIENT_STOCK:
      return new AppError(apiError.error.code, '库存不足，请减少购买数量', apiError.error.details);

    case ErrorCodes.RESOURCE_NOT_FOUND:
      return new AppError(apiError.error.code, '请求的资源不存在', apiError.error.details);

    default:
      return new AppError(
        apiError.error.code,
        apiError.error.message || '操作失败，请稍后重试',
        apiError.error.details
      );
  }
};

// React Hook for error handling
export const useErrorHandler = () => {
  const showError = (error: any) => {
    const appError = handleApiError(error);

    // 这里可以集成你的通知系统
    console.error('API Error:', appError);

    // 示例：使用 toast 通知
    // toast.error(appError.message);

    return appError;
  };

  return { showError };
};
```

## 🔄 状态管理

### Zustand 状态管理示例

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, AuthResponse } from '../services/auth';

interface AuthState {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  updateUser: (userData: Partial<AuthResponse['user']>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(userData);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      getCurrentUser: async () => {
        if (!authService.isAuthenticated()) return;

        set({ isLoading: true });
        try {
          const response = await authService.getCurrentUser();
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw error;
        }
      },

      updateUser: (userData: Partial<AuthResponse['user']>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

### 购物车状态管理

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: () => { subtotal: number; itemCount: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(i => i.productId === item.productId);

        let newItems;
        if (existingItem) {
          newItems = items.map(i =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          newItems = [...items, { ...item, quantity }];
        }

        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

        set({ items: newItems, total, itemCount });
      },

      removeItem: productId => {
        const items = get().items.filter(item => item.productId !== productId);
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        set({ items, total, itemCount });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const items = get().items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        set({ items, total, itemCount });
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },

      getCartSummary: () => {
        const { items } = get();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        return { subtotal, itemCount };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

## 💡 最佳实践

### 1. API 调用封装

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { useErrorHandler } from '../utils/errorHandler';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export const useApi = <T>(apiCall: () => Promise<T>, options: UseApiOptions<T> = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { showError } = useErrorHandler();

  const execute = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const appError = showError(err);
      setError(appError);
      options.onError?.(appError);
      throw appError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};
```

### 2. 分页数据管理

```typescript
// hooks/usePagination.ts
import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const usePagination = (initialLimit = 10) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const updatePagination = useCallback((newPagination: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => (prev.hasNext ? { ...prev, page: prev.page + 1 } : prev));
  }, []);

  const prevPage = useCallback(() => {
    setPagination(prev => (prev.hasPrev ? { ...prev, page: prev.page - 1 } : prev));
  }, []);

  const changeLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  return {
    pagination,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
  };
};
```

### 3. 表单验证

```typescript
// hooks/useForm.ts
import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FormConfig<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule>>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: FormConfig<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      if (rules.required && (!value || value.toString().trim() === '')) {
        return '此字段为必填项';
      }

      if (rules.minLength && value.toString().length < rules.minLength) {
        return `最少需要 ${rules.minLength} 个字符`;
      }

      if (rules.maxLength && value.toString().length > rules.maxLength) {
        return `最多允许 ${rules.maxLength} 个字符`;
      }

      if (rules.pattern && !rules.pattern.test(value.toString())) {
        return '格式不正确';
      }

      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules]
  );

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));

      // 实时验证
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    },
    [validateField]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateAll()) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};
```

## 📝 代码示例

### 完整的产品列表页面

```tsx
// pages/ProductsPage.tsx
import React, { useEffect, useState } from 'react';
import { productService, ProductSearchParams } from '../services/products';
import { useApi } from '../hooks/useApi';
import { usePagination } from '../hooks/usePagination';
import { useCartStore } from '../stores/cartStore';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({});
  const { pagination, updatePagination, goToPage } = usePagination(12);
  const addToCart = useCartStore(state => state.addItem);

  const {
    data: productsData,
    loading,
    error,
    execute: fetchProducts,
  } = useApi(() => productService.getProducts({ ...searchParams, ...pagination }), {
    immediate: true,
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams, pagination.page, pagination.limit]);

  useEffect(() => {
    if (productsData?.success) {
      updatePagination(productsData.data.pagination);
    }
  }, [productsData]);

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, search: query }));
    goToPage(1);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images[0] || '',
    });
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div className="products-page">
      <div className="search-bar">
        <input type="text" placeholder="搜索产品..." onChange={e => handleSearch(e.target.value)} />
      </div>

      <div className="products-grid">
        {productsData?.data.products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">¥{product.price}</p>
            <button onClick={() => handleAddToCart(product)}>加入购物车</button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button disabled={!pagination.hasPrev} onClick={() => goToPage(pagination.page - 1)}>
          上一页
        </button>
        <span>
          {pagination.page} / {pagination.totalPages}
        </span>
        <button disabled={!pagination.hasNext} onClick={() => goToPage(pagination.page + 1)}>
          下一页
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
```

### 登录表单组件

```tsx
// components/LoginForm.tsx
import React from 'react';
import { useForm } from '../hooks/useForm';
import { useAuthStore } from '../stores/authStore';
import { useErrorHandler } from '../utils/errorHandler';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const login = useAuthStore(state => state.login);
  const { showError } = useErrorHandler();

  const { values, errors, isSubmitting, setValue, handleSubmit, isValid } = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
      },
    },
    onSubmit: async values => {
      try {
        await login(values.email, values.password);
        // 登录成功后的处理
        window.location.href = '/dashboard';
      } catch (error) {
        showError(error);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={e => setValue('email', e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">密码</label>
        <input
          id="password"
          type="password"
          value={values.password}
          onChange={e => setValue('password', e.target.value)}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <button type="submit" disabled={!isValid || isSubmitting} className="submit-button">
        {isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  );
};

export default LoginForm;
```

### 订单创建流程

```tsx
// components/CheckoutForm.tsx
import React from 'react';
import { useCartStore } from '../stores/cartStore';
import { orderService } from '../services/orders';
import { useForm } from '../hooks/useForm';
import { useErrorHandler } from '../utils/errorHandler';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}

const CheckoutForm: React.FC = () => {
  const { items, total, clearCart } = useCartStore();
  const { showError } = useErrorHandler();

  const { values, errors, isSubmitting, setValue, handleSubmit, isValid } =
    useForm<CheckoutFormData>({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: '中国',
        paymentMethod: 'credit_card',
      },
      validationRules: {
        firstName: { required: true },
        lastName: { required: true },
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        phone: { required: true },
        addressLine1: { required: true },
        city: { required: true },
        state: { required: true },
        postalCode: { required: true },
      },
      onSubmit: async formData => {
        try {
          const orderData = {
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
            shippingAddress: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              addressLine1: formData.addressLine1,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            paymentMethod: formData.paymentMethod,
          };

          const response = await orderService.createOrder(orderData);

          if (response.success) {
            clearCart();
            // 跳转到订单确认页面
            window.location.href = `/orders/${response.data.id}`;
          }
        } catch (error) {
          showError(error);
        }
      },
    });

  return (
    <div className="checkout-form">
      <div className="order-summary">
        <h3>订单摘要</h3>
        {items.map(item => (
          <div key={item.productId} className="order-item">
            <span>{item.productName}</span>
            <span>x{item.quantity}</span>
            <span>¥{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="total">
          <strong>总计: ¥{total.toFixed(2)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="shipping-form">
        <h3>配送信息</h3>

        <div className="form-row">
          <div className="form-group">
            <label>姓</label>
            <input
              value={values.firstName}
              onChange={e => setValue('firstName', e.target.value)}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label>名</label>
            <input
              value={values.lastName}
              onChange={e => setValue('lastName', e.target.value)}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        {/* 其他表单字段... */}

        <button
          type="submit"
          disabled={!isValid || isSubmitting || items.length === 0}
          className="place-order-button"
        >
          {isSubmitting ? '处理中...' : '提交订单'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
```

## 🔗 相关链接

- [完整API文档](README.md) - 返回API文档首页
- [认证API](authentication.md) - 认证接口详细文档
- [产品API](products.md) - 产品管理接口文档
- [订单API](orders.md) - 订单管理接口文档
- [错误码说明](error-codes.md) - 完整的错误码参考

## 📚 推荐资源

### 开发工具

- **Axios**: HTTP 客户端库
- **React Query / SWR**: 数据获取和缓存
- **Zustand / Redux Toolkit**: 状态管理
- **React Hook Form**: 表单处理
- **Zod**: 数据验证

### 测试工具

- **Jest**: 单元测试框架
- **React Testing Library**: React 组件测试
- **MSW**: API 模拟服务

### 开发环境

- **TypeScript**: 类型安全
- **ESLint + Prettier**: 代码规范
- **Husky**: Git hooks
- **Vite / Next.js**: 构建工具

---

> 📝 **注意事项**
>
> - 始终使用 TypeScript 确保类型安全
> - 实现适当的错误处理和用户反馈
> - 使用环境变量管理不同环境的配置
> - 实施适当的缓存策略提升性能
> - 遵循 React 最佳实践和性能优化原则
> - 定期更新依赖包确保安全性

**🎉 祝您开发愉快！如有问题，请参考完整的 API 文档或联系后端团队。**
