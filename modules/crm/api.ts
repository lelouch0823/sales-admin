import { Customer } from './types';
import { db, delay } from '../../lib/db';

export const crmApi = {
  list: async () => { await delay(); return db.get('customers'); },
  create: async (item: Customer) => {
    await delay();
    const list = db.get('customers');
    list.push(item);
    db.set('customers', list);
  },
  update: async (id: string, updates: Partial<Customer>) => {
    await delay();
    const list = db.get('customers');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      db.set('customers', list);
    }
  }
};
