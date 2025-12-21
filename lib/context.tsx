import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import {
  Tenant, User, Recommendation, AuditLog, SharedMember,
  Warehouse, StockStatus
} from '../types';

// 导入各业务模块的类型定义
import { Product } from '../modules/pim/types';
import { Customer } from '../modules/crm/types';
import { InventoryBalance, InventoryMovement, StoreProductState } from '../modules/inventory/types';

import { useAuth } from './auth';
import { productApi, inventoryApi, crmApi, recsApi, userApi, systemApi } from './api';
import { MOCK_USERS } from './data/users';

/**
 * 全局上下文接口定义 (AppContextType)
 * 包含了应用中所有共享的数据状态和操作方法。
 * 这种设计模式适合中小型应用，将所有核心数据集中管理。
 */
interface AppContextType {
  currentUser: User; // 当前登录用户

  // --- 数据状态 (Data State) ---
  tenants: Tenant[];           // 租户/门店列表
  users: User[];               // 系统用户列表
  products: Product[];         // 商品列表 (PIM)
  warehouses: Warehouse[];     // 仓库列表
  inventory: InventoryBalance[]; // 库存余额表 (SKU x Warehouse)
  movements: InventoryMovement[];// 库存变动流水
  recommendations: Recommendation[]; // 推荐配置列表
  customers: Customer[];       // 客户列表 (CRM)
  logs: AuditLog[];            // 审计日志

  // --- 计算属性 (Computed Properties) ---
  storeStock: StoreProductState[]; // 计算后的门店库存状态 (用于推荐系统判断是否缺货)

  // --- 推荐模块操作 (Actions: Recommendations) ---
  addRecommendation: (rec: Omit<Recommendation, 'id'>) => Promise<void>;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => Promise<void>;
  deleteRecommendation: (id: string) => Promise<void>;

  // --- PIM 模块操作 (Actions: PIM) ---
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;

  // --- 库存模块操作 (Actions: Inventory) ---
  /**
   * 调整库存 (入库/出库/锁定)
   * @param type RECEIVE(入库), ISSUE(出库), RESERVE(预订锁定)
   */
  adjustInventory: (sku: string, warehouseId: string, quantity: number, type: 'RECEIVE' | 'ISSUE' | 'RESERVE') => Promise<void>;
  /**
   * 调拨库存
   * @param fromWh 来源仓库ID
   * @param toWh 目标仓库ID
   */
  transferInventory: (sku: string, fromWh: string, toWh: string, quantity: number) => Promise<void>;

  // --- CRM 模块操作 (Actions: CRM) ---
  addCustomer: (cust: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  claimCustomer: (customerId: string, userId: string) => Promise<void>; // 领取公海客户
  releaseCustomer: (customerId: string) => Promise<void>; // 退回公海

  addSharedMember: (customerId: string, member: SharedMember) => Promise<void>; // 添加协作成员
  removeSharedMember: (customerId: string, userId: string) => Promise<void>; // 移除协作成员

  // --- 系统管理操作 (Actions: Admin) ---
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;

  // --- 工具方法 (Utilities) ---
  logAction: (action: string, targetType: string, targetId: string, details: string) => void; // 记录审计日志
  switchUser: (userId: string) => void; // 开发调试：快速切换用户身份
  resetDemoData: () => void; // 重置演示数据到初始状态

  // --- 元数据 ---
  isLoadingData: boolean; // 数据是否正在加载
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider 组件
 * 职责: 
 * 1. 初始化并加载所有模拟数据 (从 api.ts 模拟后端)
 * 2. 提供全应用共享的业务逻辑方法 (Action Handlers)
 * 3. 处理跨模块的数据联动 (如: 推荐系统依赖库存计算)
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser, switchUser: authSwitchUser } = useAuth();
  // 如果 Auth 尚未加载完成，使用 Mock 用户兜底 (防止崩溃)
  const currentUser = authUser || MOCK_USERS[0];

