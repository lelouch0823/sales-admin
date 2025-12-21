/**
 * 用户管理 API
 * 
 * 对接后端 /users 接口
 */

import { User } from '../../types';
import { createApiWithStats, BaseFilterParams } from '../api-factory';
import { API_ENDPOINTS } from '../../constants/api';

// ============ 类型定义 ============

/** 用户筛选参数 */
export interface UserFilterParams extends BaseFilterParams {
  role?: 'admin' | 'manager' | 'user' | 'moderator' | 'guest' | 'super_admin';
  status?: 'active' | 'inactive' | 'suspended' | 'pending' | 'banned' | 'deleted';
}

/** 用户统计 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  managerUsers: number;
  userGrowthRate: number;
}

/** 创建用户参数 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
  status?: string;
}

/** 更新用户参数 */
export interface UpdateUserDto {
  fullName?: string;
  role?: string;
  status?: string;
}

// ============ API 实例 ============

// 使用工厂创建带统计的 CRUD API
export const userApi = createApiWithStats<
  User,
  UserStats,
  CreateUserDto,
  UpdateUserDto,
  UserFilterParams
>(API_ENDPOINTS.USERS.LIST);
