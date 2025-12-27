import { Designer } from './types';

export const MOCK_DESIGNERS: Designer[] = [
  {
    id: 'd1',
    name: 'John Doe',
    email: 'john@example.com',
    level: 'senior',
    status: 'active',
    totalProjects: 10,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-01-10T00:00:00Z',
  },
  {
    id: 'd2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    level: 'lead',
    status: 'active',
    totalProjects: 25,
    createdAt: '2022-05-20T00:00:00Z',
    updatedAt: '2022-05-20T00:00:00Z',
  },
  {
    id: 'd3',
    name: 'Bob Brown',
    email: 'bob@example.com',
    level: 'junior',
    status: 'inactive',
    totalProjects: 2,
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2023-08-15T00:00:00Z',
  },
];
