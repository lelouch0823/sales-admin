/**
 * 认证服务
 *
 * 处理用户登录、登出、Token 管理等认证相关操作
 * 使用 normalizers 将后端 API 响应转换为前端类型
 */

import { User } from '../../types';
import { http, tokenManager, HttpError } from '../http';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiLoginResponse } from '../../types/api';
import { normalizeUser } from '../../types/normalizers';

// ============ 类型定义 ============

/** 登录请求参数 */
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

/** 登录响应（前端格式） */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** 修改密码请求 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============ 本地状态（用于开发环境 mock） ============

import { MOCK_USERS } from '../data/users';
import { USE_MOCK_API } from '../api-factory';

// 使用全局 Mock 开关（由 VITE_USE_MOCK 环境变量控制）
const USE_MOCK = USE_MOCK_API;

// Mock 用户数据（使用前端类型）
const MOCK_USER: User = {
  id: 'mock-user-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  tenantId: undefined,
  avatarUrl: undefined,
};

// ============ 认证 API ============

export const authApi = {
  /**
   * 用户登录
   */
  login: async (email: string, password: string, _rememberMe?: boolean): Promise<LoginResponse> => {
    if (USE_MOCK) {
      // Mock 模式
      await new Promise(resolve => setTimeout(resolve, 500));

      // 尝试根据邮箱查找 Mock 用户
      const foundUser = MOCK_USERS.find(u => u.email === email);

      // 如果找不到，或者密码错误 (这里简化逻辑，只检查用户是否存在)，则报错
      // 实际开发中可以添加密码检查: if (foundUser && password === 'password') ...
      const userToReturn = foundUser || MOCK_USER;

      const mockToken = `mock_jwt_${Date.now()}_${userToReturn.id}`;
      tokenManager.setAccessToken(mockToken);
      tokenManager.setRefreshToken(`mock_refresh_${Date.now()}`);

      return {
        accessToken: mockToken,
        refreshToken: `mock_refresh_${Date.now()}`,
        user: userToReturn,
      };
    }

    // 调用真实 API
    const apiResponse = await http.post<ApiLoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        usernameOrEmail: email,
        password,
      },
      { skipAuth: true }
    );

    // 保存 Token
    tokenManager.setAccessToken(apiResponse.accessToken);
    tokenManager.setRefreshToken(apiResponse.refreshToken);

    // 转换为前端类型并返回
    return {
      accessToken: apiResponse.accessToken,
      refreshToken: apiResponse.refreshToken,
      user: normalizeUser(apiResponse.user),
    };
  },

  /**
   * 获取当前用户信息
   */
  getProfile: async (): Promise<User> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_USER;
    }

    const apiUser = await http.get<import('../../types/api').ApiUser>(API_ENDPOINTS.AUTH.PROFILE);
    return normalizeUser(apiUser);
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    try {
      if (!USE_MOCK) {
        await http.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } finally {
      // 无论成功失败都清除本地 Token
      tokenManager.clearTokens();
    }
  },

  /**
   * 修改密码
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await http.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  },
};

// 向后兼容：导出 HttpError
export { HttpError as ApiError };
