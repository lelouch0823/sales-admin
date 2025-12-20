import { Tenant, Warehouse } from '../../types';

export const MOCK_TENANTS: Tenant[] = [
  { id: 'hq', name: 'Headquarters', type: 'HQ' },
  { id: 'store-sh-001', name: 'Shanghai Flagship', type: 'STORE' },
  { id: 'store-bj-002', name: 'Beijing Sanlitun', type: 'STORE' },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'wh-dc-01', tenantId: 'hq', name: 'Central DC (Shanghai)', type: 'DC' },
  { id: 'wh-sh-001', tenantId: 'store-sh-001', name: 'SH Flagship Store', type: 'STORE' },
  { id: 'wh-bj-002', tenantId: 'store-bj-002', name: 'BJ Sanlitun Store', type: 'STORE' },
];
