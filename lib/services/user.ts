import { User } from '../../types';
import { db, delay } from '../db';

export const userApi = {
  list: async () => { await delay(); return db.get('users'); },
  create: async (item: User) => {
    await delay();
    const list = db.get('users');
    list.push(item);
    db.set('users', list);
  },
  update: async (id: string, updates: Partial<User>) => {
    await delay();
    const list = db.get('users');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      db.set('users', list);
    }
  }
};
