import { Recommendation } from '../../types';

export const MOCK_RECS: Recommendation[] = [
  { id: 'r1', tenantId: null, productId: 'p1', startAt: '2023-10-01', endAt: '2023-12-31', priority: 1, isEnabled: true, reason: 'Q4 Best Seller' },
  { id: 'r2', tenantId: null, productId: 'p2', startAt: '2023-10-01', endAt: '2023-11-30', priority: 2, isEnabled: true, reason: 'Clearance' },
];
