export interface SharedMember {
  userId: string;
  role: 'VIEWER' | 'EDITOR' | 'MANAGER';
  addedAt: string;
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
}
