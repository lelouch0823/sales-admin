import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', sku: 'SKU001', name: 'Minimalist Chair', brand: 'HAY', category: 'Furniture', price: 299, imageUrl: 'https://placehold.co/50', 
    globalStatus: 'ON_SHELF', status: 'PUBLISHED', allowBackorder: true, allowTransfer: true, tags: ['Bestseller'], 
    mediaAssets: [{ id: 'm1', type: 'IMAGE', url: 'https://placehold.co/400', isMain: true }], updatedAt: '2023-10-20', updatedBy: 'u1'
  },
  { 
    id: 'p2', sku: 'SKU002', name: 'Ceramic Vase', brand: 'Muuto', category: 'Decor', price: 89, imageUrl: 'https://placehold.co/50', 
    globalStatus: 'ON_SHELF', status: 'PUBLISHED', allowBackorder: false, allowTransfer: true, tags: [],
    mediaAssets: [{ id: 'm2', type: 'IMAGE', url: 'https://placehold.co/400', isMain: true }], updatedAt: '2023-10-21', updatedBy: 'u2'
  },
  { 
    id: 'p3', sku: 'SKU003', name: 'Wool Rug', brand: 'Gan', category: 'Textile', price: 599, imageUrl: 'https://placehold.co/50', 
    globalStatus: 'ON_SHELF', status: 'DRAFT', allowBackorder: false, allowTransfer: false, tags: ['New Arrival'],
    mediaAssets: [], updatedAt: '2023-10-22', updatedBy: 'u1'
  },
  { 
    id: 'p4', sku: 'SKU004', name: 'Desk Lamp', brand: 'Flos', category: 'Lighting', price: 199, imageUrl: 'https://placehold.co/50', 
    globalStatus: 'OFF_SHELF', status: 'UNPUBLISHED', allowBackorder: true, allowTransfer: true, tags: [],
    mediaAssets: [], updatedAt: '2023-10-15', updatedBy: 'u2'
  },
];