  // --- 状态定义 ---
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryBalance[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // --- 数据加载 (Data Fetching) ---
  const refreshData = async () => {
    try {
      // 并行请求所有数据，模拟真实环境中的并发加载
      const [
        ts, whs, us, ps, inv, mov, recs, custs, ls
      ] = await Promise.all([
        systemApi.getTenants(),
        systemApi.getWarehouses(),
        userApi.list(),
        productApi.list(),
        inventoryApi.getBalances(),
        inventoryApi.getMovements(),
        recsApi.list(),
        crmApi.list(),
        systemApi.getLogs()
      ]);

      setTenants(ts);
      setWarehouses(whs);
      setUsers(us);
      setProducts(ps);
      setInventory(inv);
      setMovements(mov);
      setRecommendations(recs);
      setCustomers(custs);
      setLogs(ls);
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setIsLoadingData(false);
    }
  };

  // 组件挂载时初始化加载
  useEffect(() => {
    refreshData();
  }, []);

  // --- 辅助方法: 记录日志 ---
  // 将关键操作记录到审计日志中
  const logAction = (action: string, targetType: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      targetType,
      targetId,
      operatorId: currentUser.id,
      details,
      timestamp: new Date().toLocaleString()
    };
    // 乐观更新 UI (Optimistic UI update) - 立即显示，无需等待后端返回
    setLogs(prev => [newLog, ...prev]);
    // 调用 API 持久化 (Fire & Forget)
    systemApi.logAction(newLog);
  };

  // --- 计算属性: 门店库存状态 (storeStock) ---
  // 这是一个昂贵的计算，使用 useMemo 缓存
  // 目的: 将库存余额(InventoryBalance) 转换为业务状态(IN_STOCK, BACKORDER, etc.)
  // 供推荐系统(Recommendations)判断商品是否可以被推荐
  const storeStock = useMemo(() => {
    const computed: StoreProductState[] = [];
    products.forEach(p => {
      warehouses.filter(w => w.type === 'STORE').forEach(w => {
        const bal = inventory.find(i => i.sku === p.sku && i.warehouseId === w.id);
        const available = bal ? bal.onHand - bal.reserved : 0;

        let status: StockStatus = 'UNAVAILABLE';

        if (available > 0) {
          status = 'IN_STOCK'; // 有现货
        } else if (p.allowBackorder) {
          status = 'BACKORDER'; // 允许缺货预订
        } else if (p.allowTransfer) {
          // 检查总仓(DC)是否有货
          const dcStock = inventory.find(i => i.sku === p.sku && i.warehouseId.includes('dc'))?.onHand || 0;
          if (dcStock > 0) status = 'TRANSFERABLE'; // 允许调货
        }

        computed.push({
          productId: p.id,
          tenantId: w.tenantId,
          stockStatus: status,
          stockCount: available
        });
      });
    });
    return computed;
  }, [products, inventory, warehouses]);


  // --- 业务操作实现 (Actions Implementation) ---

  const addProduct = async (prod: Omit<Product, 'id'>) => {
    const newProd = { ...prod, id: Math.random().toString(36).substr(2, 9) };
    await productApi.create(newProd as Product);
    logAction('CREATE', 'PRODUCT', newProd.sku, `Created product ${newProd.name}`);
    await refreshData(); // 重新拉取数据以更新 UI
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await productApi.update(id, { ...updates, updatedAt: new Date().toISOString() });
    logAction('UPDATE', 'PRODUCT', id, 'Updated product details');
    await refreshData();
  };

  const adjustInventory = async (sku: string, warehouseId: string, quantity: number, type: 'RECEIVE' | 'ISSUE' | 'RESERVE') => {
    // 查找或创建库存记录 ID
    const existingBalance = inventory.find(b => b.sku === sku && b.warehouseId === warehouseId);
    const inventoryId = existingBalance?.id || `temp-${Date.now()}`;

    // 调用 API
    await inventoryApi.adjust({
      inventoryId,
      newQuantity: type === 'RECEIVE'
        ? (existingBalance?.onHand || 0) + quantity
        : Math.max(0, (existingBalance?.onHand || 0) - quantity),
      reason: type.toLowerCase(),
      notes: `${type} quantity ${quantity} for SKU ${sku}`
    });
    logAction(type, 'INVENTORY', `${sku}@${warehouseId}`, `${type} quantity ${quantity}`);
    await refreshData();
  };

