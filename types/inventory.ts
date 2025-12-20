import { StockStatus } from './product';

export interface Warehouse {
  id: string;
  tenantId: string; // Links to Tenant
  name: string;
  type: 'STORE' | 'DC' | 'VIRTUAL';
}

export interface InventoryBalance {
  id: string;
  sku: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  // Computed: available = onHand - reserved
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

// For legacy support in Recs view (Computed from InventoryBalance)
export interface StoreProductState {
  productId: string;
  tenantId: string;
  stockStatus: StockStatus;
  stockCount: number;
}
