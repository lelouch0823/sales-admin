import { Customer } from '../../types';

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'c1', 
    name: 'John Doe', 
    phone: '13800138000', 
    tags: ['VIP', 'High Value'], 
    ownerUserId: 'u3', 
    tenantId: 'store-sh-001', 
    lastInteraction: '2 days ago', 
    nextFollowUp: 'Tomorrow', 
    sharedWith: [],
    interactions: [
      { id: 'int1', type: 'VISIT', content: 'Customer visited store and inquired about the Minimalist Chair collection.', timestamp: '2023-10-25 14:00:00', createdBy: 'u3' }
    ]
  },
  { 
    id: 'c2', 
    name: 'Jane Smith', 
    phone: '13900139000', 
    tags: ['New'], 
    ownerUserId: null, 
    tenantId: 'store-sh-001', 
    lastInteraction: '1 month ago', 
    sharedWith: [],
    interactions: []
  },
  { 
    id: 'c3', 
    name: 'Mike Johnson', 
    phone: '13700137000', 
    tags: ['Corporate'], 
    ownerUserId: 'u1', 
    tenantId: 'hq', 
    lastInteraction: '5 days ago', 
    sharedWith: [{ userId: 'u3', role: 'VIEWER', addedAt: '2023-10-01' }],
    interactions: [
      { id: 'int2', type: 'CALL', content: 'Followed up on corporate bulk order proposal.', timestamp: '2023-10-20 09:30:00', createdBy: 'u1' }
    ]
  },
];