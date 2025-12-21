/**
 * CRM 客户管理 API
 * 
 * 对接后端 /customers 接口
 */

import { Customer } from './types';
import { createCrudApi, BaseFilterParams } from '../../lib/api-factory';
import { API_ENDPOINTS } from '../../constants/api';

// ============ 类型定义 ============

/** 客户筛选参数 */
export interface CustomerFilterParams extends BaseFilterParams {
  type?: string;
  tier?: string;
  assignedTo?: string;
  createdFrom?: string;
  createdTo?: string;
}

// ============ API 实例 ============

// 使用工厂创建 CRUD API
export const crmApi = createCrudApi<Customer, Partial<Customer>, Partial<Customer>, CustomerFilterParams>(
  API_ENDPOINTS.CUSTOMERS.LIST
);
