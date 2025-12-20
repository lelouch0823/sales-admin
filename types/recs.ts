export interface Recommendation {
  id: string;
  tenantId: string | null; // null = global
  productId: string;
  startAt: string;
  endAt: string;
  priority: number;
  reason?: string;
  isEnabled: boolean;
}
