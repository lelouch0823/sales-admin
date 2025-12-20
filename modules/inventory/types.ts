import { StockStatus } from '../pim/types';

export interface Warehouse {
  id: string;
  tenantId: string;
  name: string;
  type: 'STORE' | 'DC' | 'VIRTUAL';
}

export interface InventoryBalance {
  id: string;
  sku: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  inTransitIn: number;
  inTransitOut: number;
}

export interface InventoryMovement {
  id: string;
  sku: string;
  warehouseId: string;
  type: 'RECEIVE' | 'ISSUE' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUST' | 'RESERVE';
  quantity: number;
  referenceNo?: string;
  operatorId: string;
  timestamp: string;
}

export interface StoreProductState {
  productId: string;
  tenantId: string;
  stockStatus: StockStatus;
  stockCount: number;
}
