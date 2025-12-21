/**
 * 仓库类型定义
 *
 * 对应后端 /admin/warehouses 和 /admin/transfer-orders 接口
 */

// ============ 枚举类型 ============

/** 仓库类型 */
export type WarehouseType = 'CENTRAL' | 'REGIONAL' | 'STORE' | 'VIRTUAL';

/** 调货单状态 */
export type TransferOrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'shipped'
  | 'received'
  | 'cancelled';

/** 调货单优先级 */
export type TransferPriority = 'low' | 'normal' | 'high' | 'urgent';

// ============ 实体类型 ============

/** 仓库实体 */
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: WarehouseType;
  level: number;
  parentId?: string;
  regionCode?: string;
  address?: string;
  priority?: number;
  isActive: boolean;
  isTransferSource: boolean;
  children?: Warehouse[];
  createdAt?: string;
  updatedAt?: string;
}

/** 调货单项 */
export interface TransferOrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  receivedQuantity?: number;
  notes?: string;
}

/** 调货单 */
export interface TransferOrder {
  id: string;
  orderNumber?: string;
  sourceWarehouse: {
    id: string;
    name: string;
  };
  targetWarehouse: {
    id: string;
    name: string;
  };
  items: TransferOrderItem[];
  status: TransferOrderStatus;
  priority: TransferPriority;
  expectedArrival?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
