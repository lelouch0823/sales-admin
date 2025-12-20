import { InventoryBalance, InventoryMovement } from './types';

export const MOCK_INVENTORY: InventoryBalance[] = [
  { id: 'i1', sku: 'SKU001', warehouseId: 'wh-dc-01', onHand: 100, reserved: 0, inTransitIn: 0, inTransitOut: 0 },
  { id: 'i2', sku: 'SKU002', warehouseId: 'wh-dc-01', onHand: 50, reserved: 0, inTransitIn: 0, inTransitOut: 0 },
  { id: 'i3', sku: 'SKU001', warehouseId: 'wh-sh-001', onHand: 15, reserved: 2, inTransitIn: 0, inTransitOut: 0 },
  { id: 'i4', sku: 'SKU002', warehouseId: 'wh-sh-001', onHand: 0, reserved: 0, inTransitIn: 5, inTransitOut: 0 },
  { id: 'i5', sku: 'SKU001', warehouseId: 'wh-bj-002', onHand: 0, reserved: 0, inTransitIn: 0, inTransitOut: 0 },
  { id: 'i6', sku: 'SKU002', warehouseId: 'wh-bj-002', onHand: 5, reserved: 0, inTransitIn: 0, inTransitOut: 0 }, 
];

export const MOCK_MOVEMENTS: InventoryMovement[] = [
  { id: 'm1', sku: 'SKU001', warehouseId: 'wh-dc-01', type: 'RECEIVE', quantity: 120, operatorId: 'u1', timestamp: '2023-10-01 09:00:00' },
  { id: 'm2', sku: 'SKU001', warehouseId: 'wh-dc-01', type: 'ISSUE', quantity: 20, operatorId: 'u1', timestamp: '2023-10-05 14:00:00' },
  { id: 'm3', sku: 'SKU001', warehouseId: 'wh-sh-001', type: 'RECEIVE', quantity: 20, operatorId: 'u3', timestamp: '2023-10-06 10:00:00' },
  { id: 'm4', sku: 'SKU001', warehouseId: 'wh-sh-001', type: 'ISSUE', quantity: 5, operatorId: 'u3', timestamp: '2023-10-25 16:30:00' },
  { id: 'm5', sku: 'SKU002', warehouseId: 'wh-bj-002', type: 'RECEIVE', quantity: 5, operatorId: 'u1', timestamp: '2023-10-20 11:00:00' },
];
