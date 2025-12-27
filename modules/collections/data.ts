import { Collection } from './types';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    name: 'Summer 2024',
    description: 'Summer collection for 2024',
    brand: { id: 'b1', name: 'Nike' },
    status: 'active',
    productCount: 20,
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2023-11-01T00:00:00Z',
  },
  {
    id: 'c2',
    name: 'Winter Essentials',
    description: 'Essentials for the cold season',
    brand: { id: 'b2', name: 'Adidas' },
    status: 'active',
    productCount: 15,
    createdAt: '2023-10-15T00:00:00Z',
    updatedAt: '2023-10-15T00:00:00Z',
  },
  {
    id: 'c3',
    name: 'Tech Series',
    description: 'High-tech gadgets',
    brand: { id: 'b3', name: 'Apple' },
    status: 'inactive',
    productCount: 5,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
  },
];
