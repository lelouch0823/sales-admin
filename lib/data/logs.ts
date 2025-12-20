import { AuditLog } from '../../types';

export const MOCK_LOGS: AuditLog[] = [
  { id: 'l1', action: 'CREATE', targetType: 'USER', targetId: 'u3', operatorId: 'u1', details: 'Created store manager account', timestamp: '2023-10-25 10:00:00' },
  { id: 'l2', action: 'UPDATE', targetType: 'PRODUCT', targetId: 'p1', operatorId: 'u2', details: 'Updated price to 299', timestamp: '2023-10-24 15:30:00' },
  { id: 'l3', action: 'CLAIM', targetType: 'CUSTOMER', targetId: 'c1', operatorId: 'u3', details: 'Claimed customer from pool', timestamp: '2023-10-23 09:15:00' },
];
