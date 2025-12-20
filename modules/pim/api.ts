import { Product } from './types';
import { db, delay, ApiError } from '../../lib/db';

export const productApi = {
  list: async () => { await delay(); return db.get('products'); },
  create: async (item: Product) => { 
    await delay(); 
    const list = db.get('products');
    list.push(item);
    db.set('products', list);
    return item;
  },
  update: async (id: string, updates: Partial<Product>) => {
    await delay();
    const list = db.get('products');
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) throw new ApiError('Product not found', 404);
    list[idx] = { ...list[idx], ...updates };
    db.set('products', list);
    return list[idx];
  }
};
