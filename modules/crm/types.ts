export interface SharedMember {
  userId: string;
  role: 'VIEWER' | 'EDITOR' | 'MANAGER';
  addedAt: string;
}

export interface Interaction {
  id: string;
  type: 'NOTE' | 'CALL' | 'VISIT' | 'EMAIL';
  content: string;
  timestamp: string;
  createdBy: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  ownerUserId: string | null; // null = public pool (公海)
  tenantId: string;
  lastInteraction: string;
  nextFollowUp?: string;
  sharedWith: SharedMember[];
  interactions: Interaction[];
}