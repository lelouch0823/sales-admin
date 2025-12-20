import { User } from '../../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@wr.do', role: 'SUPER_ADMIN', status: 'ACTIVE', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: 'u2', name: 'Bob Ops', email: 'bob@wr.do', role: 'OPS_GLOBAL', status: 'ACTIVE', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: 'u3', name: 'Charlie Manager', email: 'charlie@wr.do', role: 'STORE_MANAGER', tenantId: 'store-sh-001', status: 'ACTIVE', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
];
