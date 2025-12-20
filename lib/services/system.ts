import { AuditLog } from '../../types';
import { db, delay } from '../db';

export const systemApi = {
  getTenants: async () => { await delay(); return db.get('tenants'); },
  getWarehouses: async () => { await delay(); return db.get('warehouses'); },
  getLogs: async () => { await delay(); return db.get('logs'); },
  logAction: async (log: AuditLog) => {
    // Fire and forget, no heavy delay
    const logs = db.get('logs');
    logs.unshift(log);
    db.set('logs', logs);
  }
};
