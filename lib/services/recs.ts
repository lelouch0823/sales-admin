import { Recommendation } from '../../types';
import { db, delay } from '../db';

export const recsApi = {
  list: async () => { await delay(); return db.get('recommendations'); },
  create: async (item: Recommendation) => {
    await delay();
    const list = db.get('recommendations');
    list.push(item);
    db.set('recommendations', list);
  },
  update: async (id: string, updates: Partial<Recommendation>) => {
    await delay();
    const list = db.get('recommendations');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      db.set('recommendations', list);
    }
  },
  delete: async (id: string) => {
    await delay();
    const list = db.get('recommendations');
    db.set('recommendations', list.filter(r => r.id !== id));
  }
};
