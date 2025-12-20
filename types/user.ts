export type Role = 'SUPER_ADMIN' | 'OPS_GLOBAL' | 'STORE_MANAGER' | 'STORE_STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId?: string; // If null, global user
  status: 'ACTIVE' | 'DISABLED';
  avatarUrl?: string;
}