  const transferInventory = async (sku: string, fromWh: string, toWh: string, quantity: number) => {
    // 简单的两步调拨模拟: 源仓库出库 -> 目标仓库入库
    // 实际场景中应该有 "在途 (In Transit)" 状态，这里简化为原子操作
    await adjustInventory(sku, fromWh, quantity, 'ISSUE');
    await adjustInventory(sku, toWh, quantity, 'RECEIVE');
    logAction('TRANSFER', 'INVENTORY', sku, `Transferred ${quantity} from ${fromWh} to ${toWh}`);
  };

  const addRecommendation = async (rec: Omit<Recommendation, 'id'>) => {
    const newRec = { ...rec, id: Math.random().toString(36).substr(2, 9) };
    await recsApi.create(newRec as Recommendation);
    logAction('CREATE', 'RECOMMENDATION', newRec.id, `Added product ${rec.productId}`);
    await refreshData();
  };

  const updateRecommendation = async (id: string, updates: Partial<Recommendation>) => {
    await recsApi.update(id, updates);
    logAction('UPDATE', 'RECOMMENDATION', id, `Updated fields`);
    await refreshData();
  };

  const deleteRecommendation = async (id: string) => {
    await recsApi.delete(id);
    logAction('DELETE', 'RECOMMENDATION', id, 'Deleted recommendation');
    await refreshData();
  };

  const addCustomer = async (cust: Omit<Customer, 'id'>) => {
    const newCust = { ...cust, id: Math.random().toString(36).substr(2, 9) };
    await crmApi.create(newCust as Customer);
    logAction('CREATE', 'CUSTOMER', newCust.id, `Created customer ${newCust.name}`);
    await refreshData();
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    await crmApi.update(id, updates);
    logAction('UPDATE', 'CUSTOMER', id, 'Updated customer details');
    await refreshData();
  };

  // 客户公海机制: ownerUserId = null 即为进入公海
  const claimCustomer = async (customerId: string, userId: string) => {
    await updateCustomer(customerId, { ownerUserId: userId });
    logAction('CLAIM', 'CUSTOMER', customerId, `Claimed by user ${userId}`);
  };

  const releaseCustomer = async (customerId: string) => {
    await updateCustomer(customerId, { ownerUserId: null });
    logAction('RELEASE', 'CUSTOMER', customerId, 'Released to public pool');
  };

  const addSharedMember = async (customerId: string, member: SharedMember) => {
    const customer = customers.find(c => c.id === customerId);
    // 避免重复添加
    if (customer && !customer.sharedWith.some(s => s.userId === member.userId)) {
      const newShared = [...customer.sharedWith, member];
      await updateCustomer(customerId, { sharedWith: newShared });
      logAction('SHARE', 'CUSTOMER', customerId, `Added shared member ${member.userId}`);
    }
  };

  const removeSharedMember = async (customerId: string, userId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const newShared = customer.sharedWith.filter(s => s.userId !== userId);
      await updateCustomer(customerId, { sharedWith: newShared });
      logAction('UNSHARE', 'CUSTOMER', customerId, `Removed shared member ${userId}`);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    // 转换为 CreateUserDto 格式
    await userApi.create({
      username: newUser.email.split('@')[0], // 从 email 生成 username
      email: newUser.email,
      password: 'TempPassword123!', // 临时密码，实际应从表单获取
      fullName: newUser.name, // 前端 User.name -> 后端 fullName
      role: newUser.role,
      status: newUser.status,
    });
    logAction('CREATE', 'USER', newUser.id, `Created user ${newUser.name}`);
    await refreshData();
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await userApi.update(id, updates);
    logAction('UPDATE', 'USER', id, `Updated user fields`);
    await refreshData();
  };

  // 调试功能：清除 localStorage 重置数据
  const resetDemoData = () => {
    localStorage.removeItem('WR_DO_DB_V2');
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      currentUser, tenants, users, products, recommendations, customers, logs, storeStock,
      warehouses, inventory, movements,
      isLoadingData,
      addRecommendation, updateRecommendation, deleteRecommendation,
      addCustomer, updateCustomer, claimCustomer, releaseCustomer,
      addSharedMember, removeSharedMember,
      addUser, updateUser,
      addProduct, updateProduct, adjustInventory, transferInventory,
      logAction,
      switchUser: authSwitchUser,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义 Hook，方便在组件中快速访问 Context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};