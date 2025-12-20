import { Tenant, User, Recommendation, AuditLog, Warehouse } from '../types';
import { Product } from '../modules/pim/types';
import { Customer } from '../modules/crm/types';
import { InventoryBalance, InventoryMovement } from '../modules/inventory/types';

import { MOCK_TENANTS, MOCK_WAREHOUSES } from './data/system';
import { MOCK_USERS } from './data/users';
import { MOCK_PRODUCTS } from '../modules/pim/data';
import { MOCK_INVENTORY, MOCK_MOVEMENTS } from '../modules/inventory/data';
import { MOCK_CUSTOMERS } from '../modules/crm/data';
import { MOCK_RECS } from '../modules/recommendations/data';
import { MOCK_LOGS } from './data/logs';

export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// --- 本地模拟数据库 (Mock Database) ---
// 实际上线时应替换为真实的后端 API 调用 (e.g., Axios/Fetch to REST/GraphQL)
const DB_KEY = 'WR_DO_DB_V2';
const DB_VERSION = '2.0.0';

interface DbSchema {
  version: string;
  users: User[];
  products: Product[];
  inventory: InventoryBalance[];
  movements: InventoryMovement[];
  recommendations: Recommendation[];
  customers: Customer[];
  logs: AuditLog[];
  tenants: Tenant[];
  warehouses: Warehouse[];
}

/**
 * MockDatabase 类
 * 职责:
 * 1. 在 LocalStorage 中持久化存储应用的所有状态
 * 2. 首次加载时注入种子数据 (Seed Data)
 * 3. 提供类似 KV 存储的 get/set 接口
 */
class MockDatabase {
  private data: DbSchema;

  constructor() {
    // 尝试从 localStorage 恢复数据
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 版本检查：如果数据版本落后，则丢弃旧数据重新初始化
        if (parsed.version === DB_VERSION) {
          this.data = parsed;
          return;
        }
      } catch (e) { console.error('DB Load error', e); }
    }
    // 初始化种子数据 (Seed Data)
    this.data = {
      version: DB_VERSION,
      users: [...MOCK_USERS],
      products: [...MOCK_PRODUCTS],
      inventory: [...MOCK_INVENTORY],
      movements: [...MOCK_MOVEMENTS],
      recommendations: [...MOCK_RECS],
      customers: [...MOCK_CUSTOMERS],
      logs: [...MOCK_LOGS],
      tenants: [...MOCK_TENANTS],
      warehouses: [...MOCK_WAREHOUSES]
    };
    this.persist();
  }

  // 将内存数据写入 localStorage
  private persist() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  }

  // 通用读取方法
  get<K extends keyof DbSchema>(key: K): DbSchema[K] {
    return this.data[key];
  }

  // 通用写入方法 (触发持久化)
  set<K extends keyof DbSchema>(key: K, value: DbSchema[K]) {
    this.data[key] = value;
    this.persist();
  }
}

// 导出单例实例
export const db = new MockDatabase();

// 辅助方法: 模拟网络延迟 (300-600ms) 以测试 Loading 状态
export const delay = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms || 300 + Math.random() * 300));