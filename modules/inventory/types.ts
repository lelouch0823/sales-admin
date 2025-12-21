/**
 * 库存单据类型定义
 */

import type { StockStatus } from '../pim/types';

// 重新导出基础类型
export type { StockStatus };

/** 仓库类型 */
export interface Warehouse {
  id: string;
  tenantId: string;
  name: string;
  type: 'STORE' | 'DC' | 'VIRTUAL';
}

/** 库存余额 */
export interface InventoryBalance {
  id: string;
  sku: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  inTransitIn: number;
  inTransitOut: number;
}

/** 库存变动类型 */
export type MovementType = 'RECEIVE' | 'ISSUE' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUST' | 'RESERVE';

/** 库存变动记录 */
export interface InventoryMovement {
  id: string;
  sku: string;
  warehouseId: string;
  type: MovementType;
  quantity: number;
  referenceNo?: string;
  operatorId: string;
  timestamp: string;
}

/** 门店商品状态 */
export interface StoreProductState {
  productId: string;
  tenantId: string;
  stockStatus: StockStatus;
  stockCount: number;
}

// ============ 单据类型 ============

/** 单据状态 */
export type DocumentStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED';

/** 单据类型 */
export type DocumentType = 'RECEIVING' | 'ISSUING' | 'TRANSFER';

/** 单据行项目 */
export interface DocumentLine {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  receivedQuantity?: number; // 实际收货数量
}

/** 库存单据基础接口 */
export interface InventoryDocument {
  id: string;
  documentNo: string;
  type: DocumentType;
  status: DocumentStatus;
  warehouseId: string;
  lines: DocumentLine[];
  remarks?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** 入库单 */
export interface ReceivingDocument extends InventoryDocument {
  type: 'RECEIVING';
  sourceType: 'PURCHASE' | 'RETURN' | 'OTHER';
  supplierName?: string;
}

/** 出库单 */
export interface IssuingDocument extends InventoryDocument {
  type: 'ISSUING';
  issueType: 'SALE' | 'DAMAGE' | 'OTHER';
  customerName?: string;
}

/** 调拨单 */
export interface TransferDocument extends InventoryDocument {
  type: 'TRANSFER';
  fromWarehouseId: string;
  toWarehouseId: string;
  shippedAt?: string;
  receivedAt?: string;
}

// ============ 单据统计 ============

/** 单据统计 */
export interface DocumentStats {
  totalDocuments: number;
  draftDocuments: number;
  pendingDocuments: number;
  completedDocuments: number;
  byType: Record<DocumentType, number>;
}
