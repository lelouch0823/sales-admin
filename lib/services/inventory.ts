import { InventoryMovement, InventoryBalance } from '../../types';
import { db, delay, ApiError } from '../db';

export const inventoryApi = {
  getBalances: async () => { await delay(); return db.get('inventory'); },
  getMovements: async () => { await delay(); return db.get('movements'); },
  
  // Transactional logic simulation
  adjust: async (movement: InventoryMovement) => {
    await delay();
    
    // 1. Record Movement
    const movements = db.get('movements');
    movements.unshift(movement);
    db.set('movements', movements);

    // 2. Update Balance
    const balances = db.get('inventory');
    let balIdx = balances.findIndex(b => b.sku === movement.sku && b.warehouseId === movement.warehouseId);
    
    if (balIdx === -1) {
       if (movement.type === 'RECEIVE') {
          const newBal: InventoryBalance = {
            id: Math.random().toString(36).substr(2, 9),
            sku: movement.sku,
            warehouseId: movement.warehouseId,
            onHand: movement.quantity,
            reserved: 0, inTransitIn: 0, inTransitOut: 0
          };
          balances.push(newBal);
       } else {
         throw new ApiError('Cannot perform action on non-existent inventory record', 400);
       }
    } else {
        const bal = balances[balIdx];
        if (movement.type === 'RECEIVE') {
          bal.onHand += movement.quantity;
        } else if (movement.type === 'ISSUE') {
          bal.onHand = Math.max(0, bal.onHand - movement.quantity);
        } else if (movement.type === 'RESERVE') {
          // Increase reserved quantity (simulated as movement quantity)
          // Ensure we don't reserve more than available (onHand - existingReserved)
          const available = bal.onHand - bal.reserved;
          if (available < movement.quantity) {
             throw new ApiError('Insufficient available stock to reserve', 400);
          }
          bal.reserved += movement.quantity;
        }
        balances[balIdx] = bal;
    }
    db.set('inventory', balances);
  }
};