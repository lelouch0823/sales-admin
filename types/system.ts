import { LucideIcon } from 'lucide-react';

export interface Tenant {
  id: string;
  name: string;
  type: 'HQ' | 'STORE';
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  operatorId: string;
  details: string;
  timestamp: string;
}

export interface StatCardData {
  title: string;
  current: number;
  total?: number;
  unit?: string;
  icon?: LucideIcon;
  variant: 'gradient' | 'grid';
}
